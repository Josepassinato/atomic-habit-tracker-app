
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, BarChart3 } from "lucide-react";
import { useLanguage } from "@/i18n";

interface RelatoriosHeaderProps {
  onDownloadRelatorio: () => void;
  onOpenEmailDialog: () => void;
}

export const RelatoriosHeader: React.FC<RelatoriosHeaderProps> = ({
  onDownloadRelatorio,
  onOpenEmailDialog,
}) => {
  const { t, language } = useLanguage();
  
  // Header content based on language
  const getHeaderContent = () => {
    switch(language) {
      case 'pt':
        return {
          title: 'Painel da Empresa',
          subtitle: 'Relatórios, alertas e análises em tempo real',
          downloadButton: 'Baixar Relatório',
          emailButton: 'Enviar por Email'
        };
      case 'es':
        return {
          title: 'Panel de la Empresa',
          subtitle: 'Informes, alertas y análisis en tiempo real',
          downloadButton: 'Descargar Informe',
          emailButton: 'Enviar por Email'
        };
      case 'en':
      default:
        return {
          title: 'Company Dashboard',
          subtitle: 'Reports, alerts and real-time analytics',
          downloadButton: 'Download Report',
          emailButton: 'Send by Email'
        };
    }
  };
  
  const content = getHeaderContent();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{content.title}</h1>
        <p className="text-muted-foreground">{content.subtitle}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownloadRelatorio} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {content.downloadButton}
        </Button>
        <Button onClick={onOpenEmailDialog} className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {content.emailButton}
        </Button>
      </div>
    </div>
  );
};
