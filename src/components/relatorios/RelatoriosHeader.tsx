
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, BarChart3 } from "lucide-react";

interface RelatoriosHeaderProps {
  onDownloadRelatorio: () => void;
  onOpenEmailDialog: () => void;
}

export const RelatoriosHeader: React.FC<RelatoriosHeaderProps> = ({
  onDownloadRelatorio,
  onOpenEmailDialog,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Painel da Empresa</h1>
        <p className="text-muted-foreground">Relatórios, alertas e análises em tempo real</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownloadRelatorio} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Baixar Relatório
        </Button>
        <Button onClick={onOpenEmailDialog} className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Enviar por Email
        </Button>
      </div>
    </div>
  );
};
