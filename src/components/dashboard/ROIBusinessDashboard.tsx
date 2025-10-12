import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, DollarSign, Target, Activity, RefreshCw } from 'lucide-react';

interface ROIMetrics {
  period_start: string;
  period_end: string;
  habits_completed: number;
  revenue_generated: number;
  habit_completion_rate: number;
  roi_score: number;
  sales_rep_name?: string;
  team_name?: string;
}

export const ROIBusinessDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [period, setPeriod] = useState('month');
  const [roiData, setRoiData] = useState<ROIMetrics[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadROIData();
    }
  }, [companyId, period]);

  const loadCompanyData = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('company_id')
      .single();
    
    setCompanyId(data?.company_id || null);
  };

  const loadROIData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roi_analytics')
        .select(`
          *,
          sales_reps!inner(name),
          teams(name)
        `)
        .eq('company_id', companyId)
        .order('period_start', { ascending: false })
        .limit(30);

      if (error) throw error;

      const formattedData = data.map(item => ({
        period_start: item.period_start,
        period_end: item.period_end,
        habits_completed: item.habits_completed,
        revenue_generated: item.revenue_generated,
        habit_completion_rate: item.habit_completion_rate,
        roi_score: item.roi_score,
        sales_rep_name: item.sales_reps?.name,
        team_name: item.teams?.name
      }));

      setRoiData(formattedData);
    } catch (error: any) {
      toast({
        title: "Error loading ROI data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = async () => {
    if (!companyId) return;

    setCalculating(true);
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const { error } = await supabase.rpc('calculate_roi_score', {
        p_company_id: companyId,
        p_period_start: thirtyDaysAgo.toISOString().split('T')[0],
        p_period_end: today.toISOString().split('T')[0]
      });

      if (error) throw error;

      toast({
        title: "ROI calculated successfully",
        description: "Updated analytics for the last 30 days"
      });

      loadROIData();
    } catch (error: any) {
      toast({
        title: "Calculation failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  };

  const totalRevenue = roiData.reduce((sum, item) => sum + Number(item.revenue_generated), 0);
  const totalHabits = roiData.reduce((sum, item) => sum + item.habits_completed, 0);
  const avgROIScore = roiData.length > 0 
    ? roiData.reduce((sum, item) => sum + Number(item.roi_score), 0) / roiData.length 
    : 0;
  const avgCompletionRate = roiData.length > 0
    ? roiData.reduce((sum, item) => sum + Number(item.habit_completion_rate), 0) / roiData.length
    : 0;

  const correlationData = roiData.map(item => ({
    habits: item.habits_completed,
    revenue: Number(item.revenue_generated),
    name: item.sales_rep_name
  }));

  const trendData = roiData.slice(0, 12).reverse().map(item => ({
    period: new Date(item.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Number(item.revenue_generated),
    habits: item.habits_completed,
    completion: Number(item.habit_completion_rate)
  }));

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Loading ROI analytics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">ROI Business Dashboard</h2>
          <p className="text-muted-foreground">Correlação entre hábitos e receita</p>
        </div>
        <Button onClick={calculateROI} disabled={calculating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${calculating ? 'animate-spin' : ''}`} />
          Calculate ROI
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {period} period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habits Completed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
            <p className="text-xs text-muted-foreground">
              Across all teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgROIScore.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue per completed habit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average habit adherence
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Habit-Revenue Correlation</CardTitle>
            <CardDescription>
              Direct correlation between habits completed and revenue generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="habits" name="Habits Completed" />
                <YAxis dataKey="revenue" name="Revenue" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Sales Reps" data={correlationData} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Revenue and habit completion over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="habits" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Habits Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate vs Revenue</CardTitle>
          <CardDescription>
            Impact of habit adherence on sales performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="completion" 
                fill="hsl(var(--chart-3))" 
                name="Completion Rate (%)"
              />
              <Bar 
                yAxisId="right"
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                name="Revenue ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
