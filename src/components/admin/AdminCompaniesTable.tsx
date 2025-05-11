
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface AdminCompaniesTableProps {
  empresas: EmpresaAdmin[];
}

const AdminCompaniesTable: React.FC<AdminCompaniesTableProps> = ({ empresas }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas as Empresas</CardTitle>
        <CardDescription>
          Visão geral de todas as empresas cadastradas no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista de empresas cadastradas no SaaS</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Consumo de Tokens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((empresa) => (
              <TableRow key={empresa.id}>
                <TableCell className="font-medium">{empresa.nome}</TableCell>
                <TableCell>{empresa.segmento}</TableCell>
                <TableCell>{empresa.plano}</TableCell>
                <TableCell>
                  {new Date(empresa.data_cadastro).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    empresa.status === "ativo" 
                      ? "bg-green-100 text-green-800" 
                      : empresa.status === "trial" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-red-100 text-red-800"
                  }`}>
                    {empresa.status === "ativo" 
                      ? "Ativo" 
                      : empresa.status === "trial" 
                        ? "Trial" 
                        : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {empresa.tokens_consumidos.toLocaleString()} / {empresa.tokens_limite.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminCompaniesTable;
