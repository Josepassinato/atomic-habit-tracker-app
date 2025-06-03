
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Shield, Check, X, Database } from "lucide-react";
import { toast } from "sonner";
import { openAIService } from "@/services/openai-service";

const AdminOpenAIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "failed">("unknown");
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Carrega a chave da API ao montar o componente
  useEffect(() => {
    const loadApiKey = async () => {
      const savedKey = await openAIService.getApiKey();
      if (savedKey) {
        setApiKey(savedKey);
        setIsConfigured(true);
      }
    };
    
    loadApiKey();
  }, []);

  const salvarApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, insira uma chave API válida.");
      return;
    }

    setIsSaving(true);
    
    try {
      const success = await openAIService.setApiKey(apiKey);
      
      if (success) {
        setConnectionStatus("unknown");
        setIsConfigured(true);
        toast.success("Chave da API salva com sucesso no banco de dados!");
        
        // Dispara um evento personalizado para notificar outros componentes
        window.dispatchEvent(new CustomEvent('openai-key-updated'));
      } else {
        toast.error("Erro ao salvar a chave API no banco de dados.");
      }
    } catch (error) {
      console.error("Erro ao salvar a chave API:", error);
      toast.error("Erro ao salvar a chave API.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const testarConexao = async () => {
    if (!apiKey) {
      toast.error("Por favor, insira uma chave API válida.");
      return;
    }
    
    setIsTesting(true);
    
    try {
      const resultado = await openAIService.testConnection();
      
      if (resultado) {
        toast.success("Conexão com a API da OpenAI estabelecida com sucesso!");
        setConnectionStatus("success");
      } else {
        toast.error("Falha ao conectar com a API da OpenAI");
        setConnectionStatus("failed");
      }
    } catch (error) {
      toast.error("Erro ao testar conexão com a API da OpenAI");
      setConnectionStatus("failed");
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuração da API OpenAI
          <Database className="h-4 w-4 text-green-600" />
          {isConfigured && (
            <Badge variant="default" className="bg-green-600 flex items-center gap-1 ml-2">
              <Check size={12} />
              Configurada
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Configure aqui a chave da API da OpenAI que será usada por todos os clientes do SaaS.
          A chave é armazenada de forma segura no banco de dados Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Esta chave será usada para todas as solicitações de IA dos clientes do SaaS.
            Os tokens consumidos serão contabilizados por empresa.
          </p>
          
          {connectionStatus !== "unknown" && (
            <div className={`mt-2 p-2 rounded-md text-sm flex items-center gap-2 
              ${connectionStatus === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {connectionStatus === "success" ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Conectado com sucesso à API</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  <span>Falha na conexão</span>
                </>
              )}
            </div>
          )}
          
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 text-blue-700">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Armazenamento Seguro</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              A chave da API é armazenada de forma segura no banco de dados Supabase e não será perdida entre sessões.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button onClick={salvarApiKey} disabled={isSaving}>
          <Shield className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Chave da API"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={testarConexao}
          disabled={isTesting || !apiKey}
        >
          {isTesting ? "Testando..." : "Testar Conexão"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminOpenAIConfig;
