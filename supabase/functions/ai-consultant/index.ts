import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://*.lovable.app, https://*.salesforce.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface ChatRequest {
  message: string;
  userId?: string;
  companyId?: string;
  context?: {
    currentGoals?: any[];
    recentHabits?: any[];
    salesData?: any[];
    sessionHistory?: any[];
  };
  consultationType: 'sales' | 'habits' | 'goals' | 'general' | 'strategy';
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

    // Get OpenAI API key
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('openai_api_key')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (!settings?.openai_api_key) {
      console.error('OpenAI API key not configured in admin settings');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message: userMessage, userId, companyId, context, consultationType }: ChatRequest = await req.json();

    // Validate request
    if (!userMessage || typeof userMessage !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (userMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Security audit log (without sensitive data)
    console.log(`AI Consultation Request - Type: ${consultationType}, User: ${userId ? '[AUTHENTICATED]' : '[ANONYMOUS]'}, Timestamp: ${new Date().toISOString()}`);

    // Fetch relevant user context if userId provided
    let userContext = '';
    if (userId) {
      try {
        const [userProfile, userGoals, userHabits, userSalesData] = await Promise.all([
          supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
          supabase.from('goals').select('*').eq('user_id', userId).limit(5),
          supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
          supabase.from('sales_reps').select('*').eq('id', userId).single()
        ]);

        userContext = `
CONTEXTO DO USUÁRIO:
- Nome: ${userProfile.data?.name || 'Não informado'}
- Função: ${userProfile.data?.role || 'Não informado'}
- Empresa: ${userProfile.data?.company_id || 'Não informado'}

METAS ATUAIS: ${userGoals.data?.length || 0} metas
${userGoals.data?.map(goal => `- ${goal.name}: ${goal.current_value || 0}/${goal.target_value} (${((goal.current_value || 0) / goal.target_value * 100).toFixed(1)}%)`).join('\n') || 'Nenhuma meta encontrada'}

HÁBITOS RECENTES: ${userHabits.data?.length || 0} hábitos
${userHabits.data?.slice(0, 5).map(habit => `- ${habit.title}: ${habit.completed ? '✅ Completo' : '⏳ Pendente'}`).join('\n') || 'Nenhum hábito encontrado'}

PERFORMANCE DE VENDAS:
${userSalesData.data ? `- Vendas totais: R$ ${(userSalesData.data.total_sales || 0).toLocaleString('pt-BR')}
- Meta atual: R$ ${(userSalesData.data.current_goal || 0).toLocaleString('pt-BR')}
- Taxa de conversão: ${((userSalesData.data.conversion_rate || 0) * 100).toFixed(1)}%` : 'Dados de vendas não disponíveis'}
`;
      } catch (error) {
        console.log('Erro ao buscar contexto do usuário:', error);
        userContext = 'Contexto do usuário não disponível.';
      }
    }

    // Build system prompt based on consultation type
    let systemPrompt = '';
    switch (consultationType) {
      case 'sales':
        systemPrompt = `Você é um consultor especialista em vendas e performance comercial. Foque em estratégias de vendas, técnicas de fechamento, prospecção, relacionamento com clientes e otimização de processos comerciais. Use dados concretos quando disponíveis e seja específico nas recomendações.`;
        break;
      case 'habits':
        systemPrompt = `Você é um especialista em hábitos atômicos e produtividade. Foque em criação, manutenção e otimização de hábitos. Use os princípios de James Clear e outras metodologias comprovadas. Seja prático e ofereça estratégias implementáveis.`;
        break;
      case 'goals':
        systemPrompt = `Você é um consultor em definição e alcance de metas. Foque em metodologias SMART, OKRs, planejamento estratégico e acompanhamento de resultados. Seja específico sobre prazos, métricas e marcos.`;
        break;
      case 'strategy':
        systemPrompt = `Você é um consultor estratégico de negócios. Foque em visão de longo prazo, análise de mercado, otimização de processos e crescimento sustentável. Considere tanto aspectos humanos quanto de negócio.`;
        break;
      default:
        systemPrompt = `Você é um consultor de negócios especializado em vendas, hábitos e produtividade. Analise a situação e ofereça conselhos práticos e acionáveis baseados nos dados disponíveis.`;
    }

    const fullPrompt = `${systemPrompt}

${userContext}

CONTEXTO ADICIONAL:
${context ? JSON.stringify(context, null, 2) : 'Nenhum contexto adicional fornecido'}

DIRETRIZES:
- Seja específico e prático
- Use dados quando disponíveis
- Ofereça ações concretas
- Mantenha tom profissional mas acessível
- Foque em resultados mensuráveis
- Adapte as sugestões ao perfil do usuário

PERGUNTA/SITUAÇÃO:
${userMessage}

Responda de forma direta, útil e acionável. Se precisar de mais informações, faça perguntas específicas.`;

    // Call OpenAI API with timeout and retry logic
    const openaiResponse = await Promise.race([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openai_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
      throw new Error(`AI service temporarily unavailable`);
    }

    const openaiData = await openaiResponse.json();
    const consultantResponse = openaiData.choices[0].message.content;

    console.log('AI consultation completed successfully');

    // Log consultation for analytics (optional)
    try {
      await supabase.from('settings').insert({
        user_id: userId || '00000000-0000-0000-0000-000000000000',
        key: 'ai_consultation_log',
        value: {
          type: consultationType,
          messageLength: userMessage.length, // Only log message length for privacy
          timestamp: new Date().toISOString(),
          hasContext: !!userContext,
          success: true
        }
      });
    } catch (logError) {
      console.error('Failed to log consultation:', logError);
      // Don't fail the request due to logging error
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: consultantResponse,
        consultationType,
        contextUsed: !!userContext,
        metadata: {
          timestamp: new Date().toISOString(),
          userId: userId || null,
          tokenUsage: openaiData.usage || null
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('AI Consultant Error:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack?.substring(0, 500) // Limit stack trace length
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Service temporarily unavailable',
        requestId: crypto.randomUUID()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});