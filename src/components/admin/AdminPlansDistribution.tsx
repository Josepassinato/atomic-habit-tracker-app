
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Tipo para os dados do painel administrativo
type EmpresaAdmin = {
  id: string;
  plano: string;
  status: "ativo" | "inativo" | "trial";
};

interface AdminPlansDistributionProps {
  empresas: EmpresaAdmin[];
}

const AdminPlansDistribution: React.FC<AdminPlansDistributionProps> = ({ empresas }) => {
  // Formatar para real brasileiro
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Planos</CardTitle>
        <CardDescription>
          Visão geral da distribuição de planos entre as empresas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Para cada tipo de plano, vamos calcular e exibir */}
          {["Starter", "Professional", "Enterprise"].map(plano => {
            const empresasNoPlano = empresas.filter(e => e.plano === plano);
            const countTotal = empresasNoPlano.length;
            const countAtivas = empresasNoPlano.filter(e => e.status === "ativo").length;
            
            // Receita deste plano
            let valorPlano = 0;
            switch(plano) {
              case "Enterprise": valorPlano = 997; break;
              case "Professional": valorPlano = 497; break;
              case "Starter": valorPlano = 197; break;
            }
            const receitaPlano = countAtivas * valorPlano;
            
            return (
              <div key={plano} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">{plano}</h3>
                  <div className="text-sm text-muted-foreground">
                    {countTotal} empresas ({countAtivas} ativas)
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span>Valor do plano:</span>
                  <span className="font-medium">{formatarMoeda(valorPlano)}/mês</span>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <span>Receita total:</span>
                  <span className="font-medium">{formatarMoeda(receitaPlano)}/mês</span>
                </div>
                
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      plano === "Enterprise" ? "bg-primary" : 
                      plano === "Professional" ? "bg-orange-400" : 
                      "bg-orange-300"
                    }`} 
                    style={{ width: `${(countTotal / empresas.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((countTotal / empresas.length) * 100)}% das empresas
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPlansDistribution;
