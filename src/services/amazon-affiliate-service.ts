import { supabase } from "@/integrations/supabase/client";

export interface AmazonReward {
  id: string;
  company_id: string;
  achievement_type: string;
  achievement_level: string;
  reward_name: string;
  reward_description?: string;
  amazon_asin: string;
  estimated_price: number;
  currency: string;
  category: string;
  image_url?: string;
  is_active: boolean;
  requires_approval: boolean;
}

export interface RewardAchievement {
  id: string;
  company_id: string;
  user_id: string;
  reward_id: string;
  achievement_date: string;
  status: 'pending' | 'approved' | 'purchased' | 'rejected';
  affiliate_link?: string;
  purchase_confirmed: boolean;
  notes?: string;
}

export interface AffiliateConfig {
  region: string;
  affiliate_tag: string;
  marketplace_domain: string;
}

export const amazonAffiliateService = {
  async getAffiliateConfig(language: string): Promise<AffiliateConfig | null> {
    const regionMap: Record<string, string> = {
      'pt': 'BR',
      'en': 'US',
      'es': 'ES'
    };
    
    const region = regionMap[language] || 'US';
    
    const { data, error } = await supabase
      .from('amazon_affiliate_config')
      .select('*')
      .eq('region', region)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching affiliate config:', error);
      return null;
    }
    
    return data;
  },

  generateAffiliateLink(asin: string, config: AffiliateConfig): string {
    return `https://www.${config.marketplace_domain}/dp/${asin}?tag=${config.affiliate_tag}`;
  },

  async getRewardsByAchievement(
    companyId: string,
    achievementType: string,
    achievementLevel: string
  ): Promise<AmazonReward[]> {
    const { data, error } = await supabase
      .from('amazon_rewards')
      .select('*')
      .eq('company_id', companyId)
      .eq('achievement_type', achievementType)
      .eq('achievement_level', achievementLevel)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching rewards:', error);
      return [];
    }
    
    return data || [];
  },

  async createRewardAchievement(
    companyId: string,
    userId: string,
    rewardId: string,
    affiliateLink: string
  ): Promise<any | null> {
    const { data, error } = await supabase
      .from('reward_achievements')
      .insert({
        company_id: companyId,
        user_id: userId,
        reward_id: rewardId,
        affiliate_link: affiliateLink,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating reward achievement:', error);
      return null;
    }
    
    return data;
  },

  async getUserAchievements(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('reward_achievements')
      .select(`
        *,
        amazon_rewards (
          reward_name,
          reward_description,
          image_url,
          estimated_price,
          currency
        )
      `)
      .eq('user_id', userId)
      .order('achievement_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
    
    return data || [];
  },

  async approveRewardAchievement(
    achievementId: string,
    approvedBy: string,
    notes?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('reward_achievements')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', achievementId);
    
    if (error) {
      console.error('Error approving reward:', error);
      return false;
    }
    
    return true;
  },

  async rejectRewardAchievement(
    achievementId: string,
    rejectedBy: string,
    notes: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('reward_achievements')
      .update({
        status: 'rejected',
        approved_by: rejectedBy,
        approved_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', achievementId);
    
    if (error) {
      console.error('Error rejecting reward:', error);
      return false;
    }
    
    return true;
  },

  async confirmPurchase(achievementId: string): Promise<boolean> {
    const { error } = await supabase
      .from('reward_achievements')
      .update({
        status: 'purchased',
        purchase_confirmed: true,
        purchase_date: new Date().toISOString()
      })
      .eq('id', achievementId);
    
    if (error) {
      console.error('Error confirming purchase:', error);
      return false;
    }
    
    return true;
  }
};
