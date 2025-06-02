
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, TrendingDown, Users, Bell } from "lucide-react";
import { NotificacaoEmpresa } from "./types";

interface NotificacaoItemProps {
  notificacao: NotificacaoEmpresa;
  onMarcarComoLida: (id: string) => void;
}

export const NotificacaoItem: React.FC<NotificacaoItemProps> = ({
  notificacao,
  onMarcarComoLida
}) => {
  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case "meta": return <Target className="h-4 w-4" />;
      case "deadline": return <Clock className="h-4 w-4" />;
      case "performance": return <TrendingDown className="h-4 w-4" />;
      case "equipe": return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCorPorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "destructive";
      case "media": return "default";
      case "baixa": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
        notificacao.lida 
          ? "bg-muted/30 border-muted" 
          : "bg-background border-primary/20 hover:bg-muted/50"
      }`}
      onClick={() => onMarcarComoLida(notificacao.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            {getIconePorTipo(notificacao.tipo)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">
                {notificacao.titulo}
              </p>
              {!notificacao.lida && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {notificacao.mensagem}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {notificacao.timestamp.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <Badge 
          variant={getCorPorPrioridade(notificacao.prioridade) as any}
          className="ml-2 flex-shrink-0"
        >
          {notificacao.prioridade}
        </Badge>
      </div>
    </div>
  );
};
