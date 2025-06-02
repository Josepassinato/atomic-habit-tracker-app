
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

interface SalesRep {
  id: string;
  name: string;
  team: string;
  sales: number;
  goal: number;
  conversion: number;
}

interface Team {
  id: string;
  name: string;
}

export const useRelatorioData = () => {
  const { supabase } = useSupabase();
  
  // States to store data
  const [teams, setTeams] = useState<Team[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filters
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const [teamId, setTeamId] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Default data for fallback
        const defaultTeams: Team[] = [
          { id: "1", name: "Alpha Team" },
          { id: "2", name: "Beta Team" },
          { id: "3", name: "Delta Team" }
        ];
        
        const defaultSalesReps: SalesRep[] = [
          { id: "1", name: "John Silva", team: "1", sales: 120000, goal: 150000, conversion: 28 },
          { id: "2", name: "Maria Santos", team: "1", sales: 180000, goal: 150000, conversion: 35 },
          { id: "3", name: "Pedro Costa", team: "2", sales: 90000, goal: 100000, conversion: 22 },
          { id: "4", name: "Ana Oliveira", team: "2", sales: 110000, goal: 100000, conversion: 29 },
          { id: "5", name: "Carlos Mendes", team: "3", sales: 130000, goal: 120000, conversion: 31 }
        ];
        
        if (supabase) {
          // Fetch teams from Supabase
          const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .select('*');
          
          if (teamsError) {
            console.error("Error fetching teams:", teamsError);
            throw teamsError;
          }
          
          if (teamsData && teamsData.length > 0) {
            setTeams(teamsData);
          } else {
            // If no data, initialize with default data
            setTeams(defaultTeams);
            
            // Optional: insert default data into Supabase
            const { error: insertError } = await supabase
              .from('teams')
              .upsert(defaultTeams);
            
            if (insertError) {
              console.error("Error inserting teams:", insertError);
            }
          }
          
          // Fetch sales reps from Supabase
          const { data: salesRepsData, error: salesRepsError } = await supabase
            .from('sales_reps')
            .select('*');
          
          if (salesRepsError) {
            console.error("Error fetching sales reps:", salesRepsError);
            throw salesRepsError;
          }
          
          if (salesRepsData && salesRepsData.length > 0) {
            setSalesReps(salesRepsData);
          } else {
            // If no data, initialize with default data
            setSalesReps(defaultSalesReps);
            
            // Optional: insert default data into Supabase
            const { error: insertError } = await supabase
              .from('sales_reps')
              .upsert(defaultSalesReps);
            
            if (insertError) {
              console.error("Error inserting sales reps:", insertError);
            }
          }
        } else {
          // Fallback to local data when no Supabase connection
          const savedTeams = localStorage.getItem('teams');
          const savedSalesReps = localStorage.getItem('sales_reps');
          
          if (savedTeams) {
            setTeams(JSON.parse(savedTeams));
          } else {
            setTeams(defaultTeams);
            localStorage.setItem('teams', JSON.stringify(defaultTeams));
          }
          
          if (savedSalesReps) {
            setSalesReps(JSON.parse(savedSalesReps));
          } else {
            setSalesReps(defaultSalesReps);
            localStorage.setItem('sales_reps', JSON.stringify(defaultSalesReps));
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Unable to load report data");
        
        // Fallback to default data in case of error
        setTeams([
          { id: "1", name: "Alpha Team" },
          { id: "2", name: "Beta Team" },
          { id: "3", name: "Delta Team" }
        ]);
        
        setSalesReps([
          { id: "1", name: "John Silva", team: "1", sales: 120000, goal: 150000, conversion: 28 },
          { id: "2", name: "Maria Santos", team: "1", sales: 180000, goal: 150000, conversion: 35 },
          { id: "3", name: "Pedro Costa", team: "2", sales: 90000, goal: 100000, conversion: 22 },
          { id: "4", name: "Ana Oliveira", team: "2", sales: 110000, goal: 100000, conversion: 29 },
          { id: "5", name: "Carlos Mendes", team: "3", sales: 130000, goal: 120000, conversion: 31 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);

  // Filter sales reps by team
  const filteredSalesReps = teamId === "all" 
    ? salesReps 
    : salesReps.filter(salesRep => salesRep.team === teamId);

  // Totals for dashboard
  const totalSales = salesReps.reduce((acc, v) => acc + v.sales, 0);
  const totalGoals = salesReps.reduce((acc, v) => acc + v.goal, 0);
  const goalPercentage = Math.round((totalSales / totalGoals) * 100);
  const averageConversion = Math.round(salesReps.reduce((acc, v) => acc + v.conversion, 0) / salesReps.length);

  // Function to generate report with Supabase data
  const generateReport = async () => {
    console.log('Generating report with the following filters:', {
      period: selectedPeriod,
      team: teamId,
      date: date
    });
    
    try {
      setIsLoading(true);
      
      if (supabase) {
        // Real implementation with Supabase
        let query = supabase.from('sales_reps').select('*');
        
        // Apply filters
        if (teamId !== 'all') {
          query = query.eq('team', teamId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setSalesReps(data);
          toast.success("Report generated successfully!");
        }
      } else {
        // Simulation for local mode
        toast.success("Report generated successfully!");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Unable to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    teams,
    salesReps,
    filteredSalesReps,
    selectedPeriod,
    setSelectedPeriod,
    teamId,
    setTeamId,
    date,
    setDate,
    totalSales,
    totalGoals,
    goalPercentage,
    averageConversion,
    generateReport,
    isLoading
  };
};
