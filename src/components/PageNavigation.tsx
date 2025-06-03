
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '@/i18n';
import { performLogout } from '@/utils/auth-utils';

interface PageNavigationProps {
  showLogout?: boolean;
  customBackAction?: () => void;
  backText?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ 
  showLogout = true, 
  customBackAction,
  backText 
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      navigate(-1);
    }
  };
  
  const handleLogout = () => {
    performLogout('/login');
  };
  
  return (
    <div className="flex justify-between items-center mb-4 p-4">
      <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
        <ArrowLeft size={16} />
        {backText || t('back') || 'Voltar'}
      </Button>
      {showLogout && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} className="mr-2" />
          {t('logout') || 'Sair'}
        </Button>
      )}
    </div>
  );
};

export default PageNavigation;
