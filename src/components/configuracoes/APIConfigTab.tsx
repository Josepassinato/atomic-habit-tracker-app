
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import { useLanguage } from "@/i18n";
import { AIService } from "@/services/ai-service";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const APIConfigTab: React.FC = () => {
  const { t } = useLanguage();
  const [isOpenAIConfigured, setIsOpenAIConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "failed">("unknown");
  
  // Check OpenAI configuration with performance monitoring
  const checkOpenAIConfiguration = async () => {
    setIsLoading(true);
    try {
      // Use the new AIService to check configuration
      const testResult = await AIService.consultWithAI({
        message: "Test connection",
        consultationType: 'general'
      });
      setIsOpenAIConfigured(!!testResult);
      setConnectionStatus("success");
    } catch (error) {
      console.error("Error checking OpenAI configuration:", error);
      setIsOpenAIConfigured(false);
      setConnectionStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOpenAIConfiguration();
    
    // Listen for OpenAI key updates
    const handleKeyUpdate = () => {
      checkOpenAIConfiguration();
    };
    
    window.addEventListener('openai-key-updated', handleKeyUpdate);
    return () => window.removeEventListener('openai-key-updated', handleKeyUpdate);
  }, []);

  const testAIConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await AIService.consultWithAI({
        message: "Hello, this is a connection test",
        consultationType: 'general'
      });
      
      if (result) {
        toast.success("✅ Conexão com IA estabelecida com sucesso!");
        setConnectionStatus("success");
      } else {
        toast.error("❌ Falha na conexão com IA");
        setConnectionStatus("failed");
      }
    } catch (error) {
      console.error("AI connection test failed:", error);
      toast.error("❌ Erro ao testar conexão com IA");
      setConnectionStatus("failed");
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <IntegracoesCRM />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recursos de IA
            {isOpenAIConfigured ? (
              <Badge variant="default" className="bg-green-600 flex items-center gap-1">
                <Check size={12} />
                Configurada
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <X size={12} />
                Não Configurada
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Status das funcionalidades de IA disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Verificando configuração da IA...</span>
            </div>
          ) : (
            <>
              <div className={`p-4 border rounded-md ${isOpenAIConfigured ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <p className={`text-sm ${isOpenAIConfigured ? 'text-green-800' : 'text-amber-800'}`}>
                  {isOpenAIConfigured 
                    ? "✅ A API da OpenAI está configurada e operacional. Todas as funcionalidades de IA estão disponíveis."
                    : "⚠️ A API da OpenAI precisa ser configurada pelo administrador do sistema para habilitar as funcionalidades de IA."
                  }
                </p>
              </div>
              
              {isOpenAIConfigured && (
                <div className="flex gap-2">
                  <Button 
                    onClick={testAIConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isTestingConnection ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      "Testar Conexão IA"
                    )}
                  </Button>
                  
                  {connectionStatus === "success" && (
                    <Badge variant="default" className="bg-green-600 flex items-center gap-1">
                      <Check size={12} />
                      Operacional
                    </Badge>
                  )}
                  
                  {connectionStatus === "failed" && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <X size={12} />
                      Falha na Conexão
                    </Badge>
                  )}
                </div>
              )}
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-sm mb-1">Consultoria de IA</h4>
              <p className="text-xs text-muted-foreground">
                Chat inteligente para orientações sobre vendas e hábitos
              </p>
              <Badge variant={isOpenAIConfigured ? "default" : "secondary"} className="mt-2 text-xs">
                {isOpenAIConfigured ? "Disponível" : "Indisponível"}
              </Badge>
            </div>
            
            <div className="p-3 border rounded-md">
              <h4 className="font-medium text-sm mb-1">Feedback de Hábitos</h4>
              <p className="text-xs text-muted-foreground">
                Análise automática e sugestões personalizadas
              </p>
              <Badge variant={isOpenAIConfigured ? "default" : "secondary"} className="mt-2 text-xs">
                {isOpenAIConfigured ? "Disponível" : "Indisponível"}
              </Badge>
            </div>
          </div>
          
          {!isOpenAIConfigured && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Para Administradores:</strong> Configure a chave da API da OpenAI no painel administrativo para habilitar todas as funcionalidades de IA para todos os usuários do sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default APIConfigTab;
