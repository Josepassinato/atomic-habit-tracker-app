
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingTabs from "./OnboardingTabs";
import OnboardingNavigation from "./OnboardingNavigation";
import { Team } from "./types";
import { UseFormReturn } from "react-hook-form";
import { TeamFormInput } from "./types";

interface OnboardingContainerProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
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
  onNext: () => void;
  onPrevious: () => void;
  isFirstTab: boolean;
  isLastTab: boolean;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = (props) => {
  const {
    currentTab,
    setCurrentTab,
    onNext,
    onPrevious,
    isFirstTab,
    isLastTab,
    ...tabProps
  } = props;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome to Habitus</CardTitle>
          <p className="text-muted-foreground">
            Let's set up your sales performance system
          </p>
        </CardHeader>
        <CardContent>
          <OnboardingTabs
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            {...tabProps}
          />

          <OnboardingNavigation
            isFirstTab={isFirstTab}
            isLastTab={isLastTab}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingContainer;
