
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { toast } from 'sonner';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { t, language } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('user');
    
    // Show toast message in the correct language
    const logoutMessages = {
      en: 'Logout successful',
      es: 'Cierre de sesión exitoso',
      pt: 'Logout realizado com sucesso'
    };
    toast.success(logoutMessages[language]);
    
    // Navigate to login page
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, children }: { 
    to: string; 
    icon: React.ElementType;
    children: React.ReactNode;
  }) => {
    const isActive = currentPath === to;
    
    return (
      <Link to={to} className="w-full">
        <div 
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Icon size={16} />
          <span>{children}</span>
        </div>
      </Link>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1">
            <div className="h-5 w-5 rounded-sm bg-white" />
          </div>
          <span className="text-xl font-bold">Habitus</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <div className="space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            {t('dashboard')}
          </NavItem>
          <NavItem to="/habitos" icon={Calendar}>
            {t('habits')}
          </NavItem>
          <NavItem to="/metas" icon={Target}>
            {t('goals')}
          </NavItem>
          <NavItem to="/relatorios" icon={BarChart3}>
            {t('reports')}
          </NavItem>
          <NavItem to="/configuracoes" icon={Settings}>
            {t('settings')}
          </NavItem>
          <NavItem to="/onboarding" icon={Settings}>
            {t('onboarding')}
          </NavItem>
          <NavItem to="/tutorial" icon={HelpCircle}>
            Tutorial
          </NavItem>
        </div>

        <div className="mt-8">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-3 py-1 text-left text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                  M
                </div>
                <div>
                  <p className="font-medium">Marcelo Silva</p>
                  <p className="text-xs text-muted-foreground">Consultor</p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                {t('logout')}
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <p className="text-xs text-center text-muted-foreground">
          Habitus © 2025
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
