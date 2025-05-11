
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabelaVendedores } from "./TabelaVendedores";

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

interface RelatorioTabsProps {
  vendedoresFiltrados: Vendedor[];
  equipes: Equipe[];
}

export const RelatorioTabs: React.FC<RelatorioTabsProps> = ({
  vendedoresFiltrados,
  equipes,
}) => {
  return (
    <Tabs defaultValue="vendedores" className="mt-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
        <TabsTrigger value="equipes">Equipes</TabsTrigger>
        <TabsTrigger value="empresas">Empresas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vendedores">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Desempenho de Vendedores</CardTitle>
            <CardDescription>
              Visão detalhada do desempenho individual dos vendedores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabelaVendedores 
              vendedoresFiltrados={vendedoresFiltrados} 
              equipes={equipes} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="equipes">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Desempenho de Equipes</CardTitle>
            <CardDescription>
              Comparativo entre equipes de vendas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Relatórios de equipes serão implementados após integração com banco de dados.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="empresas">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Desempenho por Empresa</CardTitle>
            <CardDescription>
              Análise consolidada por empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Relatórios por empresa serão implementados após integração com banco de dados.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
