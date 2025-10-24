
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Team } from "./types";

export const useOnboardingNavigation = () => {
  const [activeStep, setActiveStep] = useState("template");
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

    if (activeStep === "template") {
      setActiveStep("teams");
    } else if (activeStep === "teams") {
      setActiveStep("habits");
    } else if (activeStep === "habits") {
      setActiveStep("goals");
    } else if (activeStep === "goals") {
      setActiveStep("integrations");
    } else if (activeStep === "integrations") {
      setActiveStep("rewards");
    } else {
      handleFinish(currentTeam.id, updateTeam);
      return;
    }

    updateTeam(updatedTeam);
    console.log("Next step:", activeStep);
  };

  const handlePrevious = () => {
    if (activeStep === "teams") {
      setActiveStep("template");
    } else if (activeStep === "habits") {
      setActiveStep("teams");
    } else if (activeStep === "goals") {
      setActiveStep("habits");
    } else if (activeStep === "integrations") {
      setActiveStep("goals");
    } else if (activeStep === "rewards") {
      setActiveStep("integrations");
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
