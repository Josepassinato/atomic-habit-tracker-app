
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield } from "lucide-react";
import { toast } from "sonner";
import { openAIService } from "@/services/openai-service";

const AdminOpenAIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("admin-openai-api-key") || "";
  });

  const salvarApiKey = () => {
    try {
      if (apiKey.trim()) {
        localStorage.setItem("admin-openai-api-key", apiKey);
        openAIService.setApiKey(apiKey);
        toast.success("Chave da API salva com sucesso!");
      } else {
        toast.error("Por favor, insira uma chave API válida.");
      }
    } catch (error) {
      console.error("Erro ao salvar a chave API:", error);
      toast.error("Erro ao salvar a chave API.");
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
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={salvarApiKey} className="w-full">
          <Shield className="mr-2 h-4 w-4" />
          Salvar Chave da API
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminOpenAIConfig;
