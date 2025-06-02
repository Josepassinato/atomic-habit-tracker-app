
import React from "react";
import { useLanguage } from "@/i18n";

export const RelatoriosFooter: React.FC = () => {
  const { language } = useLanguage();
  
  // Footer tagline based on language
  const getFooterTagline = () => {
    switch(language) {
      case 'pt':
        return 'O futuro da automação de vendas e performance';
      case 'es':
        return 'El futuro de la automatización de ventas y rendimiento';
      case 'en':
      default:
        return 'The future of sales automation and performance';
    }
  };
  
  return (
    <footer className="border-t bg-white py-4">
      <div className="container text-center text-sm text-muted-foreground">
        Habitus © 2025 - {getFooterTagline()}
      </div>
    </footer>
  );
};
