
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { AdminMetrics } from "@/types/admin";
import AdminMetricsCards from "@/components/admin/AdminMetricsCards";
import AdminOpenAIConfig from "@/components/admin/AdminOpenAIConfig";
import AdminTabs from "@/components/admin/AdminTabs";

// Tipos para os dados do painel administrativo
type EmpresaAdmin = {
  id: string;
  nome: string;
  segmento: string;
  plano: string;
  data_cadastro: string;
  tokens_consumidos: number;
  tokens_limite: number;
  status: "ativo" | "inativo" | "trial";
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  // Estatísticas gerais
  const [estatisticas, setEstatisticas] = useState<AdminMetrics>({
    totalEmpresas: 0,
    empresasAtivas: 0,
    empresasInativas: 0,
    empresasTrial: 0,
    tokensTotais: 0,
    receitaMensal: 0,
  });

  // Verifica se o usuário atual é admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase) return;
      
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        const userObj = JSON.parse(user);
        
        // Esse é um exemplo simples. Em produção, você deve verificar isso no backend
        // com Supabase RLS ou uma função de borda.
        // Aqui assumimos que o seu email é o admin
        const isAdminUser = userObj.email === "admin@habitus.com";
        setIsAdmin(isAdminUser);
        
        if (!isAdminUser) {
          navigate("/dashboard");
        } else {
          // Se for admin, carrega os dados
          await carregarDadosAdmin();
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [navigate, supabase]);

  // Função para carregar os dados do painel administrativo
  const carregarDadosAdmin = async () => {
    // Em um app real, estes dados viriam do Supabase
    // Por enquanto, usamos dados fictícios para demonstração
    const dadosFicticios: EmpresaAdmin[] = [
      {
        id: "1",
        nome: "TechSolutions Ltda",
        segmento: "Tecnologia",
        plano: "Enterprise",
        data_cadastro: "2025-02-15",
        tokens_consumidos: 125000,
        tokens_limite: 500000,
        status: "ativo"
      },
      {
        id: "2",
        nome: "Vendas Globais SA",
        segmento: "Varejo",
        plano: "Professional",
        data_cadastro: "2025-03-21",
        tokens_consumidos: 43200,
        tokens_limite: 100000,
        status: "ativo"
      },
      {
        id: "3",
        nome: "Marketing Digital Express",
        segmento: "Marketing",
        plano: "Starter",
        data_cadastro: "2025-04-05",
        tokens_consumidos: 9800,
        tokens_limite: 50000,
        status: "trial"
      },
      {
        id: "4",
        nome: "Consultoria Nexus",
        segmento: "Consultoria",
        plano: "Professional",
        data_cadastro: "2025-03-10",
        tokens_consumidos: 78500,
        tokens_limite: 100000,
        status: "ativo"
      },
      {
        id: "5",
        nome: "Imobiliária Futuro",
        segmento: "Imobiliário",
        plano: "Starter",
        data_cadastro: "2025-02-28",
        tokens_consumidos: 12300,
        tokens_limite: 50000,
        status: "inativo"
      }
    ];

    setEmpresas(dadosFicticios);

    // Calcula estatísticas
    const ativas = dadosFicticios.filter(e => e.status === "ativo").length;
    const inativas = dadosFicticios.filter(e => e.status === "inativo").length;
    const trial = dadosFicticios.filter(e => e.status === "trial").length;
    const tokens = dadosFicticios.reduce((acc, emp) => acc + emp.tokens_consumidos, 0);
    
    // Cálculo simplificado da receita
    const receita = dadosFicticios.reduce((acc, emp) => {
      if (emp.status !== "ativo") return acc;
      switch(emp.plano) {
        case "Enterprise": return acc + 997;
        case "Professional": return acc + 497;
        case "Starter": return acc + 197;
        default: return acc;
      }
    }, 0);

    setEstatisticas({
      totalEmpresas: dadosFicticios.length,
      empresasAtivas: ativas,
      empresasInativas: inativas,
      empresasTrial: trial,
      tokensTotais: tokens,
      receitaMensal: receita
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
    return null; // Componente será desmontado quando navigate é chamado
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
            Acesso Restrito
          </div>
        </div>

        {/* Cards com métricas principais */}
        <AdminMetricsCards estatisticas={estatisticas} />

        {/* Card para configurar chave da API OpenAI */}
        <AdminOpenAIConfig />

        {/* Tabs para diferentes visualizações */}
        <AdminTabs empresas={empresas} />
      </main>
    </div>
  );
};

export default Admin;
