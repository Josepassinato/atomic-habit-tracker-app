
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";

interface Goal {
  id: number;
  name: string;
  target_value: number;
  current_value: number;
  percentage: number;
}

const initialGoals = [
  {
    id: 1,
    name: "Main Goal",
    target_value: 120000,
    current_value: 102000,
    percentage: 85,
  },
  {
    id: 2,
    name: "Prospecting Goal",
    target_value: 50,
    current_value: 45,
    percentage: 90,
  },
  {
    id: 3,
    name: "Conversion Goal",
    target_value: 30,
    current_value: 18,
    percentage: 60,
  },
];

const MetasVendas = () => {
  const { supabase } = useSupabase();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<string>("Focus on the conversion goal by increasing the number of follow-ups for each qualified lead.");
  const { t } = useLanguage();
  
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    
    try {
      if (supabase) {
        // Fetch goals from Supabase
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .order('id');
        
        if (error) {
          console.error("Error fetching goals:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setGoals(data);
        } else {
          // If no data, initialize with default data
          const { error: insertError } = await supabase
            .from('goals')
            .upsert(initialGoals);
          
          if (insertError) {
            console.error("Error inserting goals:", insertError);
          }
          
          setGoals(initialGoals);
        }
        
        // Fetch AI suggestion
        const { data: suggestionData, error: suggestionError } = await supabase
          .from('ai_suggestions')
          .select('text')
          .eq('type', 'goal')
          .limit(1)
          .single();
        
        if (!suggestionError && suggestionData) {
          setAiSuggestion(suggestionData.text);
        }
      } else {
        // Fallback to local data
        const savedGoals = localStorage.getItem('goals');
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        } else {
          setGoals(initialGoals);
          localStorage.setItem('goals', JSON.stringify(initialGoals));
        }
        
        const savedSuggestion = localStorage.getItem('goal_suggestion');
        if (savedSuggestion) {
          setAiSuggestion(savedSuggestion);
        }
      }
    } catch (error) {
      console.error("Error loading goals:", error);
      toast.error("Unable to load goals");
      setGoals(initialGoals);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Goals</CardTitle>
            <CardDescription>{new Date().toLocaleDateString('en-US', { month: 'long' })}, {new Date().getFullYear()}</CardDescription>
          </div>
          <Badge className="flex items-center gap-1" variant="outline">
            <TrendingUp className="h-3 w-3" />
            AI Defined
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">{goal.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {goal.name === "Main Goal"
                        ? `$${goal.current_value.toLocaleString()} of $${goal.target_value.toLocaleString()}`
                        : `${goal.current_value} of ${goal.target_value}`}
                    </div>
                  </div>
                  <Badge
                    variant={goal.percentage >= 80 ? "secondary" : goal.percentage >= 50 ? "outline" : "destructive"}
                  >
                    {goal.percentage}%
                  </Badge>
                </div>
                <Progress value={goal.percentage} className="h-2" />
              </div>
            ))}
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">AI Suggestion:</p>
              <p className="mt-1 text-muted-foreground">
                {aiSuggestion}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetasVendas;
