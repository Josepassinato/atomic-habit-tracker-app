
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingHeader from "./onboarding/OnboardingHeader";
import OnboardingContainer from "./onboarding/OnboardingContainer";
import { useOnboarding } from "./onboarding/useOnboarding";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("teams");
  
  const { 
    teams, 
    currentTeam, 
    habitosSelecionados,
    metaMensal,
    metaDiaria,
    teamDialogOpen,
    setTeamDialogOpen,
    editingTeamId,
    setEditingTeamId,
    form,
    handleHabitoToggle,
    setMetaMensal,
    setMetaDiaria,
    onTeamSubmit,
    deleteTeam,
    editTeam,
    selectTeam,
    handleFinish,
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
    setIsComissaoAberta
  } = useOnboarding();

  const handleBack = () => {
    navigate(-1);
  };

  const tabs = [
    { id: "teams", label: "Teams" },
    { id: "habits", label: "Habits" },
    { id: "goals", label: "Goals" },
    { id: "integrations", label: "Integrations" },
    { id: "rewards", label: "Rewards" }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const handleNext = () => {
    if (isLastTab) {
      handleFinish();
    } else {
      const nextTab = tabs[currentTabIndex + 1];
      setCurrentTab(nextTab.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      const prevTab = tabs[currentTabIndex - 1];
      setCurrentTab(prevTab.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <OnboardingHeader onBack={handleBack} />
      
      <OnboardingContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentTeam={currentTeam}
        teams={teams}
        habitosSelecionados={habitosSelecionados}
        metaMensal={metaMensal}
        metaDiaria={metaDiaria}
        teamDialogOpen={teamDialogOpen}
        setTeamDialogOpen={setTeamDialogOpen}
        editingTeamId={editingTeamId}
        setEditingTeamId={setEditingTeamId}
        form={form}
        onTeamSubmit={onTeamSubmit}
        deleteTeam={deleteTeam}
        editTeam={editTeam}
        selectTeam={selectTeam}
        handleHabitoToggle={handleHabitoToggle}
        setMetaMensal={setMetaMensal}
        setMetaDiaria={setMetaDiaria}
        recompensaTipo={recompensaTipo}
        setRecompensaTipo={setRecompensaTipo}
        recompensaDescricao={recompensaDescricao}
        setRecompensaDescricao={setRecompensaDescricao}
        recompensasMetas={recompensasMetas}
        adicionarRecompensa={adicionarRecompensa}
        removerRecompensa={removerRecompensa}
        comissaoBase={comissaoBase}
        setComissaoBase={setComissaoBase}
        comissaoHabitos={comissaoHabitos}
        setComissaoHabitos={setComissaoHabitos}
        isComissaoAberta={isComissaoAberta}
        setIsComissaoAberta={setIsComissaoAberta}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstTab={isFirstTab}
        isLastTab={isLastTab}
      />
    </div>
  );
};

export default Onboarding;
