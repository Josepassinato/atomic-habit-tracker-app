
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

interface Vendedor {
  id: string;
  nome: string;
  equipe: string;
  vendas: number;
  meta: number;
  conversao: number;
}

interface Equipe {
  id: string;
  nome: string;
}

export const useRelatorioData = () => {
  const { supabase } = useSupabase();
  
  // Estados para armazenar dados
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para filtros
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"semana" | "mes" | "trimestre" | "ano">("mes");
  const [equipeId, setEquipeId] = useState<string>("todas");
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Buscar dados do Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Dados fictícios para fallback
        const equipesDefault: Equipe[] = [
          { id: "1", nome: "Equipe Alfa" },
          { id: "2", nome: "Equipe Beta" },
          { id: "3", nome: "Equipe Delta" }
        ];
        
        const vendedoresDefault: Vendedor[] = [
          { id: "1", nome: "João Silva", equipe: "1", vendas: 120000, meta: 150000, conversao: 28 },
          { id: "2", nome: "Maria Santos", equipe: "1", vendas: 180000, meta: 150000, conversao: 35 },
          { id: "3", nome: "Pedro Costa", equipe: "2", vendas: 90000, meta: 100000, conversao: 22 },
          { id: "4", nome: "Ana Oliveira", equipe: "2", vendas: 110000, meta: 100000, conversao: 29 },
          { id: "5", nome: "Carlos Mendes", equipe: "3", vendas: 130000, meta: 120000, conversao: 31 }
        ];
        
        if (supabase) {
          // Buscar equipes do Supabase
          const { data: equipesData, error: equipesError } = await supabase
            .from('equipes')
            .select('*');
          
          if (equipesError) {
            console.error("Erro ao buscar equipes:", equipesError);
            throw equipesError;
          }
          
          if (equipesData && equipesData.length > 0) {
            setEquipes(equipesData);
          } else {
            // Se não houver dados, inicializa com dados padrão
            setEquipes(equipesDefault);
            
            // Opcional: inserir dados padrão no Supabase
            const { error: insertError } = await supabase
              .from('equipes')
              .upsert(equipesDefault);
            
            if (insertError) {
              console.error("Erro ao inserir equipes:", insertError);
            }
          }
          
          // Buscar vendedores do Supabase
          const { data: vendedoresData, error: vendedoresError } = await supabase
            .from('vendedores')
            .select('*');
          
          if (vendedoresError) {
            console.error("Erro ao buscar vendedores:", vendedoresError);
            throw vendedoresError;
          }
          
          if (vendedoresData && vendedoresData.length > 0) {
            setVendedores(vendedoresData);
          } else {
            // Se não houver dados, inicializa com dados padrão
            setVendedores(vendedoresDefault);
            
            // Opcional: inserir dados padrão no Supabase
            const { error: insertError } = await supabase
              .from('vendedores')
              .upsert(vendedoresDefault);
            
            if (insertError) {
              console.error("Erro ao inserir vendedores:", insertError);
            }
          }
        } else {
          // Fallback para dados locais quando não há conexão com Supabase
          const savedEquipes = localStorage.getItem('equipes');
          const savedVendedores = localStorage.getItem('vendedores');
          
          if (savedEquipes) {
            setEquipes(JSON.parse(savedEquipes));
          } else {
            setEquipes(equipesDefault);
            localStorage.setItem('equipes', JSON.stringify(equipesDefault));
          }
          
          if (savedVendedores) {
            setVendedores(JSON.parse(savedVendedores));
          } else {
            setVendedores(vendedoresDefault);
            localStorage.setItem('vendedores', JSON.stringify(vendedoresDefault));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados do relatório");
        
        // Fallback para dados default em caso de erro
        setEquipes([
          { id: "1", nome: "Equipe Alfa" },
          { id: "2", nome: "Equipe Beta" },
          { id: "3", nome: "Equipe Delta" }
        ]);
        
        setVendedores([
          { id: "1", nome: "João Silva", equipe: "1", vendas: 120000, meta: 150000, conversao: 28 },
          { id: "2", nome: "Maria Santos", equipe: "1", vendas: 180000, meta: 150000, conversao: 35 },
          { id: "3", nome: "Pedro Costa", equipe: "2", vendas: 90000, meta: 100000, conversao: 22 },
          { id: "4", nome: "Ana Oliveira", equipe: "2", vendas: 110000, meta: 100000, conversao: 29 },
          { id: "5", nome: "Carlos Mendes", equipe: "3", vendas: 130000, meta: 120000, conversao: 31 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);

  // Filtragem de vendedores por equipe
  const vendedoresFiltrados = equipeId === "todas" 
    ? vendedores 
    : vendedores.filter(vendedor => vendedor.equipe === equipeId);

  // Totais para dashboard
  const totalVendas = vendedores.reduce((acc, v) => acc + v.vendas, 0);
  const totalMetas = vendedores.reduce((acc, v) => acc + v.meta, 0);
  const percentualMeta = Math.round((totalVendas / totalMetas) * 100);
  const mediaConversao = Math.round(vendedores.reduce((acc, v) => acc + v.conversao, 0) / vendedores.length);

  // Função para gerar relatório com dados do Supabase
  const generateReport = async () => {
    console.log('Gerando relatório com os seguintes filtros:', {
      periodo: periodoSelecionado,
      equipe: equipeId,
      data: date
    });
    
    try {
      setIsLoading(true);
      
      if (supabase) {
        // Implementação real com Supabase
        let query = supabase.from('vendedores').select('*');
        
        // Aplicar filtros
        if (equipeId !== 'todas') {
          query = query.eq('equipe', equipeId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setVendedores(data);
          toast.success("Relatório gerado com sucesso!");
        }
      } else {
        // Simulação para modo local
        toast.success("Relatório gerado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Não foi possível gerar o relatório");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    equipes,
    vendedores,
    vendedoresFiltrados,
    periodoSelecionado,
    setPeriodoSelecionado,
    equipeId,
    setEquipeId,
    date,
    setDate,
    totalVendas,
    totalMetas,
    percentualMeta,
    mediaConversao,
    generateReport,
    isLoading
  };
};
