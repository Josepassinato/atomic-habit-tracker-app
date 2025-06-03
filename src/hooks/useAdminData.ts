
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdminMetrics } from "@/types/admin";
import { getCurrentUser } from "@/utils/permissions";
import { adminDataService, EmpresaAdmin } from "@/services/admin-data-service";

export const useAdminData = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<AdminMetrics>({
    totalEmpresas: 0,
    empresasAtivas: 0,
    empresasInativas: 0,
    empresasTrial: 0,
    tokensTotais: 0,
    receitaMensal: 0,
  });

  // Verifica se o usuário atual é admin e carrega os dados
  useEffect(() => {
    const checkAdminAccess = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para acessar esta página");
        navigate("/login");
        return;
      }
      
      const isAdminUser = user.role === "admin";
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/dashboard");
      } else {
        // Se for admin, carrega os dados
        try {
          const { empresas: dadosEmpresas, estatisticas: dadosEstatisticas } = 
            await adminDataService.carregarDadosAdmin();
          setEmpresas(dadosEmpresas);
          setEstatisticas(dadosEstatisticas);
        } catch (error) {
          console.error("Erro ao carregar dados do admin:", error);
          toast.error("Erro ao carregar dados administrativos");
        }
      }
      
      setLoading(false);
    };
    
    checkAdminAccess();
  }, [navigate]);

  return {
    isAdmin,
    empresas,
    estatisticas,
    loading
  };
};
