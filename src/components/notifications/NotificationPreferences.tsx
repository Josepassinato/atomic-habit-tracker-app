import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Target, Calendar, Gift, Trophy, MessageSquare, Users, TestTube } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/i18n';
import { toast } from 'sonner';

export const NotificationPreferences: React.FC = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const {
    permission,
    isSupported,
    preferences,
    loading,
    requestPermission,
    savePreferences,
    testNotification
  } = usePushNotifications(userProfile?.id);

  const handleTogglePreference = (key: keyof typeof preferences) => {
    savePreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Notificações ativadas com sucesso!');
      await testNotification();
    } else {
      toast.error('Permissão negada. Verifique as configurações do navegador.');
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações não suportadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Seu navegador não suporta notificações push. 
              Tente usar Chrome, Firefox, Safari ou Edge mais recentes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando preferências...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Preferências de Notificações
            </CardTitle>
            <CardDescription>
              Configure quando e como você quer ser notificado
            </CardDescription>
          </div>
          {permission === 'granted' ? (
            <Badge variant="default" className="bg-green-500">
              <Bell className="h-3 w-3 mr-1" />
              Ativadas
            </Badge>
          ) : (
            <Badge variant="secondary">
              <BellOff className="h-3 w-3 mr-1" />
              Desativadas
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission !== 'granted' && (
          <Alert>
            <AlertDescription className="flex items-center justify-between">
              <span>Ative as notificações para receber atualizações em tempo real</span>
              <Button onClick={handleEnableNotifications} size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Ativar Notificações
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="enabled" className="text-base font-medium">
                  Notificações gerais
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ativar/desativar todas as notificações
                </p>
              </div>
            </div>
            <Switch
              id="enabled"
              checked={preferences.enabled}
              onCheckedChange={() => handleTogglePreference('enabled')}
              disabled={permission !== 'granted'}
            />
          </div>

          {preferences.enabled && (
            <>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <Label htmlFor="goalProgress" className="text-base font-medium">
                      Progresso de metas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando próximo de alcançar uma meta
                    </p>
                  </div>
                </div>
                <Switch
                  id="goalProgress"
                  checked={preferences.goalProgress}
                  onCheckedChange={() => handleTogglePreference('goalProgress')}
                  disabled={permission !== 'granted'}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div>
                    <Label htmlFor="habitReminders" className="text-base font-medium">
                      Lembretes de hábitos
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lembrar de completar hábitos diários
                    </p>
                  </div>
                </div>
                <Switch
                  id="habitReminders"
                  checked={preferences.habitReminders}
                  onCheckedChange={() => handleTogglePreference('habitReminders')}
                  disabled={permission !== 'granted'}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-purple-500" />
                  <div>
                    <Label htmlFor="rewardApprovals" className="text-base font-medium">
                      Aprovação de recompensas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Quando suas recompensas forem aprovadas
                    </p>
                  </div>
                </div>
                <Switch
                  id="rewardApprovals"
                  checked={preferences.rewardApprovals}
                  onCheckedChange={() => handleTogglePreference('rewardApprovals')}
                  disabled={permission !== 'granted'}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <Label htmlFor="achievements" className="text-base font-medium">
                      Conquistas desbloqueadas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando desbloquear novas conquistas
                    </p>
                  </div>
                </div>
                <Switch
                  id="achievements"
                  checked={preferences.achievements}
                  onCheckedChange={() => handleTogglePreference('achievements')}
                  disabled={permission !== 'granted'}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div>
                    <Label htmlFor="managerMessages" className="text-base font-medium">
                      Mensagens de gerentes
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receber mensagens importantes da gerência
                    </p>
                  </div>
                </div>
                <Switch
                  id="managerMessages"
                  checked={preferences.managerMessages}
                  onCheckedChange={() => handleTogglePreference('managerMessages')}
                  disabled={permission !== 'granted'}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <div>
                    <Label htmlFor="teamUpdates" className="text-base font-medium">
                      Atualizações da equipe
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Novidades e conquistas do time
                    </p>
                  </div>
                </div>
                <Switch
                  id="teamUpdates"
                  checked={preferences.teamUpdates}
                  onCheckedChange={() => handleTogglePreference('teamUpdates')}
                  disabled={permission !== 'granted'}
                />
              </div>
            </>
          )}
        </div>

        {permission === 'granted' && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={testNotification}
          >
            <TestTube className="h-4 w-4 mr-2" />
            Testar Notificação
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
