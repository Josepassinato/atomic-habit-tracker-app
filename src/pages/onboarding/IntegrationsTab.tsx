
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CRMIntegrationSetup } from "@/components/integracoes/CRMIntegrationSetup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Team } from "./types";

interface IntegrationsTabProps {
  currentTeam: Team | null;
}

const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ currentTeam }) => {
  if (!currentTeam) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-medium">Integrations for: {currentTeam.name}</h3>
        <Badge variant="outline">{currentTeam.name}</Badge>
      </div>
      
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="crm">CRM Sync</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <p className="text-sm text-muted-foreground mb-4">
            Connect Habitus with the tools you already use
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 border rounded-md">
              <div className="flex-1">
                <h4 className="font-medium">HubSpot</h4>
                <p className="text-sm text-muted-foreground">
                  Integrate your contacts and deals
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            
            <div className="flex items-center p-3 border rounded-md">
              <div className="flex-1">
                <h4 className="font-medium">Pipedrive</h4>
                <p className="text-sm text-muted-foreground">
                  Sync your sales funnels
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            
            <div className="flex items-center p-3 border rounded-md">
              <div className="flex-1">
                <h4 className="font-medium">WhatsApp Business</h4>
                <p className="text-sm text-muted-foreground">
                  Send notifications via WhatsApp
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="crm">
          <CRMIntegrationSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsTab;
