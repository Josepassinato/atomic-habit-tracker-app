
import { useToast } from "@/hooks/use-toast";
import { useTeamsManagement } from "./useTeamsManagement";
import { useOnboardingData } from "./useOnboardingData";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export const useOnboarding = () => {
  const { toast } = useToast();
  
  // Teams management
  const {
    teams,
    currentTeam,
    setCurrentTeam,
    teamDialogOpen,
    setTeamDialogOpen,
    editingTeamId,
    setEditingTeamId,
    form,
    onTeamSubmit,
    deleteTeam,
    editTeam,
    selectTeam,
    updateTeam
  } = useTeamsManagement();

  // Data management
  const {
    metaMensal,
    setMetaMensal,
    metaDiaria,
    setMetaDiaria,
    habitosSelecionados,
    handleHabitoToggle,
    recompensaTipo,
    setRecompensaTipo,
    recompensaDescricao,
    setRecompensaDescricao,
    recompensasMetas,
    adicionarRecompensa,
    removerRecompensa,
    comissaoBase,
    setComissaoBase,
    comissaoHabitos,
    setComissaoHabitos,
    isComissaoAberta,
    setIsComissaoAberta,
    getCurrentTeamData
  } = useOnboardingData(currentTeam);

  // Navigation
  const {
    activeStep,
    setActiveStep,
    loading,
    handleNext: baseHandleNext,
    handlePrevious,
    handleFinish: baseHandleFinish,
    navigate
  } = useOnboardingNavigation();

  // Enhanced handlers that include data management
  const handleNext = () => {
    baseHandleNext(currentTeam, getCurrentTeamData, updateTeam);
  };

  const handleFinish = () => {
    if (currentTeam) {
      baseHandleFinish(currentTeam.id, updateTeam);
    }
  };

  const enhancedAdicionarRecompensa = () => {
    const success = adicionarRecompensa();
    if (!success) {
      toast({
        title: "Description required",
        description: "Please describe the reward.",
        variant: "destructive",
      });
    }
  };

  return {
    // Teams state
    teams,
    currentTeam,
    setCurrentTeam,
    teamDialogOpen,
    setTeamDialogOpen,
    editingTeamId,
    setEditingTeamId,
    form,
    
    // Data state
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
    
    // Navigation state
    activeStep,
    setActiveStep,
    loading,
    
    // Handlers
    handleHabitoToggle,
    adicionarRecompensa: enhancedAdicionarRecompensa,
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
