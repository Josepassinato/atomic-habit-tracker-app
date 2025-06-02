
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificacaoItem } from "./NotificacaoItem";
import { useNotificacoesEmpresa } from "./hooks/useNotificacoesEmpresa";

interface NotificacoesEmpresaProps {
  className?: string;
}

const NotificacoesEmpresa: React.FC<NotificacoesEmpresaProps> = ({ className }) => {
  const {
    notificacoes,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas
  } = useNotificacoesEmpresa();

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
                <NotificacaoItem
                  key={notificacao.id}
                  notificacao={notificacao}
                  onMarcarComoLida={marcarComoLida}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificacoesEmpresa;
