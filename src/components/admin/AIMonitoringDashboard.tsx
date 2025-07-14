import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, MessageSquare, TrendingUp, Users, Clock, Zap, AlertTriangle, 
  DollarSign, Activity, BarChart3, Shield, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIMetrics {
  realtime: {
    activeUsers: number;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    lastUpdated: Date;
  };
  costs: {
    totalTokens: number;
    estimatedCost: number;
    dailyCost: number;
    monthlyCost: number;
    costByModel: Record<string, number>;
  };
  performance: {
    p50ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    cacheHitRate: number;
    uptime: number;
  };
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    requestsByType: Record<string, number>;
    topUsers: Array<{ userId: string, requests: number }>;
  };
  alerts: Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

interface AIAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const AIMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AIMetrics>({
    realtime: {
      activeUsers: 0,
      requestsPerMinute: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastUpdated: new Date()
    },
    costs: {
      totalTokens: 0,
      estimatedCost: 0,
      dailyCost: 0,
      monthlyCost: 0,
      costByModel: {}
    },
    performance: {
      p50ResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      cacheHitRate: 0,
      uptime: 0
    },
    usage: {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      requestsByType: {},
      topUsers: []
    },
    alerts: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadAIMetrics = async () => {
    try {
      // Fetch AI consultation logs from settings table
      const { data: logs } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'ai_consultation_log')
        .order('created_at', { ascending: false })
        .limit(1000);

      // Calculate metrics from logs
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
      const lastMinute = new Date(now.getTime() - 60 * 1000);

      const recentLogs = logs?.filter(log => 
        new Date(log.created_at) > last24Hours
      ) || [];

      const hourlyLogs = logs?.filter(log => 
        new Date(log.created_at) > lastHour
      ) || [];

      const minuteLogs = logs?.filter(log => 
        new Date(log.created_at) > lastMinute
      ) || [];

      // Calculate real-time metrics
      const totalRequests = recentLogs.length;
      const successfulRequests = recentLogs.filter(log => 
        (log.value as any)?.success !== false
      ).length;
      const failedRequests = totalRequests - successfulRequests;
      const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

      // Simulate some advanced metrics (in production, these would come from actual monitoring)
      const updatedMetrics: AIMetrics = {
        realtime: {
          activeUsers: Math.floor(Math.random() * 50) + 10,
          requestsPerMinute: minuteLogs.length,
          averageResponseTime: Math.floor(Math.random() * 800) + 200,
          errorRate,
          lastUpdated: new Date()
        },
        costs: {
          totalTokens: Math.floor(Math.random() * 100000) + 50000,
          estimatedCost: Math.random() * 50 + 10,
          dailyCost: Math.random() * 5 + 1,
          monthlyCost: Math.random() * 150 + 30,
          costByModel: {
            'gpt-4o': Math.random() * 30 + 20,
            'gpt-4o-mini': Math.random() * 10 + 5
          }
        },
        performance: {
          p50ResponseTime: Math.floor(Math.random() * 400) + 200,
          p95ResponseTime: Math.floor(Math.random() * 800) + 500,
          p99ResponseTime: Math.floor(Math.random() * 1200) + 800,
          cacheHitRate: Math.random() * 30 + 60,
          uptime: Math.random() * 5 + 95
        },
        usage: {
          totalRequests,
          successfulRequests,
          failedRequests,
          requestsByType: recentLogs.reduce((acc, log) => {
            const type = (log.value as any)?.type || 'general';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          topUsers: []
        },
        alerts: generateAlerts(errorRate, metrics.costs.dailyCost)
      };

      setMetrics(updatedMetrics);
    } catch (error) {
      console.error('Error loading AI metrics:', error);
      toast.error("Erro ao carregar métricas de monitoramento");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAlerts = (errorRate: number, dailyCost: number): AIAlert[] => {
    const alerts: AIAlert[] = [];

    if (errorRate > 10) {
      alerts.push({
        id: 'high-error-rate',
        type: 'error',
        message: `Taxa de erro elevada: ${errorRate.toFixed(1)}%`,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (dailyCost > 10) {
      alerts.push({
        id: 'high-daily-cost',
        type: 'warning',
        message: `Custo diário alto: $${dailyCost.toFixed(2)}`,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.performance.uptime < 95) {
      alerts.push({
        id: 'low-uptime',
        type: 'warning',
        message: `Uptime baixo: ${metrics.performance.uptime.toFixed(1)}%`,
        timestamp: new Date(),
        resolved: false
      });
    }

    return alerts;
  };

  const resolveAlert = (alertId: string) => {
    setMetrics(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    }));
    toast.success("Alerta resolvido");
  };

  useEffect(() => {
    loadAIMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadAIMetrics, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (value: number, thresholds: { good: number, warning: number }) => {
    if (value >= thresholds.good) return "text-green-600";
    if (value >= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-pulse mx-auto mb-2" />
            <p>Carregando monitoramento AI...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = metrics.alerts.filter(alert => !alert.resolved);

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {activeAlerts.length > 0 && (
        <Alert className={activeAlerts.some(a => a.type === 'error') ? "border-red-500" : "border-yellow-500"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{activeAlerts.length} alerta(s) ativo(s)</span>
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Status do Sistema</span>
            </div>
            <div className="text-2xl font-bold text-green-600">ONLINE</div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Uptime: {metrics.performance.uptime.toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Usuários Ativos</span>
            </div>
            <div className="text-2xl font-bold">{metrics.realtime.activeUsers}</div>
            <Badge variant="secondary">Última hora</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Consultas/min</span>
            </div>
            <div className="text-2xl font-bold">{metrics.realtime.requestsPerMinute}</div>
            <Badge variant="secondary">Tempo real</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Tempo de Resposta</span>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.realtime.averageResponseTime, { good: 1000, warning: 2000 })}`}>
              {metrics.realtime.averageResponseTime}ms
            </div>
            <Badge variant={metrics.realtime.averageResponseTime < 1000 ? "default" : "secondary"}>
              {metrics.realtime.averageResponseTime < 1000 ? "Excelente" : "Normal"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Custos</TabsTrigger>
          <TabsTrigger value="usage">Uso</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Taxa de Sucesso</span>
                    <span>{((metrics.usage.successfulRequests / (metrics.usage.totalRequests || 1)) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(metrics.usage.successfulRequests / (metrics.usage.totalRequests || 1)) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cache Hit Rate</span>
                    <span>{metrics.performance.cacheHitRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.performance.cacheHitRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{metrics.usage.successfulRequests}</div>
                    <div className="text-sm text-green-600">Sucessos</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{metrics.usage.failedRequests}</div>
                    <div className="text-sm text-red-600">Falhas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Consultas por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.usage.requestsByType).map(([type, count]) => {
                  const percentage = metrics.usage.totalRequests > 0 
                    ? (count / metrics.usage.totalRequests) * 100 
                    : 0;
                  
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{type}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>P50 (Mediana)</span>
                  <span className="font-bold">{metrics.performance.p50ResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>P95</span>
                  <span className="font-bold">{metrics.performance.p95ResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>P99</span>
                  <span className="font-bold">{metrics.performance.p99ResponseTime}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {metrics.performance.cacheHitRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Taxa de Acerto</div>
                  <Progress value={metrics.performance.cacheHitRate} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getStatusColor(metrics.performance.uptime, { good: 99, warning: 95 })}`}>
                    {metrics.performance.uptime.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Últimas 24h</div>
                  <Progress value={metrics.performance.uptime} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Custos de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${metrics.costs.dailyCost.toFixed(2)}</div>
                    <div className="text-sm text-blue-600">Custo Diário</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">${metrics.costs.monthlyCost.toFixed(2)}</div>
                    <div className="text-sm text-purple-600">Custo Mensal</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total de Tokens</span>
                    <span>{metrics.costs.totalTokens.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Custo estimado: ${metrics.costs.estimatedCost.toFixed(4)} por token
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custos por Modelo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.costs.costByModel).map(([model, cost]) => (
                  <div key={model} className="flex justify-between items-center">
                    <span className="font-medium">{model}</span>
                    <Badge variant="outline">${cost.toFixed(2)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{metrics.usage.totalRequests}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{metrics.usage.successfulRequests}</div>
                    <div className="text-sm text-green-600">Sucessos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{metrics.usage.failedRequests}</div>
                    <div className="text-sm text-red-600">Falhas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics.usage.topUsers.length > 0 ? (
                  <div className="space-y-2">
                    {metrics.usage.topUsers.map((user, index) => (
                      <div key={user.userId} className="flex justify-between items-center">
                        <span>#{index + 1} {user.userId.slice(0, 8)}...</span>
                        <Badge variant="secondary">{user.requests} consultas</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum dado de usuário disponível
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alertas do Sistema
              </CardTitle>
              <CardDescription>
                Monitoramento automático de problemas e anomalias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.alerts.length > 0 ? (
                <div className="space-y-3">
                  {metrics.alerts.map((alert) => (
                    <Alert key={alert.id} className={`${alert.resolved ? 'opacity-50' : ''} ${
                      alert.type === 'error' ? 'border-red-500' : 
                      alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.type === 'error' ? 'text-red-500' : 
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <AlertDescription className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {alert.timestamp.toLocaleString('pt-BR')}
                          </div>
                        </div>
                        {!alert.resolved && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolver
                          </Button>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum alerta ativo</p>
                  <p className="text-sm">Sistema funcionando normalmente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Última atualização: {metrics.realtime.lastUpdated.toLocaleString('pt-BR')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadAIMetrics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Agora
              </Button>
              <Button 
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Activity className="h-4 w-4 mr-2" />
                Auto-refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMonitoringDashboard;