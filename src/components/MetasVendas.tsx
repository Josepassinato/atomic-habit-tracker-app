
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const metas = [
  {
    id: 1,
    nome: "Meta Principal",
    valor: 120000,
    atual: 102000,
    percentual: 85,
  },
  {
    id: 2,
    nome: "Meta de Prospecção",
    valor: 50,
    atual: 45,
    percentual: 90,
  },
  {
    id: 3,
    nome: "Meta de Conversão",
    valor: 30,
    atual: 18,
    percentual: 60,
  },
];

const MetasVendas = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Metas de Vendas</CardTitle>
            <CardDescription>Mês de Outubro, 2025</CardDescription>
          </div>
          <Badge className="flex items-center gap-1" variant="outline">
            <TrendingUp className="h-3 w-3" />
            Definido pela IA
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metas.map((meta) => (
            <div key={meta.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">{meta.nome}</h4>
                  <div className="text-sm text-muted-foreground">
                    {meta.nome === "Meta Principal"
                      ? `R$ ${meta.atual.toLocaleString()} de R$ ${meta.valor.toLocaleString()}`
                      : `${meta.atual} de ${meta.valor}`}
                  </div>
                </div>
                <Badge
                  variant={meta.percentual >= 80 ? "secondary" : meta.percentual >= 50 ? "outline" : "destructive"}
                >
                  {meta.percentual}%
                </Badge>
              </div>
              <Progress value={meta.percentual} className="h-2" />
            </div>
          ))}
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">Sugestão da IA:</p>
            <p className="mt-1 text-muted-foreground">
              Concentre-se na meta de conversão aumentando o número de follow-ups para cada lead qualificado.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetasVendas;
