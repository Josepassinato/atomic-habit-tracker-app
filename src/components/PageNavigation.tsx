
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';

const PageNavigation = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Show toast message in the correct language
    const logoutMessages = {
      en: 'Logout successful',
      es: 'Cierre de sesión exitoso',
      pt: 'Logout realizado com sucesso'
    };
    toast.success(logoutMessages[language]);
    
    // Force navigation to login page
    window.location.replace('/login');
  };
  
  return (
    <div className="flex justify-between items-center mb-4 p-4">
      <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
        <ArrowLeft size={16} />
        {t('back')}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut size={16} className="mr-2" />
        {t('logout')}
      </Button>
    </div>
  );
};

export default PageNavigation;
