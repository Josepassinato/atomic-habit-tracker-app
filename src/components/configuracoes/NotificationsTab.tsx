
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useLanguage } from "@/i18n";

const NotificationsTab: React.FC = () => {
  const { t } = useLanguage();
  
  const notificacoesForm = useForm({
    defaultValues: {
      emailNotificacoes: true,
      lembretesDiarios: true,
      atualizacoesSemanais: true
    }
  });
  
  const salvarNotificacoes = (data: any) => {
    toast.success(t('notificationPreferencesSaved'));
    console.log("Notification preferences:", data);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('notificationPreferences')}</CardTitle>
          <CardDescription>
            {t('configureNotifications')}
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
                      <FormLabel className="text-base">{t('emailNotifications')}</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('receiveImportantUpdates')}
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
                      <FormLabel className="text-base">{t('dailyReminders')}</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('receiveDailyHabitsReminders')}
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
                      <FormLabel className="text-base">{t('weeklyReport')}</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {t('receiveWeeklyPerformance')}
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
                {t('savePreferences')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
