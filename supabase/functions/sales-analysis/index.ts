import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SalesAnalysisRequest {
  companyId?: string;
  teamId?: string;
  salesRepId?: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  analysisType: 'performance' | 'trends' | 'opportunities' | 'complete';
}

interface SalesData {
  salesReps: any[];
  goals: any[];
  habits: any[];
  teams: any[];
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
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { companyId, teamId, salesRepId, period, analysisType }: SalesAnalysisRequest = await req.json();

    console.log(`Analisando vendas - Tipo: ${analysisType}, Período: ${period}`);

    // Fetch sales data based on filters
    let salesQuery = supabase.from('sales_reps').select('*');
    let goalsQuery = supabase.from('goals').select('*');
    let habitsQuery = supabase.from('habits').select('*');
    let teamsQuery = supabase.from('teams').select('*');

    if (companyId) {
      salesQuery = salesQuery.eq('company_id', companyId);
      teamsQuery = teamsQuery.eq('company_id', companyId);
    }
    if (teamId) {
      salesQuery = salesQuery.eq('team_id', teamId);
      goalsQuery = goalsQuery.eq('team_id', teamId);
      habitsQuery = habitsQuery.eq('team_id', teamId);
    }
    if (salesRepId) {
      salesQuery = salesQuery.eq('id', salesRepId);
      goalsQuery = goalsQuery.eq('user_id', salesRepId);
      habitsQuery = habitsQuery.eq('user_id', salesRepId);
    }

    const [salesReps, goals, habits, teams] = await Promise.all([
      salesQuery,
      goalsQuery,
      habitsQuery,
      teamsQuery
    ]);

    const salesData: SalesData = {
      salesReps: salesReps.data || [],
      goals: goals.data || [],
      habits: habits.data || [],
      teams: teams.data || []
    };

    // Calculate metrics
    const totalSales = salesData.salesReps.reduce((sum, rep) => sum + (rep.total_sales || 0), 0);
    const totalGoals = salesData.goals.reduce((sum, goal) => sum + (goal.target_value || 0), 0);
    const averageConversion = salesData.salesReps.reduce((sum, rep) => sum + (rep.conversion_rate || 0), 0) / (salesData.salesReps.length || 1);
    const completedHabits = salesData.habits.filter(h => h.completed).length;
    const totalHabits = salesData.habits.length;

    // Create analysis prompt
    const analysisPrompt = `
Você é um especialista em análise de vendas e performance comercial. Analise os dados fornecidos e gere insights acionáveis.

DADOS DE VENDAS (${period.toUpperCase()}):
- Total de vendas: R$ ${totalSales.toLocaleString('pt-BR')}
- Total de metas: R$ ${totalGoals.toLocaleString('pt-BR')}
- Taxa de conversão média: ${(averageConversion * 100).toFixed(1)}%
- Hábitos completados: ${completedHabits}/${totalHabits} (${((completedHabits/totalHabits)*100).toFixed(1)}%)
- Número de vendedores: ${salesData.salesReps.length}
- Número de equipes: ${salesData.teams.length}

VENDEDORES DETALHADOS:
${salesData.salesReps.map(rep => `
- ${rep.name}: Vendas R$ ${(rep.total_sales || 0).toLocaleString('pt-BR')}, Meta R$ ${(rep.current_goal || 0).toLocaleString('pt-BR')}, Conversão ${((rep.conversion_rate || 0) * 100).toFixed(1)}%
`).join('')}

TIPO DE ANÁLISE: ${analysisType}

RESPONDA EM JSON com esta estrutura EXATA:
{
  "summary": {
    "performance": "excellent|good|fair|poor",
    "goalAttainment": number (0-100),
    "trendDirection": "up|down|stable",
    "riskLevel": "low|medium|high"
  },
  "insights": [
    "string de insights específicos"
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "habits|goals|team|process",
      "action": "string descrevendo a ação",
      "expectedImpact": "string descrevendo o impacto esperado"
    }
  ],
  "opportunities": [
    "string de oportunidades identificadas"
  ],
  "warnings": [
    "string de alertas e riscos"
  ],
  "kpis": {
    "salesEfficiency": number,
    "habitCorrelation": number,
    "teamSynergy": number,
    "growthPotential": number
  }
}

Seja específico, prático e foque em ações que podem ser tomadas imediatamente.
`;

    console.log('Enviando dados para análise OpenAI...');

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
            content: 'Você é um especialista em análise de vendas e performance comercial. Sempre responda em JSON válido com insights acionáveis.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const analysisResult = openaiData.choices[0].message.content;

    console.log('Análise de vendas concluída');

    let analysis;
    try {
      analysis = JSON.parse(analysisResult);
    } catch (error) {
      console.error('Erro ao parsear resposta da OpenAI:', error);
      analysis = {
        summary: {
          performance: 'fair',
          goalAttainment: 50,
          trendDirection: 'stable',
          riskLevel: 'medium'
        },
        insights: ['Erro na análise automática. Dados coletados mas análise indisponível.'],
        recommendations: [],
        opportunities: [],
        warnings: ['Sistema de análise temporariamente indisponível'],
        kpis: {
          salesEfficiency: 50,
          habitCorrelation: 0,
          teamSynergy: 50,
          growthPotential: 50
        }
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        metadata: {
          period,
          analysisType,
          dataPoints: {
            salesReps: salesData.salesReps.length,
            goals: salesData.goals.length,
            habits: salesData.habits.length,
            teams: salesData.teams.length
          },
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na análise de vendas:', error);
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