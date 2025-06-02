import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { Team, TeamFormInput } from "./types";

export const useOnboarding = () => {
  const [activeStep, setActiveStep] = useState("teams");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
        empresa_id: '1',
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
      empresa_id: '1',
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

  return {
    activeStep,
    setActiveStep,
    loading,
    teams,
    currentTeam,
    setCurrentTeam,
    teamDialogOpen,
    setTeamDialogOpen,
    editingTeamId,
    setEditingTeamId,
    metaMensal,
    setMetaMensal,
    metaDiaria,
    setMetaDiaria,
    habitosSelecionados,
    recompensaTipo,
    setRecompensaTipo,
    recompensaDescricao,
    setRecompensaDescricao,
    recompensasMetas,
    comissaoBase,
    setComissaoBase,
    comissaoHabitos,
    setComissaoHabitos,
    isComissaoAberta,
    setIsComissaoAberta,
    form,
    handleHabitoToggle,
    adicionarRecompensa,
    removerRecompensa,
    onTeamSubmit,
    deleteTeam,
    editTeam,
    selectTeam,
    handleNext,
    handlePrevious,
    handleFinish,
    navigate
  };
};
