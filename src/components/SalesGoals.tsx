
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
  target: number;
  current: number;
  percentage: number;
}


const SalesGoals = () => {
  const { supabase } = useSupabase();
  const { t } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<string>(t('defaultAiSuggestion'));
  
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    
    try {
      if (supabase) {
        // Fetch goals from Supabase using new column names
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .order('id');
        
        if (error) {
          console.error("Error fetching goals:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Map new column names to expected format
          const mappedGoals = data.map((goal: any) => ({
            id: goal.id,
            name: goal.name,
            target: goal.target_value,
            current: goal.current_value,
            percentage: goal.percentage
          }));
          setGoals(mappedGoals);
        } else {
          setGoals([]);
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
        setGoals([]);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
      toast.error(t('loadError'));
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('salesGoalsSection')}</CardTitle>
            <CardDescription>{new Date().toLocaleDateString('pt-BR', { month: 'long' })}, {new Date().getFullYear()}</CardDescription>
          </div>
          <Badge className="flex items-center gap-1" variant="outline">
            <TrendingUp className="h-3 w-3" />
            {t('aiDefined')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            {t('noGoalsYet')}
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
                        ? `$${goal.current.toLocaleString()} of $${goal.target.toLocaleString()}`
                        : `${goal.current} of ${goal.target}`}
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
              <p className="font-medium">{t('aiSuggestion')}:</p>
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

export default SalesGoals;
