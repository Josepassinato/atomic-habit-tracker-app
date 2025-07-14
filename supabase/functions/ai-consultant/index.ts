import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Advanced caching system
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60;

// Performance monitoring
interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  cacheHit: boolean;
  tokensUsed?: number;
  model: string;
  success: boolean;
}

// Simple LRU cache implementation
function addToCache(key: string, value: any) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  
  cache.set(key, {
    data: value,
    timestamp: Date.now()
  });
}

function getFromCache(key: string) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

// Rate limiting function
function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  let requests = rateLimitMap.get(clientId) || [];
  requests = requests.filter((time: number) => time > windowStart);
  
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  requests.push(now);
  rateLimitMap.set(clientId, requests);
  return false;
}

// Generate cache key
function generateCacheKey(message: string, consultationType: string, userId?: string): string {
  return `${consultationType}:${userId || 'anonymous'}:${message.substring(0, 100)}`;
}

// Log performance metrics
async function logPerformanceMetrics(supabase: any, metrics: PerformanceMetrics, userId?: string) {
  try {
    await supabase.from('settings').insert({
      user_id: userId || '00000000-0000-0000-0000-000000000000',
      key: 'ai_performance_log',
      value: {
        responseTime: (metrics.endTime || Date.now()) - metrics.startTime,
        cacheHit: metrics.cacheHit,
        tokensUsed: metrics.tokensUsed,
        model: metrics.model,
        success: metrics.success,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to log performance metrics:', error);
  }
}

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

  const metrics: PerformanceMetrics = {
    startTime: Date.now(),
    cacheHit: false,
    model: 'gpt-4o',
    success: false
  };

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

    // Rate limiting check
    const clientId = userId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(clientId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Enhanced input validation and security
    const suspiciousPatterns = [
      /system\s*:/i,
      /ignore\s+previous/i,
      /forget\s+everything/i,
      /<script/i,
      /javascript:/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(userMessage))) {
      console.log(`Suspicious request blocked from ${clientId}: ${userMessage.substring(0, 100)}`);
      return new Response(
        JSON.stringify({ error: 'Request blocked for security reasons' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey(userMessage, consultationType, userId);
    const cachedResponse = getFromCache(cacheKey);
    
    if (cachedResponse) {
      metrics.cacheHit = true;
      metrics.success = true;
      metrics.endTime = Date.now();
      
      // Log cache hit
      console.log(`Cache hit for ${consultationType} consultation`);
      
      // Background task: log metrics
      EdgeRuntime.waitUntil(logPerformanceMetrics(supabase, metrics, userId));
      
      return new Response(
        JSON.stringify({
          ...cachedResponse,
          cached: true,
          cacheTimestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Determine optimal model based on message complexity
    const isComplexQuery = userMessage.length > 500 || consultationType === 'strategy';
    const selectedModel = isComplexQuery ? 'gpt-4o' : 'gpt-4o-mini';
    metrics.model = selectedModel;

    // Call OpenAI API with enhanced timeout and retry logic
    const openaiResponse = await Promise.race([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openai_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
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
          max_tokens: consultationType === 'strategy' ? 2000 : 1500,
          stream: false // For now, keeping non-streaming for compatibility
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
    
    // Update metrics
    metrics.success = true;
    metrics.endTime = Date.now();
    metrics.tokensUsed = openaiData.usage?.total_tokens || 0;

    console.log(`AI consultation completed successfully - Model: ${selectedModel}, Tokens: ${metrics.tokensUsed}, Time: ${metrics.endTime - metrics.startTime}ms`);

    // Prepare response
    const responseData = {
      success: true,
      response: consultantResponse,
      consultationType,
      contextUsed: !!userContext,
      metadata: {
        timestamp: new Date().toISOString(),
        userId: userId || null,
        tokenUsage: openaiData.usage || null,
        model: selectedModel,
        responseTime: metrics.endTime - metrics.startTime,
        cacheHit: false
      }
    };

    // Cache the response for future use
    addToCache(cacheKey, responseData);

    // Background tasks: log consultation and performance metrics
    EdgeRuntime.waitUntil(Promise.all([
      // Log consultation for analytics
      supabase.from('settings').insert({
        user_id: userId || '00000000-0000-0000-0000-000000000000',
        key: 'ai_consultation_log',
        value: {
          type: consultationType,
          messageLength: userMessage.length,
          timestamp: new Date().toISOString(),
          hasContext: !!userContext,
          success: true,
          model: selectedModel,
          tokensUsed: metrics.tokensUsed,
          responseTime: metrics.endTime - metrics.startTime
        }
      }).catch(error => console.error('Failed to log consultation:', error)),
      
      // Log performance metrics
      logPerformanceMetrics(supabase, metrics, userId)
    ]));

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    // Update metrics for failed request
    metrics.success = false;
    metrics.endTime = Date.now();
    
    console.error('AI Consultant Error:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime: metrics.endTime - metrics.startTime,
      model: metrics.model,
      stack: error.stack?.substring(0, 500)
    });
    
    // Background task: log error metrics
    EdgeRuntime.waitUntil(logPerformanceMetrics(supabase, metrics, req.headers.get('user-id') || undefined));
    
    return new Response(
      JSON.stringify({ 
        error: 'Service temporarily unavailable',
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});