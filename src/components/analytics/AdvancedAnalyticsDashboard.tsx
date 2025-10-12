import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, Brain, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface PredictionData {
  prediction: number;
  confidence_low: number;
  confidence_high: number;
  probability: number;
  trends: string[];
  recommendations: string[];
}

interface InsightsData {
  roi_score: number;
  correlations: string[];
  patterns: string[];
  improvements: string[];
  risks: string[];
}

interface ROIData {
  roi_percentage: number;
  revenue_increase: number;
  efficiency_gain: number;
  cost_benefit: string;
  summary: string;
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [roiAnalysis, setROIAnalysis] = useState<ROIData | null>(null);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [habitsData, setHabitsData] = useState<number[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [userProfile?.id]);

  const loadAnalyticsData = async () => {
    if (!userProfile?.id) return;

    // Load sales data from goals
    const { data: goals } = await supabase
      .from('goals')
      .select('current_value, created_at')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: true });

    if (goals) {
      setSalesData(goals.map(g => g.current_value || 0));
    }

    // Load habits completion rates
    const { data: habits } = await supabase
      .from('habits')
      .select('completed, created_at')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: true });

    if (habits) {
      const completionRates = calculateCompletionRates(habits);
      setHabitsData(completionRates);
    }
  };

  const calculateCompletionRates = (habits: any[]) => {
    const groupedByMonth: { [key: string]: { total: number; completed: number } } = {};
    
    habits.forEach(habit => {
      const month = new Date(habit.created_at).toISOString().slice(0, 7);
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = { total: 0, completed: 0 };
      }
      groupedByMonth[month].total++;
      if (habit.completed) groupedByMonth[month].completed++;
    });

    return Object.values(groupedByMonth).map(m => 
      m.total > 0 ? m.completed / m.total : 0
    );
  };

  const runPrediction = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced-analytics', {
        body: {
          type: 'prediction',
          data: {
            sales: salesData,
            current_month: salesData[salesData.length - 1] || 0,
            target: 100000
          }
        }
      });

      if (error) throw error;
      setPrediction(data.result);
      toast.success('Previsão gerada com sucesso!');
    } catch (error) {
      console.error('Error running prediction:', error);
      toast.error('Erro ao gerar previsão');
    } finally {
      setLoading(false);
    }
  };

  const runInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced-analytics', {
        body: {
          type: 'insights',
          data: {
            sales: salesData,
            habits: habitsData
          }
        }
      });

      if (error) throw error;
      setInsights(data.result);
      toast.success('Insights gerados com sucesso!');
    } catch (error) {
      console.error('Error running insights:', error);
      toast.error('Erro ao gerar insights');
    } finally {
      setLoading(false);
    }
  };

  const runROIAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced-analytics', {
        body: {
          type: 'roi_analysis',
          data: {
            sales: salesData,
            current_month: salesData[salesData.length - 1] || 0,
            habits: habitsData
          }
        }
      });

      if (error) throw error;
      setROIAnalysis(data.result);
      toast.success('Análise de ROI concluída!');
    } catch (error) {
      console.error('Error running ROI analysis:', error);
      toast.error('Erro ao analisar ROI');
    } finally {
      setLoading(false);
    }
  };

  const chartData = salesData.map((sales, index) => ({
    month: `Mês ${index + 1}`,
    vendas: sales,
    habitos: (habitsData[index] || 0) * 100000
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Avançado</h2>
          <p className="text-muted-foreground">Análises preditivas e insights com IA</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runPrediction} disabled={loading}>
            <Brain className="h-4 w-4 mr-2" />
            Gerar Previsão
          </Button>
          <Button onClick={runInsights} disabled={loading} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Insights IA
          </Button>
          <Button onClick={runROIAnalysis} disabled={loading} variant="outline">
            <DollarSign className="h-4 w-4 mr-2" />
            Análise ROI
          </Button>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Vendas</CardTitle>
            <CardDescription>Histórico e projeção</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="vendas" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas vs Hábitos</CardTitle>
            <CardDescription>Correlação performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vendas" stroke="#8884d8" />
                <Line type="monotone" dataKey="habitos" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions */}
      {prediction && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Previsão IA - Próximo Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Previsão</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prediction.prediction)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Probabilidade de Meta</p>
                <p className="text-2xl font-bold">{Math.round(prediction.probability)}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Intervalo de Confiança</p>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prediction.confidence_low)} - 
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prediction.confidence_high)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Tendências Identificadas:</h4>
              <div className="space-y-1">
                {prediction.trends.map((trend, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="outline">{trend}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recomendações:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {prediction.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {insights && (
        <Card className="border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Insights Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">ROI Score</p>
              <p className="text-3xl font-bold">{insights.roi_score.toFixed(1)}/10</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Correlações:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {insights.correlations.map((corr, i) => (
                    <li key={i}>{corr}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Padrões:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {insights.patterns.map((pattern, i) => (
                    <li key={i}>{pattern}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Oportunidades de Melhoria:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {insights.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>

            {insights.risks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Riscos Identificados:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {insights.risks.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ROI Analysis */}
      {roiAnalysis && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Análise de ROI - Hábitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-3xl font-bold text-green-600">+{roiAnalysis.roi_percentage.toFixed(1)}%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Aumento de Receita</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(roiAnalysis.revenue_increase)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Ganho de Eficiência</p>
                <p className="text-2xl font-bold">{roiAnalysis.efficiency_gain.toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Custo-Benefício:</h4>
              <p className="text-sm">{roiAnalysis.cost_benefit}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Resumo:</h4>
              <p className="text-sm">{roiAnalysis.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
