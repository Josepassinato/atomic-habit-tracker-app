import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, HelpCircle, Trophy, Medal, Gift, Percent, Users, Plus, Trash, Edit2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/i18n/useTranslation";

// Define the team interface
interface Team {
  id: string;
  name: string;
  metas: {
    mensal: string;
    diaria: string;
  };
  habitos: string[];
  recompensas: {
    descricao: string;
    tipo: string;
  }[];
  comissoes: {
    base: string;
    habitos: string;
  };
}

// Form interface
interface TeamFormInput {
  name: string;
}

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState("equipes");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  
  // State for metas and hábitos
  const [metaMensal, setMetaMensal] = useState("");
  const [metaDiaria, setMetaDiaria] = useState("");
  
  const [habitosSelecionados, setHabitosSelecionados] = useState<string[]>([]);
  
  // State for recompensas
  const [recompensaTipo, setRecompensaTipo] = useState("individual");
  const [recompensaDescricao, setRecompensaDescricao] = useState("");
  const [recompensasMetas, setRecompensasMetas] = useState<{descricao: string; tipo: string}[]>([
    { descricao: "Café da manhã especial para o time", tipo: "equipe" },
    { descricao: "Folga no dia do aniversário", tipo: "individual" }
  ]);
  
  // State for commissões
  const [comissaoBase, setComissaoBase] = useState("3");
  const [comissaoHabitos, setComissaoHabitos] = useState("2");
  const [isComissaoAberta, setIsComissaoAberta] = useState(false);
  
  // Form handling
  const form = useForm<TeamFormInput>({
    defaultValues: {
      name: "",
    },
  });

  // Load teams from localStorage on initial render
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  // Save teams to localStorage when they change
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  // When a team is selected, load its data
  useEffect(() => {
    if (currentTeam) {
      setMetaMensal(currentTeam.metas.mensal);
      setMetaDiaria(currentTeam.metas.diaria);
      setHabitosSelecionados(currentTeam.habitos);
      setRecompensasMetas(currentTeam.recompensas);
      setComissaoBase(currentTeam.comissoes.base);
      setComissaoHabitos(currentTeam.comissoes.habitos);
    } else {
      // Reset form if no team is selected
      setMetaMensal("");
      setMetaDiaria("");
      setHabitosSelecionados([]);
      setRecompensasMetas([
        { descricao: "Café da manhã especial para o time", tipo: "equipe" },
        { descricao: "Folga no dia do aniversário", tipo: "individual" }
      ]);
      setComissaoBase("3");
      setComissaoHabitos("2");
    }
  }, [currentTeam]);
  
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

  const onTeamSubmit: SubmitHandler<TeamFormInput> = (data) => {
    if (editingTeamId) {
      // Update existing team
      setTeams(teams.map(team => 
        team.id === editingTeamId 
          ? { ...team, name: data.name }
          : team
      ));
      toast({
        title: "Time atualizado",
        description: `O time ${data.name} foi atualizado com sucesso.`,
      });
    } else {
      // Create new team
      const newTeam: Team = {
        id: Date.now().toString(),
        name: data.name,
        metas: { mensal: "", diaria: "" },
        habitos: [],
        recompensas: [
          { descricao: "Café da manhã especial para o time", tipo: "equipe" },
          { descricao: "Folga no dia do aniversário", tipo: "individual" }
        ],
        comissoes: { base: "3", habitos: "2" }
      };
      
      setTeams([...teams, newTeam]);
      toast({
        title: "Time criado",
        description: `O time ${data.name} foi criado com sucesso.`,
      });
    }
    
    setTeamDialogOpen(false);
    form.reset();
    setEditingTeamId(null);
  };

  const deleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
      setActiveStep("equipes");
    }
    
    toast({
      title: "Time removido",
      description: "O time foi removido com sucesso.",
    });
  };

  const editTeam = (team: Team) => {
    form.setValue("name", team.name);
    setEditingTeamId(team.id);
    setTeamDialogOpen(true);
  };

  const selectTeam = (team: Team) => {
    setCurrentTeam(team);
    setActiveStep("metas");
  };
  
  const handleNext = () => {
    if (!currentTeam) {
      toast({
        title: "Selecione um time",
        description: "Por favor, selecione ou crie um time antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Save current step data
    const updatedTeam = { ...currentTeam };

    if (activeStep === "metas") {
      updatedTeam.metas = { mensal: metaMensal, diaria: metaDiaria };
      setActiveStep("habitos");
    } else if (activeStep === "habitos") {
      updatedTeam.habitos = habitosSelecionados;
      setActiveStep("recompensas");
    } else if (activeStep === "recompensas") {
      updatedTeam.recompensas = recompensasMetas;
      updatedTeam.comissoes = { base: comissaoBase, habitos: comissaoHabitos };
      setActiveStep("integracao");
    } else {
      handleFinish();
    }

    // Update team in teams array
    setTeams(teams.map(team => 
      team.id === currentTeam.id ? updatedTeam : team
    ));
    setCurrentTeam(updatedTeam);
  };

  const handlePrevious = () => {
    if (activeStep === "habitos") {
      setActiveStep("metas");
    } else if (activeStep === "recompensas") {
      setActiveStep("habitos");
    } else if (activeStep === "integracao") {
      setActiveStep("recompensas");
    }
  };
  
  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Save all configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demonstration
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        configurado: true,
        teams: teams,
        activeTeamId: currentTeam?.id
      }));
      
      toast({
        title: "Configuração concluída!",
        description: "As configurações das equipes foram salvas com sucesso.",
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
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            {t('onboarding')}
          </CardTitle>
          <CardDescription>
            Configure equipes e defina metas, hábitos e recompensas personalizadas
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="equipes">Equipes</TabsTrigger>
              <TabsTrigger value="metas" disabled={!currentTeam}>Metas</TabsTrigger>
              <TabsTrigger value="habitos" disabled={!currentTeam}>Hábitos</TabsTrigger>
              <TabsTrigger value="recompensas" disabled={!currentTeam}>Recompensas</TabsTrigger>
              <TabsTrigger value="integracao" disabled={!currentTeam}>Integrações</TabsTrigger>
            </TabsList>
            
            {/* Tab de Equipes */}
            <TabsContent value="equipes" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Equipes cadastradas</h3>
                
                {/* Dialog para adicionar/editar equipe */}
                <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Equipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTeamId ? "Editar Equipe" : "Nova Equipe"}</DialogTitle>
                      <DialogDescription>
                        {editingTeamId 
                          ? "Atualize as informações da equipe abaixo"
                          : "Preencha as informações para criar uma nova equipe"
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onTeamSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da equipe</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Vendas Corporativas" {...field} />
                              </FormControl>
                              <FormDescription>
                                Forneça um nome claro e descritivo para a equipe.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setTeamDialogOpen(false);
                            form.reset();
                            setEditingTeamId(null);
                          }}>
                            Cancelar
                          </Button>
                          <Button type="submit">
                            {editingTeamId ? "Atualizar" : "Criar"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {teams.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma equipe cadastrada</h3>
                  <p className="mt-1 text-sm text-gray-500">Comece criando uma nova equipe.</p>
                  <div className="mt-6">
                    <Button onClick={() => setTeamDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Equipe
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-4 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {team.habitos.length} hábitos configurados
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => editTeam(team)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteTeam(team.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <Button
                          variant="outline" 
                          className="w-full"
                          onClick={() => selectTeam(team)}
                        >
                          {currentTeam?.id === team.id ? (
                            <>
                              <Check className="mr-2 h-4 w-4" /> 
                              Selecionado
                            </>
                          ) : (
                            "Configurar"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Aba de Metas */}
            <TabsContent value="metas" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Metas para: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Estabeleça metas realistas para esta equipe alcançar
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
              )}
            </TabsContent>
            
            {/* Aba de Hábitos */}
            <TabsContent value="habitos" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Hábitos para: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Escolha hábitos que ajudarão esta equipe a atingir as metas
                    </p>
                    
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
                  
                  <div className="space-y-2 mt-4">
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
              )}
            </TabsContent>
            
            {/* Aba de Recompensas */}
            <TabsContent value="recompensas" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Recompensas para: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
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
              )}
            </TabsContent>
            
            {/* Aba de Integração */}
            <TabsContent value="integracao" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Integrações para: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
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
              )}
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
            
            <div className="flex space-x-2">
              {activeStep !== "equipes" && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                >
                  Anterior
                </Button>
              )}
              
              <Button onClick={handleNext} disabled={loading}>
                {activeStep === "integracao" 
                  ? loading ? "Finalizando..." : "Finalizar" 
                  : "Próximo"
                }
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
