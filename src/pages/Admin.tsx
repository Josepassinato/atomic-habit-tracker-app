
import React from "react";
import AdminMetricsCards from "@/components/admin/AdminMetricsCards";
import AdminOpenAIConfig from "@/components/admin/AdminOpenAIConfig";
import OpenAIStatusChecker from "@/components/admin/OpenAIStatusChecker";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminHeader from "@/components/admin/AdminHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useAdminData } from "@/hooks/useAdminData";

const Admin = () => {
  const { isAdmin, empresas, estatisticas, loading } = useAdminData();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">Carregando...</div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return null; // Componente será desmontado quando navigate é chamado
  }

  return (
    <AppLayout>
      <div className="container py-6">
        <AdminHeader />

        {/* Cards com métricas principais */}
        <AdminMetricsCards estatisticas={estatisticas} />

        {/* Card para configurar chave da API OpenAI */}
        <AdminOpenAIConfig />

        {/* Card para verificar status da OpenAI */}
        <div className="mb-6">
          <OpenAIStatusChecker />
        </div>

        {/* Tabs para diferentes visualizações */}
        <AdminTabs empresas={empresas} />
      </div>
    </AppLayout>
  );
};

export default Admin;
