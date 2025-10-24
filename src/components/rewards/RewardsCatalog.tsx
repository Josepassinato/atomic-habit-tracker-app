import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShoppingCart, Gift } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { amazonAffiliateService, AmazonReward } from '@/services/amazon-affiliate-service';
import { useAuth } from '../auth/AuthProvider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RewardsCatalogProps {
  achievementType: string;
  achievementLevel: string;
  onRewardClaim?: (rewardId: string) => void;
}

export const RewardsCatalog: React.FC<RewardsCatalogProps> = ({
  achievementType,
  achievementLevel,
  onRewardClaim
}) => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const [rewards, setRewards] = useState<AmazonReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    loadRewards();
  }, [achievementType, achievementLevel]);

  const loadRewards = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('user_id', user.id)
      .single();
    
    if (!profile?.company_id) return;
    
    const companyId = profile.company_id;
    
    setLoading(true);
    const data = await amazonAffiliateService.getRewardsByAchievement(
      companyId,
      achievementType,
      achievementLevel
    );
    setRewards(data);
    setLoading(false);
  };

  const handleClaimReward = async (reward: AmazonReward) => {
    if (!userProfile?.id) return;
    
    setClaiming(reward.id);
    
    try {
      const config = await amazonAffiliateService.getAffiliateConfig(language);
      if (!config) {
        toast.error(t('errorLoadingData'));
        return;
      }

      const affiliateLink = amazonAffiliateService.generateAffiliateLink(
        reward.amazon_asin,
        config
      );

      const achievement = await amazonAffiliateService.createRewardAchievement(
        reward.company_id,
        userProfile.id,
        reward.id,
        affiliateLink
      );

      if (achievement) {
        if (reward.requires_approval) {
          toast.success('Recompensa solicitada! Aguardando aprovação do gerente.');
        } else {
          window.open(affiliateLink, '_blank');
          toast.success('Parabéns! Clique no link para resgatar sua recompensa.');
        }
        onRewardClaim?.(reward.id);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Erro ao solicitar recompensa');
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-32 bg-muted" />
            <CardContent className="h-24 bg-muted mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Gift className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma recompensa disponível para este nível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewards.map((reward) => (
        <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {reward.image_url && (
            <div className="aspect-square overflow-hidden bg-muted">
              <img 
                src={reward.image_url} 
                alt={reward.reward_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{reward.reward_name}</CardTitle>
              <Badge variant="secondary">
                {new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
                  style: 'currency',
                  currency: reward.currency
                }).format(reward.estimated_price)}
              </Badge>
            </div>
            {reward.reward_description && (
              <CardDescription className="line-clamp-2">
                {reward.reward_description}
              </CardDescription>
            )}
          </CardHeader>

          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={() => handleClaimReward(reward)}
              disabled={claiming === reward.id}
            >
              {claiming === reward.id ? (
                <>Processando...</>
              ) : reward.requires_approval ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Solicitar Recompensa
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Resgatar na Amazon
                </>
              )}
            </Button>
            
            {reward.requires_approval && (
              <p className="text-xs text-muted-foreground text-center">
                Requer aprovação do gerente
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
