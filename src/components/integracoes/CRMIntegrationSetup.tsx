import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface CRMIntegration {
  id: string;
  provider: string;
  status: string;
  last_sync: string;
  sync_frequency: string;
}

export const CRMIntegrationSetup = () => {
  const [provider, setProvider] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  
  // HubSpot
  const [hubspotKey, setHubspotKey] = useState('');
  
  // Salesforce
  const [salesforceUrl, setSalesforceUrl] = useState('');
  const [salesforceToken, setSalesforceToken] = useState('');

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

  const connectHubSpot = async () => {
    if (!hubspotKey) {
      toast({ title: "Error", description: "Please enter your HubSpot API key", variant: "destructive" });
      return;
    }

    setConnecting(true);
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .single();

      const { error } = await supabase.functions.invoke('crm-hubspot-sync', {
        body: {
          action: 'connect',
          apiKey: hubspotKey,
          companyId: profileData?.company_id
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "HubSpot connected successfully"
      });

      setHubspotKey('');
      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const connectSalesforce = async () => {
    if (!salesforceUrl || !salesforceToken) {
      toast({ title: "Error", description: "Please enter all Salesforce credentials", variant: "destructive" });
      return;
    }

    setConnecting(true);
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .single();

      const { error } = await supabase.functions.invoke('crm-salesforce-sync', {
        body: {
          action: 'connect',
          credentials: { instanceUrl: salesforceUrl, accessToken: salesforceToken },
          companyId: profileData?.company_id
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Salesforce connected successfully"
      });

      setSalesforceUrl('');
      setSalesforceToken('');
      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const syncCRM = async (provider: string, action: string) => {
    setSyncing(true);
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .single();

      const functionName = provider === 'hubspot' ? 'crm-hubspot-sync' : 'crm-salesforce-sync';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          action,
          companyId: profileData?.company_id
        }
      });

      if (error) throw error;

      toast({
        title: "Sync completed!",
        description: `Synced ${data.synced || data.pushed || 0} records`
      });

      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
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
          <CardTitle>CRM Integrations</CardTitle>
          <CardDescription>
            Connect your CRM to automatically sync contacts, deals, and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hubspot">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
              <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
            </TabsList>

            <TabsContent value="hubspot" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hubspot-key">HubSpot Private App Token</Label>
                <Input
                  id="hubspot-key"
                  type="password"
                  placeholder="pat-na1-xxxxx-xxxxx"
                  value={hubspotKey}
                  onChange={(e) => setHubspotKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Get your token from Settings → Integrations → Private Apps
                </p>
              </div>
              <Button onClick={connectHubSpot} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect HubSpot"}
              </Button>
            </TabsContent>

            <TabsContent value="salesforce" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sf-url">Salesforce Instance URL</Label>
                <Input
                  id="sf-url"
                  placeholder="https://your-instance.salesforce.com"
                  value={salesforceUrl}
                  onChange={(e) => setSalesforceUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sf-token">Access Token</Label>
                <Input
                  id="sf-token"
                  type="password"
                  value={salesforceToken}
                  onChange={(e) => setSalesforceToken(e.target.value)}
                />
              </div>
              <Button onClick={connectSalesforce} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect Salesforce"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No integrations configured yet
              </p>
            ) : (
              integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <p className="font-medium capitalize">{integration.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {integration.last_sync ? new Date(integration.last_sync).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncCRM(integration.provider, 'sync_contacts')}
                      disabled={syncing}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Contacts
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncCRM(integration.provider, integration.provider === 'hubspot' ? 'sync_deals' : 'sync_opportunities')}
                      disabled={syncing}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Deals
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
