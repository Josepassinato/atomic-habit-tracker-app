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
    return [];
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