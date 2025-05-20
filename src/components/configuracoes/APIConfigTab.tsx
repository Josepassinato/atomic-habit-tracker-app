
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const APIConfigTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>
            Configure integrações com outras ferramentas e serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">CRM Externo</div>
              <div className="text-sm text-muted-foreground">
                Conecte-se ao seu CRM para sincronização de dados
              </div>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">Calendário</div>
              <div className="text-sm text-muted-foreground">
                Sincronize com Google Calendar ou Outlook
              </div>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Os recursos de IA estão disponíveis em toda a plataforma e são gerenciados pelo administrador do SaaS.
              Não é necessária nenhuma configuração adicional para utilizar as funcionalidades de IA.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIConfigTab;
