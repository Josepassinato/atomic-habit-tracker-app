
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { HabitEvidenceType } from "../habits/HabitEvidence";
import { habitosIniciais, getFeedbackIA, gerarHabitosSugeridos } from "../habitos/HabitosService";
import { Habit, BusinessModel } from "../habits/types";

export const useHabitsTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : habitosIniciais;
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
    setHabits(habitosIniciais.map(h => ({...h, cumprido: false, evidencia: undefined})));
    setFeedback("");
    toast.info("Habits restarted for the next day.", {
      description: "All habits have been unmarked and are ready to be completed again."
    });
  }, []);

  const requestAIFeedback = useCallback(async () => {
    setLoadingFeedback(true);
    try {
      const feedbackMessage = await getFeedbackIA(habits);
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
      const personalizedHabits = await gerarHabitosSugeridos(businessModel);
      setSuggestedHabits(personalizedHabits);
      toast.info("Habit suggestions generated", {
        description: `${personalizedHabits.length} new habits were suggested for your profile.`
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
