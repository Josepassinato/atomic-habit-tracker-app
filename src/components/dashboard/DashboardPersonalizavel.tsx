
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Plus, X, Move } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Widget {
  id: string;
  tipo: string;
  titulo: string;
  tamanho: "pequeno" | "medio" | "grande";
  ativo: boolean;
  ordem: number;
}

interface DashboardPersonalizavelProps {
  children?: React.ReactNode;
}

const widgetsDisponiveis: Widget[] = [
  { id: "habitos", tipo: "habitos", titulo: "Hábitos Atômicos", tamanho: "medio", ativo: true, ordem: 1 },
  { id: "metas", tipo: "metas", titulo: "Metas de Vendas", tamanho: "medio", ativo: true, ordem: 2 },
  { id: "consultoria", tipo: "consultoria", titulo: "Consultoria IA", tamanho: "grande", ativo: true, ordem: 3 },
  { id: "crm", tipo: "crm", titulo: "Integrações CRM", tamanho: "pequeno", ativo: true, ordem: 4 },
  { id: "relatorios", tipo: "relatorios", titulo: "Relatórios Rápidos", tamanho: "medio", ativo: false, ordem: 5 },
  { id: "calendario", tipo: "calendario", titulo: "Calendário de Atividades", tamanho: "pequeno", ativo: false, ordem: 6 },
];

const DashboardPersonalizavel: React.FC<DashboardPersonalizavelProps> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedWidgets = localStorage.getItem("dashboard-widgets");
    return savedWidgets ? JSON.parse(savedWidgets) : widgetsDisponiveis;
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    localStorage.setItem("dashboard-widgets", JSON.stringify(widgets));
  }, [widgets]);
  
  const toggleWidget = (id: string) => {
    setWidgets(
      widgets.map(widget => 
        widget.id === id ? { ...widget, ativo: !widget.ativo } : widget
      )
    );
  };
  
  const reordenarWidgets = () => {
    // Reordena os widgets com base na propriedade 'ordem'
    // e atualiza os números de ordem corretamente
    let novaOrdem = [...widgets]
      .sort((a, b) => a.ordem - b.ordem)
      .map((widget, index) => ({
        ...widget,
        ordem: index + 1
      }));
    
    setWidgets(novaOrdem);
  };
  
  const handleSalvarLayout = () => {
    reordenarWidgets();
    setDialogOpen(false);
    toast.success("Layout do dashboard salvo com sucesso!");
  };
  
  const moveWidgetUp = (id: string) => {
    const index = widgets.findIndex(w => w.id === id);
    if (index <= 0) return;
    
    const newWidgets = [...widgets];
    const tempOrdem = newWidgets[index].ordem;
    newWidgets[index].ordem = newWidgets[index - 1].ordem;
    newWidgets[index - 1].ordem = tempOrdem;
    
    setWidgets(newWidgets);
  };
  
  const moveWidgetDown = (id: string) => {
    const index = widgets.findIndex(w => w.id === id);
    if (index === -1 || index === widgets.length - 1) return;
    
    const newWidgets = [...widgets];
    const tempOrdem = newWidgets[index].ordem;
    newWidgets[index].ordem = newWidgets[index + 1].ordem;
    newWidgets[index + 1].ordem = tempOrdem;
    
    setWidgets(newWidgets);
  };
  
  // Renderiza apenas os widgets ativos e ordenados
  const widgetsAtivos = [...widgets]
    .filter(widget => widget.ativo)
    .sort((a, b) => a.ordem - b.ordem);
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarLayout}>
                Salvar Layout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgetsAtivos.map((widget) => {
          const colSpan = 
            widget.tamanho === "pequeno" ? "md:col-span-1" :
            widget.tamanho === "medio" ? "md:col-span-2" :
            "md:col-span-4";
            
          return (
            <div key={widget.id} className={`${colSpan}`}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>{widget.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Aqui entraria o conteúdo do widget */}
                  <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                    <span className="text-muted-foreground">Conteúdo do widget {widget.tipo}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      
      {children}
    </>
  );
};

export default DashboardPersonalizavel;

import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
