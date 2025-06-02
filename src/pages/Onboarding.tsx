
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
import { toast } from "sonner";

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
  const [activeStep, setActiveStep] = useState("teams");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  
  // State for goals and habits
  const [metaMensal, setMetaMensal] = useState("");
  const [metaDiaria, setMetaDiaria] = useState("");
  
  const [habitosSelecionados, setHabitosSelecionados] = useState<string[]>([]);
  
  // State for rewards
  const [recompensaTipo, setRecompensaTipo] = useState("individual");
  const [recompensaDescricao, setRecompensaDescricao] = useState("");
  const [recompensasMetas, setRecompensasMetas] = useState<{descricao: string; tipo: string}[]>([
    { descricao: "Special breakfast for the team", tipo: "equipe" },
    { descricao: "Day off on birthday", tipo: "individual" }
  ]);
  
  // State for commissions
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
      try {
        const parsedTeams = JSON.parse(savedTeams);
        console.log("Teams loaded from localStorage:", parsedTeams);
        setTeams(parsedTeams);
      } catch (error) {
        console.error("Error loading teams:", error);
        toast({
          title: "Error loading teams",
          description: "Could not load saved teams.",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Save teams to localStorage when they change
  useEffect(() => {
    if (teams.length > 0) {
      console.log("Saving teams to localStorage:", teams);
      localStorage.setItem("teams", JSON.stringify(teams));
      
      // Also save as 'equipes' for compatibility with dashboard
      localStorage.setItem("equipes", JSON.stringify(teams.map(team => ({
        id: team.id,
        nome: team.name,
        empresa_id: '1', // default value for testing
        criado_em: new Date().toISOString()
      }))));
    }
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
        { descricao: "Special breakfast for the team", tipo: "equipe" },
        { descricao: "Day off on birthday", tipo: "individual" }
      ]);
      setComissaoBase("3");
      setComissaoHabitos("2");
    }
  }, [currentTeam]);
  
  const habitosRecomendados = [
    "Make 10 calls per day",
    "Record all interactions in CRM",
    "Follow up within 24 hours",
    "Hold daily planning meetings",
    "Study the market for 15 minutes daily",
    "Request feedback after each negotiation"
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
        title: "Description required",
        description: "Please describe the reward.",
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
      const updatedTeams = teams.map(team => 
        team.id === editingTeamId 
          ? { ...team, name: data.name }
          : team
      );
      setTeams(updatedTeams);
      toast({
        title: "Team updated",
        description: `Team ${data.name} was updated successfully.`,
      });
      console.log("Team updated:", data.name, "ID:", editingTeamId);
      console.log("Teams after update:", updatedTeams);
    } else {
      // Create new team
      const newTeam: Team = {
        id: Date.now().toString(),
        name: data.name,
        metas: { mensal: "", diaria: "" },
        habitos: [],
        recompensas: [
          { descricao: "Special breakfast for the team", tipo: "equipe" },
          { descricao: "Day off on birthday", tipo: "individual" }
        ],
        comissoes: { base: "3", habitos: "2" }
      };
      
      const newTeams = [...teams, newTeam];
      setTeams(newTeams);
      toast({
        title: "Team created",
        description: `Team ${data.name} was created successfully.`,
      });
      console.log("New team created:", newTeam);
      console.log("Teams after creation:", newTeams);
    }
    
    setTeamDialogOpen(false);
    form.reset();
    setEditingTeamId(null);
  };

  const deleteTeam = (teamId: string) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
      setActiveStep("teams");
    }
    
    toast({
      title: "Team removed",
      description: "Team was removed successfully.",
    });
    console.log("Team removed, ID:", teamId);
    console.log("Teams after removal:", updatedTeams);
  };

  const editTeam = (team: Team) => {
    form.setValue("name", team.name);
    setEditingTeamId(team.id);
    setTeamDialogOpen(true);
    console.log("Editing team:", team.name, "ID:", team.id);
  };

  const selectTeam = (team: Team) => {
    setCurrentTeam(team);
    setActiveStep("goals");
    console.log("Team selected:", team.name, "ID:", team.id);
  };
  
  const handleNext = () => {
    if (!currentTeam) {
      toast({
        title: "Select a team",
        description: "Please select or create a team before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Save current step data
    const updatedTeam = { ...currentTeam };

    if (activeStep === "goals") {
      updatedTeam.metas = { mensal: metaMensal, diaria: metaDiaria };
      setActiveStep("habits");
    } else if (activeStep === "habits") {
      updatedTeam.habitos = habitosSelecionados;
      setActiveStep("rewards");
    } else if (activeStep === "rewards") {
      updatedTeam.recompensas = recompensasMetas;
      updatedTeam.comissoes = { base: comissaoBase, habitos: comissaoHabitos };
      setActiveStep("integrations");
    } else {
      handleFinish();
    }

    // Update team in teams array
    const updatedTeams = teams.map(team => 
      team.id === currentTeam.id ? updatedTeam : team
    );
    setTeams(updatedTeams);
    setCurrentTeam(updatedTeam);
    
    console.log("Next step:", activeStep);
    console.log("Team updated:", updatedTeam);
    console.log("Teams after update:", updatedTeams);
    
    // Save immediately to localStorage
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    
    // Also save as 'equipes' for compatibility with dashboard
    localStorage.setItem("equipes", JSON.stringify(updatedTeams.map(team => ({
      id: team.id,
      nome: team.name,
      empresa_id: '1', // default value for testing
      criado_em: new Date().toISOString()
    }))));
  };

  const handlePrevious = () => {
    if (activeStep === "habits") {
      setActiveStep("goals");
    } else if (activeStep === "rewards") {
      setActiveStep("habits");
    } else if (activeStep === "integrations") {
      setActiveStep("rewards");
    }
  };
  
  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Save all configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get current user data
      const userDataStr = localStorage.getItem("user") || "{}";
      let userData = {};
      
      try {
        userData = JSON.parse(userDataStr);
      } catch (error) {
        console.error("Error parsing user data:", error);
        userData = {};
      }
      
      // Update user data
      const updatedUserData = {
        ...userData,
        configurado: true,
        teams: teams,
        activeTeamId: currentTeam?.id
      };
      
      console.log("Updated user data:", updatedUserData);
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      // Save mock members for each team if they don't exist
      if (!localStorage.getItem("vendedores")) {
        const mockVendedores = teams.flatMap((team, index) => [
          {
            id: `v${index}1`,
            nome: `Salesperson ${index+1}A`,
            email: `salesperson${index+1}a@example.com`,
            equipe_id: team.id,
            vendas_total: Math.floor(Math.random() * 100000) + 50000,
            meta_atual: 150000,
            taxa_conversao: (Math.random() * 0.3 + 0.2).toFixed(2),
            criado_em: new Date().toISOString()
          },
          {
            id: `v${index}2`,
            nome: `Salesperson ${index+1}B`,
            email: `salesperson${index+1}b@example.com`,
            equipe_id: team.id,
            vendas_total: Math.floor(Math.random() * 100000) + 50000,
            meta_atual: 150000,
            taxa_conversao: (Math.random() * 0.3 + 0.2).toFixed(2),
            criado_em: new Date().toISOString()
          }
        ]);
        
        localStorage.setItem("vendedores", JSON.stringify(mockVendedores));
        console.log("Mock salespeople created:", mockVendedores);
      }
      
      // Add mock habits for each team
      if (!localStorage.getItem("habitos_equipe")) {
        const mockHabitos = teams.flatMap(team => 
          team.habitos.map((habito, idx) => ({
            id: `h${team.id}-${idx}`,
            equipe_id: team.id,
            descricao: habito,
            concluido: Math.random() > 0.5,
            data_criacao: new Date().toISOString(),
            data_conclusao: Math.random() > 0.5 ? new Date().toISOString() : null
          }))
        );
        
        localStorage.setItem("habitos_equipe", JSON.stringify(mockHabitos));
        console.log("Mock habits created:", mockHabitos);
      }
      
      toast({
        title: "Configuration completed!",
        description: "Team configurations have been saved successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error finishing configuration:", error);
      toast({
        title: "Error finishing configuration",
        description: "Please try again.",
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
            Configure teams and define personalized goals, habits and rewards
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="goals" disabled={!currentTeam}>Goals</TabsTrigger>
              <TabsTrigger value="habits" disabled={!currentTeam}>Habits</TabsTrigger>
              <TabsTrigger value="rewards" disabled={!currentTeam}>Rewards</TabsTrigger>
              <TabsTrigger value="integrations" disabled={!currentTeam}>Integrations</TabsTrigger>
            </TabsList>
            
            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Registered teams</h3>
                
                {/* Dialog for adding/editing team */}
                <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTeamId ? "Edit Team" : "New Team"}</DialogTitle>
                      <DialogDescription>
                        {editingTeamId 
                          ? "Update the team information below"
                          : "Fill in the information to create a new team"
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
                              <FormLabel>Team name</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Corporate Sales" {...field} />
                              </FormControl>
                              <FormDescription>
                                Provide a clear and descriptive name for the team.
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
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingTeamId ? "Update" : "Create"}
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No teams registered</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by creating a new team.</p>
                  <div className="mt-6">
                    <Button onClick={() => setTeamDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Team
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
                            {team.habitos.length} habits configured
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
                              Selected
                            </>
                          ) : (
                            "Configure"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Goals for: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Set realistic goals for this team to achieve
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="metaMensal">Monthly sales goal ($)</Label>
                      <Input 
                        id="metaMensal" 
                        type="number" 
                        placeholder="30000" 
                        value={metaMensal}
                        onChange={(e) => setMetaMensal(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="metaDiaria">Daily sales goal ($)</Label>
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
            
            {/* Habits Tab */}
            <TabsContent value="habits" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Habits for: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Choose habits that will help this team achieve their goals
                    </p>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex gap-2">
                          <HelpCircle className="h-4 w-4" />
                          AI Help
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
            
            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Rewards for: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Set incentives to celebrate goal and habit achievements
                  </p>
                  
                  {/* Commissions Section */}
                  <Collapsible 
                    open={isComissaoAberta} 
                    onOpenChange={setIsComissaoAberta}
                    className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Percent className="h-5 w-5" />
                          <h4 className="font-semibold">Commission Percentages</h4>
                        </div>
                        <Button variant="ghost" size="sm">
                          {isComissaoAberta ? "Close" : "Open"}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="comissaoBase" className="text-blue-700">
                            Base commission on sales (%)
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
                            Standard percentage on all sales
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="comissaoHabitos" className="text-blue-700">
                            Bonus for completing habits (%)
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
                            Additional percentage when achieving 100% of habits
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-md">
                        <p className="text-sm text-blue-800">
                          Total potential: <span className="font-bold">{Number(comissaoBase) + Number(comissaoHabitos)}%</span> 
                          (Base commission: {comissaoBase}% + Habit bonus: {comissaoHabitos}%)
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="bg-purple-50 p-4 rounded-md mb-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2 text-purple-800">
                      <Trophy className="h-5 w-5" />
                      <h4 className="font-semibold">Why are rewards important?</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Rewards increase motivation and engagement, reinforcing positive behaviors 
                      and helping to create a culture of recognition in the team.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="recompensaDescricao">Reward description</Label>
                      <Textarea 
                        id="recompensaDescricao" 
                        placeholder="Ex: $100 gift card for whoever hits 120% of goal" 
                        value={recompensaDescricao}
                        onChange={(e) => setRecompensaDescricao(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Reward type</Label>
                      <RadioGroup value={recompensaTipo} onValueChange={setRecompensaTipo} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="individual" id="individual" />
                          <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="equipe" id="equipe" />
                          <Label htmlFor="equipe" className="cursor-pointer">Team</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Button onClick={adicionarRecompensa} className="w-full">
                      <Gift className="mr-2 h-4 w-4" />
                      Add reward
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Added rewards:</h4>
                    {recompensasMetas.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No rewards added yet</p>
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
                                {recompensa.tipo === "individual" ? "Individual" : "Team"}
                              </Badge>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removerRecompensa(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-4 pt-4">
              {currentTeam && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium">Integrations for: {currentTeam.name}</h3>
                    <Badge variant="outline">{currentTeam.name}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect Habitus with the tools you already use
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="flex-1">
                        <h4 className="font-medium">HubSpot</h4>
                        <p className="text-sm text-muted-foreground">
                          Integrate your contacts and deals
                        </p>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="flex-1">
                        <h4 className="font-medium">Pipedrive</h4>
                        <p className="text-sm text-muted-foreground">
                          Sync your sales funnels
                        </p>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="flex-1">
                        <h4 className="font-medium">WhatsApp Business</h4>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via WhatsApp
                        </p>
                      </div>
                      <Button variant="outline">Connect</Button>
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
              Skip for now
            </Button>
            
            <div className="flex space-x-2">
              {activeStep !== "teams" && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              )}
              
              <Button onClick={handleNext} disabled={loading}>
                {activeStep === "integrations" 
                  ? loading ? "Finishing..." : "Finish" 
                  : "Next"
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
