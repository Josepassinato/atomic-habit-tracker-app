
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

interface AdminSettingsProps {
  settings: AdminSettingsType;
  onSaveSettings: (settings: AdminSettingsType) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState<AdminSettingsType>(settings);
  
  const handleChange = (key: keyof AdminSettingsType, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    onSaveSettings(localSettings);
    toast.success("Configurações salvas com sucesso!");
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
            <div>
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
            </div>
            
            {/* Outros campos de API podem ser adicionados aqui */}
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
