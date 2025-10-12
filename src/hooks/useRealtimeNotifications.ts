import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeNotification } from '@/components/realtime/RealtimeNotificationCenter';
import { useLanguage } from '@/i18n';

export const useRealtimeNotifications = (userId?: string, teamId?: string) => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const { t } = useLanguage();

  const addNotification = useCallback((
    type: RealtimeNotification['type'],
    title: string,
    message: string
  ) => {
    const newNotification: RealtimeNotification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
      });
    }
  }, []);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Setup realtime listeners for habits
    const habitsChannel = supabase
      .channel('habits-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'habits',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          const newHabit = payload.new as any;
          const oldHabit = payload.old as any;
          
          // Habit completed
          if (newHabit.completed && !oldHabit.completed) {
            addNotification(
              'success',
              t('habitCompletedNotification'),
              newHabit.title
            );
          }
          
          // Habit verified
          if (newHabit.verified && !oldHabit.verified) {
            addNotification(
              'success',
              t('habitVerified'),
              newHabit.title
            );
          }
        }
      )
      .subscribe();

    // Setup realtime listeners for goals
    const goalsChannel = supabase
      .channel('goals-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'goals',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          const newGoal = payload.new as any;
          const oldGoal = payload.old as any;
          
          // Goal achieved
          if (newGoal.percentage >= 100 && oldGoal.percentage < 100) {
            addNotification(
              'success',
              t('goalAchieved'),
              `${newGoal.name} - 100%`
            );
          }
          
          // Significant progress (25%, 50%, 75%)
          const milestones = [25, 50, 75];
          milestones.forEach((milestone) => {
            if (
              newGoal.percentage >= milestone &&
              oldGoal.percentage < milestone
            ) {
              addNotification(
                'info',
                t('goalMilestone'),
                `${newGoal.name} - ${milestone}%`
              );
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(habitsChannel);
      supabase.removeChannel(goalsChannel);
    };
  }, [userId, teamId, addNotification, t]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
  };
};
