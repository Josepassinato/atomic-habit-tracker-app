
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsTab from "./TeamsTab";
import HabitsTab from "./HabitsTab";
import GoalsTab from "./GoalsTab";
import IntegrationsTab from "./IntegrationsTab";
import RewardsTab from "./RewardsTab";
import { Team } from "./types";
import { UseFormReturn } from "react-hook-form";
import { TeamFormInput } from "./types";

interface OnboardingTabsProps {
  currentTab: string;
  onTabChange: (value: string) => void;
  currentTeam: Team | null;
  teams: Team[];
  habitosSelecionados: string[];
  metaMensal: string;
  metaDiaria: string;
  teamDialogOpen: boolean;
  setTeamDialogOpen: (open: boolean) => void;
  editingTeamId: string | null;
  setEditingTeamId: (id: string | null) => void;
  form: UseFormReturn<TeamFormInput>;
  onTeamSubmit: (data: TeamFormInput) => void;
  deleteTeam: (teamId: string) => void;
  editTeam: (team: Team) => void;
  selectTeam: (team: Team) => void;
  handleHabitoToggle: (habito: string) => void;
  setMetaMensal: (value: string) => void;
  setMetaDiaria: (value: string) => void;
  recompensaTipo: string;
  setRecompensaTipo: (tipo: string) => void;
  recompensaDescricao: string;
  setRecompensaDescricao: (descricao: string) => void;
  recompensasMetas: {descricao: string; tipo: string}[];
  adicionarRecompensa: () => void;
  removerRecompensa: (index: number) => void;
  comissaoBase: string;
  setComissaoBase: (comissao: string) => void;
  comissaoHabitos: string;
  setComissaoHabitos: (comissao: string) => void;
  isComissaoAberta: boolean;
  setIsComissaoAberta: (aberta: boolean) => void;
}

const OnboardingTabs: React.FC<OnboardingTabsProps> = (props) => {
  const {
    currentTab,
    onTabChange,
    currentTeam,
    teams,
    habitosSelecionados,
    metaMensal,
    metaDiaria,
    teamDialogOpen,
    setTeamDialogOpen,
    editingTeamId,
    setEditingTeamId,
    form,
    onTeamSubmit,
    deleteTeam,
    editTeam,
    selectTeam,
    handleHabitoToggle,
    setMetaMensal,
    setMetaDiaria,
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
  } = props;

  const tabs = [
    { id: "teams", label: "Teams" },
    { id: "habits", label: "Habits" },
    { id: "goals", label: "Goals" },
    { id: "integrations", label: "Integrations" },
    { id: "rewards", label: "Rewards" }
  ];

  return (
    <Tabs value={currentTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="teams" className="mt-6">
        <TeamsTab 
          currentTeam={currentTeam}
          teams={teams}
          teamDialogOpen={teamDialogOpen}
          setTeamDialogOpen={setTeamDialogOpen}
          editingTeamId={editingTeamId}
          setEditingTeamId={setEditingTeamId}
          form={form}
          onTeamSubmit={onTeamSubmit}
          deleteTeam={deleteTeam}
          editTeam={editTeam}
          selectTeam={selectTeam}
        />
      </TabsContent>

      <TabsContent value="habits" className="mt-6">
        <HabitsTab 
          currentTeam={currentTeam}
          habitosSelecionados={habitosSelecionados}
          handleHabitoToggle={handleHabitoToggle}
        />
      </TabsContent>

      <TabsContent value="goals" className="mt-6">
        <GoalsTab 
          currentTeam={currentTeam}
          metaMensal={metaMensal}
          setMetaMensal={setMetaMensal}
          metaDiaria={metaDiaria}
          setMetaDiaria={setMetaDiaria}
        />
      </TabsContent>

      <TabsContent value="integrations" className="mt-6">
        <IntegrationsTab 
          currentTeam={currentTeam}
        />
      </TabsContent>

      <TabsContent value="rewards" className="mt-6">
        <RewardsTab 
          currentTeam={currentTeam}
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
        />
      </TabsContent>
    </Tabs>
  );
};

export default OnboardingTabs;
