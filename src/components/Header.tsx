
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSelector from "./LanguageSelector";
import { NotificacoesBadge } from "./notificacoes/NotificacoesProvider";
import SupabaseSyncButton from "./SupabaseSyncButton";
import { RealtimeNotificationCenter } from "./realtime/RealtimeNotificationCenter";
import { RealtimeIndicator } from "./realtime/RealtimeIndicator";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useSupabase } from "@/hooks/use-supabase";
import { useLanguage } from "@/i18n";
import { getCurrentUser } from "@/utils/permissions";
import { performLogout } from "@/utils/auth-utils";
import { supabase } from "@/integrations/supabase/client";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isConfigured } = useSupabase();
  const { t } = useLanguage();
  const user = getCurrentUser();
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  
  // Get user's team_id from storage or context
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const teamId = userProfile?.team_ids?.[0];
  const userId = user?.id;
  
  const { notifications, markAsRead, clearAll } = useRealtimeNotifications(userId, teamId);
  
  // Monitor Supabase realtime connection status
  useEffect(() => {
    const channel = supabase.channel('connection-status');
    
    channel
      .on('system', {}, (payload) => {
        if (payload.status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        }
      })
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleLogout = () => {
    performLogout('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <span className="font-semibold text-lg">Habitus</span>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2">
          {user && isConfigured && (
            <>
              <RealtimeIndicator connected={isRealtimeConnected} className="hidden md:flex" />
              <RealtimeNotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onClearAll={clearAll}
              />
            </>
          )}
          
          {isConfigured && (
            <SupabaseSyncButton className="hidden md:flex" />
          )}
          
          <NotificacoesBadge />
          <LanguageSelector />
          <ThemeSwitcher />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                className="hidden md:block"
                onClick={() => navigate("/dashboard")}
              >
                {t('dashboard')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut size={16} className="mr-1" />
                {t('signOut')}
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              className="hidden md:block"
              onClick={() => navigate("/auth")}
            >
              {t('signIn')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
