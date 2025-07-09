
import React from "react";
import { useLanguage } from "@/i18n";

export const RelatoriosFooter: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t bg-white py-4">
      <div className="container text-center text-sm text-muted-foreground">
        Habitus © 2025 - {t('salesAutomationFuture')}
      </div>
    </footer>
  );
};
