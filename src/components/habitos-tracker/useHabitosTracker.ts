
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { HabitoEvidenciaType } from "../habitos/HabitoEvidencia";
import { habitosIniciais, getFeedbackIA, gerarHabitosSugeridos } from "../habitos/HabitosService";
import { Habito, ModeloNegocio } from "../habitos/types";

export const useHabitosTracker = () => {
  const [habitos, setHabitos] = useState<Habito[]>(() => {
    // Tenta recuperar do localStorage, senão usa os hábitos iniciais
    const salvos = localStorage.getItem("habitos");
    return salvos ? JSON.parse(salvos) : habitosIniciais;
  });
  
  const [feedback, setFeedback] = useState<string>("");
  const [carregandoFeedback, setCarregandoFeedback] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  
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
  const habitosVerificados = habitos.filter((habito) => habito.verificado).length;
  const progresso = habitos.length > 0 ? (habitosCumpridos / habitos.length) * 100 : 0;
  
  // Salvar hábitos no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(habitos));
    
    // Animar a barra de progresso quando os hábitos cumpridos mudarem
    if (habitosCumpridos > 0) {
      setAnimateProgress(true);
      const timer = setTimeout(() => setAnimateProgress(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [habitos, habitosCumpridos]);

  const marcarComoConcluido = useCallback((id: number) => {
    const habito = habitos.find(h => h.id === id);
    
    if (habito && habito.verificacaoNecessaria && !habito.evidencia) {
      toast.warning("Por favor, adicione uma evidência antes de concluir este hábito", {
        description: "Este hábito requer verificação para ser concluído.",
        duration: 4000
      });
      return;
    }
    
    setHabitos(prev => prev.map((habito) => 
      habito.id === id ? { ...habito, cumprido: true } : habito
    ));

    // Mostrar toast com mais detalhes
    toast.success("Hábito marcado como concluído!", {
      description: `Você progrediu para ${habitosCumpridos + 1} de ${habitos.length} hábitos para hoje.`,
      duration: 4000
    });
  }, [habitos, habitosCumpridos]);
  
  const reiniciarHabitos = useCallback(() => {
    setHabitos(habitosIniciais.map(h => ({...h, cumprido: false, evidencia: undefined})));
    setFeedback("");
    toast.info("Hábitos reiniciados para o próximo dia.", {
      description: "Todos os hábitos foram desmarcados e estão prontos para serem concluídos novamente."
    });
  }, []);

  const solicitarFeedbackIA = useCallback(async () => {
    setCarregandoFeedback(true);
    try {
      const mensagemFeedback = await getFeedbackIA(habitos);
      setFeedback(mensagemFeedback);
      toast.success("Feedback da IA gerado com sucesso!", {
        description: "O assistente analisou seus hábitos e forneceu recomendações."
      });
    } catch (error) {
      toast.error("Erro ao gerar feedback", {
        description: "Tente novamente em alguns instantes."
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
      const habitosPersonalizados = await gerarHabitosSugeridos(modeloNegocio);
      setHabitosSugeridos(habitosPersonalizados);
      toast.info("Sugestões de hábitos geradas", {
        description: `${habitosPersonalizados.length} novos hábitos foram sugeridos para seu perfil.`
      });
    } catch (error) {
      toast.error("Erro ao gerar sugestões", {
        description: "Tente novamente em alguns instantes."
      });
    } finally {
      setCarregandoSugestoes(false);
    }
  }, [modeloNegocio]);
  
  const adicionarHabitosSugeridos = useCallback(() => {
    if (habitosSugeridos.length === 0) {
      toast.warning("Não há hábitos para adicionar", {
        description: "Gere sugestões primeiro antes de adicioná-las."
      });
      return;
    }
    
    // Adicionar hábitos sugeridos à lista atual
    setHabitos(prev => [...prev, ...habitosSugeridos]);
    setHabitosSugeridos([]);
    setDialogAberto(false);
    toast.success("Hábitos personalizados adicionados com sucesso!", {
      description: `${habitosSugeridos.length} novos hábitos foram adicionados à sua lista.`
    });
  }, [habitosSugeridos]);

  const handleEvidenciaSubmitted = useCallback((habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(prev => prev.map((habito) => 
      habito.id === habitoId ? { ...habito, evidencia } : habito
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
