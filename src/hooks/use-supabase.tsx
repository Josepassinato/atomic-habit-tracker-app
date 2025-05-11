
import React, { createContext, useContext, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

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
  loading: false,
  error: null,
});

// Provider para disponibilizar o cliente Supabase
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState<SupabaseClient | null>(null);
  const [loading] = useState<boolean>(false);
  const [error] = useState<Error | null>(null);

  // Desativamos a criação do cliente Supabase para evitar erros
  // Quando precisarmos usar o Supabase, precisaremos ativar a integração
  // nas configurações do projeto

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

// Hook para buscar equipes - versão sem consulta real ao banco
export const useEquipes = () => {
  const [equipes] = useState<Equipe[]>([
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
  const [loading] = useState(false);
  const [error] = useState<Error | null>(null);

  return { equipes, loading, error };
};

// Hook para buscar vendedores - versão sem consulta real ao banco
export const useVendedores = (equipeId?: string) => {
  const [vendedores] = useState<Vendedor[]>([
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
  ]).filter(v => !equipeId || v.equipe_id === equipeId);
  
  const [loading] = useState(false);
  const [error] = useState<Error | null>(null);

  return { vendedores, loading, error };
};

export default useSupabase;
