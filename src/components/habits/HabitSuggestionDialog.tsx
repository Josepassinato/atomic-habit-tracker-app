
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { Habit, BusinessModel } from "./types";

interface HabitSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessModel: BusinessModel;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  suggestedHabits: Habit[];
  onSuggestHabits: () => void;
  onAddHabits: () => void;
  loadingSuggestions: boolean;
}

const HabitSuggestionDialog: React.FC<HabitSuggestionDialogProps> = ({
  open,
  onOpenChange,
  businessModel,
  onInputChange,
  suggestedHabits,
  onSuggestHabits,
  onAddHabits,
  loadingSuggestions
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest Personalized Habits</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="segmento">Business Segment</Label>
            <Input
              id="segmento"
              name="segmento"
              value={businessModel.segmento}
              onChange={onInputChange}
              placeholder="e.g., Technology, Real Estate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cicloVenda">Sales Cycle</Label>
            <Input
              id="cicloVenda"
              name="cicloVenda"
              value={businessModel.cicloVenda}
              onChange={onInputChange}
              placeholder="e.g., 30 days, 6 months"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tamEquipe">Team Size</Label>
            <Input
              id="tamEquipe"
              name="tamEquipe"
              value={businessModel.tamEquipe}
              onChange={onInputChange}
              placeholder="e.g., 5 people, 20 people"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objetivoPrincipal">Main Objective</Label>
            <Input
              id="objetivoPrincipal"
              name="objetivoPrincipal"
              value={businessModel.objetivoPrincipal}
              onChange={onInputChange}
              placeholder="e.g., Increase sales by 20%"
            />
          </div>
          
          <Button onClick={onSuggestHabits} disabled={loadingSuggestions} className="w-full">
            {loadingSuggestions ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Generating suggestions...
              </>
            ) : (
              "Generate Habit Suggestions"
            )}
          </Button>
          
          {suggestedHabits.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Suggested Habits:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {suggestedHabits.map((habit) => (
                  <div key={habit.id} className="p-2 border rounded text-sm">
                    <div className="font-medium">{habit.titulo}</div>
                    <div className="text-muted-foreground">{habit.descricao}</div>
                  </div>
                ))}
              </div>
              <Button onClick={onAddHabits} className="w-full">
                Add All Suggested Habits
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HabitSuggestionDialog;
