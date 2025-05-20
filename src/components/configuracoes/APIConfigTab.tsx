
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, Sparkles, Save } from "lucide-react";
import { openAIService } from "@/services/openai-service";

const APIConfigTab: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const apiForm = useForm({
    defaultValues: {
      openaiApiKey: ""
    }
  });
  
  // Carregar a chave da API existente
  useEffect(() => {
    const savedApiKey = openAIService.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
      apiForm.setValue("openaiApiKey", savedApiKey);
    }
  }, []);
  
  const salvarChaveAPI = (data: { openaiApiKey: string }) => {
    openAIService.setApiKey(data.openaiApiKey);
    setApiKey(data.openaiApiKey);
    toast.success("Chave da API salva com sucesso!");
  };
  
  const testarConexaoAPI = async () => {
    setIsTesting(true);
    try {
      const resultado = await openAIService.generateText("Teste de conexão. Responda apenas com 'Conexão bem-sucedida'.");
      if (resultado.includes("Conexão bem-sucedida")) {
        toast.success("Conexão com a API da OpenAI estabelecida com sucesso!");
      } else {
        toast.error("Teste concluído, mas a resposta não foi a esperada.");
      }
    } catch (error) {
      toast.error("Falha ao conectar com a API da OpenAI");
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>OpenAI API</CardTitle>
            </div>
            {apiKey && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Configurada
              </Badge>
            )}
          </div>
          <CardDescription>
            Configure sua chave da API da OpenAI para utilizar os recursos de inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...apiForm}>
            <form onSubmit={apiForm.handleSubmit(salvarChaveAPI)} className="space-y-4">
              <FormField
                control={apiForm.control}
                name="openaiApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave da API da OpenAI</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="sk-..." 
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Chave
                </Button>
                {apiKey && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={testarConexaoAPI}
                    disabled={isTesting}
                  >
                    {isTesting ? "Testando..." : "Testar Conexão"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
          
          {!apiKey && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                É necessário configurar a chave da API para utilizar recursos como assistente IA,
                feedback personalizado e sugestão de hábitos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Outras Integrações</CardTitle>
          <CardDescription>
            Configure integrações com outras ferramentas e serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">CRM Externo</div>
              <div className="text-sm text-muted-foreground">
                Conecte-se ao seu CRM para sincronização de dados
              </div>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="font-medium">Calendário</div>
              <div className="text-sm text-muted-foreground">
                Sincronize com Google Calendar ou Outlook
              </div>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIConfigTab;
