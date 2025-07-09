import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CRMSyncRequest {
  action: 'import' | 'export';
  teamId: string;
  crmType: 'hubspot' | 'pipedrive' | 'salesforce';
  apiKey: string;
  apiUrl: string;
  salesRepsData?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: CRMSyncRequest = await req.json();
    console.log('CRM Sync request:', { action: body.action, crmType: body.crmType, teamId: body.teamId });

    switch (body.action) {
      case 'import':
        return await handleImport(body);
      case 'export':
        return await handleExport(body);
      default:
        throw new Error('Ação não suportada');
    }
  } catch (error) {
    console.error('Erro no CRM Sync:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleImport(body: CRMSyncRequest) {
  const { crmType, apiKey, apiUrl } = body;
  
  let salesReps: any[] = [];

  switch (crmType) {
    case 'hubspot':
      salesReps = await importFromHubSpot(apiKey);
      break;
    case 'pipedrive':
      salesReps = await importFromPipedrive(apiKey, apiUrl);
      break;
    case 'salesforce':
      salesReps = await importFromSalesforce(apiKey, apiUrl);
      break;
    default:
      throw new Error(`CRM ${crmType} não suportado`);
  }

  return new Response(
    JSON.stringify({ salesReps }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleExport(body: CRMSyncRequest) {
  const { crmType, apiKey, apiUrl, salesRepsData } = body;
  
  if (!salesRepsData) {
    throw new Error('Dados de vendedores não fornecidos');
  }

  switch (crmType) {
    case 'hubspot':
      await exportToHubSpot(apiKey, salesRepsData);
      break;
    case 'pipedrive':
      await exportToPipedrive(apiKey, apiUrl, salesRepsData);
      break;
    case 'salesforce':
      await exportToSalesforce(apiKey, apiUrl, salesRepsData);
      break;
    default:
      throw new Error(`CRM ${crmType} não suportado`);
  }

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// HubSpot Integration
async function importFromHubSpot(apiKey: string) {
  console.log('Importando dados do HubSpot...');
  
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro do HubSpot: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.results?.map((contact: any) => ({
    crmId: contact.id,
    name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
    email: contact.properties.email,
    totalSales: parseFloat(contact.properties.total_revenue || '0'),
    goal: parseFloat(contact.properties.sales_goal || '100000'),
    conversionRate: parseFloat(contact.properties.conversion_rate || '0.3'),
  })) || [];
}

async function exportToHubSpot(apiKey: string, salesRepsData: any[]) {
  console.log('Exportando dados para HubSpot...');
  
  for (const rep of salesRepsData) {
    const contactData = {
      properties: {
        firstname: rep.name.split(' ')[0],
        lastname: rep.name.split(' ').slice(1).join(' '),
        email: rep.email,
        total_revenue: rep.totalSales.toString(),
        sales_goal: rep.currentGoal.toString(),
        conversion_rate: rep.conversionRate.toString(),
      }
    };

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      console.error(`Erro ao exportar ${rep.name} para HubSpot:`, await response.text());
    }
  }
}

// Pipedrive Integration
async function importFromPipedrive(apiKey: string, apiUrl: string) {
  console.log('Importando dados do Pipedrive...');
  
  const response = await fetch(`${apiUrl}/v1/persons?api_token=${apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Erro do Pipedrive: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.data?.map((person: any) => ({
    crmId: person.id,
    name: person.name,
    email: person.email?.[0]?.value || '',
    totalSales: parseFloat(person.custom_fields?.total_sales || '0'),
    goal: parseFloat(person.custom_fields?.sales_goal || '100000'),
    conversionRate: parseFloat(person.custom_fields?.conversion_rate || '0.3'),
  })) || [];
}

async function exportToPipedrive(apiKey: string, apiUrl: string, salesRepsData: any[]) {
  console.log('Exportando dados para Pipedrive...');
  
  for (const rep of salesRepsData) {
    const personData = {
      name: rep.name,
      email: [{ value: rep.email, primary: true }],
      custom_fields: {
        total_sales: rep.totalSales,
        sales_goal: rep.currentGoal,
        conversion_rate: rep.conversionRate,
      }
    };

    const response = await fetch(`${apiUrl}/v1/persons?api_token=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      console.error(`Erro ao exportar ${rep.name} para Pipedrive:`, await response.text());
    }
  }
}

// Salesforce Integration
async function importFromSalesforce(apiKey: string, apiUrl: string) {
  console.log('Importando dados do Salesforce...');
  
  const response = await fetch(`${apiUrl}/services/data/v55.0/query/?q=SELECT Id,Name,Email,Total_Sales__c,Sales_Goal__c,Conversion_Rate__c FROM Contact`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro do Salesforce: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.records?.map((contact: any) => ({
    crmId: contact.Id,
    name: contact.Name,
    email: contact.Email,
    totalSales: parseFloat(contact.Total_Sales__c || '0'),
    goal: parseFloat(contact.Sales_Goal__c || '100000'),
    conversionRate: parseFloat(contact.Conversion_Rate__c || '0.3'),
  })) || [];
}

async function exportToSalesforce(apiKey: string, apiUrl: string, salesRepsData: any[]) {
  console.log('Exportando dados para Salesforce...');
  
  for (const rep of salesRepsData) {
    const contactData = {
      Name: rep.name,
      Email: rep.email,
      Total_Sales__c: rep.totalSales,
      Sales_Goal__c: rep.currentGoal,
      Conversion_Rate__c: rep.conversionRate,
    };

    const response = await fetch(`${apiUrl}/services/data/v55.0/sobjects/Contact/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      console.error(`Erro ao exportar ${rep.name} para Salesforce:`, await response.text());
    }
  }
}