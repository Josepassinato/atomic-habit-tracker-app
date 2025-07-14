import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AIService } from '@/services/ai-service';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'performance' | 'opportunity' | 'warning' | 'suggestion';
  title: string;
  description: string;
  impact: 'alto' | 'medio' | 'baixo';
  confidence: number;
  actionable: boolean;
  relatedData?: any;
}

interface AIInsightsDashboardProps {
  teamId?: string;
  period?: 'week' | 'month' | 'quarter';
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  teamId,
  period = 'month'
}) => {
  const { userProfile } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    generateInsights();
  }, [teamId, period]);

  const generateInsights = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const response = await AIService.analyzeSales({
        companyId: userProfile.empresa_id,
        teamId,
        period,
        analysisType: 'complete'
      });

      const parsedInsights = parseInsightsFromAnalysis(response);
      setInsights(parsedInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      toast.error('Erro ao gerar insights de IA');
    } finally {
      setLoading(false);
    }
  };

  const parseInsightsFromAnalysis = (analysis: any): AIInsight[] => {
    // Mock insights - in practice, you'd parse the AI analysis response
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'performance',
        title: 'Aumento na taxa de conversão',
        description: 'A taxa de conversão aumentou 15% nas últimas duas semanas, principalmente devido aos novos scripts de follow-up.',
        impact: 'alto',
        confidence: 92,
        actionable: false,
        relatedData: { metric: 'conversion_rate', change: '+15%' }
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Potencial de melhoria em prospecção',
        description: 'Existe uma oportunidade de aumentar 30% o volume de leads qualificados focando em horários específicos.',
        impact: 'alto',
        confidence: 87,
        actionable: true,
        relatedData: { bestTimes: ['9:00-11:00', '14:00-16:00'] }
      },
      {
        id: '3',
        type: 'warning',
        title: 'Queda no engajamento de leads',
        description: 'O tempo de resposta médio aos leads aumentou para 4 horas, o que pode impactar negativamente as conversões.',
        impact: 'medio',
        confidence: 85,
        actionable: true,
        relatedData: { averageResponseTime: '4h', recommended: '< 2h' }
      },
      {
        id: '4',
        type: 'suggestion',
        title: 'Implementar cadência de nutrição',
        description: 'Leads que não converteram podem ser reativados com uma sequência automatizada de e-mails.',
        impact: 'medio',
        confidence: 78,
        actionable: true,
        relatedData: { potentialLeads: 156, estimatedConversion: '12%' }
      }
    ];

    return mockInsights;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return <BarChart3 className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'suggestion': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance': return 'default';
      case 'opportunity': return 'default';
      case 'warning': return 'destructive';
      case 'suggestion': return 'secondary';
      default: return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'destructive';
      case 'medio': return 'default';
      case 'baixo': return 'secondary';
      default: return 'default';
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return true;
    return insight.type === activeTab;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Insights de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Insights de IA
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Atualizado: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generateInsights}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="opportunity">Oportunidades</TabsTrigger>
            <TabsTrigger value="warning">Alertas</TabsTrigger>
            <TabsTrigger value="suggestion">Sugestões</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Nenhum insight disponível para este filtro.
                  </p>
                </div>
              ) : (
                filteredInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-md bg-muted`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{insight.title}</h4>
                            <Badge variant={getInsightColor(insight.type)}>
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant={getImpactColor(insight.impact)}>
                              Impacto {insight.impact}
                            </Badge>
                            <Badge variant="outline">
                              {insight.confidence}% confiança
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="secondary">
                                Acionável
                              </Badge>
                            )}
                          </div>
                          {insight.relatedData && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                                {JSON.stringify(insight.relatedData, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};