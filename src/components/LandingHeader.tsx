import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/i18n";
import { getCurrentUser } from "@/utils/permissions";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const user = getCurrentUser();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <span className="font-semibold text-lg">Habitus</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            {t('features') || 'Recursos'}
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {t('pricing') || 'Preços'}
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            {t('testimonials') || 'Depoimentos'}
          </a>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/entenda-produto")}
          >
            Entenda o Produto
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeSwitcher />
          
          {user ? (
            <Button 
              variant="default" 
              onClick={() => navigate("/dashboard")}
            >
              {t('dashboard')}
            </Button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
              >
                {t('signIn')}
              </Button>
              <Button 
                variant="default" 
                onClick={() => navigate("/auth")}
              >
                {t('hero.cta') || 'Começar'}
              </Button>
            </div>
          )}
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#features" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('features') || 'Recursos'}
                </a>
                <a href="#pricing" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('pricing') || 'Preços'}
                </a>
                <a href="#testimonials" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('testimonials') || 'Depoimentos'}
                </a>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/entenda-produto")}
                  className="justify-start"
                >
                  Entenda o Produto
                </Button>
                {!user && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/auth")}
                      className="justify-start"
                    >
                      {t('signIn')}
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => navigate("/auth")}
                    >
                      {t('hero.cta') || 'Começar'}
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;