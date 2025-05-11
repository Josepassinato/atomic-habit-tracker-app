
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HabitoItem from "@/components/habitos/HabitoItem";
import { Habito } from "@/components/habitos/types";
import { HabitoEvidenciaType } from "@/components/habitos/HabitoEvidencia";
import FeedbackIA from "@/components/habitos/FeedbackIA";
import GamificacaoCard from "@/components/habitos/GamificacaoCard";

interface HabitosListProps {
  habitos: Habito[];
  conquistasRecentes: any[];
  pontos: number;
  nivel: number;
  onEvidenciaSubmitted: (habitoId: number, evidencia: HabitoEvidenciaType) => void;
  onMarcarConcluido: (id: number) => void;
}

const HabitosList: React.FC<HabitosListProps> = ({
  habitos,
  conquistasRecentes,
  pontos,
  nivel,
  onEvidenciaSubmitted,
  onMarcarConcluido
}) => {
  // Feedback fictício para demonstração
  const feedback = "Você está progredindo bem com seus hábitos diários. Considere adicionar mais hábitos focados em prospecção ativa para aumentar seu pipeline de vendas.";

  return (
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
                    onEvidenciaSubmitted={onEvidenciaSubmitted}
                    onMarcarConcluido={onMarcarConcluido}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <FeedbackIA feedback={feedback} />
      </div>
      
      <div>
        <GamificacaoCard 
          pontos={pontos}
          nivel={nivel}
          proximoNivel={250}
          conquistasRecentes={conquistasRecentes}
        />
        <EstadisticasCard />
      </div>
    </div>
  );
};

// Componente de estatísticas extraído
const EstadisticasCard = () => (
  <Card className="mt-6">
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
);

export default HabitosList;
