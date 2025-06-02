
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Habito, ModeloNegocio } from "./types";

interface SugestaoHabitosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modeloNegocio: ModeloNegocio;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  habitosSugeridos: Habito[];
  onSugerirHabitos: () => void;
  onAdicionarHabitos: () => void;
  carregandoSugestoes: boolean;
}

const SugestaoHabitosDialog: React.FC<SugestaoHabitosDialogProps> = ({
  open,
  onOpenChange,
  modeloNegocio,
  onInputChange,
  habitosSugeridos,
  onSugerirHabitos,
  onAdicionarHabitos,
  carregandoSugestoes,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalized Habit Suggestions</DialogTitle>
          <DialogDescription>
            Describe your company's business model to receive optimized habit suggestions for your sales team.
          </DialogDescription>
        </DialogHeader>
        
        {!habitosSugeridos.length ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="segmento" className="text-sm font-medium">Segment/Industry</label>
              <Input 
                id="segmento" 
                name="segmento" 
                placeholder="e.g., SaaS, Retail, Healthcare, etc." 
                value={modeloNegocio.segmento}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cicloVenda" className="text-sm font-medium">Sales Cycle</label>
              <Input 
                id="cicloVenda" 
                name="cicloVenda" 
                placeholder="e.g., Short (1-30 days), Medium, Long (>90 days)" 
                value={modeloNegocio.cicloVenda}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tamEquipe" className="text-sm font-medium">Sales Team Size</label>
              <Input 
                id="tamEquipe" 
                name="tamEquipe" 
                placeholder="e.g., 5, 10, 25, etc." 
                value={modeloNegocio.tamEquipe}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="objetivoPrincipal" className="text-sm font-medium">Main Objective</label>
              <Textarea 
                id="objetivoPrincipal" 
                name="objetivoPrincipal" 
                placeholder="e.g., Increase conversion, Reduce sales cycle, Expand to Enterprise, etc." 
                value={modeloNegocio.objetivoPrincipal}
                onChange={onInputChange}
              />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <h4 className="font-medium mb-3">AI Suggested Habits:</h4>
            <div className="space-y-3">
              {habitosSugeridos.map((habito) => (
                <div key={habito.id} className="border p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{habito.title}</h5>
                    <span className="text-sm text-muted-foreground">{habito.schedule}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{habito.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {habitosSugeridos.length ? (
            <Button onClick={onAdicionarHabitos}>
              Add Habits
            </Button>
          ) : (
            <Button onClick={onSugerirHabitos} disabled={carregandoSugestoes}>
              {carregandoSugestoes ? "Generating suggestions..." : "Generate Suggestions"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SugestaoHabitosDialog;
