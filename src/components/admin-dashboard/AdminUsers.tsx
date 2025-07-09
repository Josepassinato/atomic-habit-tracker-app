
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
          console.error("Error fetching companies:", companiesError);
          throw companiesError;
        }
        
        // Fetch profile data to get emails
        const { data: profilesData, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*');
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }
        
        if (companiesData && companiesData.length > 0) {
          // Map real Supabase data to expected format
          const mappedData: Company[] = companiesData.map(company => {
            // Find profile related to company (if any)
            const relatedProfile = profilesData?.find(profile => profile.company_id === company.id);
            
            return {
              id: company.id,
              name: company.name || 'Company without name',
              segment: company.segment || 'Not defined',
              plan: 'Professional' as PlanType, // For now, use default plan
              registration_date: new Date(company.created_at).toISOString().split('T')[0],
              status: 'active' as StatusType, // For now, consider all active
              contact_email: relatedProfile?.email || `contact@${company.name?.toLowerCase().replace(/\s+/g, '') || 'company'}.com`
            };
          });
          
          setCompanies(mappedData);
        } else {
          // If no data in Supabase, show empty list
          setCompanies([]);
          console.log("No companies found in database");
        }
      } else {
        // If no Supabase connection, use empty data
        setCompanies([]);
        toast.info("Connect to Supabase to see real data");
      }
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Error loading company list");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCompany = () => {
    toast.info("Add company functionality in development");
  };
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
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
                          ? "Active" 
                          : company.status === "trial" 
                            ? "Trial" 
                            : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(company.registration_date).toLocaleDateString("en-US")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm ? "No companies found with search criteria" : "No companies registered in the system"}
                    </div>
                    {!searchTerm && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Companies will appear here when registered through the onboarding process
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
