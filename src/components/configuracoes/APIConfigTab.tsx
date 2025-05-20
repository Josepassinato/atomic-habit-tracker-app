
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegracoesCRM from "@/components/IntegracoesCRM";

const APIConfigTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <IntegracoesCRM />
      
      <Card>
        <CardHeader>
          <CardTitle>Recursos de IA</CardTitle>
          <CardDescription>
            Informações sobre os recursos de inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
