import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase.functions.invoke('ai-consultant', {
      body: request
    });

    if (error) throw error;
    return data;
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