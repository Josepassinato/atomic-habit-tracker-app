import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, HelpCircle, Trophy, Medal, Gift, Percent } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState("metas");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para metas e hábitos
  const [metaMensal, setMetaMensal] = useState("");
  const [metaDiaria, setMetaDiaria] = useState("");
  
  const [habitosSelecionados, setHabitosSelecionados] = useState<string[]>([]);
  
  // Estado para recompensas
  const [recompensaTipo, setRecompensaTipo] = useState("individual");
  const [recompensaDescricao, setRecompensaDescricao] = useState("");
  const [recompensasMetas, setRecompensasMetas] = useState<{descricao: string; tipo: string}[]>([
    { descricao: "Café da manhã especial para o time", tipo: "equipe" },
    { descricao: "Folga no dia do aniversário", tipo: "individual" }
  ]);
  
  // Estado para percentuais de comissão
  const [comissaoBase, setComissaoBase] = useState("3");
  const [comissaoHabitos, setComissaoHabitos] = useState("2");
  const [isComissaoAberta, setIsComissaoAberta] = useState(false);
  
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
  
  const adicionarRecompensa = () => {
    if (recompensaDescricao.trim() === "") {
      toast({
        title: "Descrição obrigatória",
        description: "Por favor, descreva a recompensa.",
        variant: "destructive",
      });
      return;
    }
    
    setRecompensasMetas([
      ...recompensasMetas, 
      { descricao: recompensaDescricao, tipo: recompensaTipo }
    ]);
    setRecompensaDescricao("");
  };
  
  const removerRecompensa = (index: number) => {
    const novasRecompensas = [...recompensasMetas];
    novasRecompensas.splice(index, 1);
    setRecompensasMetas(novasRecompensas);
  };
  
  const handleNext = () => {
    if (activeStep === "metas") {
      setActiveStep("habitos");
    } else if (activeStep === "habitos") {
      setActiveStep("recompensas");
    } else if (activeStep === "recompensas") {
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
        habitos: habitosSelecionados,
        recompensas: recompensasMetas,
        comissoes: {
          base: comissaoBase,
          habitos: comissaoHabitos
        }
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metas">Metas</TabsTrigger>
              <TabsTrigger value="habitos">Hábitos</TabsTrigger>
              <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
              <TabsTrigger value="integracao">Integrações</TabsTrigger>
            </TabsList>
            
            {/* Aba de Metas */}
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
            
            {/* Aba de Hábitos */}
            <TabsContent value="habitos" className="space-y-4 pt-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Selecione os hábitos atômicos</h3>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Ajuda da IA
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="end">
                      <ConsultoriaIA />
                    </PopoverContent>
                  </Popover>
                </div>
                
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
            
            {/* Aba de Recompensas */}
            <TabsContent value="recompensas" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Defina recompensas para motivar sua equipe</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Estabeleça incentivos para celebrar conquistas de metas e hábitos
                </p>
                
                {/* Seção de Comissões */}
                <Collapsible 
                  open={isComissaoAberta} 
                  onOpenChange={setIsComissaoAberta}
                  className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Percent className="h-5 w-5" />
                        <h4 className="font-semibold">Percentuais de Comissão</h4>
                      </div>
                      <Button variant="ghost" size="sm">
                        {isComissaoAberta ? "Fechar" : "Abrir"}
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="comissaoBase" className="text-blue-700">
                          Comissão base sobre vendas (%)
                        </Label>
                        <Input 
                          id="comissaoBase" 
                          type="number" 
                          placeholder="3" 
                          value={comissaoBase}
                          onChange={(e) => setComissaoBase(e.target.value)}
                          className="bg-white mt-1"
                        />
                        <p className="text-xs text-blue-600 mt-1">
                          Percentual padrão sobre todas as vendas
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="comissaoHabitos" className="text-blue-700">
                          Bônus por cumprir hábitos (%)
                        </Label>
                        <Input 
                          id="comissaoHabitos" 
                          type="number" 
                          placeholder="2" 
                          value={comissaoHabitos}
                          onChange={(e) => setComissaoHabitos(e.target.value)}
                          className="bg-white mt-1"
                        />
                        <p className="text-xs text-blue-600 mt-1">
                          Percentual adicional ao atingir 100% dos hábitos
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-md">
                      <p className="text-sm text-blue-800">
                        Total potencial: <span className="font-bold">{Number(comissaoBase) + Number(comissaoHabitos)}%</span> 
                        (Comissão base: {comissaoBase}% + Bônus por hábitos: {comissaoHabitos}%)
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="bg-purple-50 p-4 rounded-md mb-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2 text-purple-800">
                    <Trophy className="h-5 w-5" />
                    <h4 className="font-semibold">Por que recompensas são importantes?</h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    Recompensas aumentam a motivação e engajamento, reforçando comportamentos positivos 
                    e ajudando a criar uma cultura de reconhecimento na equipe.
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="recompensaDescricao">Descrição da recompensa</Label>
                    <Textarea 
                      id="recompensaDescricao" 
                      placeholder="Ex: Vale-presente de R$100 para quem bater 120% da meta" 
                      value={recompensaDescricao}
                      onChange={(e) => setRecompensaDescricao(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de recompensa</Label>
                    <RadioGroup value={recompensaTipo} onValueChange={setRecompensaTipo} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equipe" id="equipe" />
                        <Label htmlFor="equipe" className="cursor-pointer">Equipe</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button onClick={adicionarRecompensa} className="w-full">
                    <Gift className="mr-2 h-4 w-4" />
                    Adicionar recompensa
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recompensas adicionadas:</h4>
                  {recompensasMetas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma recompensa adicionada ainda</p>
                  ) : (
                    <div className="space-y-3">
                      {recompensasMetas.map((recompensa, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {recompensa.tipo === "individual" ? (
                                <Medal className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Trophy className="h-4 w-4 text-purple-600" />
                              )}
                              <span>{recompensa.descricao}</span>
                            </div>
                            <Badge variant="outline" className="mt-1">
                              {recompensa.tipo === "individual" ? "Individual" : "Equipe"}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removerRecompensa(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Aba de Integração */}
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
