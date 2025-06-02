
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n/useTranslation";
import { useOnboarding } from "./onboarding/useOnboarding";
import TeamsTab from "./onboarding/TeamsTab";
import GoalsTab from "./onboarding/GoalsTab";
import HabitsTab from "./onboarding/HabitsTab";
import RewardsTab from "./onboarding/RewardsTab";
import IntegrationsTab from "./onboarding/IntegrationsTab";

const Onboarding = () => {
  const { t } = useTranslation();
  const {
    activeStep,
    setActiveStep,
    loading,
    teams,
    currentTeam,
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
    navigate
  } = useOnboarding();

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
            
            <TabsContent value="teams">
              <TeamsTab
                teams={teams}
                currentTeam={currentTeam}
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
            
            <TabsContent value="goals">
              <GoalsTab
                currentTeam={currentTeam}
                metaMensal={metaMensal}
                setMetaMensal={setMetaMensal}
                metaDiaria={metaDiaria}
                setMetaDiaria={setMetaDiaria}
              />
            </TabsContent>
            
            <TabsContent value="habits">
              <HabitsTab
                currentTeam={currentTeam}
                habitosSelecionados={habitosSelecionados}
                handleHabitoToggle={handleHabitoToggle}
              />
            </TabsContent>
            
            <TabsContent value="rewards">
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
            
            <TabsContent value="integrations">
              <IntegrationsTab currentTeam={currentTeam} />
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
