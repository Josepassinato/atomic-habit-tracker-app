import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

// Types for our database tables
export type Team = {
  id: string;
  name: string;
  empresa_id: string;
  created_at: string;
};

export type SalesRep = {
  id: string;
  name: string;
  email: string;
  equipe_id: string;
  vendas_total: number;
  meta_atual: number;
  taxa_conversao: number;
  created_at: string;
};

export type Company = {
  id: string;
  name: string;
  segment: string;
  team_size: string;
  created_at: string;
};

// Context for managing the Supabase client
type SupabaseContextType = {
  supabase: SupabaseClient | null;
  loading: boolean;
  error: Error | null;
  isConfigured: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  loading: false,
  error: null,
  isConfigured: false,
});

// Provider to make the Supabase client available
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    const initSupabase = async () => {
      try {
        // Try to get credentials from local storage
        const supabaseUrl = localStorage.getItem('supabase_url');
        const supabaseKey = localStorage.getItem('supabase_key');
        
        if (supabaseUrl && supabaseKey) {
          const client = createClient(supabaseUrl, supabaseKey);
          
          // Test the connection
          const { error } = await client.from('test').select('*').limit(1);
          
          if (error && error.code !== 'PGRST116') {
            // PGRST116 means the table doesn't exist, which is OK for the test
            console.warn('Error connecting to Supabase:', error);
            setSupabase(null);
            setIsConfigured(false);
          } else {
            setSupabase(client);
            setIsConfigured(true);
          }
        } else {
          console.info('Supabase credentials not found');
          setSupabase(null);
          setIsConfigured(false);
        }
      } catch (err) {
        console.error('Error initializing Supabase:', err);
        setError(err as Error);
        setSupabase(null);
        setIsConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    initSupabase();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, loading, error, isConfigured }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook to use the Supabase client
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Hook to fetch teams
export const useTeams = () => {
  const { supabase } = useSupabase();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        
        // Default teams for fallback
        const defaultTeams: Team[] = [
          {
            id: '1',
            name: 'Sales Team',
            empresa_id: '1',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Customer Success Team',
            empresa_id: '1',
            created_at: new Date().toISOString(),
          }
        ];
        
        if (supabase) {
          const { data, error } = await supabase
            .from('teams')
            .select('*');
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setTeams(data);
          } else {
            // If no data, initialize with default data
            await supabase.from('teams').upsert(defaultTeams);
            setTeams(defaultTeams);
          }
        } else {
          // Local mode with localStorage
          const savedTeams = localStorage.getItem('teams');
          if (savedTeams) {
            setTeams(JSON.parse(savedTeams));
          } else {
            localStorage.setItem('teams', JSON.stringify(defaultTeams));
            setTeams(defaultTeams);
          }
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err as Error);
        
        // Fallback to default data
        setTeams([
          {
            id: '1',
            name: 'Sales Team',
            empresa_id: '1',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Customer Success Team',
            empresa_id: '1',
            created_at: new Date().toISOString(),
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [supabase]);

  return { teams, loading, error };
};

// Hook to fetch sales reps
export const useSalesReps = (teamId?: string) => {
  const { supabase } = useSupabase();
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setLoading(true);
        
        // Default sales reps for fallback
        const defaultSalesReps: SalesRep[] = [
          {
            id: '1',
            name: 'John Silva',
            email: 'john@example.com',
            equipe_id: '1',
            vendas_total: 120000,
            meta_atual: 150000,
            taxa_conversao: 0.35,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Maria Souza',
            email: 'maria@example.com',
            equipe_id: '1',
            vendas_total: 180000,
            meta_atual: 150000,
            taxa_conversao: 0.42,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Carlos Pereira',
            email: 'carlos@example.com',
            equipe_id: '2',
            vendas_total: 90000,
            meta_atual: 120000,
            taxa_conversao: 0.28,
            created_at: new Date().toISOString(),
          }
        ];
        
        if (supabase) {
          let query = supabase.from('sales_reps').select('*');
          
          if (teamId) {
            query = query.eq('equipe_id', teamId);
          }
          
          const { data, error } = await query;
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setSalesReps(data);
          } else {
            // If no data, initialize with default data
            await supabase.from('sales_reps').upsert(defaultSalesReps);
            
            if (teamId) {
              setSalesReps(defaultSalesReps.filter(v => v.equipe_id === teamId));
            } else {
              setSalesReps(defaultSalesReps);
            }
          }
        } else {
          // Local mode with localStorage
          const savedSalesReps = localStorage.getItem('sales_reps');
          if (savedSalesReps) {
            const allSalesReps = JSON.parse(savedSalesReps);
            if (teamId) {
              setSalesReps(allSalesReps.filter((v: SalesRep) => v.equipe_id === teamId));
            } else {
              setSalesReps(allSalesReps);
            }
          } else {
            localStorage.setItem('sales_reps', JSON.stringify(defaultSalesReps));
            if (teamId) {
              setSalesReps(defaultSalesReps.filter(v => v.equipe_id === teamId));
            } else {
              setSalesReps(defaultSalesReps);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching sales reps:', err);
        setError(err as Error);
        
        // Fallback to filtered data
        const defaultSalesReps = [
          {
            id: '1',
            name: 'John Silva',
            email: 'john@example.com',
            equipe_id: '1',
            vendas_total: 120000,
            meta_atual: 150000,
            taxa_conversao: 0.35,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Maria Souza',
            email: 'maria@example.com',
            equipe_id: '1',
            vendas_total: 180000,
            meta_atual: 150000,
            taxa_conversao: 0.42,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Carlos Pereira',
            email: 'carlos@example.com',
            equipe_id: '2',
            vendas_total: 90000,
            meta_atual: 120000,
            taxa_conversao: 0.28,
            created_at: new Date().toISOString(),
          }
        ];
        
        if (teamId) {
          setSalesReps(defaultSalesReps.filter(v => v.equipe_id === teamId));
        } else {
          setSalesReps(defaultSalesReps);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReps();
  }, [supabase, teamId]);

  return { salesReps, loading, error };
};

// Export aliases for Portuguese naming compatibility
export const useEquipes = useTeams;
export const useVendedores = useSalesReps;
