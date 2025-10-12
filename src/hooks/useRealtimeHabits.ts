import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';

interface Habit {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  verified: boolean;
  created_at: string;
  completed_at?: string;
  user_id?: string;
  team_id?: string;
}

export const useRealtimeHabits = (teamId?: string, userId?: string) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Initial fetch
    const fetchHabits = async () => {
      try {
        let query = supabase.from('habits').select('*');
        
        if (teamId) {
          query = query.eq('team_id', teamId);
        }
        if (userId) {
          query = query.eq('user_id', userId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        setHabits(data || []);
      } catch (error) {
        console.error('Error fetching habits:', error);
        toast.error(t('errorLoadingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();

    // Setup realtime subscription
    const channel = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'habits',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          console.log('New habit:', payload);
          setHabits((current) => [payload.new as Habit, ...current]);
          toast.success(t('newHabitAdded'), {
            description: (payload.new as Habit).title,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'habits',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          console.log('Habit updated:', payload);
          setHabits((current) =>
            current.map((habit) =>
              habit.id === payload.new.id ? (payload.new as Habit) : habit
            )
          );
          
          // Show notification if habit was completed
          const newHabit = payload.new as Habit;
          if (newHabit.completed && !payload.old.completed) {
            toast.success(t('habitCompletedNotification'), {
              description: newHabit.title,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'habits',
          filter: teamId ? `team_id=eq.${teamId}` : undefined,
        },
        (payload) => {
          console.log('Habit deleted:', payload);
          setHabits((current) =>
            current.filter((habit) => habit.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, userId, t]);

  return { habits, loading, setHabits };
};
