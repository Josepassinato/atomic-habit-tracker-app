
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { NotificacoesBadge } from "@/components/notificacoes/NotificacoesProvider";

interface HeaderProps {
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false }) => {
  return (
    <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-sm">
              <div className="h-5 w-5 bg-white dark:bg-slate-900 rounded-sm" />
            </div>
            <span className="font-bold">Habitus</span>
          </Link>
          
          {isLoggedIn && (
            <nav className="hidden md:flex gap-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Link to="/habitos" className="text-sm font-medium hover:text-primary">
                Hábitos
              </Link>
              <Link to="/metas" className="text-sm font-medium hover:text-primary">
                Metas
              </Link>
              <Link to="/relatorios" className="text-sm font-medium hover:text-primary">
                Relatórios
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <NotificacoesBadge />
              <ThemeSwitcher />
              <Button size="sm" variant="outline" asChild>
                <Link to="/configuracoes">Configurações</Link>
              </Button>
            </>
          ) : (
            <>
              <ThemeSwitcher />
              <Button size="sm" variant="outline" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/registro">Registrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
