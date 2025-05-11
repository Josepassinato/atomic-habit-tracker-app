
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface TabelaVendedoresProps {
  vendedoresFiltrados: Vendedor[];
  equipes: Equipe[];
}

export const TabelaVendedores: React.FC<TabelaVendedoresProps> = ({
  vendedoresFiltrados,
  equipes,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Equipe</TableHead>
          <TableHead className="text-right">Vendas</TableHead>
          <TableHead className="text-right">Meta</TableHead>
          <TableHead className="text-right">% da Meta</TableHead>
          <TableHead className="text-right">Conv. %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendedoresFiltrados.map((vendedor) => {
          const equipe = equipes.find(e => e.id === vendedor.equipe);
          const percentual = Math.round((vendedor.vendas / vendedor.meta) * 100);
          
          return (
            <TableRow key={vendedor.id}>
              <TableCell className="font-medium">{vendedor.nome}</TableCell>
              <TableCell>{equipe?.nome}</TableCell>
              <TableCell className="text-right">
                R$ {vendedor.vendas.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                R$ {vendedor.meta.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">{percentual}%</TableCell>
              <TableCell className="text-right">{vendedor.conversao}%</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
