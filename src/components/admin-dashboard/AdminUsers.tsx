
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
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

const AdminUsers = () => {
  const { supabase } = useSupabase();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  const fetchCompanies = async () => {
    setLoading(true);
    
    try {
      // Dados fictícios para fallback
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
      
      if (supabase) {
        // Buscar dados do Supabase
        const { data, error } = await supabase
          .from('empresas')
          .select('*');
        
        if (error) {
          console.error("Erro ao buscar empresas:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setCompanies(data);
        } else {
          // Se não houver dados no Supabase, inicializa com dados padrão
          const { error: insertError } = await supabase
            .from('empresas')
            .upsert(mockCompanies);
          
          if (insertError) {
            console.error("Erro ao inserir empresas:", insertError);
            throw insertError;
          }
          
          setCompanies(mockCompanies);
        }
      } else {
        // Fallback para dados locais
        const savedCompanies = localStorage.getItem('admin_companies');
        if (savedCompanies) {
          setCompanies(JSON.parse(savedCompanies));
        } else {
          setCompanies(mockCompanies);
          localStorage.setItem('admin_companies', JSON.stringify(mockCompanies));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast.error("Não foi possível carregar a lista de empresas");
      
      // Fallback para dados mockados em caso de erro
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
        }
      ];
      
      setCompanies(mockCompanies);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCompany = () => {
    // Implementação futura para adicionar empresas
    toast.info("Funcionalidade de adicionar empresa em desenvolvimento");
  };
  
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
          <Button onClick={handleAddCompany}>Adicionar Empresa</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <span className="ml-2">Carregando...</span>
          </div>
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
