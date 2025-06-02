
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface RelatoriosEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodoSelecionado: string;
  equipeId: string;
  date: Date | undefined;
  totalVendas: number;
  totalMetas: number;
  percentualMeta: number;
  mediaConversao: number;
}

export const RelatoriosEmailDialog: React.FC<RelatoriosEmailDialogProps> = ({
  open,
  onOpenChange,
  periodoSelecionado,
  equipeId,
  date,
  totalVendas,
  totalMetas,
  percentualMeta,
  mediaConversao,
}) => {
  const [emailDestino, setEmailDestino] = useState("");

  const handleEnviarEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailDestino || !emailDestino.includes('@')) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    // Em uma aplicação real, aqui seria feita uma chamada para o backend
    console.log(`Enviando relatório para: ${emailDestino}`);
    console.log({
      periodo: periodoSelecionado,
      equipe: equipeId,
      data: date,
      metricas: {
        totalVendas,
        totalMetas,
        percentualMeta,
        mediaConversao
      }
    });
    
    onOpenChange(false);
    setEmailDestino("");
    toast.success(`Relatório enviado para ${emailDestino}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar relatório por email</DialogTitle>
          <DialogDescription>
            Insira o endereço de email para enviar o relatório de desempenho de vendas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEnviarEmail}>
          <div className="py-4">
            <Input
              placeholder="exemplo@email.com"
              value={emailDestino}
              onChange={(e) => setEmailDestino(e.target.value)}
              type="email"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
