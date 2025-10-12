import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';
import { pushNotificationService } from '@/services/push-notification-service';
import { usePushNotifications } from './usePushNotifications';

interface Goal {
  id: string;
  name: string;
  type?: string;
  target_value: number;
  current_value: number;
  percentage: number;
  user_id?: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeGoals = (teamId?: string, userId?: string) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { preferences } = usePushNotifications(userId);
  const { t } = useLanguage();

  useEffect(() => {
    // Initial fetch
    const fetchGoals = async () => {
      try {
        let query = supabase.from('goals').select('*');
        
        if (teamId) {
          query = query.eq('team_id', teamId);
        }
        if (userId) {
          query = query.eq('user_id', userId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        setGoals(data || []);
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast.error(t('errorLoadingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();

    // Setup realtime subscription
    const channel = supabase
      .channel('goals-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'goals',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          console.log('New goal:', payload);
          setGoals((current) => [payload.new as Goal, ...current]);
          toast.success(t('newGoalCreated'), {
            description: (payload.new as Goal).name,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'goals',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          console.log('Goal updated:', payload);
          const newGoal = payload.new as Goal;
          const oldGoal = payload.old as Goal;
          
          setGoals((current) =>
            current.map((goal) =>
              goal.id === newGoal.id ? newGoal : goal
            )
          );
          
          // Show push notification if goal is near completion
          if (preferences.goalProgress && newGoal.percentage >= 75 && newGoal.percentage < 100) {
            pushNotificationService.showGoalNotification(
              newGoal.name, 
              newGoal.percentage,
              '/metas'
            );
          }
          
          // Show notification if goal progress increased significantly
          if (newGoal.percentage >= 100 && oldGoal.percentage < 100) {
            toast.success(t('goalAchieved'), {
              description: `${newGoal.name} - 100%`,
              duration: 5000,
            });
          } else if (newGoal.percentage - oldGoal.percentage >= 10) {
            toast.info(t('goalProgress'), {
              description: `${newGoal.name} - ${Math.round(newGoal.percentage)}%`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'goals',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          console.log('Goal deleted:', payload);
          setGoals((current) =>
            current.filter((goal) => goal.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, userId, t]);

  return { goals, loading, setGoals };
};
