
import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { PlansConfiguration, PlanLimits, PlanFeatures } from "@/types/admin";
import { plansLimitService } from "@/services/plans-service";
import { toast } from "sonner";

const AdminPlans = () => {
  const [plansConfig, setPlansConfig] = useState<PlansConfiguration>(
    plansLimitService.getPlansConfig()
  );

  const handleSavePlan = (planKey: keyof PlansConfiguration) => {
    plansLimitService.savePlansConfig(plansConfig);
    toast.success(`Plano ${planKey} atualizado com sucesso!`);
  };

  const handleInputChange = (
    planKey: keyof PlansConfiguration,
    field: string,
    value: number | boolean
  ) => {
    if (field.includes('.')) {
      // Para campos aninhados como "features.aiConsulting"
      const [parentField, childField] = field.split('.');
      setPlansConfig((prev) => {
        const updatedConfig = { ...prev };
        if (parentField === 'features') {
          updatedConfig[planKey] = {
            ...updatedConfig[planKey],
            features: {
              ...updatedConfig[planKey].features,
              [childField]: value
            }
          };
        }
        return updatedConfig;
      });
    } else {
      // Para campos simples como "tokensLimit"
      setPlansConfig((prev) => {
        const updatedConfig = { ...prev };
        updatedConfig[planKey] = {
          ...updatedConfig[planKey],
          [field]: value
        };
        return updatedConfig;
      });
    }
  };

  // Salvar se houver alterações ao desmontar o componente
  useEffect(() => {
    return () => {
      plansLimitService.savePlansConfig(plansConfig);
    };
  }, [plansConfig]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Starter</CardTitle>
          <CardDescription>
            Plano básico para pequenas equipes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="starter-price">Preço mensal (R$)</Label>
            <Input 
              id="starter-price" 
              value={plansConfig.starter.price} 
              onChange={(e) => handleInputChange('starter', 'price', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="starter-tokens">Limite de tokens</Label>
            <Input 
              id="starter-tokens" 
              value={plansConfig.starter.tokensLimit}
              onChange={(e) => handleInputChange('starter', 'tokensLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="starter-users">Limite de usuários</Label>
            <Input 
              id="starter-users" 
              value={plansConfig.starter.usersLimit}
              onChange={(e) => handleInputChange('starter', 'usersLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="starter-ai"
              checked={plansConfig.starter.features.aiConsulting}
              onCheckedChange={(checked) => handleInputChange('starter', 'features.aiConsulting', checked)}
            />
            <Label htmlFor="starter-ai">Consultoria IA</Label>
          </div>
          <div>
            <Label htmlFor="starter-crm">Integrações CRM</Label>
            <Input 
              id="starter-crm" 
              value={plansConfig.starter.features.crmIntegrations}
              onChange={(e) => handleInputChange('starter', 'features.crmIntegrations', parseInt(e.target.value) || 0)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleSavePlan('starter')}>Salvar alterações</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Professional</CardTitle>
          <CardDescription>
            Plano intermediário para empresas em crescimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pro-price">Preço mensal (R$)</Label>
            <Input 
              id="pro-price" 
              value={plansConfig.professional.price}
              onChange={(e) => handleInputChange('professional', 'price', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="pro-tokens">Limite de tokens</Label>
            <Input 
              id="pro-tokens" 
              value={plansConfig.professional.tokensLimit}
              onChange={(e) => handleInputChange('professional', 'tokensLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="pro-users">Limite de usuários</Label>
            <Input 
              id="pro-users" 
              value={plansConfig.professional.usersLimit}
              onChange={(e) => handleInputChange('professional', 'usersLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="pro-ai"
              checked={plansConfig.professional.features.aiConsulting}
              onCheckedChange={(checked) => handleInputChange('professional', 'features.aiConsulting', checked)}
            />
            <Label htmlFor="pro-ai">Consultoria IA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="pro-reports"
              checked={plansConfig.professional.features.advancedReports}
              onCheckedChange={(checked) => handleInputChange('professional', 'features.advancedReports', checked)}
            />
            <Label htmlFor="pro-reports">Relatórios avançados</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleSavePlan('professional')}>Salvar alterações</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Enterprise</CardTitle>
          <CardDescription>
            Plano avançado para grandes organizações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ent-price">Preço mensal (R$)</Label>
            <Input 
              id="ent-price" 
              value={plansConfig.enterprise.price}
              onChange={(e) => handleInputChange('enterprise', 'price', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="ent-tokens">Limite de tokens</Label>
            <Input 
              id="ent-tokens" 
              value={plansConfig.enterprise.tokensLimit}
              onChange={(e) => handleInputChange('enterprise', 'tokensLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="ent-users">Limite de usuários</Label>
            <Input 
              id="ent-users" 
              value={plansConfig.enterprise.usersLimit}
              onChange={(e) => handleInputChange('enterprise', 'usersLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ent-ai"
              checked={plansConfig.enterprise.features.aiConsulting}
              onCheckedChange={(checked) => handleInputChange('enterprise', 'features.aiConsulting', checked)}
            />
            <Label htmlFor="ent-ai">Consultoria IA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ent-support"
              checked={plansConfig.enterprise.features.prioritySupport}
              onCheckedChange={(checked) => handleInputChange('enterprise', 'features.prioritySupport', checked)}
            />
            <Label htmlFor="ent-support">Suporte prioritário</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ent-api"
              checked={plansConfig.enterprise.features.customApi}
              onCheckedChange={(checked) => handleInputChange('enterprise', 'features.customApi', checked)}
            />
            <Label htmlFor="ent-api">API dedicada</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleSavePlan('enterprise')}>Salvar alterações</Button>
        </CardFooter>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Configurações de Trial</CardTitle>
          <CardDescription>
            Configure as opções para contas em período de avaliação
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="trial-days">Duração (dias)</Label>
            <Input 
              id="trial-days" 
              defaultValue="14" 
            />
          </div>
          <div>
            <Label htmlFor="trial-tokens">Limite de tokens</Label>
            <Input 
              id="trial-tokens" 
              value={plansConfig.trial.tokensLimit}
              onChange={(e) => handleInputChange('trial', 'tokensLimit', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="trial-users">Limite de usuários</Label>
            <Input 
              id="trial-users" 
              value={plansConfig.trial.usersLimit}
              onChange={(e) => handleInputChange('trial', 'usersLimit', parseInt(e.target.value) || 0)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => handleSavePlan('trial')}
          >
            Salvar configurações de trial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPlans;
