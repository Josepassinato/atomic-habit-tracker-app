
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { NotificacoesBadge } from "@/components/notificacoes/NotificacoesProvider";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  isLoggedIn?: boolean;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, showBackButton = true }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('user');
      
      // Show toast message in the correct language
      const logoutMessages = {
        en: 'Logout successful',
        es: 'Cierre de sesión exitoso',
        pt: 'Logout realizado com sucesso'
      };
      toast.success(logoutMessages[language]);
      
      // Use window.location for a hard redirect to the login page
      window.location.href = '/login';
    }
  };
  
  return (
    <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {showBackButton && window.history.length > 1 && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
              <ArrowLeft size={16} className="mr-2" />
              {t('back')}
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-sm">
              <div className="h-5 w-5 bg-white dark:bg-slate-900 rounded-sm" />
            </div>
            <span className="font-bold">Habitus</span>
          </Link>
          
          {isLoggedIn && (
            <nav className="hidden md:flex gap-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                {t('dashboard')}
              </Link>
              <Link to="/habitos" className="text-sm font-medium hover:text-primary">
                {t('habits')}
              </Link>
              <Link to="/metas" className="text-sm font-medium hover:text-primary">
                {t('goals')}
              </Link>
              <Link to="/relatorios" className="text-sm font-medium hover:text-primary">
                {t('reports')}
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <NotificacoesBadge />
              <LanguageSelector />
              <ThemeSwitcher />
              <Button size="sm" variant="outline" asChild>
                <Link to="/configuracoes">{t('settings')}</Link>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut size={16} className="mr-2" />
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <LanguageSelector />
              <ThemeSwitcher />
              <Button size="sm" variant="outline" asChild>
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/registro">{t('register')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
