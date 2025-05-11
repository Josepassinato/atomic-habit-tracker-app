import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, List, Trophy } from "lucide-react";
import { TrendingUp, Zap, Award } from "lucide-react";
import HabitoItem from "@/components/habitos/HabitoItem";
import { Habito } from "@/components/habitos/types";
import { HabitoEvidenciaType } from "@/components/habitos/HabitoEvidencia";
import FeedbackIA from "@/components/habitos/FeedbackIA";
import { toast } from "sonner";
import CalendarioHabitos from "@/components/habitos/CalendarioHabitos";
import GamificacaoCard from "@/components/habitos/GamificacaoCard";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";

const Habitos = () => {
  const { adicionarNotificacao } = useNotificacoes();
  
  const [habitos, setHabitos] = useState<Habito[]>([
    {
      id: 1,
      titulo: "Fazer 10 ligações para prospectos",
      descricao: "Realizar ligações para novos leads qualificados",
      cumprido: false,
      horario: "09:00",
      verificacaoNecessaria: true,
      dataCriacao: new Date().toISOString()
    },
    {
      id: 2,
      titulo: "Atualizar CRM",
      descricao: "Registrar interações com clientes no sistema",
      cumprido: false,
      horario: "15:00",
      dataCriacao: new Date().toISOString()
    },
    {
      id: 3,
      titulo: "Revisar pipeline de vendas",
      descricao: "Analisar oportunidades e próximas ações",
      cumprido: true,
      horario: "17:00",
      verificado: true,
      dataCriacao: new Date().toISOString()
    }
  ]);
  
  // Estado para as conquistas e pontos do sistema de gamificação
  const [pontos, setPontos] = useState(150);
  const [nivel, setNivel] = useState(2);
  const [conquistasRecentes, setConquistasRecentes] = useState([
    {
      id: 1,
      titulo: "Consistência Semanal",
      descricao: "Complete todos os hábitos por 5 dias seguidos",
      icone: <TrendingUp className="h-4 w-4 text-blue-600" />,
      progresso: 60,
      completa: false
    },
    {
      id: 2,
      titulo: "Mestre do CRM",
      descricao: "Atualize o CRM por 10 dias consecutivos",
      icone: <Zap className="h-4 w-4 text-amber-600" />,
      progresso: 100,
      completa: true
    },
    {
      id: 3,
      titulo: "Pipeline Saudável",
      descricao: "Mantenha 20 leads ativos no pipeline",
      icone: <Award className="h-4 w-4 text-purple-600" />,
      progresso: 75,
      completa: false
    }
  ]);
  
  const [feedback, setFeedback] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("lista");

  // Criar dados de hábitos para o calendário
  const [habitosPorDia, setHabitosPorDia] = useState<Record<string, { total: number; completos: number }>>({});

  useEffect(() => {
    // Gerar dados fictícios para o calendário dos últimos 30 dias
    const hoje = new Date();
    const dadosPorDia: Record<string, { total: number; completos: number }> = {};
    
    // Preencher com dados fictícios
    for (let i = 0; i < 30; i++) {
      const data = new Date();
      data.setDate(hoje.getDate() - i);
      const dataFormatada = format(data, "yyyy-MM-dd");
      
      // Para dias passados, gerar dados aleatórios
      if (i > 0) {
        const totalHabitos = 3;
        const habitosCompletos = Math.floor(Math.random() * (totalHabitos + 1));
        dadosPorDia[dataFormatada] = {
          total: totalHabitos,
          completos: habitosCompletos
        };
      } else {
        // Para hoje, usar dados reais
        dadosPorDia[dataFormatada] = {
          total: habitos.length,
          completos: habitos.filter(h => h.cumprido).length
        };
      }
    }
    
    setHabitosPorDia(dadosPorDia);
    
    // Simular carregamento de feedback da IA
    setFeedback(
      "Você está progredindo bem com seus hábitos diários. Considere adicionar mais hábitos focados em prospecção ativa para aumentar seu pipeline de vendas."
    );
  }, []);

  const handleMarcarConcluido = (id: number) => {
    setHabitos(habitos.map(habito => 
      habito.id === id ? { ...habito, cumprido: true } : habito
    ));
    
    // Adicionar pontos quando um hábito é concluído
    setPontos(prev => prev + 10);
    
    // Adicionar notificação
    adicionarNotificacao({
      titulo: "Hábito concluído!",
      mensagem: "Você ganhou 10 pontos por concluir um hábito.",
      tipo: "sucesso"
    });
    
    toast.success("Hábito marcado como concluído!");
  };

  const handleEvidenciaSubmitted = (habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(habitos.map(habito => 
      habito.id === habitoId ? { ...habito, evidencia } : habito
    ));
    
    // Adicionar pontos extras por enviar evidência
    setPontos(prev => prev + 5);
    
    adicionarNotificacao({
      titulo: "Evidência enviada",
      mensagem: "Sua evidência foi enviada para verificação. +5 pontos!",
      tipo: "info"
    });
    
    toast.success("Evidência enviada com sucesso!");
  };

  const handleCalendarDaySelect = (date: Date) => {
    setSelectedDate(date);
    // Em um sistema real, buscaríamos os hábitos para esta data específica
  };

  const handleAddNewHabito = () => {
    // Simplesmente adiciona um novo hábito exemplo
    const novoHabito: Habito = {
      id: Math.max(...habitos.map(h => h.id)) + 1,
      titulo: "Novo hábito",
      descricao: "Descrição do novo hábito",
      cumprido: false,
      horario: "10:00",
      dataCriacao: new Date().toISOString()
    };
    
    setHabitos([...habitos, novoHabito]);
    
    adicionarNotificacao({
      titulo: "Novo hábito adicionado",
      mensagem: "Você adicionou um novo hábito à sua rotina.",
      tipo: "info"
    });
    
    toast.success("Novo hábito adicionado!");
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hábitos Atômicos</h1>
        <Button className="gap-2" onClick={handleAddNewHabito}>
          <PlusCircle size={16} />
          Novo Hábito
        </Button>
      </div>
      
      <Tabs defaultValue="lista" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <List size={16} />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar size={16} />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="desempenho" className="flex items-center gap-2">
            <Trophy size={16} />
            Desempenho
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista" className="mt-0">
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
              <GamificacaoCard 
                pontos={pontos}
                nivel={nivel}
                proximoNivel={250}
                conquistasRecentes={conquistasRecentes}
              />
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="calendario" className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <CalendarioHabitos 
                habitos={habitos}
                habitosPorDia={habitosPorDia}
                onSelectDay={handleCalendarDaySelect}
              />
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
        </TabsContent>
        
        <TabsContent value="desempenho" className="mt-0">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Habitos;

// Adicionamos os ícones necessários
import { TrendingUp, Zap, Award } from "lucide-react";
