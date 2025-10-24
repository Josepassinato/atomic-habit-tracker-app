import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, User, Eye, Edit, Trash, Plus } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  ip_address?: string;
  created_at: string;
}

const getActionIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case 'create': return <Plus className="h-4 w-4" />;
    case 'update': return <Edit className="h-4 w-4" />;
    case 'delete': return <Trash className="h-4 w-4" />;
    case 'view': return <Eye className="h-4 w-4" />;
    default: return <Shield className="h-4 w-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case 'create': return 'bg-green-500';
    case 'update': return 'bg-blue-500';
    case 'delete': return 'bg-red-500';
    case 'view': return 'bg-gray-500';
    default: return 'bg-primary';
  }
};

export const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      // Simulate audit logs since we don't have a real audit table yet
      // In production, this would fetch from an audit_logs table
      setLogs([]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Trilha de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
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
          Trilha de Auditoria
        </CardTitle>
        <CardDescription>
          Registro de todas as ações realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full text-white ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{log.user_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.action.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {log.action === 'create' && `Criou ${log.resource_type}`}
                    {log.action === 'update' && `Atualizou ${log.resource_type}`}
                    {log.action === 'delete' && `Excluiu ${log.resource_type}`}
                    {log.action === 'view' && `Visualizou ${log.resource_type}`}
                  </p>
                  {log.details && (
                    <div className="text-xs text-muted-foreground">
                      <code className="bg-muted px-2 py-1 rounded">
                        {JSON.stringify(log.details, null, 2)}
                      </code>
                    </div>
                  )}
                  {log.ip_address && (
                    <div className="text-xs text-muted-foreground mt-1">
                      IP: {log.ip_address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};