
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Tipo para os dados do painel administrativo
type EmpresaAdmin = {
  id: string;
  nome: string;
  tokens_consumidos: number;
  tokens_limite: number;
  status: "ativo" | "inativo" | "trial";
};

interface AdminTokenUsageProps {
  empresas: EmpresaAdmin[];
}

const AdminTokenUsage: React.FC<AdminTokenUsageProps> = ({ empresas }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo de Tokens</CardTitle>
        <CardDescription>
          Análise detalhada do consumo de tokens por empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{empresa.nome}</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((empresa.tokens_consumidos / empresa.tokens_limite) * 100)}% utilizado
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min(100, (empresa.tokens_consumidos / empresa.tokens_limite) * 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {empresa.tokens_consumidos.toLocaleString()} / {empresa.tokens_limite.toLocaleString()} tokens
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTokenUsage;
