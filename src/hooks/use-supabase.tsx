
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

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
  isConfigured: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  loading: false,
  error: null,
  isConfigured: false,
});

// Provider para disponibilizar o cliente Supabase
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    const initSupabase = async () => {
      try {
        // Tentar buscar credenciais do armazenamento local
        const supabaseUrl = localStorage.getItem('supabase_url');
        const supabaseKey = localStorage.getItem('supabase_key');
        
        if (supabaseUrl && supabaseKey) {
          const client = createClient(supabaseUrl, supabaseKey);
          
          // Testar a conexão
          const { error } = await client.from('test').select('*').limit(1);
          
          if (error && error.code !== 'PGRST116') {
            // PGRST116 significa que a tabela não existe, o que é ok para o teste
            console.warn('Erro ao conectar com Supabase:', error);
            setSupabase(null);
            setIsConfigured(false);
          } else {
            setSupabase(client);
            setIsConfigured(true);
          }
        } else {
          console.info('Credenciais do Supabase não encontradas');
          setSupabase(null);
          setIsConfigured(false);
        }
      } catch (err) {
        console.error('Erro ao inicializar Supabase:', err);
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
  const { supabase } = useSupabase();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoading(true);
        
        // Equipes default para fallback
        const equipesDefault: Equipe[] = [
          {
            id: '1',
            nome: 'Equipe Comercial',
            empresa_id: '1',
            criado_em: new Date().toISOString(),
          },
          {
            id: '2',
            nome: 'Equipe de Sucesso do Cliente',
            empresa_id: '1',
            criado_em: new Date().toISOString(),
          }
        ];
        
        if (supabase) {
          const { data, error } = await supabase
            .from('equipes')
            .select('*');
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setEquipes(data);
          } else {
            // Se não houver dados, inicializar com dados padrão
            await supabase.from('equipes').upsert(equipesDefault);
            setEquipes(equipesDefault);
          }
        } else {
          // Modo local com localStorage
          const savedEquipes = localStorage.getItem('equipes');
          if (savedEquipes) {
            setEquipes(JSON.parse(savedEquipes));
          } else {
            localStorage.setItem('equipes', JSON.stringify(equipesDefault));
            setEquipes(equipesDefault);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar equipes:', err);
        setError(err as Error);
        
        // Fallback para dados padrão
        setEquipes([
          {
            id: '1',
            nome: 'Equipe Comercial',
            empresa_id: '1',
            criado_em: new Date().toISOString(),
          },
          {
            id: '2',
            nome: 'Equipe de Sucesso do Cliente',
            empresa_id: '1',
            criado_em: new Date().toISOString(),
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipes();
  }, [supabase]);

  return { equipes, loading, error };
};

// Hook para buscar vendedores
export const useVendedores = (equipeId?: string) => {
  const { supabase } = useSupabase();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        
        // Vendedores default para fallback
        const vendedoresDefault: Vendedor[] = [
          {
            id: '1',
            nome: 'João Silva',
            email: 'joao@example.com',
            equipe_id: '1',
            vendas_total: 120000,
            meta_atual: 150000,
            taxa_conversao: 0.35,
            criado_em: new Date().toISOString(),
          },
          {
            id: '2',
            nome: 'Maria Souza',
            email: 'maria@example.com',
            equipe_id: '1',
            vendas_total: 180000,
            meta_atual: 150000,
            taxa_conversao: 0.42,
            criado_em: new Date().toISOString(),
          },
          {
            id: '3',
            nome: 'Carlos Pereira',
            email: 'carlos@example.com',
            equipe_id: '2',
            vendas_total: 90000,
            meta_atual: 120000,
            taxa_conversao: 0.28,
            criado_em: new Date().toISOString(),
          }
        ];
        
        if (supabase) {
          let query = supabase.from('vendedores').select('*');
          
          if (equipeId) {
            query = query.eq('equipe_id', equipeId);
          }
          
          const { data, error } = await query;
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setVendedores(data);
          } else {
            // Se não houver dados, inicializar com dados padrão
            await supabase.from('vendedores').upsert(vendedoresDefault);
            
            if (equipeId) {
              setVendedores(vendedoresDefault.filter(v => v.equipe_id === equipeId));
            } else {
              setVendedores(vendedoresDefault);
            }
          }
        } else {
          // Modo local com localStorage
          const savedVendedores = localStorage.getItem('vendedores');
          if (savedVendedores) {
            const allVendedores = JSON.parse(savedVendedores);
            if (equipeId) {
              setVendedores(allVendedores.filter((v: Vendedor) => v.equipe_id === equipeId));
            } else {
              setVendedores(allVendedores);
            }
          } else {
            localStorage.setItem('vendedores', JSON.stringify(vendedoresDefault));
            if (equipeId) {
              setVendedores(vendedoresDefault.filter(v => v.equipe_id === equipeId));
            } else {
              setVendedores(vendedoresDefault);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao buscar vendedores:', err);
        setError(err as Error);
        
        // Fallback para dados filtrados
        const vendedoresDefault = [
          {
            id: '1',
            nome: 'João Silva',
            email: 'joao@example.com',
            equipe_id: '1',
            vendas_total: 120000,
            meta_atual: 150000,
            taxa_conversao: 0.35,
            criado_em: new Date().toISOString(),
          },
          {
            id: '2',
            nome: 'Maria Souza',
            email: 'maria@example.com',
            equipe_id: '1',
            vendas_total: 180000,
            meta_atual: 150000,
            taxa_conversao: 0.42,
            criado_em: new Date().toISOString(),
          },
          {
            id: '3',
            nome: 'Carlos Pereira',
            email: 'carlos@example.com',
            equipe_id: '2',
            vendas_total: 90000,
            meta_atual: 120000,
            taxa_conversao: 0.28,
            criado_em: new Date().toISOString(),
          }
        ];
        
        if (equipeId) {
          setVendedores(vendedoresDefault.filter(v => v.equipe_id === equipeId));
        } else {
          setVendedores(vendedoresDefault);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, [supabase, equipeId]);

  return { vendedores, loading, error };
};
