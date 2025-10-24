
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap, MessageSquare, Phone, BarChart, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";
import { useLanguage } from "@/i18n";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  category: "CRM" | "Communication" | "Analytics";
}

const integrations: Integration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Contacts, Deals, Activities",
    icon: ExternalLink,
    connected: false,
    category: "CRM"
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Contacts, Deals, Activities",
    icon: BarChart,
    connected: false,
    category: "CRM"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Messages, Notifications",
    icon: MessageSquare,
    connected: false,
    category: "Communication"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Messages, Notifications",
    icon: MessageSquare,
    connected: false,
    category: "Communication"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Custom Automations",
    icon: Shuffle,
    connected: false,
    category: "Analytics"
  }
];

const IntegracoesCRM = () => {
  const [integrationsList, setIntegrationsList] = useState<Integration[]>(integrations);
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const { t } = useLanguage();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'integrations')
          .single();

        if (!error && data) {
          const savedIntegrations = data.value as { [key: string]: boolean };
          setIntegrationsList(prev => 
            prev.map(integration => ({
              ...integration,
              connected: savedIntegrations[integration.id] || false
            }))
          );
        }
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('integrations');
        if (saved) {
          const savedIntegrations = JSON.parse(saved);
          setIntegrationsList(prev => 
            prev.map(integration => ({
              ...integration,
              connected: savedIntegrations[integration.id] || false
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error loading integrations:", error);
    }
  };

  const handleConnect = async (integrationId: string) => {
    setLoading(true);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIntegrations = integrationsList.map(integration =>
        integration.id === integrationId
          ? { ...integration, connected: !integration.connected }
          : integration
      );
      
      setIntegrationsList(newIntegrations);
      
      // Save to backend
      const integrationsStatus = newIntegrations.reduce((acc, integration) => {
        acc[integration.id] = integration.connected;
        return acc;
      }, {} as { [key: string]: boolean });
      
      if (supabase) {
        const { error } = await supabase
          .from('settings')
          .upsert({
            key: 'integrations',
            value: integrationsStatus,
            user_id: 'current-user-id' // This should be the actual user ID
          });
          
        if (error) throw error;
      } else {
        localStorage.setItem('integrations', JSON.stringify(integrationsStatus));
      }
      
      const integration = newIntegrations.find(i => i.id === integrationId);
      toast.success(
        integration?.connected ? t('connectionSuccess') : t('disconnecting'),
        {
          description: `${integration?.name} ${integration?.connected ? t('connected') : t('disconnected')}.`
        }
      );
    } catch (error) {
      console.error("Error connecting integration:", error);
      toast.error(t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Integrations
        </CardTitle>
        <CardDescription>
          Connect your CRM and communication tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrationsList.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <integration.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">{integration.name}</h4>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {integration.connected && (
                <Badge variant="secondary" className="text-green-700 bg-green-50">
                  Connected
                </Badge>
              )}
              <Button
                size="sm"
                variant={integration.connected ? "outline" : "default"}
                onClick={() => handleConnect(integration.id)}
                disabled={loading}
                className="min-w-[80px]"
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IntegracoesCRM;
