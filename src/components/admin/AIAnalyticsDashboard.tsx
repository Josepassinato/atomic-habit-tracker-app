import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, TrendingUp, Users, Clock, Zap, AlertTriangle } from "lucide-react";
import { AIService } from "@/services/ai-service";
import { toast } from "sonner";

interface AIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  tokenUsage: {
    total: number;
    byType: {
      general: number;
      sales: number;
      habits: number;
      goals: number;
      strategy: number;
    };
  };
  lastUpdated: Date;
}

const AIAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AIMetrics>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    tokenUsage: {
      total: 0,
      byType: {
        general: 0,
        sales: 0,
        habits: 0,
        goals: 0,
        strategy: 0
      }
    },
    lastUpdated: new Date()
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isTestingAI, setIsTestingAI] = useState(false);

  const loadAIMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate loading AI metrics (in real implementation, this would come from a logging service)
      // For now, we'll generate some realistic sample data
      const simulatedMetrics: AIMetrics = {
        totalRequests: Math.floor(Math.random() * 1000) + 500,
        successfulRequests: Math.floor(Math.random() * 900) + 450,
        failedRequests: Math.floor(Math.random() * 50) + 10,
        averageResponseTime: Math.floor(Math.random() * 800) + 200,
        tokenUsage: {
          total: Math.floor(Math.random() * 50000) + 10000,
          byType: {
            general: Math.floor(Math.random() * 10000) + 2000,
            sales: Math.floor(Math.random() * 15000) + 3000,
            habits: Math.floor(Math.random() * 12000) + 2500,
            goals: Math.floor(Math.random() * 8000) + 1500,
            strategy: Math.floor(Math.random() * 5000) + 1000
          }
        },
        lastUpdated: new Date()
      };

      setMetrics(simulatedMetrics);
      console.log("AI metrics loaded:", simulatedMetrics);
    } catch (error) {
      console.error("Error loading AI metrics:", error);
      toast.error("Erro ao carregar métricas de IA");
    } finally {
      setIsLoading(false);
    }
  };

  const testAIService = async () => {
    setIsTestingAI(true);
    try {
      const startTime = performance.now();
      
      const result = await AIService.consultWithAI({
        message: "Test AI service performance",
        consultationType: 'general'
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (result) {
        toast.success(`✅ IA operacional! Tempo: ${responseTime.toFixed(0)}ms`);
        
        // Update metrics with the new test
        setMetrics(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          successfulRequests: prev.successfulRequests + 1,
          averageResponseTime: Math.round((prev.averageResponseTime + responseTime) / 2),
          lastUpdated: new Date()
        }));
      } else {
        toast.error("❌ Falha no teste de IA");
        setMetrics(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          failedRequests: prev.failedRequests + 1,
          lastUpdated: new Date()
        }));
      }
    } catch (error) {
      console.error("AI service test failed:", error);
      toast.error("❌ Erro no teste de IA");
      
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        failedRequests: prev.failedRequests + 1,
        lastUpdated: new Date()
      }));
    } finally {
      setIsTestingAI(false);
    }
  };

  useEffect(() => {
    loadAIMetrics();
    
    // Auto-refresh every minute
    const interval = setInterval(loadAIMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const successRate = metrics.totalRequests > 0 
    ? (metrics.successfulRequests / metrics.totalRequests) * 100 
    : 0;
  
  const errorRate = metrics.totalRequests > 0 
    ? (metrics.failedRequests / metrics.totalRequests) * 100 
    : 0;

  const getPerformanceStatus = () => {
    if (successRate >= 99) return { color: "bg-green-600", label: "Excelente" };
    if (successRate >= 95) return { color: "bg-blue-600", label: "Bom" };
    if (successRate >= 90) return { color: "bg-yellow-600", label: "Regular" };
    return { color: "bg-red-600", label: "Crítico" };
  };

  const performanceStatus = getPerformanceStatus();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Brain className="h-8 w-8 animate-pulse mx-auto mb-2" />
            <p>Carregando métricas de IA...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total de Consultas</span>
            </div>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <Badge variant="secondary">Todas as categorias</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Taxa de Sucesso</span>
            </div>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <Badge variant="secondary" className={performanceStatus.color}>
              {performanceStatus.label}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Tempo Médio</span>
            </div>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <Badge variant={metrics.averageResponseTime < 1000 ? "default" : "secondary"}>
              {metrics.averageResponseTime < 1000 ? "Rápido" : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Tokens Usados</span>
            </div>
            <div className="text-2xl font-bold">{metrics.tokenUsage.total.toLocaleString()}</div>
            <Badge variant="secondary">Total</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success/Error Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance da IA
            </CardTitle>
            <CardDescription>Taxa de sucesso e falhas das consultas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taxa de Sucesso</span>
                <span>{successRate.toFixed(1)}%</span>
              </div>
              <Progress value={successRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taxa de Erro</span>
                <span>{errorRate.toFixed(1)}%</span>
              </div>
              <Progress value={errorRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.successfulRequests}</div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{metrics.failedRequests}</div>
                <div className="text-sm text-red-600">Falhas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Usage by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Uso de Tokens por Categoria
            </CardTitle>
            <CardDescription>Distribuição do uso de tokens por tipo de consulta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(metrics.tokenUsage.byType).map(([type, tokens]) => {
              const percentage = metrics.tokenUsage.total > 0 
                ? (tokens / metrics.tokenUsage.total) * 100 
                : 0;
              
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{type}</span>
                    <span>{tokens.toLocaleString()} tokens ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Ações e Testes
          </CardTitle>
          <CardDescription>
            Ferramentas para monitoramento e teste do sistema de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={testAIService}
              disabled={isTestingAI}
              className="flex items-center gap-2"
            >
              {isTestingAI ? (
                <>
                  <Brain className="h-4 w-4 animate-pulse" />
                  Testando IA...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Testar IA
                </>
              )}
            </Button>

            <Button 
              variant="outline"
              onClick={loadAIMetrics}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Atualizar Métricas
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Última atualização: {metrics.lastUpdated.toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalyticsDashboard;