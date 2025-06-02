
import { supabaseConfigService } from "../supabase-config";

/**
 * Service for syncing habits data with Supabase
 */
export class HabitsSyncService {
  /**
   * Syncs habits from localStorage to Supabase
   */
  async syncToSupabase(habits: any[]): Promise<boolean> {
    const url = supabaseConfigService.getUrl();
    const key = supabaseConfigService.getApiKey();
    
    if (!url || !key || !habits || habits.length === 0) {
      console.log("Incomplete data, cannot sync habits");
      return false;
    }
    
    try {
      console.log("Syncing habits with Supabase...");
      
      // For each habit in the array
      for (const habit of habits) {
        const tableName = habit.equipe_id ? 'team_habits' : 'habits';
        
        // Check if habit already exists in Supabase
        const checkResponse = await fetch(`${url}/rest/v1/${tableName}?id=eq.${habit.id}`, {
          method: "GET",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        const existingHabit = await checkResponse.json();
          
        // If habit doesn't exist, insert it
        if (!existingHabit || existingHabit.length === 0) {
          let habitData: any = {
            id: habit.id,
            title: habit.title || habit.titulo || habit.nome,
            description: habit.description || habit.descricao || '',
            completed: habit.completed || habit.concluido || false,
            recurrence: habit.recurrence || habit.recorrencia || 'daily',
            created_at: habit.created_at || habit.data_criacao || new Date().toISOString(),
            completed_at: habit.completed_at || habit.data_conclusao || null
          };

          if (habit.equipe_id) {
            // For team habits
            habitData.equipe_id = habit.equipe_id;
          } else {
            // For individual habits
            habitData.usuario_id = habit.usuario_id || '1';
            habitData.verified = habit.verified || habit.verificado || false;
            habitData.verification_required = habit.verification_required || habit.verificacao_necessaria || false;
            habitData.schedule = habit.schedule || habit.horario || null;
            habitData.evidence = habit.evidence || habit.evidencia || null;
          }

          const insertResponse = await fetch(`${url}/rest/v1/${tableName}`, {
            method: "POST",
            headers: {
              "apikey": key,
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify(habitData)
          });
            
          if (!insertResponse.ok) {
            console.error("Error inserting habit into Supabase:", await insertResponse.text());
          } else {
            console.log(`Habit ${habit.title || habit.titulo || habit.nome} synced with Supabase`);
          }
        }
      }
      
      console.log("Habits sync with Supabase completed");
      return true;
    } catch (error) {
      console.error("Error syncing habits with Supabase:", error);
      return false;
    }
  }
}
