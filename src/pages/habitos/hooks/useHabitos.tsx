
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
  
  // State for achievements and points from gamification system
  const [pontos, setPontos] = useState(150);
  const [nivel, setNivel] = useState(2);
  const [conquistasRecentes, setConquistasRecentes] = useState([
    {
      id: 1,
      titulo: "Weekly Consistency",
      descricao: "Complete all habits for 5 consecutive days",
      icone: <TrendingUp className="h-4 w-4 text-blue-600" />,
      progresso: 60,
      completa: false
    },
    {
      id: 2,
      titulo: "CRM Master",
      descricao: "Update CRM for 10 consecutive days",
      icone: <Zap className="h-4 w-4 text-amber-600" />,
      progresso: 100,
      completa: true
    },
    {
      id: 3,
      titulo: "Healthy Pipeline",
      descricao: "Maintain 20 active leads in pipeline",
      icone: <Award className="h-4 w-4 text-purple-600" />,
      progresso: 75,
      completa: false
    }
  ]);
  
  const [habitos, setHabitos] = useState<Habito[]>(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : habitosIniciais;
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habitosPorDia, setHabitosPorDia] = useState<Record<string, { total: number; completos: number }>>({});

  // Generate data for calendar
  useEffect(() => {
    // Generate mock data for calendar for last 30 days
    const today = new Date();
    const dadosPorDia: Record<string, { total: number; completos: number }> = {};
    
    // Fill with mock data
    for (let i = 0; i < 30; i++) {
      const data = new Date();
      data.setDate(today.getDate() - i);
      const dataFormatada = format(data, "yyyy-MM-dd");
      
      // For past days, generate random data
      if (i > 0) {
        const totalHabitos = 3;
        const habitosCompletos = Math.floor(Math.random() * (totalHabitos + 1));
        dadosPorDia[dataFormatada] = {
          total: totalHabitos,
          completos: habitosCompletos
        };
      } else {
        // For today, use real data
        dadosPorDia[dataFormatada] = {
          total: habitos.length,
          completos: habitos.filter(h => h.cumprido).length
        };
      }
    }
    
    setHabitosPorDia(dadosPorDia);
  }, [habitos]);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habitos));
  }, [habitos]);

  // Function to mark habits as completed
  const handleMarcarConcluido = useCallback((id: number) => {
    setHabitos(prev => prev.map(habito => 
      habito.id === id ? { ...habito, cumprido: true } : habito
    ));
    
    // Add points when a habit is completed
    setPontos(prev => prev + 10);
    
    // Add notification
    adicionarNotificacao({
      titulo: "Habit completed!",
      mensagem: "You earned 10 points for completing a habit.",
      tipo: "sucesso"
    });
    
    toast.success("Habit marked as completed!", {
      description: "You're building consistency and improving your results!"
    });
  }, [adicionarNotificacao]);

  // Function to register habit evidence
  const handleEvidenciaSubmitted = useCallback((habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(prev => prev.map(habito => 
      habito.id === habitoId ? { ...habito, evidencia } : habito
    ));
    
    // Add extra points for submitting evidence
    setPontos(prev => prev + 5);
    
    adicionarNotificacao({
      titulo: "Evidence submitted",
      mensagem: "Your evidence has been sent for verification. +5 points!",
      tipo: "info"
    });
  }, [adicionarNotificacao]);

  // Function to select day in calendar
  const handleCalendarDaySelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // In a real system, we would fetch habits for this specific date
  }, []);

  // Function to add new habit
  const handleAddNewHabito = useCallback(() => {
    // Add a new habit with unique ID
    const novoHabito: Habito = {
      id: Math.max(0, ...habitos.map(h => h.id)) + 1,
      titulo: "New habit",
      descricao: "Description of new habit",
      cumprido: false,
      horario: "10:00",
      dataCriacao: new Date().toISOString()
    };
    
    setHabitos(prev => [...prev, novoHabito]);
    
    adicionarNotificacao({
      titulo: "New habit added",
      mensagem: "You added a new habit to your routine.",
      tipo: "info"
    });
    
    toast.success("New habit added!", {
      description: "Configure the title and description by editing the habit."
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
