import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Habito } from "@/components/habitos/types";
import { HabitoEvidenciaType } from "@/components/habitos/HabitoEvidencia";
import { toast } from "sonner";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";
import { habitosIniciais } from "@/components/habitos/HabitosService";
import { TrendingUp, Zap, Award } from "lucide-react";

type ConquistaRecente = {
  id: number;
  titulo: string;
  descricao: string;
  icone: JSX.Element;
  progresso: number;
  completa: boolean;
};

export const useHabitos = () => {
  const { adicionarNotificacao } = useNotificacoes();
  
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
  
  const [habitos, setHabitos] = useState<Habito[]>(() => {
    const salvos = localStorage.getItem("habitos");
    return salvos ? JSON.parse(salvos) : habitosIniciais;
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habitosPorDia, setHabitosPorDia] = useState<Record<string, { total: number; completos: number }>>({});

  // Gerar dados para o calendário
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
  }, [habitos]);
  
  // Salvar hábitos no localStorage sempre que forem alterados
  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(habitos));
  }, [habitos]);

  // Função para marcar hábitos como concluídos
  const handleMarcarConcluido = useCallback((id: number) => {
    setHabitos(prev => prev.map(habito => 
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
    
    toast.success("Hábito marcado como concluído!", {
      description: "Você está construindo consistência e melhorando seus resultados!"
    });
  }, [adicionarNotificacao]);

  // Função para registrar evidências de hábitos
  const handleEvidenciaSubmitted = useCallback((habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(prev => prev.map(habito => 
      habito.id === habitoId ? { ...habito, evidencia } : habito
    ));
    
    // Adicionar pontos extras por enviar evidência
    setPontos(prev => prev + 5);
    
    adicionarNotificacao({
      titulo: "Evidência enviada",
      mensagem: "Sua evidência foi enviada para verificação. +5 pontos!",
      tipo: "info"
    });
  }, [adicionarNotificacao]);

  // Função para selecionar dia no calendário
  const handleCalendarDaySelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // Em um sistema real, buscaríamos os hábitos para esta data específica
  }, []);

  // Função para adicionar novo hábito
  const handleAddNewHabito = useCallback(() => {
    // Adicionar um novo hábito com ID único
    const novoHabito: Habito = {
      id: Math.max(0, ...habitos.map(h => h.id)) + 1,
      titulo: "Novo hábito",
      descricao: "Descrição do novo hábito",
      cumprido: false,
      horario: "10:00",
      dataCriacao: new Date().toISOString()
    };
    
    setHabitos(prev => [...prev, novoHabito]);
    
    adicionarNotificacao({
      titulo: "Novo hábito adicionado",
      mensagem: "Você adicionou um novo hábito à sua rotina.",
      tipo: "info"
    });
    
    toast.success("Novo hábito adicionado!", {
      description: "Configure o título e a descrição editando o hábito."
    });
  }, [habitos, adicionarNotificacao]);

  return {
    habitos,
    conquistasRecentes,
    pontos,
    nivel,
    selectedDate,
    habitosPorDia,
    handleMarcarConcluido,
    handleEvidenciaSubmitted,
    handleCalendarDaySelect,
    handleAddNewHabito
  };
};
