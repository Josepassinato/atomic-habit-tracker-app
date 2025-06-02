
import React from "react";
import { HabitEvidenceType } from "../habits/HabitEvidence";
import HabitItem from "../habits/HabitItem";
import { Habit } from "../habits/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface HabitsListProps {
  habits: Habit[];
  onEvidenceSubmitted: (habitId: number, evidence: HabitEvidenceType) => void;
  onMarkCompleted: (id: number) => void;
  onOpenSuggestDialog: () => void;
}

const HabitsList: React.FC<HabitsListProps> = ({
  habits,
  onEvidenceSubmitted,
  onMarkCompleted,
  onOpenSuggestDialog
}) => {
  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onEvidenceSubmitted={onEvidenceSubmitted}
          onMarkCompleted={onMarkCompleted}
        />
      ))}
      
      {habits.length === 0 && (
        <div className="py-6 text-center text-muted-foreground">
          <p>No habits created yet. Start building your success!</p>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4 w-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all"
        onClick={onOpenSuggestDialog}
      >
        <Plus className="h-4 w-4 mr-2" /> Suggest Personalized Habits
      </Button>
    </div>
  );
};

export default HabitsList;
