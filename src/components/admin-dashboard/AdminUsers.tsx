
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
      // Mock data in English
      const mockCompanies: Company[] = [
        {
          id: "1",
          nome: "TechSolutions Ltd",
          segmento: "Technology",
          plano: "Enterprise",
          data_cadastro: "2025-02-15",
          status: "ativo",
          email_contato: "contact@techsolutions.com"
        },
        {
          id: "2",
          nome: "Global Sales Corp",
          segmento: "Retail",
          plano: "Professional",
          data_cadastro: "2025-03-21",
          status: "ativo",
          email_contato: "admin@globalsales.com"
        },
        {
          id: "3",
          nome: "Digital Marketing Express",
          segmento: "Marketing",
          plano: "Starter",
          data_cadastro: "2025-04-05",
          status: "trial",
          email_contato: "info@digitalmarketing.com"
        },
        {
          id: "4",
          nome: "Nexus Consulting",
          segmento: "Consulting",
          plano: "Professional",
          data_cadastro: "2025-03-10",
          status: "ativo",
          email_contato: "contact@nexus.com"
        },
        {
          id: "5",
          nome: "Future Real Estate",
          segmento: "Real Estate",
          plano: "Starter",
          data_cadastro: "2025-02-28",
          status: "inativo",
          email_contato: "sales@futurerealestate.com"
        }
      ];
      
      if (supabase) {
        // Fetch data from Supabase
        const { data, error } = await supabase
          .from('empresas')
          .select('*');
        
        if (error) {
          console.error("Error fetching companies:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setCompanies(data);
        } else {
          // If no data in Supabase, initialize with default data
          const { error: insertError } = await supabase
            .from('empresas')
            .upsert(mockCompanies);
          
          if (insertError) {
            console.error("Error inserting companies:", insertError);
            throw insertError;
          }
          
          setCompanies(mockCompanies);
        }
      } else {
        // Fallback to local data
        const savedCompanies = localStorage.getItem('admin_companies');
        if (savedCompanies) {
          setCompanies(JSON.parse(savedCompanies));
        } else {
          setCompanies(mockCompanies);
          localStorage.setItem('admin_companies', JSON.stringify(mockCompanies));
        }
      }
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Unable to load company list");
      
      // Fallback to mock data in case of error
      const mockCompanies: Company[] = [
        {
          id: "1",
          nome: "TechSolutions Ltd",
          segmento: "Technology",
          plano: "Enterprise",
          data_cadastro: "2025-02-15",
          status: "ativo",
          email_contato: "contact@techsolutions.com"
        },
        {
          id: "2",
          nome: "Global Sales Corp",
          segmento: "Retail",
          plano: "Professional",
          data_cadastro: "2025-03-21",
          status: "ativo",
          email_contato: "admin@globalsales.com"
        }
      ];
      
      setCompanies(mockCompanies);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCompany = () => {
    // Future implementation for adding companies
    toast.info("Add company functionality in development");
  };
  
  const filteredCompanies = companies.filter(company => 
    company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.segmento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email_contato.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Management</CardTitle>
        <CardDescription>
          Manage all companies registered on the platform.
        </CardDescription>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCompany}>Add Company</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
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
                          ? "Active" 
                          : company.status === "trial" 
                            ? "Trial" 
                            : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(company.data_cadastro).toLocaleDateString("en-US")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No companies found
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
