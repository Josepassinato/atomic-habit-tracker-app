import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RealtimeConfig {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export const useRealtimeUpdates = (configs: RealtimeConfig[]) => {
  useEffect(() => {
    const channels: any[] = [];

    configs.forEach((config) => {
      const channel = supabase
        .channel(`realtime-${config.table}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: config.table
          },
          (payload) => {
            console.log(`Nova inserção em ${config.table}:`, payload);
            config.onInsert?.(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: config.table
          },
          (payload) => {
            console.log(`Atualização em ${config.table}:`, payload);
            config.onUpdate?.(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: config.table
          },
          (payload) => {
            console.log(`Exclusão em ${config.table}:`, payload);
            config.onDelete?.(payload);
          }
        )
        .subscribe();

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [configs]);
};

// Hook específico para hábitos com notificações
export const useHabitsRealtime = (onHabitUpdate?: (habit: any) => void) => {
  useRealtimeUpdates([
    {
      table: 'habits',
      onUpdate: (payload) => {
        const habit = payload.new;
        
        // Notificar sobre verificação automática
        if (habit.auto_verified && !payload.old.auto_verified) {
          toast.success(`Hábito "${habit.title}" foi verificado automaticamente!`);
        }
        
        // Notificar sobre verificação manual
        if (habit.verified && !payload.old.verified) {
          toast.success(`Hábito "${habit.title}" foi verificado pela liderança!`);
        }
        
        onHabitUpdate?.(habit);
      },
      onInsert: (payload) => {
        const habit = payload.new;
        toast.info(`Novo hábito criado: ${habit.title}`);
      }
    }
  ]);
};

// Hook para atualizações de equipe
export const useTeamRealtime = (onTeamUpdate?: (team: any) => void) => {
  useRealtimeUpdates([
    {
      table: 'teams',
      onUpdate: (payload) => {
        const team = payload.new;
        toast.info(`Equipe ${team.name} foi atualizada`);
        onTeamUpdate?.(team);
      }
    },
    {
      table: 'sales_reps',
      onUpdate: (payload) => {
        const salesRep = payload.new;
        toast.info(`Vendedor ${salesRep.name} atualizou suas métricas`);
      }
    }
  ]);
};