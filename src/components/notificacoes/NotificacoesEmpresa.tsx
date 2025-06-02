
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, Target, Clock, AlertTriangle, TrendingDown, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface NotificacaoEmpresa {
  id: string;
  tipo: "meta" | "deadline" | "performance" | "equipe";
  titulo: string;
  mensagem: string;
  prioridade: "baixa" | "media" | "alta";
  timestamp: Date;
  lida: boolean;
  dadosExtras?: any;
}

interface NotificacoesEmpresaProps {
  className?: string;
}

const NotificacoesEmpresa: React.FC<NotificacoesEmpresaProps> = ({ className }) => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoEmpresa[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);

  // Simula notificações em tempo real
  useEffect(() => {
    const notificacoesIniciais: NotificacaoEmpresa[] = [
      {
        id: "1",
        tipo: "meta",
        titulo: "Meta Mensal em Risco",
        mensagem: "Equipe Alfa está 20% abaixo da meta mensal com 5 dias restantes",
        prioridade: "alta",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        lida: false,
        dadosExtras: { equipe: "Alfa", percentual: 80, diasRestantes: 5 }
      },
      {
        id: "2",
        tipo: "deadline",
        titulo: "Deadline Aproximando",
        mensagem: "Relatório trimestral deve ser entregue em 2 dias",
        prioridade: "media",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        lida: false,
        dadosExtras: { prazo: "2 dias", documento: "Relatório Q1" }
      },
      {
        id: "3",
        tipo: "performance",
        titulo: "Queda na Performance",
        mensagem: "Taxa de conversão geral caiu 15% esta semana",
        prioridade: "alta",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lida: false,
        dadosExtras: { queda: 15, periodo: "esta semana" }
      },
      {
        id: "4",
        tipo: "equipe",
        titulo: "Nova Equipe Criada",
        mensagem: "Equipe Delta foi criada com 3 membros",
        prioridade: "baixa",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lida: true,
        dadosExtras: { equipe: "Delta", membros: 3 }
      }
    ];

    setNotificacoes(notificacoesIniciais);
    setNaoLidas(notificacoesIniciais.filter(n => !n.lida).length);

    // Simula novas notificações chegando
    const interval = setInterval(() => {
      const novaNotificacao: NotificacaoEmpresa = {
        id: Date.now().toString(),
        tipo: Math.random() > 0.5 ? "meta" : "performance",
        titulo: Math.random() > 0.5 ? "Atualização de Meta" : "Alerta de Performance",
        mensagem: "Nova atualização disponível no sistema",
        prioridade: "media",
        timestamp: new Date(),
        lida: false
      };

      setNotificacoes(prev => [novaNotificacao, ...prev]);
      setNaoLidas(prev => prev + 1);
      toast.info(`Nova notificação: ${novaNotificacao.titulo}`);
    }, 30000); // Nova notificação a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
    setNaoLidas(prev => Math.max(0, prev - 1));
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(notif => ({ ...notif, lida: true }))
    );
    setNaoLidas(0);
  };

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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Notificações da Empresa
            {naoLidas > 0 && (
              <Badge variant="destructive" className="ml-2">
                {naoLidas}
              </Badge>
            )}
          </CardTitle>
          {naoLidas > 0 && (
            <Button variant="outline" size="sm" onClick={marcarTodasComoLidas}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {notificacoes.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma notificação encontrada
              </p>
            ) : (
              notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notificacao.lida 
                      ? "bg-muted/30 border-muted" 
                      : "bg-background border-primary/20 hover:bg-muted/50"
                  }`}
                  onClick={() => marcarComoLida(notificacao.id)}
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
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificacoesEmpresa;
