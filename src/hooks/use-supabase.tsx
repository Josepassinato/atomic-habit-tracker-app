
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Tipos para as tabelas do nosso banco de dados
export type Equipe = {
  id: string;
  nome: string;
  empresa_id: string;
  criado_em: string;
};

export type Vendedor = {
  id: string;
  nome: string;
  email: string;
  equipe_id: string;
  vendas_total: number;
  meta_atual: number;
  taxa_conversao: number;
  criado_em: string;
};

export type Empresa = {
  id: string;
  nome: string;
  segmento: string;
  tamanho_equipe: string;
  criado_em: string;
};

// Context para gerenciar o cliente Supabase
type SupabaseContextType = {
  supabase: SupabaseClient | null;
  loading: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  loading: true,
  error: null,
});

// Provider para disponibilizar o cliente Supabase
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Estes valores serão fornecidos pelo ambiente Supabase integrado ao Lovable
      const supabaseUrl = 'SUPABASE_URL';
      const supabaseKey = 'SUPABASE_KEY';
      
      // Criar cliente Supabase
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
    } catch (err) {
      console.error('Erro ao inicializar Supabase:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, loading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook para usar o cliente Supabase
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase deve ser usado dentro de um SupabaseProvider');
  }
  return context;
};

// Hook para buscar equipes
export const useEquipes = () => {
  const { supabase, loading: clientLoading } = useSupabase();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEquipes = async () => {
      if (clientLoading || !supabase) return;

      try {
        setLoading(true);
        // Quando a integração for concluída, esta consulta funcionará
        const { data, error } = await supabase
          .from('equipes')
          .select('*');

        if (error) throw error;
        setEquipes(data || []);
      } catch (err) {
        console.error('Erro ao buscar equipes:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipes();
  }, [supabase, clientLoading]);

  return { equipes, loading, error };
};

// Hook para buscar vendedores
export const useVendedores = (equipeId?: string) => {
  const { supabase, loading: clientLoading } = useSupabase();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVendedores = async () => {
      if (clientLoading || !supabase) return;

      try {
        setLoading(true);
        // Consulta condicional baseada em equipeId
        let query = supabase.from('vendedores').select('*');
        
        if (equipeId) {
          query = query.eq('equipe_id', equipeId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setVendedores(data || []);
      } catch (err) {
        console.error('Erro ao buscar vendedores:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, [supabase, clientLoading, equipeId]);

  return { vendedores, loading, error };
};

export default useSupabase;
