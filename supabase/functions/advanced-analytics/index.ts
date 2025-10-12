import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsRequest {
  type: 'prediction' | 'insights' | 'roi_analysis';
  data: {
    sales?: number[];
    habits?: number[];
    period?: string;
    current_month?: number;
    target?: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key from admin_settings
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('openai_api_key')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (settingsError || !settings?.openai_api_key) {
      throw new Error('OpenAI API key not configured. Please configure it in the admin settings.');
    }

    const openaiApiKey = settings.openai_api_key;
    const { type, data }: AnalyticsRequest = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case 'prediction':
        systemPrompt = `Você é um analista de vendas sênior com 15 anos de experiência em previsões precisas.
Especializado em análise de dados de vendas B2B, você combina estatística avançada com intuição de mercado.
Considere tendências, sazonalidade, correlação entre hábitos e resultados, e fatores externos.
Suas previsões devem incluir intervalos de confiança e justificativas claras baseadas nos dados.`;
        
        userPrompt = `Analise os seguintes dados de vendas para gerar uma previsão detalhada para o próximo mês:

Vendas dos últimos meses: ${JSON.stringify(data.sales)}
Vendas do mês atual: ${data.current_month}
Meta estabelecida: ${data.target}

Forneça uma análise completa incluindo:
1. Previsão de vendas para o próximo mês (com intervalo de confiança de 90%)
2. Probabilidade de atingir a meta
3. Tendências principais identificadas nos dados
4. Ações recomendadas para maximizar resultados

Retorne no formato JSON: { prediction: number, confidence_low: number, confidence_high: number, probability: number, trends: string[], recommendations: string[] }`;
        break;

      case 'insights':
        systemPrompt = `Você é um consultor de performance de vendas especializado em análise de dados comportamentais.
Com expertise em gamificação e desenvolvimento de hábitos produtivos, você identifica padrões e correlações.
Forneça insights práticos e acionáveis que podem ser implementados imediatamente pela equipe.
Seja direto e focado em resultados mensuráveis.`;
        
        userPrompt = `Analise a correlação entre hábitos e performance de vendas:

Vendas ao longo do tempo: ${JSON.stringify(data.sales)}
Taxas de conclusão de hábitos: ${JSON.stringify(data.habits)}

Forneça insights acionáveis sobre:
1. Correlação entre conclusão de hábitos e resultados de vendas
2. Padrões de performance identificados
3. Áreas prioritárias para melhoria
4. Riscos potenciais que devem ser mitigados

Retorne no formato JSON: { roi_score: number, correlations: string[], patterns: string[], improvements: string[], risks: string[] }`;
        break;

      case 'roi_analysis':
        systemPrompt = `Você é um especialista em análise de ROI e eficiência operacional com foco em programas de desenvolvimento.
Sua missão é calcular o retorno sobre investimento em programas de hábitos e treinamento de vendas.
Analise métricas financeiras e comportamentais para fornecer uma visão clara do impacto do programa.
Forneça recomendações concretas para otimizar o ROI.`;
        
        userPrompt = `Calcule o ROI do programa de hábitos de vendas baseado nos seguintes dados:

Vendas baseline (antes dos hábitos): ${data.sales?.[0] || 0}
Vendas atuais (com programa de hábitos): ${data.current_month || 0}
Taxa de conclusão de hábitos: ${(data.habits?.[data.habits.length - 1] || 0) * 100}%

Forneça uma análise detalhada de ROI incluindo:
- Percentual de ROI
- Aumento absoluto de receita
- Ganho de eficiência
- Análise custo-benefício
- Resumo executivo

Retorne no formato JSON: { roi_percentage: number, revenue_increase: number, efficiency_gain: number, cost_benefit: string, summary: string }`;
        break;

      default:
        throw new Error("Invalid analysis type");
    }

    console.log(`Analyzing ${type} with OpenAI GPT-4o-mini`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log("AI Analysis completed:", type);

    return new Response(
      JSON.stringify({ result: JSON.parse(content), type }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in advanced-analytics:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
