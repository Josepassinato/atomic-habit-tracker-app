
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/hooks/use-supabase";

type Integracao = {
  id: number;
  nome: string;
  conectado: boolean;
  integracoes: string[];
  apiUrl?: string;
  apiKey?: string;
};

const integracoesIniciais: Integracao[] = [
  {
    id: 1,
    nome: "HubSpot",
    conectado: false,
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
    conectado: false,
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
  const [crmList, setCrmList] = useState<Integracao[]>([]);
  const [selectedCrm, setSelectedCrm] = useState<Integracao | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { supabase } = useSupabase();
  
  useEffect(() => {
    fetchIntegracoes();
  }, []);
  
  const fetchIntegracoes = async () => {
    setIsLoading(true);
    
    try {
      if (supabase) {
        // Tenta buscar do Supabase
        const { data, error } = await supabase
          .from('integracoes')
          .select('*');
          
        if (error) {
          console.error("Erro ao buscar integrações:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setCrmList(data);
        } else {
          // Se não houver dados no Supabase, inicializa com as integrações padrão
          if (supabase) {
            // Insere as integrações iniciais no Supabase
            await supabase.from('integracoes').upsert(
              integracoesIniciais.map(item => ({
                ...item,
                empresa_id: 'current' // Em um sistema real, usaríamos o ID da empresa do usuário
              }))
            );
          }
          setCrmList(integracoesIniciais);
        }
      } else {
        // Fallback para localStorage se não tiver Supabase
        const savedIntegracoes = localStorage.getItem('integracoes_crm');
        if (savedIntegracoes) {
          setCrmList(JSON.parse(savedIntegracoes));
        } else {
          setCrmList(integracoesIniciais);
          localStorage.setItem('integracoes_crm', JSON.stringify(integracoesIniciais));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
      // Fallback para dados iniciais
      setCrmList(integracoesIniciais);
      toast.error("Não foi possível carregar as integrações. Usando dados locais.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSaveConfig = async () => {
    if (!selectedCrm) return;
    
    setIsConnecting(true);
    
    try {
      const updatedItem = {
        ...selectedCrm,
        conectado: true,
        apiUrl,
        apiKey
      };
      
      const updatedList = crmList.map(item => 
        item.id === selectedCrm.id ? updatedItem : item
      );
      
      if (supabase) {
        // Salvar no Supabase
        const { error } = await supabase
          .from('integracoes')
          .upsert({
            id: selectedCrm.id,
            nome: selectedCrm.nome,
            conectado: true,
            integracoes: selectedCrm.integracoes,
            apiUrl,
            apiKey,
            empresa_id: 'current' // Em um sistema real, usaríamos o ID da empresa do usuário
          });
          
        if (error) {
          console.error("Erro ao salvar integração:", error);
          throw error;
        }
      } else {
        // Fallback para localStorage
        localStorage.setItem('integracoes_crm', JSON.stringify(updatedList));
      }
      
      setCrmList(updatedList);
      setIsDialogOpen(false);
      toast.success(`Integração com ${selectedCrm.nome} ${selectedCrm.conectado ? 'atualizada' : 'conectada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error(`Erro ao configurar a integração com ${selectedCrm.nome}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedCrm) return;
    
    setIsConnecting(true);
    
    try {
      const updatedItem = {
        ...selectedCrm,
        conectado: false,
        apiUrl: undefined,
        apiKey: undefined
      };
      
      const updatedList = crmList.map(item => 
        item.id === selectedCrm.id ? updatedItem : item
      );
      
      if (supabase) {
        // Atualizar no Supabase
        const { error } = await supabase
          .from('integracoes')
          .update({
            conectado: false,
            apiUrl: null,
            apiKey: null
          })
          .eq('id', selectedCrm.id);
          
        if (error) {
          console.error("Erro ao desconectar integração:", error);
          throw error;
        }
      } else {
        // Fallback para localStorage
        localStorage.setItem('integracoes_crm', JSON.stringify(updatedList));
      }
      
      setCrmList(updatedList);
      setIsDialogOpen(false);
      toast.success(`Integração com ${selectedCrm.nome} desconectada com sucesso!`);
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast.error(`Erro ao desconectar a integração com ${selectedCrm.nome}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>Conecte seu CRM e ferramentas de comunicação</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-sm text-muted-foreground">Carregando integrações...</p>
            </div>
          ) : (
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
          )}
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
