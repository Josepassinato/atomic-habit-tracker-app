
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n";
import LanguageSelector from "@/components/LanguageSelector";

const Footer = () => {
  const { t, language } = useLanguage();
  
  // Footer tagline based on language
  const getFooterTagline = () => {
    switch(language) {
      case 'en':
        return 'The future of sales automation and performance';
      case 'es':
        return 'El futuro de la automatización de ventas y rendimiento';
      case 'pt':
        return 'O futuro da automação de vendas e performance';
      default:
        return 'O futuro da automação de vendas e performance';
    }
  };
  
  return (
    <footer className="border-t bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex space-x-4">
            <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground">
              {t('aboutUs')}
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link to="/contato" className="text-sm text-muted-foreground hover:text-foreground">
              {t('contact')}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Habitus © 2025 - {getFooterTagline()}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
