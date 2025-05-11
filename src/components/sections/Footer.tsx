
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Footer = () => {
  const { t } = useLanguage();
  
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
            Habitus © 2025 - {t('language') === 'en' ? 'The future of sales automation and performance' : 
                             t('language') === 'es' ? 'El futuro de la automatización de ventas y rendimiento' : 
                             'O futuro da automação de vendas e performance'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
