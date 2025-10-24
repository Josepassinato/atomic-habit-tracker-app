
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Habito } from "@/components/habitos/types";
import { HabitoEvidenciaType } from "@/components/habitos/HabitoEvidencia";
import { toast } from "sonner";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";

import { TrendingUp, Zap, Award } from "lucide-react";
import { useLanguage } from "@/i18n";

type RecentAchievement = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  complete: boolean;
};

export const useHabitos = () => {
  const { adicionarNotificacao } = useNotificacoes();
  const { t } = useLanguage();
  
  // State for achievements and points from gamification system
  const [points, setPoints] = useState(150);
  const [level, setLevel] = useState(2);
  const [recentAchievements, setRecentAchievements] = useState([
    {
      id: 1,
      title: "Weekly Consistency",
      description: "Complete all habits for 5 consecutive days",
      icon: <TrendingUp className="h-4 w-4 text-blue-600" />,
      progress: 60,
      complete: false
    },
    {
      id: 2,
      title: "CRM Master",
      description: "Update CRM for 10 consecutive days",
      icon: <Zap className="h-4 w-4 text-amber-600" />,
      progress: 100,
      complete: true
    },
    {
      id: 3,
      title: "Healthy Pipeline",
      description: "Maintain 20 active leads in pipeline",
      icon: <Award className="h-4 w-4 text-purple-600" />,
      progress: 75,
      complete: false
    }
  ]);
  
  const [habits, setHabits] = useState<Habito[]>(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habitsByDay, setHabitsByDay] = useState<Record<string, { total: number; completos: number }>>({});

  // Generate data for calendar from actual habits
  useEffect(() => {
    const today = new Date();
    const dataByDay: Record<string, { total: number; completos: number }> = {};
    
    // Calculate actual data from habits
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // For past days, generate random data
      if (i > 0) {
        const totalHabits = 3;
        const completedHabits = Math.floor(Math.random() * (totalHabits + 1));
        dataByDay[formattedDate] = {
          total: totalHabits,
          completos: completedHabits
        };
      } else {
        // For today, use real data
        dataByDay[formattedDate] = {
          total: habits.length,
          completos: habits.filter(h => h.completed).length
        };
      }
    }
    
    setHabitsByDay(dataByDay);
  }, [habits]);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Function to mark habits as completed
  const handleMarkCompleted = useCallback((id: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, completed: true } : habit
    ));
    
    // Add points when a habit is completed
    setPoints(prev => prev + 10);
    
    // Add notification
    adicionarNotificacao({
      titulo: t('habitCompleted'),
      mensagem: t('habitCompletedMessage'),
      tipo: "sucesso"
    });
    
    toast.success(t('habitCompleted'), {
      description: t('buildingConsistency')
    });
  }, [adicionarNotificacao, t]);

  // Function to register habit evidence
  const handleEvidenceSubmitted = useCallback((habitId: number, evidence: HabitoEvidenciaType) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, evidence } : habit
    ));
    
    // Add extra points for submitting evidence
    setPoints(prev => prev + 5);
    
    adicionarNotificacao({
      titulo: t('evidenceSubmitted'),
      mensagem: t('evidenceSubmittedMessage'),
      tipo: "info"
    });
  }, [adicionarNotificacao, t]);

  // Function to select day in calendar
  const handleCalendarDaySelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // In a real system, we would fetch habits for this specific date
  }, []);

  // Function to add new habit
  const handleAddNewHabit = useCallback(() => {
    // Add a new habit with unique ID
    const newHabit: Habito = {
      id: Math.max(0, ...habits.map(h => h.id)) + 1,
      title: "New habit",
      description: "Description of new habit",
      completed: false,
      schedule: "10:00",
      createdAt: new Date().toISOString()
    };
    
    setHabits(prev => [...prev, newHabit]);
    
    adicionarNotificacao({
      titulo: t('newHabitAdded'),
      mensagem: t('newHabitAddedMessage'),
      tipo: "info"
    });
    
    toast.success(t('newHabitAdded'), {
      description: t('configureTitle')
    });
  }, [habits, adicionarNotificacao, t]);

  return {
    habitos: habits, // Keep Portuguese property name for backward compatibility
    habits,
    conquistasRecentes: recentAchievements, // Keep Portuguese property name for backward compatibility
    recentAchievements,
    pontos: points, // Keep Portuguese property name for backward compatibility
    points,
    nivel: level, // Keep Portuguese property name for backward compatibility
    level,
    selectedDate,
    habitosPorDia: habitsByDay, // Keep Portuguese property name for backward compatibility
    habitsByDay,
    handleMarcarConcluido: handleMarkCompleted, // Keep Portuguese name for backward compatibility
    handleMarkCompleted,
    handleEvidenciaSubmitted: handleEvidenceSubmitted, // Keep Portuguese name for backward compatibility
    handleEvidenceSubmitted,
    handleCalendarDaySelect,
    handleAddNewHabito: handleAddNewHabit, // Keep Portuguese name for backward compatibility
    handleAddNewHabit
  };
};
