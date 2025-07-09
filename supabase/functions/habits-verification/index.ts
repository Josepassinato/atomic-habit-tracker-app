import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  habitId: string;
  habitTitle: string;
  habitDescription: string;
  evidence: {
    type: 'text' | 'image' | 'data';
    content: string;
    metadata?: any;
  };
  schedule?: string;
  expectedOutcome?: string;
}

interface VerificationResult {
  verified: boolean;
  confidence: number;
  score: number;
  feedback: string;
  suggestions: string[];
  evidenceQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get OpenAI API key from admin settings
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('openai_api_key')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (!settings?.openai_api_key) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { habitId, habitTitle, habitDescription, evidence, schedule, expectedOutcome }: VerificationRequest = await req.json();

    console.log(`Verificando hábito: ${habitTitle} (ID: ${habitId})`);

    // Create analysis prompt
    const analysisPrompt = `
Você é um especialista em análise de hábitos e produtividade. Analise se o hábito foi realmente cumprido com base na evidência fornecida.

HÁBITO:
- Título: ${habitTitle}
- Descrição: ${habitDescription}
- Horário esperado: ${schedule || 'Não especificado'}
- Resultado esperado: ${expectedOutcome || 'Não especificado'}

EVIDÊNCIA FORNECIDA:
- Tipo: ${evidence.type}
- Conteúdo: ${evidence.content}
- Metadados: ${JSON.stringify(evidence.metadata || {})}

CRITÉRIOS DE ANÁLISE:
1. A evidência comprova que o hábito foi executado?
2. A qualidade da evidência é suficiente?
3. O timing está adequado?
4. O resultado alcança o objetivo do hábito?

RESPONDA EM JSON com esta estrutura EXATA:
{
  "verified": boolean,
  "confidence": number (0-100),
  "score": number (0-100),
  "feedback": "string explicando a análise",
  "suggestions": ["array", "de", "sugestões"],
  "evidenceQuality": "excellent|good|fair|poor"
}

Seja rigoroso mas justo na análise. Considere fatores como especificidade, clareza e relevância da evidência.
`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.openai_api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de hábitos. Sempre responda em JSON válido.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const analysisResult = openaiData.choices[0].message.content;

    console.log('Resposta da OpenAI:', analysisResult);

    let verification: VerificationResult;
    try {
      verification = JSON.parse(analysisResult);
    } catch (error) {
      console.error('Erro ao parsear resposta da OpenAI:', error);
      // Fallback case
      verification = {
        verified: false,
        confidence: 0,
        score: 0,
        feedback: 'Erro na análise automática. Verificação manual necessária.',
        suggestions: ['Tente fornecer uma evidência mais clara', 'Inclua mais detalhes sobre a execução'],
        evidenceQuality: 'poor'
      };
    }

    // Update habit in database
    const { error: updateError } = await supabase
      .from('habits')
      .update({
        auto_verified: verification.verified,
        verification_score: verification.score,
        verification_notes: verification.feedback,
        verified: verification.verified && verification.confidence > 80, // Auto-approve high confidence
        updated_at: new Date().toISOString()
      })
      .eq('id', habitId);

    if (updateError) {
      console.error('Erro ao atualizar hábito:', updateError);
    }

    // Log verification attempt
    console.log(`Hábito ${habitId} verificado:`, {
      verified: verification.verified,
      confidence: verification.confidence,
      score: verification.score
    });

    return new Response(
      JSON.stringify({
        success: true,
        verification,
        habitId,
        autoApproved: verification.verified && verification.confidence > 80
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na verificação de hábitos:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});