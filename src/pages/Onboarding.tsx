
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import TeamsTab from "./onboarding/TeamsTab";
import HabitsTab from "./onboarding/HabitsTab";
import GoalsTab from "./onboarding/GoalsTab";
import IntegrationsTab from "./onboarding/IntegrationsTab";
import RewardsTab from "./onboarding/RewardsTab";
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
    setCurrentTeam,
    handleHabitoToggle,
    setMetaMensal,
    setMetaDiaria,
    onTeamSubmit,
    deleteTeam,
    editTeam,
    selectTeam,
    handleFinish
  } = useOnboarding();

  const handleBack = () => {
    navigate(-1);
  };

  const tabs = [
    { id: "teams", label: "Teams", component: TeamsTab },
    { id: "habits", label: "Habits", component: HabitsTab },
    { id: "goals", label: "Goals", component: GoalsTab },
    { id: "integrations", label: "Integrations", component: IntegrationsTab },
    { id: "rewards", label: "Rewards", component: RewardsTab }
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

  const getCurrentTabComponent = () => {
    const currentTabData = tabs.find(tab => tab.id === currentTab);
    if (!currentTabData) return null;

    const Component = currentTabData.component;
    
    // Base props that most components need
    const baseProps = {
      currentTeam,
      teams,
      setCurrentTeam
    };

    // Add specific props based on the current tab
    if (currentTab === "teams") {
      return (
        <Component 
          {...baseProps}
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
      );
    }

    if (currentTab === "habits" || currentTab === "goals") {
      return (
        <Component 
          {...baseProps}
          habitosSelecionados={habitosSelecionados}
          handleHabitoToggle={handleHabitoToggle}
          metaMensal={metaMensal}
          setMetaMensal={setMetaMensal}
          metaDiaria={metaDiaria}
          setMetaDiaria={setMetaDiaria}
        />
      );
    }

    // For integrations and rewards tabs, only pass base props
    return <Component {...baseProps} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome to Habitus</CardTitle>
            <p className="text-muted-foreground">
              Let's set up your sales performance system
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-5">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  {getCurrentTabComponent()}
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={isFirstTab}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button onClick={handleNext}>
                {isLastTab ? "Finish Setup" : "Next"}
                {!isLastTab && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
