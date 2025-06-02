
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NotificacaoEmpresa } from "../types";

export const useNotificacoesEmpresa = () => {
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

  return {
    notificacoes,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas
  };
};
