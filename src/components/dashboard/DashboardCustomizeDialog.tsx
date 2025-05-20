
import React from "react";
import { Settings, ArrowUp, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Widget } from "./types/widget.types";

interface DashboardCustomizeDialogProps {
  widgets: Widget[];
  toggleWidget: (id: string) => void;
  moveWidgetUp: (id: string) => void;
  moveWidgetDown: (id: string) => void;
  reordenarWidgets: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DashboardCustomizeDialog: React.FC<DashboardCustomizeDialogProps> = ({
  widgets,
  toggleWidget,
  moveWidgetUp,
  moveWidgetDown,
  reordenarWidgets,
  open,
  setOpen
}) => {
  const handleSalvarLayout = () => {
    reordenarWidgets();
    setOpen(false);
    toast.success("Layout do dashboard salvo com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Personalizar Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Selecione quais widgets deseja exibir e a ordem em que eles aparecem.
          </div>
          <div className="space-y-2">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`widget-${widget.id}`}
                    checked={widget.ativo}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                  <Label htmlFor={`widget-${widget.id}`} className="cursor-pointer">
                    {widget.titulo}
                  </Label>
                  <Badge className="ml-2">{widget.tamanho}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveWidgetUp(widget.id)}
                    disabled={widgets.indexOf(widget) === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveWidgetDown(widget.id)}
                    disabled={widgets.indexOf(widget) === widgets.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvarLayout}>
            Salvar Layout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
