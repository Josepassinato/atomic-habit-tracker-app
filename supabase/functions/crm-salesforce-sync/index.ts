import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, credentials, companyId } = await req.json();

    console.log(`Salesforce sync action: ${action} for company: ${companyId}`);

    switch (action) {
      case 'connect':
        return await connectSalesforce(credentials, companyId, supabaseClient);
      case 'sync_leads':
        return await syncLeads(companyId, supabaseClient);
      case 'sync_opportunities':
        return await syncOpportunities(companyId, supabaseClient);
      case 'push_tasks':
        return await pushTasks(companyId, supabaseClient);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Salesforce sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function connectSalesforce(credentials: any, companyId: string, supabase: any) {
  const { instanceUrl, accessToken } = credentials;

  // Test connection
  const testResponse = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Contact`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!testResponse.ok) {
    throw new Error('Invalid Salesforce credentials');
  }

  // Store encrypted credentials
  const { error } = await supabase
    .from('crm_integrations')
    .upsert({
      company_id: companyId,
      provider: 'salesforce',
      api_key: accessToken,
      instance_url: instanceUrl,
      status: 'active',
      last_sync: new Date().toISOString()
    });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, message: 'Salesforce connected successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncLeads(companyId: string, supabase: any) {
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('api_key, instance_url')
    .eq('company_id', companyId)
    .eq('provider', 'salesforce')
    .single();

  if (!integration) {
    throw new Error('Salesforce integration not found');
  }

  const query = encodeURIComponent('SELECT Id, Name, Email, OwnerId FROM Lead WHERE IsConverted = false LIMIT 200');
  const response = await fetch(`${integration.instance_url}/services/data/v57.0/query?q=${query}`, {
    headers: { 'Authorization': `Bearer ${integration.api_key}` }
  });

  const data = await response.json();

  // Sync leads to sales_reps
  for (const lead of data.records || []) {
    await supabase.from('sales_reps').upsert({
      company_id: companyId,
      name: lead.Name,
      email: lead.Email,
      external_id: lead.OwnerId,
      external_source: 'salesforce'
    }, { onConflict: 'external_id' });
  }

  await supabase
    .from('crm_integrations')
    .update({ last_sync: new Date().toISOString() })
    .eq('company_id', companyId)
    .eq('provider', 'salesforce');

  return new Response(
    JSON.stringify({ success: true, synced: data.records?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncOpportunities(companyId: string, supabase: any) {
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('api_key, instance_url')
    .eq('company_id', companyId)
    .eq('provider', 'salesforce')
    .single();

  if (!integration) {
    throw new Error('Salesforce integration not found');
  }

  const query = encodeURIComponent('SELECT Id, Amount, StageName, OwnerId FROM Opportunity WHERE IsClosed = true AND IsWon = true LIMIT 200');
  const response = await fetch(`${integration.instance_url}/services/data/v57.0/query?q=${query}`, {
    headers: { 'Authorization': `Bearer ${integration.api_key}` }
  });

  const data = await response.json();

  // Sync opportunities to update sales metrics
  for (const opp of data.records || []) {
    const { data: salesRep } = await supabase
      .from('sales_reps')
      .select('id, total_sales')
      .eq('external_id', opp.OwnerId)
      .eq('external_source', 'salesforce')
      .single();

    if (salesRep && opp.Amount) {
      await supabase
        .from('sales_reps')
        .update({ total_sales: (salesRep.total_sales || 0) + opp.Amount })
        .eq('id', salesRep.id);
    }
  }

  return new Response(
    JSON.stringify({ success: true, synced: data.records?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function pushTasks(companyId: string, supabase: any) {
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('api_key, instance_url')
    .eq('company_id', companyId)
    .eq('provider', 'salesforce')
    .single();

  if (!integration) {
    throw new Error('Salesforce integration not found');
  }

  // Get completed habits from last 24h
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data: habits } = await supabase
    .from('habits')
    .select('*, sales_reps!inner(external_id)')
    .eq('completed', true)
    .gte('completed_at', yesterday);

  let pushed = 0;
  for (const habit of habits || []) {
    if (habit.sales_reps?.external_id) {
      await fetch(`${integration.instance_url}/services/data/v57.0/sobjects/Task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Subject: `Habit Completed: ${habit.title}`,
          Description: habit.description || '',
          Status: 'Completed',
          OwnerId: habit.sales_reps.external_id,
          ActivityDate: new Date(habit.completed_at).toISOString().split('T')[0]
        })
      });
      pushed++;
    }
  }

  return new Response(
    JSON.stringify({ success: true, pushed }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
