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

    const { action, apiKey, companyId } = await req.json();

    console.log(`HubSpot sync action: ${action} for company: ${companyId}`);

    switch (action) {
      case 'connect':
        return await connectHubSpot(apiKey, companyId, supabaseClient);
      case 'sync_contacts':
        return await syncContacts(companyId, supabaseClient);
      case 'sync_deals':
        return await syncDeals(companyId, supabaseClient);
      case 'push_activities':
        return await pushActivities(companyId, supabaseClient);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('HubSpot sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function connectHubSpot(apiKey: string, companyId: string, supabase: any) {
  // Test connection
  const testResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });

  if (!testResponse.ok) {
    throw new Error('Invalid HubSpot API key');
  }

  // Store encrypted credentials
  const { error } = await supabase
    .from('crm_integrations')
    .upsert({
      company_id: companyId,
      provider: 'hubspot',
      api_key: apiKey,
      status: 'active',
      last_sync: new Date().toISOString()
    });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, message: 'HubSpot connected successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncContacts(companyId: string, supabase: any) {
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('api_key')
    .eq('company_id', companyId)
    .eq('provider', 'hubspot')
    .single();

  if (!integration) {
    throw new Error('HubSpot integration not found');
  }

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    headers: { 'Authorization': `Bearer ${integration.api_key}` }
  });

  const contacts = await response.json();

  // Sync contacts to sales_reps
  for (const contact of contacts.results || []) {
    await supabase.from('sales_reps').upsert({
      company_id: companyId,
      name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
      email: contact.properties.email,
      external_id: contact.id,
      external_source: 'hubspot'
    }, { onConflict: 'external_id' });
  }

  await supabase
    .from('crm_integrations')
    .update({ last_sync: new Date().toISOString() })
    .eq('company_id', companyId)
    .eq('provider', 'hubspot');

  return new Response(
    JSON.stringify({ success: true, synced: contacts.results?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function syncDeals(companyId: string, supabase: any) {
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('api_key')
    .eq('company_id', companyId)
    .eq('provider', 'hubspot')
    .single();

  if (!integration) {
    throw new Error('HubSpot integration not found');
  }

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
    headers: { 'Authorization': `Bearer ${integration.api_key}` }
  });

  const deals = await response.json();

  // Sync deals to update sales metrics
  for (const deal of deals.results || []) {
    if (deal.properties.dealstage === 'closedwon' && deal.properties.amount) {
      const ownerId = deal.properties.hubspot_owner_id;
      
      const { data: salesRep } = await supabase
        .from('sales_reps')
        .select('id, total_sales')
        .eq('external_id', ownerId)
        .eq('external_source', 'hubspot')
        .single();

      if (salesRep) {
        await supabase
          .from('sales_reps')
          .update({ total_sales: (salesRep.total_sales || 0) + parseFloat(deal.properties.amount) })
          .eq('id', salesRep.id);
      }
    }
  }

  return new Response(
    JSON.stringify({ success: true, synced: deals.results?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function pushActivities(companyId: string, supabase: any) {
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('api_key')
    .eq('company_id', companyId)
    .eq('provider', 'hubspot')
    .single();

  if (!integration) {
    throw new Error('HubSpot integration not found');
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
      await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            hs_note_body: `Completed habit: ${habit.title} - ${habit.description || ''}`,
            hs_timestamp: new Date(habit.completed_at).getTime(),
            hubspot_owner_id: habit.sales_reps.external_id
          }
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
