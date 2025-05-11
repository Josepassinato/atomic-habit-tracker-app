
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const habitos = [
  {
    id: 1,
    titulo: "Check-in Matinal",
    descricao: "Definir metas diárias para vendas",
    cumprido: true,
    horario: "08:30",
  },
  {
    id: 2,
    titulo: "Follow-up Sistemático",
    descricao: "Verificar se contatos foram registrados no CRM",
    cumprido: true,
    horario: "12:00",
  },
  {
    id: 3,
    titulo: "Treinamento em Micro Doses",
    descricao: "Ler conteúdo e validar aprendizado",
    cumprido: false,
    horario: "15:00",
  },
  {
    id: 4,
    titulo: "Registro de Insights no CRM",
    descricao: "Documentar interações importantes",
    cumprido: false,
    horario: "16:30",
  },
  {
    id: 5,
    titulo: "Encerramento do Dia",
    descricao: "Reflexão sobre conquistas e melhorias",
    cumprido: false,
    horario: "18:00",
  },
];

const HabitosTracker = () => {
  const habitosCumpridos = habitos.filter((habito) => habito.cumprido).length;
  const progresso = (habitosCumpridos / habitos.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hábitos Atômicos Diários</CardTitle>
        <CardDescription>
          Progresso de hoje: {habitosCumpridos} de {habitos.length} hábitos
        </CardDescription>
        <Progress value={progresso} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habitos.map((habito) => (
            <div key={habito.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
              <div className="mt-0.5">
                {habito.cumprido ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                    <span className="sr-only">Não concluído</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{habito.titulo}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {habito.horario}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{habito.descricao}</p>
                {!habito.cumprido && (
                  <Button size="sm" className="mt-1">
                    Marcar como concluído
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitosTracker;
