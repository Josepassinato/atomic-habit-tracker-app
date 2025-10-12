export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{ action: string; title: string }>;
}

export type NotificationType = 
  | 'goal_near_completion'
  | 'habit_incomplete'
  | 'reward_approved'
  | 'achievement_unlocked'
  | 'manager_message'
  | 'team_update';

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);
      this.permission = Notification.permission;
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'Notification' in window;
  }

  async showNotification(payload: PushNotificationPayload): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    if (!this.registration) {
      await this.initialize();
    }

    if (this.registration) {
      await this.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: '/favicon.ico',
        data: {
          url: payload.url || '/',
          dateOfArrival: Date.now()
        },
        tag: payload.tag || 'notification',
        requireInteraction: payload.requireInteraction || false
      } as any);
    }
  }

  async showGoalNotification(goalName: string, percentage: number, url?: string): Promise<void> {
    await this.showNotification({
      title: `🎯 Meta próxima de ser alcançada!`,
      body: `${goalName} está ${percentage}% completa. Continue assim!`,
      url: url || '/metas',
      tag: 'goal_progress',
      requireInteraction: false
    });
  }

  async showHabitReminder(habitName: string, url?: string): Promise<void> {
    await this.showNotification({
      title: '⏰ Lembrete de hábito',
      body: `Não esqueça de completar: ${habitName}`,
      url: url || '/habitos',
      tag: 'habit_reminder',
      requireInteraction: false
    });
  }

  async showRewardApproval(rewardName: string, url?: string): Promise<void> {
    await this.showNotification({
      title: '🎁 Recompensa aprovada!',
      body: `Sua recompensa "${rewardName}" foi aprovada! Clique para resgatar.`,
      url: url || '/premiacoes',
      tag: 'reward_approved',
      requireInteraction: true
    });
  }

  async showAchievementUnlocked(achievementName: string, url?: string): Promise<void> {
    await this.showNotification({
      title: '🏆 Conquista desbloqueada!',
      body: `Parabéns! Você desbloqueou: ${achievementName}`,
      url: url || '/dashboard',
      tag: 'achievement',
      requireInteraction: true
    });
  }

  async showManagerMessage(message: string, from: string, url?: string): Promise<void> {
    await this.showNotification({
      title: `💬 Mensagem de ${from}`,
      body: message,
      url: url || '/dashboard',
      tag: 'manager_message',
      requireInteraction: true
    });
  }

  async showTeamUpdate(message: string, url?: string): Promise<void> {
    await this.showNotification({
      title: '👥 Atualização da equipe',
      body: message,
      url: url || '/dashboard',
      tag: 'team_update',
      requireInteraction: false
    });
  }
}

export const pushNotificationService = new PushNotificationService();
