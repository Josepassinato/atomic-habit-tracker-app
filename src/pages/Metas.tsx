
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle, TrendingUp } from "lucide-react";

const Metas = () => {
  const metas = [
    {
      id: 1,
      titulo: "Meta de vendas Q2",
      valor: "R$ 100.000,00",
      progresso: 68,
      dataFinal: "30/06/2025",
      status: "em_andamento"
    },
    {
      id: 2,
      titulo: "Novos clientes",
      valor: "15 clientes",
      progresso: 40,
      dataFinal: "30/06/2025",
      status: "em_andamento"
    },
    {
      id: 3,
      titulo: "Meta de vendas Q1",
      valor: "R$ 85.000,00",
      progresso: 100,
      dataFinal: "31/03/2025",
      status: "concluida"
    }
  ];

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Metas de Vendas</h1>
        <Button className="gap-2">
          <PlusCircle size={16} />
          Nova Meta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Metas Ativas</h2>
          
          {metas
            .filter(meta => meta.status === "em_andamento")
            .map(meta => (
              <Card key={meta.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{meta.titulo}</h3>
                        <p className="text-2xl font-bold mt-1">{meta.valor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Data final: {meta.dataFinal}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{meta.progresso}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${meta.progresso}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">Detalhes</Button>
                      <Button size="sm">Atualizar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          
          <h2 className="text-xl font-semibold mt-8">Metas Concluídas</h2>
          
          {metas
            .filter(meta => meta.status === "concluida")
            .map(meta => (
              <Card key={meta.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          {meta.titulo}
                          <CheckCircle size={16} className="text-green-500" />
                        </h3>
                        <p className="text-2xl font-bold mt-1">{meta.valor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Concluída em: {meta.dataFinal}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-100 rounded-lg">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium">Média de conclusão</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Resumo</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <div className="text-lg font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-md">
                      <div className="text-lg font-bold">2</div>
                      <div className="text-xs text-muted-foreground">Ativas</div>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-md">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Concluídas</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p>
                Metas SMART são específicas, mensuráveis, alcançáveis, relevantes e com tempo definido.
              </p>
              <p>
                Divida suas metas grandes em partes menores para acompanhar melhor seu progresso diário.
              </p>
              <p>
                Reavalie suas metas ao final de cada ciclo para ajustar sua estratégia.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Metas;
