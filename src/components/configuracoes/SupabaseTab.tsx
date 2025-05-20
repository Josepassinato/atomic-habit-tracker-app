import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";
import { supabaseService } from "@/services/supabase";

const SupabaseTab = () => {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isConfigured, loading } = useSupabase();
  
  useEffect(() => {
    if (isConfigured) {
      setUrl(supabaseService.getUrl() || "");
      setApiKey(supabaseService.getApiKey() || "");
    }
  }, [isConfigured]);
  
  const handleConnect = async () => {
    if (!url || !apiKey) {
      toast.error("URL e chave API são obrigatórios");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Configura o Supabase
      supabaseService.setUrl(url);
      supabaseService.setApiKey(apiKey);
      
      // Testa a conexão
      const success = await supabaseService.testConnection();
      
      if (success) {
        toast.success("Conectado ao Supabase com sucesso!");
        
        // Atualiza o localStorage para que a conexão persista
        localStorage.setItem('supabase_url', url);
        localStorage.setItem('supabase_key', apiKey);
        
        // Tenta sincronizar dados imediatamente
        syncData();
      } else {
        toast.error("Falha ao conectar com o Supabase. Verifique as credenciais.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao Supabase:", error);
      toast.error("Erro ao conectar ao Supabase. Verifique o console para detalhes.");
    } finally {
      setIsConnecting(false);
    }
  };
  
  const syncData = async () => {
    if (!isConfigured) {
      toast.error("Configure o Supabase antes de sincronizar dados");
      return;
    }
    
    setIsSyncing(true);
    
    try {
      toast.loading("Sincronizando dados com o Supabase...");
      
      const success = await supabaseService.syncAllDataToSupabase();
      
      toast.dismiss();
      if (success) {
        toast.success("Dados sincronizados com sucesso!");
      } else {
        toast.warning("Alguns dados não foram sincronizados completamente");
      }
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      toast.dismiss();
      toast.error("Erro ao sincronizar dados com o Supabase");
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuração do Supabase</CardTitle>
            <CardDescription>
              Configure a conexão com o Supabase para sincronizar seus dados na nuvem
            </CardDescription>
          </div>
          {isConfigured && (
            <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
              <Database className="h-3 w-3" />
              Conectado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supabase-url">URL do Supabase</Label>
          <Input
            id="supabase-url"
            placeholder="https://seu-projeto.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supabase-key">Chave API do Supabase</Label>
          <Input
            id="supabase-key"
            type="password"
            placeholder="sua-chave-supabase"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Esta deve ser a chave anônima (public) do seu projeto Supabase
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <Button
          className="w-full sm:w-auto"
          onClick={handleConnect}
          disabled={isConnecting || (!url || !apiKey)}
        >
          {isConnecting ? "Conectando..." : isConfigured ? "Atualizar Conexão" : "Conectar"}
        </Button>
        
        {isConfigured && (
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={syncData}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SupabaseTab;
