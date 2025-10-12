import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Plug } from 'lucide-react';

interface CRMIntegration {
  id: string;
  provider: string;
  status: string;
  last_sync: string | null;
  instance_url: string | null;
}

export const CRMIntegrationSetup = () => {
  const [provider, setProvider] = useState<'hubspot' | 'pipedrive' | 'salesforce' | ''>('');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);

  const loadIntegrations = async () => {
    const { data, error } = await supabase
      .from('crm_integrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading integrations",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setIntegrations(data || []);
  };

  React.useEffect(() => {
    loadIntegrations();
  }, []);

  const connectCRM = async () => {
    if (!provider) {
      toast({ title: "Erro", description: "Selecione um CRM", variant: "destructive" });
      return;
    }
    if (!apiKey) {
      toast({ title: "Erro", description: "Informe a API Key", variant: "destructive" });
      return;
    }
    if ((provider === 'pipedrive' || provider === 'salesforce') && !apiUrl) {
      toast({ title: "Erro", description: "Informe a URL da API", variant: "destructive" });
      return;
    }

    setConnecting(true);
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .single();

      const { error } = await supabase
        .from('crm_integrations')
        .insert({
          company_id: profileData?.company_id,
          provider,
          api_key: apiKey,
          instance_url: apiUrl || null,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Conectado!",
        description: `${provider.toUpperCase()} conectado com sucesso`
      });

      setProvider('');
      setApiKey('');
      setApiUrl('');
      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Erro na conexão",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const syncCRM = async (integrationId: string, crmType: 'hubspot' | 'pipedrive' | 'salesforce') => {
    setSyncing(true);
    try {
      const { data: integration } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('id', integrationId)
        .single();

      if (!integration) throw new Error('Integração não encontrada');

      const { data, error } = await supabase.functions.invoke('crm-sync', {
        body: {
          action: 'import',
          teamId: integration.company_id,
          crmType,
          apiKey: integration.api_key,
          apiUrl: integration.instance_url || ''
        }
      });

      if (error) throw error;

      await supabase
        .from('crm_integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', integrationId);

      toast({
        title: "Sincronizado!",
        description: `${data.salesReps?.length || 0} vendedores importados`
      });

      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const disconnectCRM = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('crm_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      toast({
        title: "Desconectado",
        description: "Integração removida com sucesso"
      });

      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Integração CRM
          </CardTitle>
          <CardDescription>
            Conecte seu CRM de forma simples - apenas API Key e pronto!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecione o CRM</Label>
            <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha seu CRM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hubspot">HubSpot</SelectItem>
                <SelectItem value="pipedrive">Pipedrive</SelectItem>
                <SelectItem value="salesforce">Salesforce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {provider === 'pipedrive' && (
            <div className="space-y-2">
              <Label>URL da API</Label>
              <Input
                placeholder="https://api.pipedrive.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          )}

          {provider === 'salesforce' && (
            <div className="space-y-2">
              <Label>URL da Instância</Label>
              <Input
                placeholder="https://sua-instancia.salesforce.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>API Key / Token</Label>
            <Input
              type="password"
              placeholder={
                provider === 'hubspot' ? 'pat-na1-xxxxx-xxxxx' :
                provider === 'salesforce' ? 'Access Token' :
                'API Token'
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {provider === 'hubspot' && (
              <p className="text-sm text-muted-foreground">
                Settings → Integrations → Private Apps
              </p>
            )}
          </div>

          <Button onClick={connectCRM} disabled={connecting} className="w-full">
            <Plug className="h-4 w-4 mr-2" />
            {connecting ? "Conectando..." : "Conectar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrações Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma integração configurada
              </p>
            ) : (
              integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <p className="font-medium capitalize">{integration.provider}</p>
                      <p className="text-xs text-muted-foreground">
                        {integration.last_sync ? `Última sync: ${new Date(integration.last_sync).toLocaleString('pt-BR')}` : 'Nunca sincronizado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncCRM(integration.id, integration.provider as any)}
                      disabled={syncing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                      Sincronizar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => disconnectCRM(integration.id)}
                    >
                      Desconectar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
