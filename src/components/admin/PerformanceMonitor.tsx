import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Zap, TrendingUp, RefreshCw } from "lucide-react";
import { usePerformanceMonitoring } from "@/utils/performance-monitor/hooks";

interface PerformanceMetrics {
  responseTime: number;
  requestCount: number;
  errorRate: number;
  uptime: number;
  lastUpdated: Date;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    requestCount: 0,
    errorRate: 0,
    uptime: 99.9,
    lastUpdated: new Date()
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use performance monitoring hook
  const { getMetrics, clearMetrics } = usePerformanceMonitoring({
    enabled: true,
    sampleRate: 1.0,
    endpoint: '/api/performance'
  });

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate performance data collection
      const performanceData = getMetrics();
      
      // Calculate aggregated metrics
      const avgResponseTime = performanceData.length > 0 
        ? performanceData.reduce((sum, metric) => sum + metric.value, 0) / performanceData.length
        : 0;
      
      setMetrics({
        responseTime: Math.round(avgResponseTime),
        requestCount: performanceData.length,
        errorRate: Math.random() * 5, // Simulated error rate
        uptime: 99.9 - Math.random() * 0.5,
        lastUpdated: new Date()
      });
      
      console.log("Performance metrics updated:", {
        metrics: performanceData.length,
        avgResponseTime: avgResponseTime.toFixed(2)
      });
      
    } catch (error) {
      console.error("Error refreshing performance metrics:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getResponseTimeStatus = () => {
    if (metrics.responseTime < 200) return { status: "excellent", color: "bg-green-600" };
    if (metrics.responseTime < 500) return { status: "good", color: "bg-blue-600" };
    if (metrics.responseTime < 1000) return { status: "fair", color: "bg-yellow-600" };
    return { status: "poor", color: "bg-red-600" };
  };

  const getUptimeStatus = () => {
    if (metrics.uptime >= 99.9) return { status: "excellent", color: "bg-green-600" };
    if (metrics.uptime >= 99.5) return { status: "good", color: "bg-blue-600" };
    if (metrics.uptime >= 99.0) return { status: "fair", color: "bg-yellow-600" };
    return { status: "poor", color: "bg-red-600" };
  };

  const responseTimeStatus = getResponseTimeStatus();
  const uptimeStatus = getUptimeStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Monitor de Performance
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshMetrics}
            disabled={isRefreshing}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Métricas de performance do sistema em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Response Time */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tempo de Resposta</span>
            </div>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <Badge variant="secondary" className={responseTimeStatus.color}>
              {responseTimeStatus.status}
            </Badge>
          </div>

          {/* Request Count */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Requisições</span>
            </div>
            <div className="text-2xl font-bold">{metrics.requestCount}</div>
            <Badge variant="secondary">Total</Badge>
          </div>

          {/* Error Rate */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Taxa de Erro</span>
            </div>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
            <Badge variant={metrics.errorRate < 1 ? "default" : "destructive"}>
              {metrics.errorRate < 1 ? "Baixa" : "Atenção"}
            </Badge>
          </div>

          {/* Uptime */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Uptime</span>
            </div>
            <div className="text-2xl font-bold">{metrics.uptime.toFixed(1)}%</div>
            <Badge variant="secondary" className={uptimeStatus.color}>
              {uptimeStatus.status}
            </Badge>
          </div>
        </div>

        {/* Performance Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tempo de Resposta</span>
              <span>{metrics.responseTime}ms / 1000ms</span>
            </div>
            <Progress 
              value={Math.min((metrics.responseTime / 1000) * 100, 100)} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Uptime</span>
              <span>{metrics.uptime.toFixed(2)}% / 100%</span>
            </div>
            <Progress 
              value={metrics.uptime} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Taxa de Erro (Inversa)</span>
              <span>{(100 - metrics.errorRate).toFixed(1)}% / 100%</span>
            </div>
            <Progress 
              value={100 - metrics.errorRate} 
              className="h-2"
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Última atualização: {metrics.lastUpdated.toLocaleString('pt-BR')}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={clearMetrics}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Limpar Métricas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;