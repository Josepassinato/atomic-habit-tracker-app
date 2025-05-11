
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Habito {
  id: number;
  titulo: string;
  descricao: string;
  cumprido: boolean;
  horario: string;
}

const habitosIniciais = [
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
  const [habitos, setHabitos] = useState<Habito[]>(() => {
    // Tenta recuperar do localStorage, senão usa os hábitos iniciais
    const salvos = localStorage.getItem("habitos");
    return salvos ? JSON.parse(salvos) : habitosIniciais;
  });
  
  const [feedback, setFeedback] = useState<string>("");
  const [carregandoFeedback, setCarregandoFeedback] = useState(false);
  
  const habitosCumpridos = habitos.filter((habito) => habito.cumprido).length;
  const progresso = (habitosCumpridos / habitos.length) * 100;
  
  // Salvar hábitos no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(habitos));
  }, [habitos]);

  const marcarComoConcluido = (id: number) => {
    setHabitos(habitos.map((habito) => 
      habito.id === id ? { ...habito, cumprido: true } : habito
    ));
    toast.success("Hábito marcado como concluído!");
  };
  
  const reiniciarHabitos = () => {
    setHabitos(habitosIniciais.map(h => ({...h, cumprido: false})));
    setFeedback("");
    toast.info("Hábitos reiniciados para o próximo dia.");
  };

  const solicitarFeedbackIA = async () => {
    setCarregandoFeedback(true);
    
    try {
      // Simulação de resposta da OpenAI (em produção, use a API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let mensagemFeedback = "";
      const percentualConcluido = (habitosCumpridos / habitos.length) * 100;
      
      if (percentualConcluido === 100) {
        mensagemFeedback = "Excelente trabalho hoje! Você completou todos os hábitos programados. Manter essa consistência trará resultados significativos para suas metas de vendas. Continue assim!";
      } else if (percentualConcluido >= 60) {
        mensagemFeedback = `Bom progresso! Você completou ${habitosCumpridos} de ${habitos.length} hábitos hoje. Para melhorar ainda mais, considere priorizar "${habitos.find(h => !h.cumprido)?.titulo}" amanhã, pois esse hábito tem impacto direto no fechamento de vendas.`;
      } else {
        mensagemFeedback = `Você completou ${habitosCumpridos} de ${habitos.length} hábitos hoje. Recomendo revisar sua rotina para priorizar esses hábitos atômicos, especialmente o "${habitos.find(h => !h.cumprido)?.titulo}" que pode ter impacto significativo no seu desempenho.`;
      }
      
      setFeedback(mensagemFeedback);
      
      // Em produção, substituir por chamada real à API da OpenAI
      // const response = await fetch("https://api.openai.com/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${OPENAI_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-4o",
      //     messages: [
      //       {
      //         role: "system",
      //         content: "Você é um assistente especializado em produtividade e vendas. Forneça feedback construtivo e motivacional."
      //       },
      //       {
      //         role: "user",
      //         content: `Um vendedor completou ${habitosCumpridos} de ${habitos.length} hábitos hoje: ${habitos.map(h => `${h.titulo} (${h.cumprido ? 'concluído' : 'não concluído'})`).join(', ')}. Dê um feedback sobre o desempenho e sugira melhorias.`
      //       }
      //     ],
      //     max_tokens: 200
      //   })
      // });
      // const data = await response.json();
      // setFeedback(data.choices[0].message.content);
      
    } catch (error) {
      console.error("Erro ao obter feedback da IA:", error);
      toast.error("Não foi possível obter o feedback da IA. Tente novamente mais tarde.");
    } finally {
      setCarregandoFeedback(false);
    }
  };

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
                  <Button size="sm" className="mt-1" onClick={() => marcarComoConcluido(habito.id)}>
                    Marcar como concluído
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {feedback && (
          <div className="mt-6 bg-slate-50 p-4 rounded-md border">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Brain size={18} />
              <h4 className="font-medium">Feedback da IA</h4>
            </div>
            <p className="text-sm">{feedback}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={reiniciarHabitos}
        >
          Reiniciar Hábitos
        </Button>
        <Button 
          size="sm" 
          onClick={solicitarFeedbackIA} 
          disabled={carregandoFeedback}
        >
          {carregandoFeedback ? "Analisando..." : "Solicitar Feedback da IA"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitosTracker;
