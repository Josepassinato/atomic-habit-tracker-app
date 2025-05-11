
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState("metas");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para metas e hábitos
  const [metaMensal, setMetaMensal] = useState("");
  const [metaDiaria, setMetaDiaria] = useState("");
  
  const [habitosSelecionados, setHabitosSelecionados] = useState<string[]>([]);
  
  const habitosRecomendados = [
    "Fazer 10 ligações por dia",
    "Registrar todas as interações no CRM",
    "Fazer follow-up em até 24h",
    "Realizar reuniões de planejamento diárias",
    "Estudar sobre o mercado por 15min diariamente",
    "Solicitar feedbacks após cada negociação"
  ];
  
  const handleHabitoToggle = (habito: string) => {
    if (habitosSelecionados.includes(habito)) {
      setHabitosSelecionados(habitosSelecionados.filter(h => h !== habito));
    } else {
      setHabitosSelecionados([...habitosSelecionados, habito]);
    }
  };
  
  const handleNext = () => {
    if (activeStep === "metas") {
      setActiveStep("habitos");
    } else if (activeStep === "habitos") {
      setActiveStep("integracao");
    } else {
      handleFinish();
    }
  };
  
  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Simulação de salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar no localStorage para demonstração
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        configurado: true,
        metas: {
          mensal: metaMensal,
          diaria: metaDiaria
        },
        habitos: habitosSelecionados
      }));
      
      toast({
        title: "Configuração concluída!",
        description: "Bem-vindo ao Habitus. Seu dashboard está pronto.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao finalizar configuração",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Configuração Inicial
          </CardTitle>
          <CardDescription>
            Vamos configurar sua experiência no Habitus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metas">Metas</TabsTrigger>
              <TabsTrigger value="habitos">Hábitos</TabsTrigger>
              <TabsTrigger value="integracao">Integrações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metas" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Defina suas metas de vendas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Estabeleça metas realistas para sua equipe alcançar
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaMensal">Meta de vendas mensal (R$)</Label>
                    <Input 
                      id="metaMensal" 
                      type="number" 
                      placeholder="30000" 
                      value={metaMensal}
                      onChange={(e) => setMetaMensal(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDiaria">Meta de vendas diária (R$)</Label>
                    <Input 
                      id="metaDiaria" 
                      type="number" 
                      placeholder="1500" 
                      value={metaDiaria}
                      onChange={(e) => setMetaDiaria(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="habitos" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Selecione os hábitos atômicos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Escolha hábitos que ajudarão sua equipe a atingir as metas
                </p>
                
                <div className="space-y-2">
                  {habitosRecomendados.map((habito) => (
                    <Button
                      key={habito}
                      variant={habitosSelecionados.includes(habito) ? "default" : "outline"}
                      className="w-full justify-start mb-2 text-left"
                      onClick={() => handleHabitoToggle(habito)}
                    >
                      {habitosSelecionados.includes(habito) && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {habito}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integracao" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Integre seus sistemas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Conecte o Habitus com as ferramentas que você já utiliza
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="flex-1">
                      <h4 className="font-medium">HubSpot</h4>
                      <p className="text-sm text-muted-foreground">
                        Integre seus contatos e negócios
                      </p>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="flex-1">
                      <h4 className="font-medium">Pipedrive</h4>
                      <p className="text-sm text-muted-foreground">
                        Sincronize seus funis de vendas
                      </p>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="flex-1">
                      <h4 className="font-medium">WhatsApp Business</h4>
                      <p className="text-sm text-muted-foreground">
                        Envie notificações via WhatsApp
                      </p>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <div className="w-full flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
            >
              Pular por agora
            </Button>
            <Button onClick={handleNext} disabled={loading}>
              {activeStep === "integracao" 
                ? loading ? "Finalizando..." : "Finalizar" 
                : "Próximo"
              }
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
