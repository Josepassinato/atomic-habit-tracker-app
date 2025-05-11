
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
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
  const progresso = (habitosCumpridos / habitos.length) * 100;
  
  // Salvar hábitos no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(habitos));
  }, [habitos]);

  const marcarComoConcluido = (id: number) => {
    const habito = habitos.find(h => h.id === id);
    
    if (habito && habito.verificacaoNecessaria && !habito.evidencia) {
      toast.warning("Por favor, adicione uma evidência antes de concluir este hábito");
      return;
    }
    
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
      const mensagemFeedback = await getFeedbackIA(habitos);
      setFeedback(mensagemFeedback);
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
      const habitosPersonalizados = await gerarHabitosSugeridos(modeloNegocio);
      setHabitosSugeridos(habitosPersonalizados);
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

  const handleEvidenciaSubmitted = (habitoId: number, evidencia: HabitoEvidenciaType) => {
    setHabitos(habitos.map((habito) => 
      habito.id === habitoId ? { ...habito, evidencia } : habito
    ));
  };

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
        <Progress value={progresso} className="h-2" />
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full flex items-center justify-center"
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
