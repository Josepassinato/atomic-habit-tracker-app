import { supabase } from '@/integrations/supabase/client';
import { aiCache } from './performance-cache';
import { intelligentRetry } from './intelligent-retry';

export interface AIConsultationRequest {
  message: string;
  consultationType: 'sales' | 'habits' | 'goals' | 'general' | 'strategy';
  context?: any;
}

export interface SalesAnalysisRequest {
  companyId?: string;
  teamId?: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  analysisType: 'performance' | 'trends' | 'opportunities' | 'complete';
}

export interface HabitVerificationRequest {
  habitId: string;
  habitTitle: string;
  habitDescription: string;
  evidence: {
    type: 'text' | 'image' | 'data';
    content: string;
    metadata?: any;
  };
}

export class AIService {
  static async consultWithAI(request: AIConsultationRequest) {
    const cacheKey = `consultation:${request.consultationType}:${request.message.slice(0, 50)}`;
    
    return aiCache.getOrSet(cacheKey, async () => {
      return intelligentRetry.executeResilient(async () => {
        const { data, error } = await supabase.functions.invoke('ai-consultant', {
          body: request
        });

        if (error) throw error;
        return data;
      }, {
        retry: { maxAttempts: 3, baseDelay: 1000 },
        timeout: 30000,
        circuitBreaker: { failureThreshold: 5, resetTimeout: 60000, monitoringPeriod: 60000 }
      });
    }, 300000); // Cache for 5 minutes
  }

  static async analyzeSales(request: SalesAnalysisRequest) {
    const { data, error } = await supabase.functions.invoke('sales-analysis', {
      body: request
    });

    if (error) throw error;
    return data;
  }

  static async verifyHabit(request: HabitVerificationRequest) {
    const { data, error } = await supabase.functions.invoke('habits-verification', {
      body: request
    });

    if (error) throw error;
    return data;
  }
}