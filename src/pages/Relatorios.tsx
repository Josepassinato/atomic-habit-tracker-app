
import React from "react";
import { RelatoriosHeader } from "@/components/relatorios/RelatoriosHeader";
import { RelatoriosTabsNavigation } from "@/components/relatorios/RelatoriosTabsNavigation";
import { RelatoriosFooter } from "@/components/relatorios/RelatoriosFooter";
import PageNavigation from "@/components/PageNavigation";

const Relatorios = () => {
  const handleDownloadRelatorio = () => {
    console.log("Download relatório");
  };

  const handleOpenEmailDialog = () => {
    console.log("Open email dialog");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageNavigation />
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
