
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { HabitoEvidenciaType } from "../habitos/HabitoEvidencia";
import { initialHabits, getAIFeedback, generateSuggestedHabits } from "../habitos/HabitosService";
import { Habito, ModeloNegocio } from "../habitos/types";

export const useHabitosTracker = () => {
  const [habitos, setHabitos] = useState<Habito[]>(() => {
    // Try to recover from localStorage, otherwise use initial habits
    const salvos = localStorage.getItem("habitos");
    return salvos ? JSON.parse(salvos) : initialHabits;
  });
  
  const [feedback, setFeedback] = useState<string>("");
  const [carregandoFeedback, setCarregandoFeedback] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // States for the habit suggestion dialog
  const [dialogAberto, setDialogAberto] = useState(false);
  const [modeloNegocio, setModeloNegocio] = useState<ModeloNegocio>({
    segmento: "",
    cicloVenda: "",
    tamEquipe: "",
    objetivoPrincipal: ""
  });
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  const [habitosSugeridos, setHabitosSugeridos] = useState<Habito[]>([]);
  
  const habitosCumpridos = habitos.filter((habito) => habito.completed).length;
  const habitosVerificados = habitos.filter((habito) => habito.verified).length;
  const progresso = habitos.length > 0 ? (habitosCumpridos / habitos.length) * 100 : 0;
  
  // Save habits to localStorage when they change
  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(habitos));
    
    // Animate progress bar when completed habits change
    if (habitosCumpridos > 0) {
      setAnimateProgress(true);
      const timer = setTimeout(() => setAnimateProgress(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [habitos, habitosCumpridos]);

  const marcarComoConcluido = useCallback((id: number) => {
    const habito = habitos.find(h => h.id === id);
    
    if (habito && habito.verificationRequired && !habito.evidence) {
      toast.warning("Please add evidence before completing this habit", {
        description: "This habit requires verification to be completed.",
        duration: 4000
      });
      return;
    }
    
    setHabitos(prev => prev.map((habito) => 
      habito.id === id ? { ...habito, completed: true } : habito
    ));

    // Show toast with more details
    toast.success("Habit marked as completed!", {
      description: `You progressed to ${habitosCumpridos + 1} of ${habitos.length} habits for today.`,
      duration: 4000
    });
  }, [habitos, habitosCumpridos]);
  
  const reiniciarHabitos = useCallback(() => {
    setHabitos(initialHabits.map(h => ({...h, completed: false, evidence: undefined})));
    setFeedback("");
    toast.info("Habits restarted for the next day.", {
      description: "All habits have been unchecked and are ready to be completed again."
    });
  }, []);

  const solicitarFeedbackIA = useCallback(async () => {
    setCarregandoFeedback(true);
    try {
      const mensagemFeedback = await getAIFeedback(habitos);
      setFeedback(mensagemFeedback);
      toast.success("AI feedback generated successfully!", {
        description: "The assistant analyzed your habits and provided recommendations."
      });
    } catch (error) {
      console.error('Error requesting AI feedback:', error);
      setFeedback('Unable to generate feedback at the moment. Please try again later.');
      toast.error("Error generating feedback", {
        description: "Please try again in a few moments."
      });
    } finally {
      setCarregandoFeedback(false);
    }
  }, [habitos]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModeloNegocio(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const sugerirHabitosPersonalizados = useCallback(async () => {
    setCarregandoSugestoes(true);
    try {
      // Convert ModeloNegocio to BusinessModel for the service call
      const businessModel = {
        segment: modeloNegocio.segmento,
        salesCycle: modeloNegocio.cicloVenda,
        teamSize: modeloNegocio.tamEquipe,
        mainObjective: modeloNegocio.objetivoPrincipal
      };
      const habitosPersonalizados = await generateSuggestedHabits(businessModel);
      setHabitosSugeridos(habitosPersonalizados);
      toast.info("Habit suggestions generated", {
        description: `${habitosPersonalizados.length} new habits were suggested for your profile.`
      });
    } catch (error) {
      console.error('Error generating habit suggestions:', error);
      setHabitosSugeridos([]);
      toast.error("Error generating suggestions", {
        description: "Please try again in a few moments."
      });
    } finally {
      setCarregandoSugestoes(false);
    }
  }, [modeloNegocio]);
  
  const adicionarHabitosSugeridos = useCallback(() => {
    if (habitosSugeridos.length === 0) {
      toast.warning("No habits to add", {
        description: "Generate suggestions first before adding them."
      });
      return;
    }
    
    // Add suggested habits to current list
    setHabitos(prev => [...prev, ...habitosSugeridos]);
    setHabitosSugeridos([]);
    setDialogAberto(false);
    toast.success("Personalized habits added successfully!", {
      description: `${habitosSugeridos.length} new habits were added to your list.`
    });
  }, [habitosSugeridos]);

  const handleEvidenciaSubmitted = useCallback((habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(prev => prev.map((habito) => 
      habito.id === habitoId ? { ...habito, evidence: evidencia } : habito
    ));
  }, []);

  return {
    habitos,
    feedback,
    carregandoFeedback,
    animateProgress,
    dialogAberto,
    setDialogAberto,
    modeloNegocio,
    carregandoSugestoes,
    habitosSugeridos,
    habitosCumpridos,
    habitosVerificados,
    progresso,
    marcarComoConcluido,
    reiniciarHabitos,
    solicitarFeedbackIA,
    handleInputChange,
    sugerirHabitosPersonalizados,
    adicionarHabitosSugeridos,
    handleEvidenciaSubmitted
  };
};
