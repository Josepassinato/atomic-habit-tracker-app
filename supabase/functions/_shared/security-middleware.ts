import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://*.lovable.app, https://*.salesforce.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Rate limiting configuration
const RATE_LIMITS = {
  'sales-analysis': { max: 10, window: 60 * 1000 }, // 10 requests per minute
  'habits-verification': { max: 50, window: 60 * 1000 }, // 50 requests per minute
  'ai-consultant': { max: 20, window: 60 * 1000 }, // 20 requests per minute
};

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map();

function getRateLimitKey(ip: string, userId: string | null, functionName: string): string {
  return `${functionName}:${userId || ip}`;
}

function checkRateLimit(key: string, limit: { max: number; window: number }): boolean {
  const now = Date.now();
  const windowStart = now - limit.window;
  
  const requests = rateLimitStore.get(key) || [];
  const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
  
  if (validRequests.length >= limit.max) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    for (const [storeKey, timestamps] of rateLimitStore.entries()) {
      const validTimestamps = timestamps.filter((t: number) => t > windowStart);
      if (validTimestamps.length === 0) {
        rateLimitStore.delete(storeKey);
      } else {
        rateLimitStore.set(storeKey, validTimestamps);
      }
    }
  }
  
  return true;
}

function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
  ];
  
  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // Take first IP if comma-separated
      return value.split(',')[0].trim();
    }
  }
  
  return 'unknown';
}

async function logSecurityEvent(
  supabase: any,
  event: string,
  details: any,
  userId?: string,
  ip?: string
) {
  try {
    await supabase.rpc('log_user_action', {
      p_action: `SECURITY_${event}`,
      p_resource_type: 'security',
      p_resource_id: null,
      p_old_values: null,
      p_new_values: {
        event,
        details,
        ip,
        timestamp: new Date().toISOString(),
        user_id: userId
      },
      p_company_id: null
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const clientIP = getClientIP(req);
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const functionName = 'sales-analysis'; // This would be dynamic based on function
  
  try {
    // Basic request validation
    if (req.method !== 'POST') {
      await logSecurityEvent(supabase, 'INVALID_METHOD', { method: req.method }, undefined, clientIP);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Content-Type validation
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      await logSecurityEvent(supabase, 'INVALID_CONTENT_TYPE', { contentType }, undefined, clientIP);
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      const text = await req.text();
      if (text.length > 100000) { // 100KB limit
        await logSecurityEvent(supabase, 'PAYLOAD_TOO_LARGE', { size: text.length }, undefined, clientIP);
        return new Response(
          JSON.stringify({ error: 'Payload too large' }),
          { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      requestBody = JSON.parse(text);
    } catch (error) {
      await logSecurityEvent(supabase, 'INVALID_JSON', { error: error.message }, undefined, clientIP);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract user ID for rate limiting
    const { userId } = requestBody;

    // Rate limiting
    const rateLimit = RATE_LIMITS[functionName as keyof typeof RATE_LIMITS];
    if (rateLimit) {
      const rateLimitKey = getRateLimitKey(clientIP, userId, functionName);
      if (!checkRateLimit(rateLimitKey, rateLimit)) {
        await logSecurityEvent(supabase, 'RATE_LIMIT_EXCEEDED', { 
          key: rateLimitKey,
          limit: rateLimit
        }, userId, clientIP);
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(rateLimit.window / 1000)
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(rateLimit.window / 1000).toString()
            } 
          }
        );
      }
    }

    // Input sanitization
    const sanitizedInput = {
      ...requestBody,
      // Remove potentially dangerous fields
      __proto__: undefined,
      constructor: undefined,
      prototype: undefined,
    };

    // Log successful security check
    await logSecurityEvent(supabase, 'REQUEST_VALIDATED', {
      function: functionName,
      hasUserId: !!userId,
      userAgent: userAgent.substring(0, 100) // Truncate user agent
    }, userId, clientIP);

    // Your actual function logic would go here
    // This is just a template showing security measures

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Security validation passed',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Security middleware error:', error);
    
    await logSecurityEvent(supabase, 'SECURITY_ERROR', {
      error: error.message,
      stack: error.stack?.substring(0, 500)
    }, undefined, clientIP);

    return new Response(
      JSON.stringify({ 
        error: 'Security validation failed',
        requestId: crypto.randomUUID()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});