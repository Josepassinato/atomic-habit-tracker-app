
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HabitoEvidenciaType } from "./habitos/HabitoEvidencia";
import HabitoItem from "./habitos/HabitoItem";
import FeedbackIA from "./habitos/FeedbackIA";
import SugestaoHabitosDialog from "./habitos/SugestaoHabitosDialog";
import { habitosIniciais, getFeedbackIA, gerarHabitosSugeridos } from "./habitos/HabitosService";
import { Habito, ModeloNegocio } from "./habitos/types";

const HabitosTracker = () => {
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hábitos Atômicos Diários</CardTitle>
        <CardDescription>
          Progresso de hoje: {habitosCumpridos} de {habitos.length} hábitos
          {habitosVerificados > 0 && (
            <span className="text-green-600 ml-1">
              ({habitosVerificados} verificado{habitosVerificados > 1 ? 's' : ''})
            </span>
          )}
        </CardDescription>
        <Progress 
          value={progresso} 
          className={`h-2 transition-all duration-700 ${animateProgress ? 'scale-y-150' : ''}`} 
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habitos.map((habito) => (
            <HabitoItem
              key={habito.id}
              habito={habito}
              onEvidenciaSubmitted={handleEvidenciaSubmitted}
              onMarcarConcluido={marcarComoConcluido}
            />
          ))}
        </div>
        
        {habitos.length === 0 && (
          <div className="py-6 text-center text-muted-foreground">
            <p>Você ainda não possui hábitos cadastrados.</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all"
          onClick={() => setDialogAberto(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Sugerir Hábitos Personalizados
        </Button>
        
        <FeedbackIA feedback={feedback} />
        
        <SugestaoHabitosDialog
          open={dialogAberto}
          onOpenChange={(open) => {
            setDialogAberto(open);
            if (!open) {
              setHabitosSugeridos([]);
            }
          }}
          modeloNegocio={modeloNegocio}
          onInputChange={handleInputChange}
          habitosSugeridos={habitosSugeridos}
          onSugerirHabitos={sugerirHabitosPersonalizados}
          onAdicionarHabitos={adicionarHabitosSugeridos}
          carregandoSugestoes={carregandoSugestoes}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={reiniciarHabitos}
          className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
        >
          Reiniciar Hábitos
        </Button>
        <Button 
          size="sm" 
          onClick={solicitarFeedbackIA} 
          disabled={carregandoFeedback}
          className="relative overflow-hidden"
        >
          {carregandoFeedback ? (
            <span className="flex items-center">
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Analisando...
            </span>
          ) : (
            "Solicitar Feedback da IA"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitosTracker;
