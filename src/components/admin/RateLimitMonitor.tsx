import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, AlertTriangle, TrendingDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface RateLimitData {
  current: number;
  limit: number;
  windowStart: Date;
  windowEnd: Date;
  blocked: number;
  lastReset: Date;
}

interface RateLimitConfig {
  requests: RateLimitData;
  tokens: RateLimitData;
  concurrent: RateLimitData;
}

const RateLimitMonitor: React.FC = () => {
  const [rateLimits, setRateLimits] = useState<RateLimitConfig>({
    requests: {
      current: 0,
      limit: 1000,
      windowStart: new Date(),
      windowEnd: new Date(Date.now() + 3600000), // 1 hour
      blocked: 0,
      lastReset: new Date()
    },
    tokens: {
      current: 0,
      limit: 50000,
      windowStart: new Date(),
      windowEnd: new Date(Date.now() + 3600000),
      blocked: 0,
      lastReset: new Date()
    },
    concurrent: {
      current: 0,
      limit: 10,
      windowStart: new Date(),
      windowEnd: new Date(Date.now() + 60000), // 1 minute
      blocked: 0,
      lastReset: new Date()
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRateLimitData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading rate limit data (in real implementation, this would come from a rate limiting service)
      const now = new Date();
      const simulatedData: RateLimitConfig = {
        requests: {
          current: Math.floor(Math.random() * 800) + 100,
          limit: 1000,
          windowStart: new Date(now.getTime() - 3600000),
          windowEnd: new Date(now.getTime() + 3600000),
          blocked: Math.floor(Math.random() * 20),
          lastReset: new Date(now.getTime() - Math.random() * 3600000)
        },
        tokens: {
          current: Math.floor(Math.random() * 40000) + 5000,
          limit: 50000,
          windowStart: new Date(now.getTime() - 3600000),
          windowEnd: new Date(now.getTime() + 3600000),
          blocked: Math.floor(Math.random() * 5),
          lastReset: new Date(now.getTime() - Math.random() * 3600000)
        },
        concurrent: {
          current: Math.floor(Math.random() * 8) + 1,
          limit: 10,
          windowStart: new Date(now.getTime() - 60000),
          windowEnd: new Date(now.getTime() + 60000),
          blocked: Math.floor(Math.random() * 3),
          lastReset: new Date(now.getTime() - Math.random() * 60000)
        }
      };

      setRateLimits(simulatedData);
      console.log("Rate limit data loaded:", simulatedData);
    } catch (error) {
      console.error("Error loading rate limit data:", error);
      toast.error("Erro ao carregar dados de rate limiting");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadRateLimitData();
    setIsRefreshing(false);
    toast.success("Dados atualizados!");
  };

  useEffect(() => {
    loadRateLimitData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadRateLimitData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getUsagePercentage = (current: number, limit: number) => {
    return (current / limit) * 100;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-600";
    if (percentage < 85) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage < 70) return "Normal";
    if (percentage < 85) return "Atenção";
    return "Crítico";
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const remaining = endTime.getTime() - now.getTime();
    
    if (remaining <= 0) return "Renovando...";
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Shield className="h-8 w-8 animate-pulse mx-auto mb-2" />
            <p>Carregando dados de rate limiting...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Monitor de Rate Limiting
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Monitoramento de limites de taxa para APIs e recursos do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rate Limit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Requests Rate Limit */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Requisições por Hora</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Atual / Limite</span>
                <span>{rateLimits.requests.current} / {rateLimits.requests.limit}</span>
              </div>
              
              <Progress 
                value={getUsagePercentage(rateLimits.requests.current, rateLimits.requests.limit)} 
                className="h-2"
              />
              
              <div className="flex justify-between items-center">
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(getUsagePercentage(rateLimits.requests.current, rateLimits.requests.limit))}
                >
                  {getStatusLabel(getUsagePercentage(rateLimits.requests.current, rateLimits.requests.limit))}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Renova em: {formatTimeRemaining(rateLimits.requests.windowEnd)}
                </span>
              </div>
              
              {rateLimits.requests.blocked > 0 && (
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {rateLimits.requests.blocked} bloqueadas
                </div>
              )}
            </div>
          </div>

          {/* Tokens Rate Limit */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Tokens por Hora</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Atual / Limite</span>
                <span>{rateLimits.tokens.current.toLocaleString()} / {rateLimits.tokens.limit.toLocaleString()}</span>
              </div>
              
              <Progress 
                value={getUsagePercentage(rateLimits.tokens.current, rateLimits.tokens.limit)} 
                className="h-2"
              />
              
              <div className="flex justify-between items-center">
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(getUsagePercentage(rateLimits.tokens.current, rateLimits.tokens.limit))}
                >
                  {getStatusLabel(getUsagePercentage(rateLimits.tokens.current, rateLimits.tokens.limit))}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Renova em: {formatTimeRemaining(rateLimits.tokens.windowEnd)}
                </span>
              </div>
              
              {rateLimits.tokens.blocked > 0 && (
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {rateLimits.tokens.blocked} bloqueadas
                </div>
              )}
            </div>
          </div>

          {/* Concurrent Rate Limit */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Requisições Simultâneas</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Atual / Limite</span>
                <span>{rateLimits.concurrent.current} / {rateLimits.concurrent.limit}</span>
              </div>
              
              <Progress 
                value={getUsagePercentage(rateLimits.concurrent.current, rateLimits.concurrent.limit)} 
                className="h-2"
              />
              
              <div className="flex justify-between items-center">
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(getUsagePercentage(rateLimits.concurrent.current, rateLimits.concurrent.limit))}
                >
                  {getStatusLabel(getUsagePercentage(rateLimits.concurrent.current, rateLimits.concurrent.limit))}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Janela: 1min
                </span>
              </div>
              
              {rateLimits.concurrent.blocked > 0 && (
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {rateLimits.concurrent.blocked} bloqueadas
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Status Geral do Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total de Bloqueios:</span>
              <span className="font-medium ml-2">
                {rateLimits.requests.blocked + rateLimits.tokens.blocked + rateLimits.concurrent.blocked}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Última Atualização:</span>
              <span className="font-medium ml-2">
                {new Date().toLocaleTimeString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="secondary" className="ml-2">
                {Math.max(
                  getUsagePercentage(rateLimits.requests.current, rateLimits.requests.limit),
                  getUsagePercentage(rateLimits.tokens.current, rateLimits.tokens.limit),
                  getUsagePercentage(rateLimits.concurrent.current, rateLimits.concurrent.limit)
                ) < 85 ? "Operacional" : "Atenção"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateLimitMonitor;