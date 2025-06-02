
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { HabitEvidenceType } from "../habits/HabitEvidence";
import { habitosIniciais, getFeedbackIA, gerarHabitosSugeridos } from "../habitos/HabitosService";
import { Habit, BusinessModel } from "../habits/types";

// Convert Portuguese habits to English format
const convertToEnglishHabits = (habitos: any[]): Habit[] => {
  return habitos.map(habito => ({
    id: habito.id,
    titulo: habito.titulo,
    descricao: habito.descricao,
    cumprido: habito.cumprido,
    horario: habito.horario,
    evidencia: habito.evidencia ? {
      type: habito.evidencia.tipo || 'text',
      content: habito.evidencia.conteudo || habito.evidencia.content || '',
      timestamp: habito.evidencia.timestamp || new Date().toISOString()
    } : undefined,
    verificacaoNecessaria: habito.verificacaoNecessaria,
    verificado: habito.verificado,
    dataCriacao: habito.dataCriacao
  }));
};

export const useHabitsTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("habits");
    if (saved) {
      return convertToEnglishHabits(JSON.parse(saved));
    }
    return convertToEnglishHabits(habitosIniciais);
  });
  
  const [feedback, setFeedback] = useState<string>("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [businessModel, setBusinessModel] = useState<BusinessModel>({
    segmento: "",
    cicloVenda: "",
    tamEquipe: "",
    objetivoPrincipal: ""
  });
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestedHabits, setSuggestedHabits] = useState<Habit[]>([]);
  
  const completedHabits = habits.filter((habit) => habit.cumprido).length;
  const verifiedHabits = habits.filter((habit) => habit.verificado).length;
  const progress = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;
  
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
    
    if (completedHabits > 0) {
      setAnimateProgress(true);
      const timer = setTimeout(() => setAnimateProgress(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [habits, completedHabits]);

  const markAsCompleted = useCallback((id: number) => {
    const habit = habits.find(h => h.id === id);
    
    if (habit && habit.verificacaoNecessaria && !habit.evidencia) {
      toast.warning("Please add evidence before completing this habit", {
        description: "This habit requires verification to be completed.",
        duration: 4000
      });
      return;
    }
    
    setHabits(prev => prev.map((habit) => 
      habit.id === id ? { ...habit, cumprido: true } : habit
    ));

    toast.success("Habit marked as completed!", {
      description: `You progressed to ${completedHabits + 1} of ${habits.length} habits for today.`,
      duration: 4000
    });
  }, [habits, completedHabits]);
  
  const restartHabits = useCallback(() => {
    const resetHabits = convertToEnglishHabits(habitosIniciais).map(h => ({...h, cumprido: false, evidencia: undefined}));
    setHabits(resetHabits);
    setFeedback("");
    toast.info("Habits restarted for the next day.", {
      description: "All habits have been unmarked and are ready to be completed again."
    });
  }, []);

  const requestAIFeedback = useCallback(async () => {
    setLoadingFeedback(true);
    try {
      // Convert to Portuguese format for the service call
      const habitosForService = habits.map(habit => ({
        id: habit.id,
        titulo: habit.titulo,
        descricao: habit.descricao,
        cumprido: habit.cumprido,
        horario: habit.horario,
        evidencia: habit.evidencia ? {
          tipo: habit.evidencia.type,
          conteudo: habit.evidencia.content,
          timestamp: habit.evidencia.timestamp
        } : undefined,
        verificacaoNecessaria: habit.verificacaoNecessaria,
        verificado: habit.verificado,
        dataCriacao: habit.dataCriacao
      }));
      
      const feedbackMessage = await getFeedbackIA(habitosForService);
      setFeedback(feedbackMessage);
      toast.success("AI feedback generated successfully!", {
        description: "The assistant analyzed your habits and provided recommendations."
      });
    } catch (error) {
      toast.error("Error generating feedback", {
        description: "Please try again in a few moments."
      });
    } finally {
      setLoadingFeedback(false);
    }
  }, [habits]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessModel(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const suggestPersonalizedHabits = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      // Convert to Portuguese format for the service call
      const modeloNegocio = {
        segmento: businessModel.segmento,
        cicloVenda: businessModel.cicloVenda,
        tamEquipe: businessModel.tamEquipe,
        objetivoPrincipal: businessModel.objetivoPrincipal
      };
      
      const personalizedHabits = await gerarHabitosSugeridos(modeloNegocio);
      const convertedHabits = convertToEnglishHabits(personalizedHabits);
      setSuggestedHabits(convertedHabits);
      toast.info("Habit suggestions generated", {
        description: `${convertedHabits.length} new habits were suggested for your profile.`
      });
    } catch (error) {
      toast.error("Error generating suggestions", {
        description: "Please try again in a few moments."
      });
    } finally {
      setLoadingSuggestions(false);
    }
  }, [businessModel]);
  
  const addSuggestedHabits = useCallback(() => {
    if (suggestedHabits.length === 0) {
      toast.warning("No habits to add", {
        description: "Generate suggestions first before adding them."
      });
      return;
    }
    
    setHabits(prev => [...prev, ...suggestedHabits]);
    setSuggestedHabits([]);
    setDialogOpen(false);
    toast.success("Personalized habits added successfully!", {
      description: `${suggestedHabits.length} new habits were added to your list.`
    });
  }, [suggestedHabits]);

  const handleEvidenceSubmitted = useCallback((habitId: number, evidence: HabitEvidenceType) => {
    setHabits(prev => prev.map((habit) => 
      habit.id === habitId ? { ...habit, evidencia: evidence } : habit
    ));
  }, []);

  return {
    habits,
    feedback,
    loadingFeedback,
    animateProgress,
    dialogOpen,
    setDialogOpen,
    businessModel,
    loadingSuggestions,
    suggestedHabits,
    completedHabits,
    verifiedHabits,
    progress,
    markAsCompleted,
    restartHabits,
    requestAIFeedback,
    handleInputChange,
    suggestPersonalizedHabits,
    addSuggestedHabits,
    handleEvidenceSubmitted
  };
};
