
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import HabitoItem from "@/components/habitos/HabitoItem";
import { Habito } from "@/components/habitos/types";
import { HabitoEvidenciaType } from "@/components/habitos/HabitoEvidencia";
import FeedbackIA from "@/components/habitos/FeedbackIA";
import { toast } from "sonner";

const Habitos = () => {
  const [habitos, setHabitos] = useState<Habito[]>([
    {
      id: 1,
      titulo: "Fazer 10 ligações para prospectos",
      descricao: "Realizar ligações para novos leads qualificados",
      cumprido: false,
      horario: "09:00",
      verificacaoNecessaria: true
    },
    {
      id: 2,
      titulo: "Atualizar CRM",
      descricao: "Registrar interações com clientes no sistema",
      cumprido: false,
      horario: "15:00"
    },
    {
      id: 3,
      titulo: "Revisar pipeline de vendas",
      descricao: "Analisar oportunidades e próximas ações",
      cumprido: true,
      horario: "17:00",
      verificado: true
    }
  ]);
  
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Simular carregamento de feedback da IA
    setFeedback(
      "Você está progredindo bem com seus hábitos diários. Considere adicionar mais hábitos focados em prospecção ativa para aumentar seu pipeline de vendas."
    );
  }, []);

  const handleMarcarConcluido = (id: number) => {
    setHabitos(habitos.map(habito => 
      habito.id === id ? { ...habito, cumprido: true } : habito
    ));
    toast.success("Hábito marcado como concluído!");
  };

  const handleEvidenciaSubmitted = (habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(habitos.map(habito => 
      habito.id === habitoId ? { ...habito, evidencia } : habito
    ));
    toast.success("Evidência enviada com sucesso!");
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hábitos Atômicos</h1>
        <Button className="gap-2">
          <PlusCircle size={16} />
          Novo Hábito
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meus Hábitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {habitos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Você ainda não possui hábitos cadastrados.
                </p>
              ) : (
                <div className="space-y-4">
                  {habitos.map((habito) => (
                    <HabitoItem 
                      key={habito.id}
                      habito={habito}
                      onEvidenciaSubmitted={handleEvidenciaSubmitted}
                      onMarcarConcluido={handleMarcarConcluido}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <FeedbackIA feedback={feedback} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso Semanal</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: "67%" }}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium text-sm mb-2">Estatísticas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="text-2xl font-bold">15</div>
                      <div className="text-xs text-muted-foreground">Concluídos</div>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-md">
                      <div className="text-2xl font-bold">21</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Habitos;
