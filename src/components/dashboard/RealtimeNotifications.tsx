import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Users, Target, Activity } from 'lucide-react';
import { useHabitsRealtime, useTeamRealtime } from '@/hooks/useRealtimeUpdates';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RealtimeNotification {
  id: string;
  type: 'habit_verified' | 'goal_updated' | 'team_activity' | 'member_joined';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ComponentType<any>;
  priority: 'low' | 'medium' | 'high';
}

const RealtimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Hook para escutar updates em tempo real
  useHabitsRealtime((habit) => {
    if (habit.auto_verified || habit.verified) {
      addNotification({
        type: 'habit_verified',
        title: 'Hábito Verificado',
        description: `"${habit.title}" foi ${habit.auto_verified ? 'verificado automaticamente' : 'aprovado pela liderança'}`,
        priority: habit.auto_verified ? 'medium' : 'high',
        icon: CheckCircle
      });
    }
  });

  useTeamRealtime((team) => {
    addNotification({
      type: 'team_activity',
      title: 'Atividade da Equipe',
      description: `Equipe ${team.name} teve atualizações nas métricas`,
      priority: 'low',
      icon: Users
    });
  });

  const addNotification = (notification: Omit<RealtimeNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Manter apenas 20 mais recentes
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'habit_verified': return CheckCircle;
      case 'goal_updated': return Target;
      case 'team_activity': return Users;
      case 'member_joined': return Activity;
      default: return Bell;
    }
  };

  // Removed demo notifications - will show real data only

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-lg">Atualizações em Tempo Real</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <CardDescription>
          Acompanhe verificações automáticas e atividades da equipe
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Nenhuma notificação por enquanto</p>
            <p className="text-xs">As atualizações aparecerão aqui em tempo real</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const Icon = notification.icon || getIcon(notification.type);
            
            return (
              <React.Fragment key={notification.id}>
                <div 
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    notification.read 
                      ? 'bg-gray-50 opacity-75' 
                      : 'bg-white hover:bg-gray-50 border-primary/20'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      
                      <p className={`text-xs mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.description}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(notification.timestamp, { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
                
                {index < notifications.length - 1 && (
                  <Separator className="my-2" />
                )}
              </React.Fragment>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeNotifications;