
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, Loader2, Key, Database, RefreshCw } from "lucide-react";
import { openAIService } from "@/services/openai-service";
import { toast } from "sonner";

const OpenAIStatusChecker: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "failed">("unknown");
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  // Verifica se a chave está configurada ao carregar o componente
  const checkApiKey = async () => {
    setIsRefreshing(true);
    try {
      const apiKey = await openAIService.getApiKey();
      setIsConfigured(!!apiKey);
      console.log("API Key check:", !!apiKey ? "Configurada" : "Não configurada");
    } catch (error) {
      console.error("Erro ao verificar chave da API:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkApiKey();
    
    // Verifica a cada 5 segundos se houve mudanças
    const interval = setInterval(checkApiKey, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("unknown");

    try {
      const isConnected = await openAIService.testConnection();
      
      if (isConnected) {
        setConnectionStatus("success");
        setLastTestTime(new Date());
        toast.success("Conexão com OpenAI estabelecida com sucesso!");
      } else {
        setConnectionStatus("failed");
        toast.error("Falha na conexão com a API da OpenAI");
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setConnectionStatus("failed");
      toast.error("Erro ao testar conexão com a OpenAI");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const refreshStatus = async () => {
    await checkApiKey();
    setConnectionStatus("unknown");
    toast.info("Status atualizado!");
  };

  const getStatusBadge = () => {
    if (isRefreshing) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Loader2 size={12} className="animate-spin" />
        Verificando...
      </Badge>;
    }

    if (!isConfigured) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <X size={12} />
        Não Configurada
      </Badge>;
    }

    switch (connectionStatus) {
      case "success":
        return <Badge variant="default" className="bg-green-600 flex items-center gap-1">
          <Check size={12} />
          Operacional
        </Badge>;
      case "failed":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <X size={12} />
          Falha na Conexão
        </Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle size={12} />
          Status Desconhecido
        </Badge>;
    }
  };

  const getStatusMessage = () => {
    if (isRefreshing) {
      return "Verificando configuração da chave da API...";
    }

    if (!isConfigured) {
      return "A chave da API da OpenAI não está configurada no sistema.";
    }

    switch (connectionStatus) {
      case "success":
        return `Última verificação bem-sucedida: ${lastTestTime?.toLocaleString('pt-BR')}`;
      case "failed":
        return "A chave está configurada, mas a conexão falhou. Verifique se a chave é válida.";
      default:
        return "Chave configurada no banco de dados. Clique em 'Testar Conexão' para verificar se está operacional.";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Status da OpenAI API
          <Database className="h-4 w-4 text-green-600" />
        </CardTitle>
        <CardDescription>
          Verificação do status e operacionalidade da chave da OpenAI armazenada no banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status da Configuração:</span>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            {getStatusMessage()}
          </p>
        </div>

        {isConfigured && (
          <div className="flex gap-2">
            <Button 
              onClick={testConnection}
              disabled={isTestingConnection}
              className="flex items-center gap-2"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                "Testar Conexão"
              )}
            </Button>

            {connectionStatus === "success" && (
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("✅ OpenAI API está operacional e pronta para uso!");
                }}
              >
                ✅ Sistema Operacional
              </Button>
            )}
          </div>
        )}

        {!isConfigured && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              Para configurar a chave da OpenAI, acesse a seção "Configuração da API OpenAI" acima.
            </p>
          </div>
        )}

        {isConfigured && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Armazenamento Persistente</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              A chave da API está armazenada de forma segura no banco de dados e não será perdida.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenAIStatusChecker;
