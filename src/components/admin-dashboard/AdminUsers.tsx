
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/admin";
import { Search } from "lucide-react";

const AdminUsers = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from Supabase
    // For now, mock data
    const mockCompanies: Company[] = [
      {
        id: "1",
        nome: "TechSolutions Ltda",
        segmento: "Tecnologia",
        plano: "Enterprise",
        data_cadastro: "2025-02-15",
        status: "ativo",
        email_contato: "contato@techsolutions.com"
      },
      {
        id: "2",
        nome: "Vendas Globais SA",
        segmento: "Varejo",
        plano: "Professional",
        data_cadastro: "2025-03-21",
        status: "ativo",
        email_contato: "adm@vendasglobais.com"
      },
      {
        id: "3",
        nome: "Marketing Digital Express",
        segmento: "Marketing",
        plano: "Starter",
        data_cadastro: "2025-04-05",
        status: "trial",
        email_contato: "info@mkdigital.com"
      },
      {
        id: "4",
        nome: "Consultoria Nexus",
        segmento: "Consultoria",
        plano: "Professional",
        data_cadastro: "2025-03-10",
        status: "ativo",
        email_contato: "contato@nexus.com.br"
      },
      {
        id: "5",
        nome: "Imobiliária Futuro",
        segmento: "Imobiliário",
        plano: "Starter",
        data_cadastro: "2025-02-28",
        status: "inativo",
        email_contato: "vendas@imobiliariafuturo.com"
      }
    ];
    
    setCompanies(mockCompanies);
    setLoading(false);
  }, []);
  
  const filteredCompanies = companies.filter(company => 
    company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.segmento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email_contato.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Empresas</CardTitle>
        <CardDescription>
          Gerencie todas as empresas cadastradas na plataforma.
        </CardDescription>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar empresas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>Adicionar Empresa</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.nome}</TableCell>
                    <TableCell>{company.segmento}</TableCell>
                    <TableCell>{company.email_contato}</TableCell>
                    <TableCell>{company.plano}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        company.status === "ativo" 
                          ? "bg-green-100 text-green-800" 
                          : company.status === "trial" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {company.status === "ativo" 
                          ? "Ativo" 
                          : company.status === "trial" 
                            ? "Trial" 
                            : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(company.data_cadastro).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhuma empresa encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
