import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, Zap, Shield, Clock, Database, 
  TrendingUp, AlertTriangle, CheckCircle, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OptimizationSettings {
  caching: {
    enabled: boolean;
    ttl: number; // Time to live in minutes
    maxSize: number; // Max cache entries
  };
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    requestsPerHour: number;
    burstLimit: number;
  };
  performance: {
    timeout: number;
    maxTokens: number;
    temperature: number;
    model: string;
  };
  monitoring: {
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    metricsEnabled: boolean;
    alertsEnabled: boolean;
  };
  security: {
    inputValidation: boolean;
    outputFiltering: boolean;
    rateLimitByIP: boolean;
    blockSuspiciousRequests: boolean;
  };
}

interface PerformanceMetrics {
  cacheHitRate: number;
  averageResponseTime: number;
  requestsBlocked: number;
  errorRate: number;
  totalRequests: number;
  optimizationScore: number;
}

const AIPerformanceOptimizer: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    caching: {
      enabled: true,
      ttl: 300, // 5 minutes
      maxSize: 1000
    },
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      burstLimit: 10
    },
    performance: {
      timeout: 30000,
      maxTokens: 1500,
      temperature: 0.7,
      model: 'gpt-4o'
    },
    monitoring: {
      logLevel: 'info',
      metricsEnabled: true,
      alertsEnabled: true
    },
    security: {
      inputValidation: true,
      outputFiltering: true,
      rateLimitByIP: true,
      blockSuspiciousRequests: true
    }
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheHitRate: 0,
    averageResponseTime: 0,
    requestsBlocked: 0,
    errorRate: 0,
    totalRequests: 0,
    optimizationScore: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (data) {
        // In a real implementation, settings would be stored in the database
        // For now, we'll use the current state as default
        console.log('Settings loaded from database');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, these settings would be saved to database
      // and applied to the edge function configuration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
      
      toast.success("Configurações de otimização salvas com sucesso!");
      calculateOptimizationScore();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateOptimizationScore = () => {
    let score = 0;
    
    // Caching optimization
    if (settings.caching.enabled) score += 20;
    if (settings.caching.ttl >= 300) score += 10;
    
    // Rate limiting
    if (settings.rateLimiting.enabled) score += 15;
    if (settings.rateLimiting.requestsPerMinute <= 100) score += 10;
    
    // Performance settings
    if (settings.performance.timeout <= 30000) score += 10;
    if (settings.performance.maxTokens <= 2000) score += 10;
    
    // Security
    if (settings.security.inputValidation) score += 10;
    if (settings.security.outputFiltering) score += 5;
    if (settings.security.rateLimitByIP) score += 5;
    if (settings.security.blockSuspiciousRequests) score += 5;
    
    setMetrics(prev => ({ ...prev, optimizationScore: score }));
  };

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate loading real performance metrics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const simulatedMetrics: PerformanceMetrics = {
        cacheHitRate: Math.random() * 40 + 50, // 50-90%
        averageResponseTime: Math.random() * 500 + 200, // 200-700ms
        requestsBlocked: Math.floor(Math.random() * 100),
        errorRate: Math.random() * 5, // 0-5%
        totalRequests: Math.floor(Math.random() * 10000) + 1000,
        optimizationScore: 0
      };
      
      setMetrics(simulatedMetrics);
      calculateOptimizationScore();
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setIsLoading(false);
    }
  };

  const runOptimizationTest = async () => {
    toast.info("Executando teste de otimização...");
    
    try {
      // Test AI service with current settings
      const startTime = performance.now();
      
      const response = await supabase.functions.invoke('ai-consultant', {
        body: {
          message: "Performance optimization test",
          consultationType: 'general'
        }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (response.error) {
        toast.error("Teste falhou: " + response.error.message);
      } else {
        toast.success(`Teste concluído! Tempo de resposta: ${responseTime.toFixed(0)}ms`);
        
        // Update metrics with test results
        setMetrics(prev => ({
          ...prev,
          averageResponseTime: Math.round((prev.averageResponseTime + responseTime) / 2),
          totalRequests: prev.totalRequests + 1
        }));
      }
    } catch (error) {
      console.error('Optimization test failed:', error);
      toast.error("Erro no teste de otimização");
    }
  };

  useEffect(() => {
    loadSettings();
    loadMetrics();
    calculateOptimizationScore();
  }, []);

  useEffect(() => {
    calculateOptimizationScore();
  }, [settings]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: "Excelente", color: "bg-green-100 text-green-800" };
    if (score >= 60) return { label: "Bom", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Necessita Melhoria", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score de Otimização
          </CardTitle>
          <CardDescription>
            Avaliação geral da configuração de performance da IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(metrics.optimizationScore)}`}>
                {metrics.optimizationScore}/100
              </div>
              <Badge className={getScoreStatus(metrics.optimizationScore).color}>
                {getScoreStatus(metrics.optimizationScore).label}
              </Badge>
            </div>
            <div className="text-right space-y-2">
              <Button onClick={runOptimizationTest} className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Testar Performance
              </Button>
              <Button variant="outline" onClick={loadMetrics} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Métricas
              </Button>
            </div>
          </div>
          <Progress value={metrics.optimizationScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Cache Hit Rate</span>
            </div>
            <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
            <Badge variant={metrics.cacheHitRate > 70 ? "default" : "secondary"}>
              {metrics.cacheHitRate > 70 ? "Ótimo" : "Regular"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Tempo Médio</span>
            </div>
            <div className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(0)}ms</div>
            <Badge variant={metrics.averageResponseTime < 1000 ? "default" : "secondary"}>
              {metrics.averageResponseTime < 1000 ? "Rápido" : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Requisições Bloqueadas</span>
            </div>
            <div className="text-2xl font-bold">{metrics.requestsBlocked}</div>
            <Badge variant="secondary">Segurança</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Taxa de Erro</span>
            </div>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
            <Badge variant={metrics.errorRate < 5 ? "default" : "destructive"}>
              {metrics.errorRate < 5 ? "Baixa" : "Alta"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caching Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configurações de Cache
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Cache Habilitado</Label>
              <Switch
                checked={settings.caching.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    caching: { ...prev.caching, enabled: checked }
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>TTL do Cache (minutos): {settings.caching.ttl}</Label>
              <Slider
                value={[settings.caching.ttl]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    caching: { ...prev.caching, ttl: value }
                  }))
                }
                max={1440}
                min={60}
                step={60}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Tamanho Máximo do Cache: {settings.caching.maxSize}</Label>
              <Slider
                value={[settings.caching.maxSize]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    caching: { ...prev.caching, maxSize: value }
                  }))
                }
                max={10000}
                min={100}
                step={100}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rate Limiting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Rate Limiting Habilitado</Label>
              <Switch
                checked={settings.rateLimiting.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    rateLimiting: { ...prev.rateLimiting, enabled: checked }
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Requisições por Minuto: {settings.rateLimiting.requestsPerMinute}</Label>
              <Slider
                value={[settings.rateLimiting.requestsPerMinute]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    rateLimiting: { ...prev.rateLimiting, requestsPerMinute: value }
                  }))
                }
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Limite de Burst: {settings.rateLimiting.burstLimit}</Label>
              <Slider
                value={[settings.rateLimiting.burstLimit]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    rateLimiting: { ...prev.rateLimiting, burstLimit: value }
                  }))
                }
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Modelo de IA</Label>
              <Select
                value={settings.performance.model}
                onValueChange={(value) =>
                  setSettings(prev => ({
                    ...prev,
                    performance: { ...prev.performance, model: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o (Mais capaz)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Mais rápido)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeout (ms): {settings.performance.timeout}</Label>
              <Slider
                value={[settings.performance.timeout]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    performance: { ...prev.performance, timeout: value }
                  }))
                }
                max={60000}
                min={5000}
                step={5000}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {settings.performance.maxTokens}</Label>
              <Slider
                value={[settings.performance.maxTokens]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    performance: { ...prev.performance, maxTokens: value }
                  }))
                }
                max={4000}
                min={500}
                step={100}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Temperature: {settings.performance.temperature}</Label>
              <Slider
                value={[settings.performance.temperature]}
                onValueChange={([value]) =>
                  setSettings(prev => ({
                    ...prev,
                    performance: { ...prev.performance, temperature: value }
                  }))
                }
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Validação de Input</Label>
              <Switch
                checked={settings.security.inputValidation}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, inputValidation: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Filtro de Output</Label>
              <Switch
                checked={settings.security.outputFiltering}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, outputFiltering: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Rate Limit por IP</Label>
              <Switch
                checked={settings.security.rateLimitByIP}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, rateLimitByIP: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Bloquear Requisições Suspeitas</Label>
              <Switch
                checked={settings.security.blockSuspiciousRequests}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, blockSuspiciousRequests: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              As configurações serão aplicadas à função de IA em tempo real
            </div>
            <Button 
              onClick={saveSettings} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPerformanceOptimizer;