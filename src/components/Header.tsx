
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSelector from "./LanguageSelector";
import { NotificacoesBadge } from "./notificacoes/NotificacoesProvider";
import SupabaseSyncButton from "./SupabaseSyncButton";
import { useSupabase } from "@/hooks/use-supabase";
import { useLanguage } from "@/i18n";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isConfigured } = useSupabase();
  const { t } = useLanguage();
  
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
          {isConfigured && (
            <SupabaseSyncButton className="hidden md:flex" />
          )}
          
          <NotificacoesBadge />
          <LanguageSelector />
          <ThemeSwitcher />
          
          <Button 
            variant="default" 
            className="hidden md:block"
            onClick={() => {
              const user = localStorage.getItem("user");
              if (user) {
                navigate("/dashboard");
              } else {
                navigate("/login");
              }
            }}
          >
            {t('dashboard')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
