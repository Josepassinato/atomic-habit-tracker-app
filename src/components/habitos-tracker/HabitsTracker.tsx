
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import AIFeedback from "../habits/AIFeedback";
import HabitSuggestionDialog from "../habits/HabitSuggestionDialog";
import HabitsStats from "./HabitsStats";
import HabitsList from "./HabitsList";
import HabitsActions from "./HabitsActions";
import { useHabitsTracker } from "./useHabitsTracker";
import { HabitsTrackerProps } from "./types";

const HabitsTracker: React.FC<HabitsTrackerProps> = ({ className }) => {
  const {
    habits,
    feedback,
    loadingFeedback,
    animateProgress,
    dialogOpen,
    setDialogOpen,
    businessModel,
    loadingSuggestions,
    suggestedHabits,
    completedHabits,
    verifiedHabits,
    progress,
    markAsCompleted,
    restartHabits,
    requestAIFeedback,
    handleInputChange,
    suggestPersonalizedHabits,
    addSuggestedHabits,
    handleEvidenceSubmitted
  } = useHabitsTracker();

  return (
    <Card className={`h-full ${className || ''}`}>
      <CardHeader>
        <CardTitle>Daily Atomic Habits</CardTitle>
        <CardDescription>
          <HabitsStats 
            habits={habits}
            completedHabits={completedHabits}
            verifiedHabits={verifiedHabits}
            progress={progress}
            animateProgress={animateProgress}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HabitsList 
          habits={habits}
          onEvidenceSubmitted={handleEvidenceSubmitted}
          onMarkCompleted={markAsCompleted}
          onOpenSuggestDialog={() => setDialogOpen(true)}
        />
        
        <AIFeedback feedback={feedback} />
        
        <HabitSuggestionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          businessModel={businessModel}
          onInputChange={handleInputChange}
          suggestedHabits={suggestedHabits}
          onSuggestHabits={suggestPersonalizedHabits}
          onAddHabits={addSuggestedHabits}
          loadingSuggestions={loadingSuggestions}
        />
      </CardContent>
      <CardFooter>
        <HabitsActions 
          onRestart={restartHabits}
          onRequestFeedback={requestAIFeedback}
          loadingFeedback={loadingFeedback}
        />
      </CardFooter>
    </Card>
  );
};

export default HabitsTracker;
