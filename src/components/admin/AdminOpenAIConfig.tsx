
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield, Check, X } from "lucide-react";
import { toast } from "sonner";
import { openAIService } from "@/services/openai-service";

const AdminOpenAIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "failed">("unknown");
  
  // Carrega a chave da API ao montar o componente
  useEffect(() => {
    const savedKey = openAIService.getApiKey() || "";
    setApiKey(savedKey);
  }, []);

  const salvarApiKey = () => {
    try {
      if (apiKey.trim()) {
        openAIService.setApiKey(apiKey);
        setConnectionStatus("unknown");
        toast.success("Chave da API salva com sucesso!");
      } else {
        toast.error("Por favor, insira uma chave API válida.");
      }
    } catch (error) {
      console.error("Erro ao salvar a chave API:", error);
      toast.error("Erro ao salvar a chave API.");
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
        </CardTitle>
        <CardDescription>
          Configure aqui a chave da API da OpenAI que será usada por todos os clientes do SaaS
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
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button onClick={salvarApiKey}>
          <Shield className="mr-2 h-4 w-4" />
          Salvar Chave da API
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
