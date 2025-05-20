
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const PrivacyTab: React.FC = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default PrivacyTab;
