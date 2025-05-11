
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const integracoes = [
  {
    id: 1,
    nome: "HubSpot",
    conectado: true,
    integracoes: ["Contatos", "Negócios", "Atividades"],
  },
  {
    id: 2,
    nome: "Pipedrive",
    conectado: false,
    integracoes: ["Contatos", "Negócios", "Atividades"],
  },
  {
    id: 3,
    nome: "WhatsApp",
    conectado: true,
    integracoes: ["Mensagens", "Notificações"],
  },
  {
    id: 4,
    nome: "Slack",
    conectado: false,
    integracoes: ["Mensagens", "Notificações"],
  },
  {
    id: 5,
    nome: "Zapier",
    conectado: false,
    integracoes: ["Automações Personalizadas"],
  },
];

const IntegracoesCRM = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
        <CardDescription>Conecte seu CRM e ferramentas de comunicação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {integracoes.map((integracao) => (
            <div key={integracao.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{integracao.nome}</h4>
                  {integracao.conectado && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Check className="h-3 w-3" /> Conectado
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {integracao.integracoes.join(", ")}
                </p>
              </div>
              <Button variant={integracao.conectado ? "outline" : "default"} size="sm">
                {integracao.conectado ? "Configurar" : "Conectar"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegracoesCRM;
