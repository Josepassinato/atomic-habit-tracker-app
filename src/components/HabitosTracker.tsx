
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Brain, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Habito {
  id: number;
  titulo: string;
  descricao: string;
  cumprido: boolean;
  horario: string;
}

interface ModeloNegocio {
  segmento: string;
  cicloVenda: string;
  tamEquipe: string;
  objetivoPrincipal: string;
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
  
  // Estados para o diálogo de sugestão de hábitos
  const [dialogAberto, setDialogAberto] = useState(false);
  const [modeloNegocio, setModeloNegocio] = useState<ModeloNegocio>({
    segmento: "",
    cicloVenda: "",
    tamEquipe: "",
    objetivoPrincipal: ""
  });
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  const [habitosSugeridos, setHabitosSugeridos] = useState<Habito[]>([]);
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModeloNegocio(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const sugerirHabitosPersonalizados = async () => {
    setCarregandoSugestoes(true);
    
    try {
      // Simulação de resposta da OpenAI (em produção, use a API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Hábitos personalizados baseados no modelo de negócio
      let habitosPersonalizados: Habito[] = [];
      
      // Lógica básica de personalização baseada no setor/segmento
      if (modeloNegocio.segmento.toLowerCase().includes("saas") || 
          modeloNegocio.segmento.toLowerCase().includes("software")) {
        habitosPersonalizados = [
          {
            id: Date.now(),
            titulo: "Demonstração de Valor",
            descricao: "Preparar demonstrações personalizadas do produto para cada cliente",
            cumprido: false,
            horario: "10:00"
          },
          {
            id: Date.now() + 1,
            titulo: "Acompanhamento Pós-Demo",
            descricao: "Entrar em contato 24h após demonstrações",
            cumprido: false,
            horario: "09:00"
          },
          {
            id: Date.now() + 2,
            titulo: "Análise de Engajamento",
            descricao: "Verificar métricas de uso do trial/freemium",
            cumprido: false,
            horario: "14:00"
          }
        ];
      } else if (modeloNegocio.cicloVenda.toLowerCase().includes("longo") || 
                modeloNegocio.objetivoPrincipal.toLowerCase().includes("enterprise")) {
        habitosPersonalizados = [
          {
            id: Date.now(),
            titulo: "Mapeamento de Stakeholders",
            descricao: "Identificar e documentar todos os decisores do cliente",
            cumprido: false,
            horario: "09:30"
          },
          {
            id: Date.now() + 1,
            titulo: "Estudo de Caso",
            descricao: "Preparar estudo de caso relevante para o setor do cliente",
            cumprido: false,
            horario: "11:00"
          },
          {
            id: Date.now() + 2,
            titulo: "Análise de Objeções",
            descricao: "Documentar e preparar respostas para objeções recorrentes",
            cumprido: false,
            horario: "15:30"
          }
        ];
      } else {
        // Caso genérico baseado no tamanho da equipe
        const tamEquipeNum = parseInt(modeloNegocio.tamEquipe) || 5;
        
        habitosPersonalizados = [
          {
            id: Date.now(),
            titulo: "Qualificação de Leads",
            descricao: "Qualificar novos leads usando metodologia BANT",
            cumprido: false,
            horario: "09:00"
          },
          {
            id: Date.now() + 1,
            titulo: tamEquipeNum > 10 ? "Reunião de Alinhamento" : "Revisão de Pipeline",
            descricao: tamEquipeNum > 10 ? "Sincronizar prioridades com a equipe" : "Atualizar status de oportunidades no CRM",
            cumprido: false,
            horario: tamEquipeNum > 10 ? "09:30" : "16:00"
          },
          {
            id: Date.now() + 2,
            titulo: "Feedback de Mercado",
            descricao: "Documentar percepções dos clientes sobre produto/concorrência",
            cumprido: false,
            horario: "17:00"
          }
        ];
      }
      
      setHabitosSugeridos(habitosPersonalizados);
      
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
      //         content: "Você é um assistente especializado em vendas e produtividade. Sugira hábitos atômicos personalizados para equipes de vendas."
      //       },
      //       {
      //         role: "user",
      //         content: `Crie 3 hábitos atômicos personalizados para uma equipe de vendas com as seguintes características: Segmento: ${modeloNegocio.segmento}, Ciclo de Vendas: ${modeloNegocio.cicloVenda}, Tamanho da Equipe: ${modeloNegocio.tamEquipe}, Objetivo Principal: ${modeloNegocio.objetivoPrincipal}. Cada hábito deve ter título, descrição e horário recomendado.`
      //       }
      //     ],
      //     max_tokens: 300
      //   })
      // });
      // const data = await response.json();
      // const habitosGerados = JSON.parse(data.choices[0].message.content); // Assumindo que a resposta é um JSON válido
      // setHabitosSugeridos(habitosGerados);
    } catch (error) {
      console.error("Erro ao obter sugestões da IA:", error);
      toast.error("Não foi possível gerar hábitos personalizados. Tente novamente mais tarde.");
    } finally {
      setCarregandoSugestoes(false);
    }
  };
  
  const adicionarHabitosSugeridos = () => {
    // Adicionar hábitos sugeridos à lista atual
    setHabitos(prev => [...prev, ...habitosSugeridos]);
    setHabitosSugeridos([]);
    setDialogAberto(false);
    toast.success("Hábitos personalizados adicionados com sucesso!");
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full flex items-center justify-center"
          onClick={() => setDialogAberto(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Sugerir Hábitos Personalizados
        </Button>
        
        {feedback && (
          <div className="mt-6 bg-slate-50 p-4 rounded-md border">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Brain size={18} />
              <h4 className="font-medium">Feedback da IA</h4>
            </div>
            <p className="text-sm">{feedback}</p>
          </div>
        )}
        
        {/* Diálogo para sugestão de hábitos personalizados */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Sugestão de Hábitos Personalizados</DialogTitle>
              <DialogDescription>
                Descreva o modelo de negócio da sua empresa para receber sugestões de hábitos otimizados para sua equipe de vendas.
              </DialogDescription>
            </DialogHeader>
            
            {!habitosSugeridos.length ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="segmento" className="text-sm font-medium">Segmento/Indústria</label>
                  <Input 
                    id="segmento" 
                    name="segmento" 
                    placeholder="Ex: SaaS, Varejo, Saúde, etc." 
                    value={modeloNegocio.segmento}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cicloVenda" className="text-sm font-medium">Ciclo de Vendas</label>
                  <Input 
                    id="cicloVenda" 
                    name="cicloVenda" 
                    placeholder="Ex: Curto (1-30 dias), Médio, Longo (>90 dias)" 
                    value={modeloNegocio.cicloVenda}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="tamEquipe" className="text-sm font-medium">Tamanho da Equipe de Vendas</label>
                  <Input 
                    id="tamEquipe" 
                    name="tamEquipe" 
                    placeholder="Ex: 5, 10, 25, etc." 
                    value={modeloNegocio.tamEquipe}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="objetivoPrincipal" className="text-sm font-medium">Objetivo Principal</label>
                  <Textarea 
                    id="objetivoPrincipal" 
                    name="objetivoPrincipal" 
                    placeholder="Ex: Aumentar conversão, Reduzir ciclo de vendas, Expandir para Enterprise, etc." 
                    value={modeloNegocio.objetivoPrincipal}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <div className="py-4">
                <h4 className="font-medium mb-3">Hábitos Sugeridos pela IA:</h4>
                <div className="space-y-3">
                  {habitosSugeridos.map((habito) => (
                    <div key={habito.id} className="border p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{habito.titulo}</h5>
                        <span className="text-sm text-muted-foreground">{habito.horario}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{habito.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setHabitosSugeridos([]);
                setDialogAberto(false);
              }}>
                Cancelar
              </Button>
              
              {habitosSugeridos.length ? (
                <Button onClick={adicionarHabitosSugeridos}>
                  Adicionar Hábitos
                </Button>
              ) : (
                <Button onClick={sugerirHabitosPersonalizados} disabled={carregandoSugestoes}>
                  {carregandoSugestoes ? "Gerando sugestões..." : "Gerar Sugestões"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
