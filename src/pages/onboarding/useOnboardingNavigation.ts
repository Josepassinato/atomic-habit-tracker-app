
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Team } from "./types";

export const useOnboardingNavigation = () => {
  const [activeStep, setActiveStep] = useState("teams");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = (
    currentTeam: Team | null,
    getCurrentTeamData: () => Team | null,
    updateTeam: (team: Team) => void
  ) => {
    if (!currentTeam) {
      toast({
        title: "Select a team",
        description: "Please select or create a team before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Save current step data
    const updatedTeam = getCurrentTeamData();
    if (!updatedTeam) return;

    if (activeStep === "goals") {
      setActiveStep("habits");
    } else if (activeStep === "habits") {
      setActiveStep("rewards");
    } else if (activeStep === "rewards") {
      setActiveStep("integrations");
    } else {
      handleFinish(currentTeam.id, updateTeam);
      return;
    }

    updateTeam(updatedTeam);
    console.log("Next step:", activeStep);
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
  
  const handleFinish = async (currentTeamId: string, updateTeam: (team: Team) => void) => {
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
      
      // Get teams from localStorage
      const teamsStr = localStorage.getItem("teams") || "[]";
      const teams = JSON.parse(teamsStr);
      
      // Update user data
      const updatedUserData = {
        ...userData,
        configurado: true,
        teams: teams,
        activeTeamId: currentTeamId
      };
      
      console.log("Updated user data:", updatedUserData);
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      // Save mock members for each team if they don't exist
      if (!localStorage.getItem("vendedores")) {
        const mockVendedores = teams.flatMap((team: Team, index: number) => [
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
        const mockHabitos = teams.flatMap((team: Team) => 
          team.habitos.map((habito: string, idx: number) => ({
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
    handleNext,
    handlePrevious,
    handleFinish,
    navigate
  };
};
