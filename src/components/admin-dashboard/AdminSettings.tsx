
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AdminSettings as AdminSettingsType } from "@/types/admin";
import { toast } from "sonner";
import { supabaseService } from "@/services/supabase";
import { openAIService } from "@/services/openai-service";
import { KeyRound, Database } from "lucide-react";

interface AdminSettingsProps {
  settings: AdminSettingsType;
  onSaveSettings: (settings: AdminSettingsType) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState<AdminSettingsType>(settings);
  const [testingOpenAI, setTestingOpenAI] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  
  const handleChange = (key: keyof AdminSettingsType, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    // Salva as configurações do OpenAI e Supabase nos seus respectivos serviços
    if (localSettings.openAIApiKey) {
      openAIService.setApiKey(localSettings.openAIApiKey);
    }
    
    if (localSettings.supabaseApiKey && localSettings.supabaseUrl) {
      supabaseService.setApiKey(localSettings.supabaseApiKey);
      supabaseService.setUrl(localSettings.supabaseUrl);
    }
    
    onSaveSettings(localSettings);
    toast.success("Configurações salvas com sucesso!");
  };
  
  const testOpenAIConnection = async () => {
    if (!localSettings.openAIApiKey) {
      toast.error("Por favor, insira uma chave API para a OpenAI");
      return;
    }
    
    setTestingOpenAI(true);
    try {
      // Primeiro salva a chave temporariamente para o teste
      openAIService.setApiKey(localSettings.openAIApiKey);
      
      const response = await openAIService.generateText("Teste de conexão. Responda apenas com 'Conexão bem-sucedida'.");
      if (response.includes("Conexão bem-sucedida")) {
        toast.success("Conexão com a API da OpenAI estabelecida com sucesso!");
      } else {
        toast.warning("Resposta recebida, mas não foi a esperada. Verifique a chave.");
      }
    } catch (error) {
      console.error("Erro ao testar OpenAI:", error);
      toast.error("Falha ao conectar com a API da OpenAI");
    } finally {
      setTestingOpenAI(false);
    }
  };
  
  const testSupabaseConnection = async () => {
    if (!localSettings.supabaseApiKey || !localSettings.supabaseUrl) {
      toast.error("Por favor, insira a URL e a chave API do Supabase");
      return;
    }
    
    setTestingSupabase(true);
    try {
      // Primeiro salva as configurações temporariamente para o teste
      supabaseService.setApiKey(localSettings.supabaseApiKey);
      supabaseService.setUrl(localSettings.supabaseUrl);
      
      const success = await supabaseService.testConnection();
      if (success) {
        toast.success("Conexão com o Supabase estabelecida com sucesso!");
      } else {
        toast.error("Não foi possível conectar ao Supabase. Verifique as credenciais.");
      }
    } catch (error) {
      console.error("Erro ao testar Supabase:", error);
      toast.error("Falha ao conectar com o Supabase");
    } finally {
      setTestingSupabase(false);
    }
  };
  
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Configure as opções gerais da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir contas trial</Label>
                <p className="text-sm text-muted-foreground">
                  Habilita o registro de novas contas em período de avaliação
                </p>
              </div>
              <Switch 
                checked={localSettings.allowTrialAccounts}
                onCheckedChange={(checked) => handleChange('allowTrialAccounts', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="trial-days">Duração do trial (dias)</Label>
              <Input 
                id="trial-days" 
                type="number" 
                value={localSettings.trialDurationDays} 
                onChange={(e) => handleChange('trialDurationDays', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="token-limit">Limite padrão de tokens</Label>
              <Input 
                id="token-limit" 
                type="number" 
                value={localSettings.defaultTokenLimit} 
                onChange={(e) => handleChange('defaultTokenLimit', Number(e.target.value))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Salvar configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="api" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de API</CardTitle>
            <CardDescription>
              Configure as chaves de API utilizadas pela plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OpenAI API Config */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">OpenAI API</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openai-key">Chave da API OpenAI</Label>
                <Input 
                  id="openai-key" 
                  type="password" 
                  value={localSettings.openAIApiKey || ""} 
                  onChange={(e) => handleChange('openAIApiKey', e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Utilizada para todas as funcionalidades de IA da plataforma
                </p>
                
                <div className="mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={testOpenAIConnection}
                    disabled={testingOpenAI || !localSettings.openAIApiKey}
                  >
                    {testingOpenAI ? "Testando..." : "Testar Conexão"}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Supabase API Config */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Supabase</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supabase-url">URL do Supabase</Label>
                <Input 
                  id="supabase-url" 
                  type="text" 
                  value={localSettings.supabaseUrl || ""} 
                  onChange={(e) => handleChange('supabaseUrl', e.target.value)}
                  placeholder="https://[seu-projeto].supabase.co"
                />
                
                <Label htmlFor="supabase-key">Chave API do Supabase</Label>
                <Input 
                  id="supabase-key" 
                  type="password" 
                  value={localSettings.supabaseApiKey || ""} 
                  onChange={(e) => handleChange('supabaseApiKey', e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Utilize a chave <strong>anon public</strong> para autenticação e acesso ao banco de dados
                </p>
                
                <div className="mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={testSupabaseConnection}
                    disabled={testingSupabase || !localSettings.supabaseApiKey || !localSettings.supabaseUrl}
                  >
                    {testingSupabase ? "Testando..." : "Testar Conexão"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Salvar configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Email</CardTitle>
            <CardDescription>
              Configure as opções de email do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="system-email">Email do sistema</Label>
              <Input 
                id="system-email" 
                type="email" 
                value={localSettings.systemEmailAddress || ""} 
                onChange={(e) => handleChange('systemEmailAddress', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email utilizado para enviar notificações do sistema
              </p>
            </div>
            
            {/* Outros campos de email podem ser adicionados aqui */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Salvar configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminSettings;
