import { useState, useEffect } from 'react';
import { pushNotificationService } from '@/services/push-notification-service';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPreferences {
  enabled: boolean;
  goalProgress: boolean;
  habitReminders: boolean;
  rewardApprovals: boolean;
  achievements: boolean;
  managerMessages: boolean;
  teamUpdates: boolean;
}

export const usePushNotifications = (userId?: string) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    goalProgress: true,
    habitReminders: true,
    rewardApprovals: true,
    achievements: true,
    managerMessages: true,
    teamUpdates: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    if (userId) {
      loadPreferences();
    }
  }, [userId]);

  const initializeNotifications = async () => {
    const supported = pushNotificationService.isSupported();
    setIsSupported(supported);
    
    if (supported) {
      await pushNotificationService.initialize();
      setPermission(pushNotificationService.getPermission());
    }
    setLoading(false);
  };

  const loadPreferences = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('user_id', userId)
      .eq('key', 'notification_preferences')
      .maybeSingle();

    if (error) {
      console.error('Error loading notification preferences:', error);
      return;
    }

    if (data?.value) {
      setPreferences(data.value as any);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    if (!userId) return;

    setPreferences(newPreferences);

    const { error } = await supabase
      .from('settings')
      .upsert({
        user_id: userId,
        key: 'notification_preferences',
        value: newPreferences as any
      }, {
        onConflict: 'user_id,key'
      });

    if (error) {
      console.error('Error saving notification preferences:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    const result = await pushNotificationService.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const testNotification = async () => {
    await pushNotificationService.showNotification({
      title: '🔔 Notificações ativadas!',
      body: 'Você receberá atualizações sobre suas metas e hábitos.',
      tag: 'test_notification'
    });
  };

  return {
    permission,
    isSupported,
    preferences,
    loading,
    requestPermission,
    savePreferences,
    testNotification
  };
};
