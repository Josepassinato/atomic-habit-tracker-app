
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";

const DashboardSummary = () => {
  const { supabase, isConfigured } = useSupabase();
  const { t } = useLanguage();
  const [salesGoal, setSalesGoal] = useState<number>(85);
  const [habitsCompleted, setHabitsCompleted] = useState<number>(72);
  const [totalBonus, setTotalBonus] = useState<number>(2.5);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (supabase && isConfigured) {
          // Fetch sales data for current user
          const userId = localStorage.getItem("user") 
            ? JSON.parse(localStorage.getItem("user")!).id 
            : null;
            
          if (!userId) {
            console.log("User not found, using default data");
            return;
          }
          
          // Fetch sales goals
          const { data: goalsData, error: goalsError } = await supabase
            .from('sales_reps')
            .select('meta_atual, vendas_total')
            .eq('id', userId)
            .single();
            
          if (goalsError) {
            console.log("No sales data found, using defaults");
            return;
          }
          
          if (goalsData) {
            const goal = goalsData.meta_atual || 0;
            const sales = goalsData.vendas_total || 0;
            const percentage = goal > 0 ? Math.min(Math.round((sales / goal) * 100), 100) : 85;
            setSalesGoal(percentage);
          }
          
          // Fetch habits
          const { data: habitsData, error: habitsError } = await supabase
            .from('habits')
            .select('*')
            .eq('usuario_id', userId);
            
          if (habitsError) {
            console.log("No habits data found, using defaults");
            return;
          }
          
          if (habitsData && habitsData.length > 0) {
            const totalHabits = habitsData.length;
            const completed = habitsData.filter(h => h.completed).length;
            const habitsPercentage = Math.round((completed / totalHabits) * 100);
            setHabitsCompleted(habitsPercentage);
          }
          
          // Calculate bonus
          const goalBonus = salesGoal >= 100 ? 3 : salesGoal >= 80 ? 1.5 : 0;
          const habitsBonus = habitsCompleted >= 90 ? 2 : habitsCompleted >= 70 ? 1 : 0;
          setTotalBonus(goalBonus + habitsBonus);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Continue with default values instead of showing error
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [supabase, isConfigured, salesGoal, habitsCompleted]);

  const getSalesGoalText = () => {
    if (salesGoal >= 100) return "Complete";
    if (salesGoal >= 80) return "On Track";
    return "In Progress";
  };

  const getHabitsText = () => {
    if (habitsCompleted >= 90) return "Excellent";
    if (habitsCompleted >= 70) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sales Goal</CardTitle>
          <CardDescription>Current month progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{salesGoal}%</div>
                <Badge variant={salesGoal >= 100 ? "default" : salesGoal >= 80 ? "secondary" : "outline"}>
                  {getSalesGoalText()}
                </Badge>
              </div>
              <Progress className="mt-2" value={salesGoal} />
              <p className="mt-2 text-sm text-muted-foreground">
                Current bonus: {salesGoal >= 100 ? "3%" : salesGoal >= 80 ? "1.5%" : "0%"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Atomic Habits</CardTitle>
          <CardDescription>Daily completion</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{habitsCompleted}%</div>
                <Badge variant={habitsCompleted >= 90 ? "default" : habitsCompleted >= 70 ? "secondary" : "outline"}>
                  {getHabitsText()}
                </Badge>
              </div>
              <Progress className="mt-2" value={habitsCompleted} />
              <p className="mt-2 text-sm text-muted-foreground">
                Current bonus: {habitsCompleted >= 90 ? "2%" : habitsCompleted >= 70 ? "1%" : "0%"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Bonus</CardTitle>
          <CardDescription>Accumulated reward</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalBonus}%</div>
                <Badge>Monthly Reward</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sales Goal</span>
                  <span className="font-medium">{salesGoal >= 100 ? "3.0%" : salesGoal >= 80 ? "1.5%" : "0.0%"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Habits Completion</span>
                  <span className="font-medium">{habitsCompleted >= 90 ? "2.0%" : habitsCompleted >= 70 ? "1.0%" : "0.0%"}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>{totalBonus}%</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
