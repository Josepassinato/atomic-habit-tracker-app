import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { AIService } from '@/services/ai-service';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Users,
  Loader2,
  Brain
} from 'lucide-react';

interface SalesAnalysis {
  summary: {
    performance: 'excellent' | 'good' | 'fair' | 'poor';
    goalAttainment: number;
    trendDirection: 'up' | 'down' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
  };
  insights: string[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'habits' | 'goals' | 'team' | 'process';
    action: string;
    expectedImpact: string;
  }>;
  opportunities: string[];
  warnings: string[];
  kpis: {
    salesEfficiency: number;
    habitCorrelation: number;
    teamSynergy: number;
    growthPotential: number;
  };
}

export const SalesAnalyticsDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SalesAnalysis | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [analysisType, setAnalysisType] = useState<'performance' | 'trends' | 'opportunities' | 'complete'>('complete');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await AIService.analyzeSales({
        companyId: userProfile?.empresa_id,
        period,
        analysisType
      });

      setAnalysis(response.analysis);
      toast.success('Análise de vendas concluída! 📊');
    } catch (error) {
      console.error('Erro na análise:', error);
      toast.error('Erro ao gerar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      runAnalysis();
    }
  }, [userProfile, period, analysisType]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return variants[priority as keyof typeof variants] || 'outline';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Análise Inteligente de Vendas
          </h2>
          <p className="text-muted-foreground">
            Insights e recomendações baseados em IA
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            'Atualizar Análise'
          )}
        </Button>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
            <SelectItem value="quarter">Último Trimestre</SelectItem>
            <SelectItem value="year">Último Ano</SelectItem>
          </SelectContent>
        </Select>

        <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Análise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="complete">Análise Completa</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="trends">Tendências</SelectItem>
            <SelectItem value="opportunities">Oportunidades</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Gerando análise inteligente...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && !loading && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold p-2 rounded ${getPerformanceColor(analysis.summary.performance)}`}>
                  {analysis.summary.performance === 'excellent' ? 'Excelente' :
                   analysis.summary.performance === 'good' ? 'Boa' :
                   analysis.summary.performance === 'fair' ? 'Regular' : 'Ruim'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alcance de Metas</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.summary.goalAttainment}%</div>
                <Progress value={analysis.summary.goalAttainment} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tendência</CardTitle>
                {getTrendIcon(analysis.summary.trendDirection)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysis.summary.trendDirection === 'up' ? '📈 Crescendo' :
                   analysis.summary.trendDirection === 'down' ? '📉 Declinando' : '📊 Estável'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nível de Risco</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskColor(analysis.summary.riskLevel)}`}>
                  {analysis.summary.riskLevel === 'low' ? '🟢 Baixo' :
                   analysis.summary.riskLevel === 'medium' ? '🟡 Médio' : '🔴 Alto'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KPIs */}
          <Card>
            <CardHeader>
              <CardTitle>Indicadores Chave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Eficiência de Vendas</label>
                  <Progress value={analysis.kpis.salesEfficiency} />
                  <span className="text-sm text-muted-foreground">{analysis.kpis.salesEfficiency}/100</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Correlação Hábitos</label>
                  <Progress value={analysis.kpis.habitCorrelation} />
                  <span className="text-sm text-muted-foreground">{analysis.kpis.habitCorrelation}/100</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sinergia da Equipe</label>
                  <Progress value={analysis.kpis.teamSynergy} />
                  <span className="text-sm text-muted-foreground">{analysis.kpis.teamSynergy}/100</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potencial de Crescimento</label>
                  <Progress value={analysis.kpis.growthPotential} />
                  <span className="text-sm text-muted-foreground">{analysis.kpis.growthPotential}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Principais</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityBadge(rec.priority)}>
                        {rec.priority === 'high' ? 'Alta' :
                         rec.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <h4 className="font-medium mb-1">{rec.action}</h4>
                    <p className="text-sm text-muted-foreground">{rec.expectedImpact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities and Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">⚠</span>
                      <span className="text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};