
import React, { createContext, useContext, useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  data: Date;
  lida: boolean;
}

interface NotificacoesContextType {
  notificacoes: Notificacao[];
  adicionarNotificacao: (notificacao: Omit<Notificacao, "id" | "data" | "lida">) => void;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  removerNotificacao: (id: string) => void;
  limparNotificacoes: () => void;
}

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

export const useNotificacoes = () => {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error("useNotificacoes deve ser usado dentro de um NotificacoesProvider");
  }
  return context;
};

export const NotificacoesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(() => {
    const salvas = localStorage.getItem("notificacoes");
    if (salvas) {
      const parsed = JSON.parse(salvas);
      return parsed.map((n: any) => ({
        ...n,
        data: new Date(n.data)
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
  }, [notificacoes]);

  const adicionarNotificacao = (notificacao: Omit<Notificacao, "id" | "data" | "lida">) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: Math.random().toString(36).slice(2, 11),
      data: new Date(),
      lida: false,
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);
    
    // Exibir notificação do navegador se permitido
    if (Notification.permission === "granted") {
      new Notification(notificacao.titulo, {
        body: notificacao.mensagem
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => 
      prev.map(n => ({ ...n, lida: true }))
    );
  };

  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
  };

  const valor = {
    notificacoes,
    adicionarNotificacao,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    limparNotificacoes,
  };

  return (
    <NotificacoesContext.Provider value={valor}>
      {children}
    </NotificacoesContext.Provider>
  );
};

export const NotificacoesBadge: React.FC = () => {
  const { notificacoes, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0" 
              variant="destructive"
            >
              {naoLidas}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notificações</h3>
          {notificacoes.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1" 
              onClick={marcarTodasComoLidas}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <Separator />
        
        <ScrollArea className="max-h-[60vh]">
          {notificacoes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            <div className="divide-y">
              {notificacoes.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-4 cursor-pointer ${!notif.lida ? 'bg-muted/50' : ''}`}
                  onClick={() => marcarComoLida(notif.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{notif.titulo}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notif.data).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm">{notif.mensagem}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
