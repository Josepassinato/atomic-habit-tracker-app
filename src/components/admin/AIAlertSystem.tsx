import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell, AlertTriangle, CheckCircle, Clock, 
  Mail, MessageSquare, Zap, Shield, TrendingUp, Settings 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AlertRule {
  id: string;
  name: string;
  type: 'performance' | 'cost' | 'error' | 'security' | 'usage';
  condition: {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
    timeWindow: number; // minutes
  };
  enabled: boolean;
  notifications: {
    email: boolean;
    inApp: boolean;
    webhook?: string;
  };
  created: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

interface ActiveAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  metadata: any;
}

interface AlertConfig {
  globalEnabled: boolean;
  maxAlertsPerHour: number;
  autoResolveAfter: number; // minutes
  escalationRules: {
    enabled: boolean;
    criticalThreshold: number; // minutes before escalation
  };
}

const AIAlertSystem: React.FC = () => {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [config, setConfig] = useState<AlertConfig>({
    globalEnabled: true,
    maxAlertsPerHour: 50,
    autoResolveAfter: 60,
    escalationRules: {
      enabled: false,
      criticalThreshold: 30
    }
  });
  
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    name: '',
    type: 'performance',
    condition: {
      metric: 'error_rate',
      operator: '>',
      threshold: 5,
      timeWindow: 15
    },
    enabled: true,
    notifications: {
      email: false,
      inApp: true
    }
  });

  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load initial data
  useEffect(() => {
    loadAlertRules();
    loadActiveAlerts();
    loadAlertConfig();
    
    // Set up real-time monitoring
    const interval = setInterval(() => {
      checkAlertConditions();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const loadAlertRules = async () => {
    try {
      // In production, these would be stored in database
      const defaultRules: AlertRule[] = [
        {
          id: 'error-rate-high',
          name: 'Taxa de Erro Alta',
          type: 'error',
          condition: {
            metric: 'error_rate',
            operator: '>',
            threshold: 5,
            timeWindow: 15
          },
          enabled: true,
          notifications: {
            email: true,
            inApp: true
          },
          created: new Date(),
          triggerCount: 0
        },
        {
          id: 'response-time-slow',
          name: 'Tempo de Resposta Lento',
          type: 'performance',
          condition: {
            metric: 'avg_response_time',
            operator: '>',
            threshold: 2000,
            timeWindow: 10
          },
          enabled: true,
          notifications: {
            email: false,
            inApp: true
          },
          created: new Date(),
          triggerCount: 0
        },
        {
          id: 'daily-cost-high',
          name: 'Custo Diário Alto',
          type: 'cost',
          condition: {
            metric: 'daily_cost',
            operator: '>',
            threshold: 20,
            timeWindow: 60
          },
          enabled: true,
          notifications: {
            email: true,
            inApp: true
          },
          created: new Date(),
          triggerCount: 0
        }
      ];
      
      setRules(defaultRules);
    } catch (error) {
      console.error('Error loading alert rules:', error);
      toast.error("Erro ao carregar regras de alerta");
    }
  };

  const loadActiveAlerts = async () => {
    try {
      // Load from database or generate sample alerts
      const sampleAlerts: ActiveAlert[] = [
        {
          id: 'alert-1',
          ruleId: 'error-rate-high',
          ruleName: 'Taxa de Erro Alta',
          message: 'Taxa de erro atingiu 8.5% nos últimos 15 minutos',
          severity: 'high',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          resolved: false,
          metadata: {
            currentValue: 8.5,
            threshold: 5,
            affectedRequests: 23
          }
        }
      ];
      
      setActiveAlerts(sampleAlerts);
    } catch (error) {
      console.error('Error loading active alerts:', error);
    }
  };

  const loadAlertConfig = async () => {
    try {
      // Load configuration from database
      console.log('Alert configuration loaded');
    } catch (error) {
      console.error('Error loading alert config:', error);
    }
  };

  const checkAlertConditions = async () => {
    if (!config.globalEnabled) return;

    try {
      // Fetch current metrics
      const { data: logs } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'ai_consultation_log')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!logs || logs.length === 0) return;

      // Calculate current metrics
      const now = new Date();
      const recentLogs = logs.filter(log => {
        const logTime = new Date(log.created_at);
        return (now.getTime() - logTime.getTime()) <= (15 * 60 * 1000); // Last 15 minutes
      });

      const errorRate = recentLogs.length > 0 ? 
        (recentLogs.filter(log => (log.value as any)?.success === false).length / recentLogs.length) * 100 : 0;

      const avgResponseTime = recentLogs.reduce((sum, log) => {
        const responseTime = (log.value as any)?.responseTime || 1000;
        return sum + responseTime;
      }, 0) / (recentLogs.length || 1);

      // Check each rule
      for (const rule of rules.filter(r => r.enabled)) {
        let currentValue = 0;
        let shouldTrigger = false;

        switch (rule.condition.metric) {
          case 'error_rate':
            currentValue = errorRate;
            break;
          case 'avg_response_time':
            currentValue = avgResponseTime;
            break;
          case 'daily_cost':
            currentValue = Math.random() * 30; // Simulated cost
            break;
        }

        // Check condition
        switch (rule.condition.operator) {
          case '>':
            shouldTrigger = currentValue > rule.condition.threshold;
            break;
          case '<':
            shouldTrigger = currentValue < rule.condition.threshold;
            break;
          case '>=':
            shouldTrigger = currentValue >= rule.condition.threshold;
            break;
          case '<=':
            shouldTrigger = currentValue <= rule.condition.threshold;
            break;
        }

        if (shouldTrigger) {
          // Check if we already have an active alert for this rule
          const existingAlert = activeAlerts.find(a => a.ruleId === rule.id && !a.resolved);
          
          if (!existingAlert) {
            triggerAlert(rule, currentValue);
          }
        }
      }
    } catch (error) {
      console.error('Error checking alert conditions:', error);
    }
  };

  const triggerAlert = (rule: AlertRule, currentValue: number) => {
    const severity = determineSeverity(rule.type, currentValue, rule.condition.threshold);
    
    const newAlert: ActiveAlert = {
      id: `alert-${Date.now()}`,
      ruleId: rule.id,
      ruleName: rule.name,
      message: `${rule.name}: ${currentValue.toFixed(1)} ${rule.condition.operator} ${rule.condition.threshold}`,
      severity,
      timestamp: new Date(),
      resolved: false,
      metadata: {
        currentValue,
        threshold: rule.condition.threshold,
        metric: rule.condition.metric
      }
    };

    setActiveAlerts(prev => [newAlert, ...prev]);
    
    // Update rule trigger count
    setRules(prev => prev.map(r => 
      r.id === rule.id 
        ? { ...r, triggerCount: r.triggerCount + 1, lastTriggered: new Date() }
        : r
    ));

    // Send notifications
    if (rule.notifications.inApp) {
      toast.error(`🚨 ${newAlert.message}`, {
        duration: 10000,
        action: {
          label: "Ver Detalhes",
          onClick: () => console.log("View alert details", newAlert)
        }
      });
    }

    console.log(`Alert triggered: ${newAlert.message}`);
  };

  const determineSeverity = (type: AlertRule['type'], currentValue: number, threshold: number): ActiveAlert['severity'] => {
    const ratio = currentValue / threshold;
    
    if (type === 'error' || type === 'security') {
      if (ratio > 3) return 'critical';
      if (ratio > 2) return 'high';
      if (ratio > 1.5) return 'medium';
      return 'low';
    }
    
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  };

  const resolveAlert = async (alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true, resolvedAt: new Date(), resolvedBy: 'admin' }
          : alert
      )
    );
    
    toast.success("Alerta resolvido com sucesso");
  };

  const createAlertRule = async () => {
    if (!newRule.name || !newRule.condition) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsCreatingRule(true);
    try {
      const rule: AlertRule = {
        id: `rule-${Date.now()}`,
        name: newRule.name,
        type: newRule.type || 'performance',
        condition: newRule.condition!,
        enabled: newRule.enabled || true,
        notifications: newRule.notifications || { email: false, inApp: true },
        created: new Date(),
        triggerCount: 0
      };

      setRules(prev => [...prev, rule]);
      setShowCreateForm(false);
      setNewRule({
        name: '',
        type: 'performance',
        condition: {
          metric: 'error_rate',
          operator: '>',
          threshold: 5,
          timeWindow: 15
        },
        enabled: true,
        notifications: {
          email: false,
          inApp: true
        }
      });
      
      toast.success("Regra de alerta criada com sucesso");
    } catch (error) {
      console.error('Error creating alert rule:', error);
      toast.error("Erro ao criar regra de alerta");
    } finally {
      setIsCreatingRule(false);
    }
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast.success("Regra removida com sucesso");
  };

  const toggleRule = (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled } : r
    ));
    toast.success(`Regra ${enabled ? 'ativada' : 'desativada'}`);
  };

  const getSeverityColor = (severity: ActiveAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: ActiveAlert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const activeUnresolvedAlerts = activeAlerts.filter(alert => !alert.resolved);

  return (
    <div className="space-y-6">
      {/* Alert Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Alertas Ativos</span>
            </div>
            <div className="text-2xl font-bold">{activeUnresolvedAlerts.length}</div>
            <Badge variant={activeUnresolvedAlerts.length > 0 ? "destructive" : "secondary"}>
              {activeUnresolvedAlerts.length > 0 ? "Requer Atenção" : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Regras Ativas</span>
            </div>
            <div className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</div>
            <Badge variant="secondary">de {rules.length} total</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Alertas Hoje</span>
            </div>
            <div className="text-2xl font-bold">
              {activeAlerts.filter(a => 
                a.timestamp.toDateString() === new Date().toDateString()
              ).length}
            </div>
            <Badge variant="secondary">24h</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Sistema</span>
            </div>
            <div className="text-2xl font-bold text-green-600">ONLINE</div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Monitorando
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeUnresolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Alertas Ativos ({activeUnresolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeUnresolvedAlerts.map((alert) => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {alert.timestamp.toLocaleString('pt-BR')} • {alert.ruleName}
                      </div>
                      {alert.metadata && (
                        <div className="text-xs opacity-70 mt-1">
                          Valor atual: {alert.metadata.currentValue?.toFixed(2)} • 
                          Limite: {alert.metadata.threshold}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolver
                  </Button>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alert Rules Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Regras de Alerta
              </CardTitle>
              <CardDescription>
                Configure condições automáticas para monitoramento
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Global Configuration */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Label>Sistema de Alertas Habilitado</Label>
              <Switch
                checked={config.globalEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({ ...prev, globalEnabled: checked }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>Max alertas por hora: {config.maxAlertsPerHour}</div>
              <div>Auto-resolução após: {config.autoResolveAfter} min</div>
            </div>
          </div>

          {/* Create Rule Form */}
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-4">Nova Regra de Alerta</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Nome da Regra</Label>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Taxa de erro alta"
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={newRule.type}
                    onValueChange={(value: AlertRule['type']) =>
                      setNewRule(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                      <SelectItem value="cost">Custo</SelectItem>
                      <SelectItem value="security">Segurança</SelectItem>
                      <SelectItem value="usage">Uso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Métrica</Label>
                  <Select
                    value={newRule.condition?.metric}
                    onValueChange={(value) =>
                      setNewRule(prev => ({
                        ...prev,
                        condition: { ...prev.condition!, metric: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error_rate">Taxa de Erro (%)</SelectItem>
                      <SelectItem value="avg_response_time">Tempo Resposta (ms)</SelectItem>
                      <SelectItem value="daily_cost">Custo Diário ($)</SelectItem>
                      <SelectItem value="requests_per_minute">Req/min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Operador</Label>
                  <Select
                    value={newRule.condition?.operator}
                    onValueChange={(value: any) =>
                      setNewRule(prev => ({
                        ...prev,
                        condition: { ...prev.condition!, operator: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">Maior que</SelectItem>
                      <SelectItem value="<">Menor que</SelectItem>
                      <SelectItem value=">=">Maior ou igual</SelectItem>
                      <SelectItem value="<=">Menor ou igual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Limite</Label>
                  <Input
                    type="number"
                    value={newRule.condition?.threshold}
                    onChange={(e) =>
                      setNewRule(prev => ({
                        ...prev,
                        condition: { ...prev.condition!, threshold: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Janela (min)</Label>
                  <Input
                    type="number"
                    value={newRule.condition?.timeWindow}
                    onChange={(e) =>
                      setNewRule(prev => ({
                        ...prev,
                        condition: { ...prev.condition!, timeWindow: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newRule.notifications?.inApp}
                    onCheckedChange={(checked) =>
                      setNewRule(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications!, inApp: checked }
                      }))
                    }
                  />
                  <Label>Notificação no App</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newRule.notifications?.email}
                    onCheckedChange={(checked) =>
                      setNewRule(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications!, email: checked }
                      }))
                    }
                  />
                  <Label>Email</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createAlertRule} disabled={isCreatingRule}>
                  {isCreatingRule ? "Criando..." : "Criar Regra"}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                  />
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-xs text-gray-500">
                      {rule.condition.metric} {rule.condition.operator} {rule.condition.threshold} 
                      • Janela: {rule.condition.timeWindow}min
                      • Disparos: {rule.triggerCount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{rule.type}</Badge>
                  {rule.lastTriggered && (
                    <Badge variant="secondary" className="text-xs">
                      Último: {rule.lastTriggered.toLocaleTimeString('pt-BR')}
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAlertSystem;