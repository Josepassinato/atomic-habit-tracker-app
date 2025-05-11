
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
import { toast } from "sonner";

export type NotificacaoTipo = 'info' | 'sucesso' | 'alerta' | 'erro';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: NotificacaoTipo;
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

// Função auxiliar para verificar se as notificações do navegador são suportadas
const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Gera um ID único para notificações
const gerarId = () => Math.random().toString(36).slice(2, 11);

// Mapeia tipos de notificação para variantes de toast
const tipoParaVariantToast = (tipo: NotificacaoTipo) => {
  switch (tipo) {
    case 'sucesso': return 'success';
    case 'erro': return 'error';
    case 'alerta': return 'warning';
    case 'info': 
    default: return 'info';
  }
};

export const NotificacoesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(() => {
    try {
      const salvas = localStorage.getItem("notificacoes");
      if (salvas) {
        const parsed = JSON.parse(salvas);
        return parsed.map((n: any) => ({
          ...n,
          data: new Date(n.data)
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
    }
  }, [notificacoes]);

  const adicionarNotificacao = (notificacao: Omit<Notificacao, "id" | "data" | "lida">) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: gerarId(),
      data: new Date(),
      lida: false,
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);
    
    // Mostrar toast interno para todos os tipos de notificações
    toast[tipoParaVariantToast(notificacao.tipo)](notificacao.titulo, {
      description: notificacao.mensagem,
    });
    
    // Exibir notificação do navegador se suportado e permitido
    if (isNotificationSupported()) {
      try {
        if (Notification.permission === "granted") {
          new Notification(notificacao.titulo, {
            body: notificacao.mensagem
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(notificacao.titulo, {
                body: notificacao.mensagem
              });
            }
          });
        }
      } catch (error) {
        console.error("Erro ao exibir notificação do navegador:", error);
      }
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

  const tipoParaCor = (tipo: NotificacaoTipo) => {
    switch (tipo) {
      case 'sucesso': return 'bg-green-50 text-green-700 border-green-200';
      case 'erro': return 'bg-red-50 text-red-700 border-red-200';
      case 'alerta': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'info': 
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

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
                  <span className={`text-xs inline-block mt-2 px-2 py-0.5 rounded border ${tipoParaCor(notif.tipo)}`}>
                    {notif.tipo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
