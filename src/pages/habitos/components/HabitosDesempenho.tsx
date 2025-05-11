
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GamificacaoCard from "@/components/habitos/GamificacaoCard";
import { Habito } from "@/components/habitos/types";

interface HabitosDesempenhoProps {
  habitos: Habito[];
  conquistasRecentes: any[];
  pontos: number;
  nivel: number;
}

const HabitosDesempenho: React.FC<HabitosDesempenhoProps> = ({
  habitos,
  conquistasRecentes,
  pontos,
  nivel
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso de Hábitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Visão Geral</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold mb-1">67%</div>
                      <div className="text-sm text-muted-foreground">Conclusão Média</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold mb-1">15</div>
                      <div className="text-sm text-muted-foreground">Dias Consistentes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold mb-1">3</div>
                      <div className="text-sm text-muted-foreground">Sequência Atual</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <HabitosEficazes habitos={habitos} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <GamificacaoCard 
          pontos={pontos}
          nivel={nivel}
          proximoNivel={250}
          conquistasRecentes={conquistasRecentes}
        />
      </div>
    </div>
  );
};

// Componente de hábitos mais eficazes extraído
const HabitosEficazes: React.FC<{ habitos: Habito[] }> = ({ habitos }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Hábitos Mais Eficazes</h3>
      <div className="space-y-2">
        {habitos.slice(0, 3).map((habito) => (
          <div key={habito.id} className="flex items-center justify-between border p-3 rounded-md">
            <div>
              <h4 className="font-medium">{habito.titulo}</h4>
              <p className="text-sm text-muted-foreground">Taxa de conclusão: 85%</p>
            </div>
            <div className="text-sm font-bold text-green-600">+15% em vendas</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitosDesempenho;
