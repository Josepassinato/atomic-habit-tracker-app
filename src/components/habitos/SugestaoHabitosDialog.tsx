
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
          <DialogTitle>Sugestão de Hábitos Personalizados</DialogTitle>
          <DialogDescription>
            Descreva o modelo de negócio da sua empresa para receber sugestões de hábitos otimizados para sua equipe de vendas.
          </DialogDescription>
        </DialogHeader>
        
        {!habitosSugeridos.length ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="segmento" className="text-sm font-medium">Segmento/Indústria</label>
              <Input 
                id="segmento" 
                name="segmento" 
                placeholder="Ex: SaaS, Varejo, Saúde, etc." 
                value={modeloNegocio.segmento}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cicloVenda" className="text-sm font-medium">Ciclo de Vendas</label>
              <Input 
                id="cicloVenda" 
                name="cicloVenda" 
                placeholder="Ex: Curto (1-30 dias), Médio, Longo (>90 dias)" 
                value={modeloNegocio.cicloVenda}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tamEquipe" className="text-sm font-medium">Tamanho da Equipe de Vendas</label>
              <Input 
                id="tamEquipe" 
                name="tamEquipe" 
                placeholder="Ex: 5, 10, 25, etc." 
                value={modeloNegocio.tamEquipe}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="objetivoPrincipal" className="text-sm font-medium">Objetivo Principal</label>
              <Textarea 
                id="objetivoPrincipal" 
                name="objetivoPrincipal" 
                placeholder="Ex: Aumentar conversão, Reduzir ciclo de vendas, Expandir para Enterprise, etc." 
                value={modeloNegocio.objetivoPrincipal}
                onChange={onInputChange}
              />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <h4 className="font-medium mb-3">Hábitos Sugeridos pela IA:</h4>
            <div className="space-y-3">
              {habitosSugeridos.map((habito) => (
                <div key={habito.id} className="border p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{habito.titulo}</h5>
                    <span className="text-sm text-muted-foreground">{habito.horario}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{habito.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          
          {habitosSugeridos.length ? (
            <Button onClick={onAdicionarHabitos}>
              Adicionar Hábitos
            </Button>
          ) : (
            <Button onClick={onSugerirHabitos} disabled={carregandoSugestoes}>
              {carregandoSugestoes ? "Gerando sugestões..." : "Gerar Sugestões"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SugestaoHabitosDialog;
