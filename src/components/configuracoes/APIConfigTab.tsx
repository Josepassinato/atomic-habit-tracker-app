
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import { useLanguage } from "@/i18n";
import { openAIService } from "@/services/openai-service";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const APIConfigTab: React.FC = () => {
  const { t } = useLanguage();
  
  // Verifica se a chave da OpenAI está configurada no sistema
  const isOpenAIConfigured = !!openAIService.getApiKeySync();
  
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
          <div className={`p-4 border rounded-md ${isOpenAIConfigured ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-sm ${isOpenAIConfigured ? 'text-green-800' : 'text-amber-800'}`}>
              {isOpenAIConfigured 
                ? "✅ A API da OpenAI está configurada pelo administrador do sistema. Todas as funcionalidades de IA estão disponíveis."
                : "⚠️ A API da OpenAI precisa ser configurada pelo administrador do sistema para habilitar as funcionalidades de IA."
              }
            </p>
          </div>
          
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
