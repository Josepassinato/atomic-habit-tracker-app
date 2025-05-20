
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Integracao = {
  id: number;
  nome: string;
  conectado: boolean;
  integracoes: string[];
  apiUrl?: string;
  apiKey?: string;
};

const integracoes: Integracao[] = [
  {
    id: 1,
    nome: "HubSpot",
    conectado: true,
    integracoes: ["Contatos", "Negócios", "Atividades"],
    apiUrl: "https://api.hubspot.com",
    apiKey: "demo-key-hubspot"
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
    apiUrl: "https://api.whatsapp.com",
    apiKey: "demo-key-whatsapp"
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
  const [crmList, setCrmList] = useState<Integracao[]>(integracoes);
  const [selectedCrm, setSelectedCrm] = useState<Integracao | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConfigClick = (integracao: Integracao) => {
    if (integracao.conectado) {
      // Abrir diálogo com dados pré-preenchidos
      setSelectedCrm(integracao);
      setApiUrl(integracao.apiUrl || "");
      setApiKey(integracao.apiKey || "");
      setIsDialogOpen(true);
    } else {
      // Abrir diálogo para nova conexão
      setSelectedCrm(integracao);
      setApiUrl("");
      setApiKey("");
      setIsDialogOpen(true);
    }
  };

  const handleSaveConfig = () => {
    if (!selectedCrm) return;
    
    setIsConnecting(true);
    
    // Simulando uma chamada API
    setTimeout(() => {
      const updatedList = crmList.map(item => {
        if (item.id === selectedCrm.id) {
          return {
            ...item,
            conectado: true,
            apiUrl,
            apiKey
          };
        }
        return item;
      });
      
      setCrmList(updatedList);
      setIsConnecting(false);
      setIsDialogOpen(false);
      
      toast.success(`Integração com ${selectedCrm.nome} ${selectedCrm.conectado ? 'atualizada' : 'conectada'} com sucesso!`);
    }, 1500);
  };

  const handleDisconnect = () => {
    if (!selectedCrm) return;
    
    setIsConnecting(true);
    
    // Simulando uma chamada API
    setTimeout(() => {
      const updatedList = crmList.map(item => {
        if (item.id === selectedCrm.id) {
          return {
            ...item,
            conectado: false,
            apiUrl: undefined,
            apiKey: undefined
          };
        }
        return item;
      });
      
      setCrmList(updatedList);
      setIsConnecting(false);
      setIsDialogOpen(false);
      
      toast.success(`Integração com ${selectedCrm.nome} desconectada com sucesso!`);
    }, 1000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>Conecte seu CRM e ferramentas de comunicação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {crmList.map((integracao) => (
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
                <Button 
                  variant={integracao.conectado ? "outline" : "default"} 
                  size="sm"
                  onClick={() => handleConfigClick(integracao)}
                >
                  {integracao.conectado ? "Configurar" : "Conectar"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              {selectedCrm?.conectado ? `Configurar ${selectedCrm?.nome}` : `Conectar com ${selectedCrm?.nome}`}
            </DialogTitle>
            <DialogDescription>
              {selectedCrm?.conectado 
                ? "Atualize as configurações da sua integração" 
                : "Configure a integração para sincronizar dados"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="api-url">URL da API</Label>
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.exemplo.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="api-key">Chave da API</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua chave API secreta"
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedCrm?.conectado && (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={isConnecting}
              >
                Desconectar
              </Button>
            )}
            <Button
              onClick={handleSaveConfig}
              disabled={!apiUrl || !apiKey || isConnecting}
            >
              {isConnecting ? "Processando..." : selectedCrm?.conectado ? "Atualizar" : "Conectar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegracoesCRM;
