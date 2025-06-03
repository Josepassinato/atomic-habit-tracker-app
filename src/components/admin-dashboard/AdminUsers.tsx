
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
import { Company, PlanType, StatusType } from "@/types/admin";
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
      if (supabase) {
        // Buscar dados reais do Supabase
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*');
        
        if (companiesError) {
          console.error("Erro ao buscar empresas:", companiesError);
          throw companiesError;
        }
        
        // Buscar dados de profiles para obter emails
        const { data: profilesData, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*');
        
        if (profilesError) {
          console.error("Erro ao buscar profiles:", profilesError);
        }
        
        if (companiesData && companiesData.length > 0) {
          // Mapear dados reais do Supabase para o formato esperado
          const mappedData: Company[] = companiesData.map(company => {
            // Encontrar o profile relacionado à empresa (se houver)
            const relatedProfile = profilesData?.find(profile => profile.company_id === company.id);
            
            return {
              id: company.id,
              name: company.name || 'Empresa sem nome',
              segment: company.segment || 'Não definido',
              plan: 'Professional' as PlanType, // Por enquanto, usar um plano padrão
              registration_date: new Date(company.created_at).toISOString().split('T')[0],
              status: 'active' as StatusType, // Por enquanto, considerar todas ativas
              contact_email: relatedProfile?.email || `contato@${company.name?.toLowerCase().replace(/\s+/g, '') || 'empresa'}.com`
            };
          });
          
          setCompanies(mappedData);
        } else {
          // Se não há dados no Supabase, mostrar lista vazia
          setCompanies([]);
          console.log("Nenhuma empresa encontrada no banco de dados");
        }
      } else {
        // Se não há conexão com Supabase, usar dados vazios
        setCompanies([]);
        toast.info("Conecte-se ao Supabase para ver dados reais");
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast.error("Erro ao carregar lista de empresas");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCompany = () => {
    toast.info("Funcionalidade de adicionar empresa em desenvolvimento");
  };
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.segment}</TableCell>
                    <TableCell>{company.contact_email}</TableCell>
                    <TableCell>{company.plan}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        company.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : company.status === "trial" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {company.status === "active" 
                          ? "Ativo" 
                          : company.status === "trial" 
                            ? "Trial" 
                            : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(company.registration_date).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm ? "Nenhuma empresa encontrada com os critérios de busca" : "Nenhuma empresa cadastrada no sistema"}
                    </div>
                    {!searchTerm && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        As empresas aparecerão aqui quando forem cadastradas através do processo de onboarding
                      </div>
                    )}
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
