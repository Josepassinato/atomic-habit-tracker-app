
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RelatoriosHeader } from "@/components/relatorios/RelatoriosHeader";
import { RelatoriosTabsNavigation } from "@/components/relatorios/RelatoriosTabsNavigation";
import { RelatoriosFooter } from "@/components/relatorios/RelatoriosFooter";

const Relatorios = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadRelatorio = () => {
    console.log("Download relatório");
  };

  const handleOpenEmailDialog = () => {
    console.log("Open email dialog");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>

      <div className="container py-6">
        <RelatoriosHeader 
          onDownloadRelatorio={handleDownloadRelatorio}
          onOpenEmailDialog={handleOpenEmailDialog}
        />
        <RelatoriosTabsNavigation />
        <RelatoriosFooter />
      </div>
    </div>
  );
};

export default Relatorios;
