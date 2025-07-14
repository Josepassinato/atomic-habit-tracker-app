
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Shield, Check, X, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AIService } from "@/services/ai-service";

const AdminOpenAIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "failed">("unknown");
  const [isConfigured, setIsConfigured] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
  
  // Carrega a chave da API ao montar o componente
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('openai_api_key')
          .single();
          
        if (data?.openai_api_key) {
          setApiKey('••••••••••••••••••••••••••••••••••••••••'); // Mascarar para segurança
          setIsConfigured(true);
        }
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    };
    
    loadApiKey();
  }, []);

  const salvarApiKey = async () => {
    if (!apiKey.trim() || apiKey.includes('••••')) {
      toast.error("Por favor, insira uma chave API válida.");
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          openai_api_key: apiKey,
          updated_at: new Date().toISOString()
        });
      
      if (!error) {
        setConnectionStatus("unknown");
        setIsConfigured(true);
        setApiKey('••••••••••••••••••••••••••••••••••••••••'); // Mascarar depois de salvar
        toast.success("Chave da API salva com sucesso!");
        
        // Dispara um evento personalizado para notificar outros componentes
        window.dispatchEvent(new CustomEvent('openai-key-updated'));
      } else {
        toast.error("Erro ao salvar a chave API.");
        console.error(error);
      }
    } catch (error) {
      console.error("Erro ao salvar a chave API:", error);
      toast.error("Erro ao salvar a chave API.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const testarConexao = async (retryAttempt = 0) => {
    if (!isConfigured) {
      toast.error("Por favor, configure a chave API primeiro.");
      return;
    }
    
    setIsTesting(true);
    const maxRetries = 3;
    
    try {
      // Test connection through AI service with performance monitoring
      const startTime = performance.now();
      
      const response = await AIService.consultWithAI({
        message: "Test connection for admin panel",
        consultationType: 'general'
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (response) {
        toast.success(`✅ Conexão estabelecida! Tempo de resposta: ${responseTime.toFixed(0)}ms`);
        setConnectionStatus("success");
        setLastTestTime(new Date());
        setRetryCount(0);
        
        // Log performance metrics
        console.log(`OpenAI API Test - Response time: ${responseTime}ms`);
      } else {
        throw new Error("No response from AI service");
      }
    } catch (error) {
      console.error(`AI connection test failed (attempt ${retryAttempt + 1}):`, error);
      
      if (retryAttempt < maxRetries) {
        setRetryCount(retryAttempt + 1);
        toast.info(`Tentativa ${retryAttempt + 1}/${maxRetries} falhou. Tentando novamente...`);
        setTimeout(() => testarConexao(retryAttempt + 1), 1000 * (retryAttempt + 1));
        return;
      }
      
      toast.error("❌ Falha ao conectar após várias tentativas");
      setConnectionStatus("failed");
      setRetryCount(0);
    } finally {
      if (retryAttempt === 0) {
        setIsTesting(false);
      }
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
                  <span>
                    Conectado com sucesso à API
                    {lastTestTime && (
                      <span className="block text-xs opacity-75">
                        Último teste: {lastTestTime.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  <span>Falha na conexão</span>
                  {retryCount > 0 && (
                    <span className="block text-xs opacity-75">
                      Tentando novamente... ({retryCount}/3)
                    </span>
                  )}
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
          onClick={() => testarConexao()}
          disabled={isTesting || !apiKey}
        >
          {isTesting ? (
            retryCount > 0 ? `Tentando (${retryCount}/3)...` : "Testando..."
          ) : (
            "Testar Conexão"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminOpenAIConfig;
