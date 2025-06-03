
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCompaniesTable from "./AdminCompaniesTable";
import AdminTokenUsage from "./AdminTokenUsage";
import AdminPlansDistribution from "./AdminPlansDistribution";
import { EmpresaAdmin } from "@/services/admin-data-service";

interface AdminTabsProps {
  empresas: EmpresaAdmin[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({ empresas }) => {
  return (
    <Tabs defaultValue="empresas" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="empresas">Empresas</TabsTrigger>
        <TabsTrigger value="consumo">Consumo de Tokens</TabsTrigger>
        <TabsTrigger value="planos">Distribuição de Planos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="empresas">
        <AdminCompaniesTable empresas={empresas} />
      </TabsContent>
      
      <TabsContent value="consumo">
        <AdminTokenUsage empresas={empresas} />
      </TabsContent>
      
      <TabsContent value="planos">
        <AdminPlansDistribution empresas={empresas} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
