
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";

const NotificationsTab: React.FC = () => {
  const notificacoesForm = useForm({
    defaultValues: {
      emailNotificacoes: true,
      lembretesDiarios: true,
      atualizacoesSemanais: true
    }
  });
  
  const salvarNotificacoes = (data: any) => {
    // Aqui você implementaria a lógica para salvar as preferências de notificação
    toast.success("Preferências de notificação salvas com sucesso!");
    console.log("Preferências de notificação:", data);
  };
  
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default NotificationsTab;
