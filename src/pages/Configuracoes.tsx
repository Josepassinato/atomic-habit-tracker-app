
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, Sparkles, Bell, Shield, Save } from "lucide-react";
import { openAIService } from "@/services/openai-service";

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState("api");
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const apiForm = useForm({
    defaultValues: {
      openaiApiKey: ""
    }
  });
  
  const notificacoesForm = useForm({
    defaultValues: {
      emailNotificacoes: true,
      lembretesDiarios: true,
      atualizacoesSemanais: true
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
  
  const salvarNotificacoes = (data: any) => {
    // Aqui você implementaria a lógica para salvar as preferências de notificação
    toast.success("Preferências de notificação salvas com sucesso!");
    console.log("Preferências de notificação:", data);
  };
  
  return (
    <>
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Configurações</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <KeyRound size={16} />
              <span>APIs e Integrações</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="privacidade" className="flex items-center gap-2">
              <Shield size={16} />
              <span>Privacidade</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="notificacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificacoesForm}>
                  <form onSubmit={notificacoesForm.handleSubmit(salvarNotificacoes)} className="space-y-6">
                    <FormField
                      control={notificacoesForm.control}
                      name="emailNotificacoes"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações por Email</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Receba atualizações importantes por email
                            </div>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificacoesForm.control}
                      name="lembretesDiarios"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Lembretes Diários</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Receba lembretes sobre seus hábitos diários
                            </div>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificacoesForm.control}
                      name="atualizacoesSemanais"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Relatório Semanal</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Receba um resumo semanal de sua performance
                            </div>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Preferências
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacidade" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Gerencie suas preferências de privacidade e segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="font-medium">Compartilhamento de Dados</div>
                      <div className="text-sm text-muted-foreground">
                        Controle quais dados são compartilhados para análise
                      </div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="font-medium">Histórico de Atividades</div>
                      <div className="text-sm text-muted-foreground">
                        Manter histórico de suas atividades e interações
                      </div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                
                  <Separator className="my-4" />
                
                  <div className="space-y-2">
                    <h3 className="font-medium">Segurança da Conta</h3>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        Alterar Senha
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Verificação em Duas Etapas
                      </Button>
                      <Button variant="outline" className="justify-start text-destructive hover:bg-destructive/10">
                        Excluir Conta
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - O futuro da automação de vendas e performance
        </div>
      </footer>
    </>
  );
};

export default Configuracoes;
