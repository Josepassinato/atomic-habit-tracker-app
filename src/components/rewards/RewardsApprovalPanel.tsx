import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { amazonAffiliateService, RewardAchievement } from '@/services/amazon-affiliate-service';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

export const RewardsApprovalPanel: React.FC = () => {
  const { userProfile } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    loadPendingAchievements();
  }, []);

  const loadPendingAchievements = async () => {
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
    const { data, error } = await supabase
      .from('reward_achievements')
      .select(`
        *,
        amazon_rewards (*),
        user_profiles!reward_achievements_user_id_fkey (name, email)
      `)
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .order('achievement_date', { ascending: false });
    
    if (error) {
      console.error('Error loading achievements:', error);
      toast.error('Erro ao carregar solicitações');
    } else {
      setAchievements(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedAchievement || !userProfile?.id) return;
    
    const success = await amazonAffiliateService.approveRewardAchievement(
      selectedAchievement.id,
      userProfile.id,
      notes
    );
    
    if (success) {
      toast.success('Recompensa aprovada!');
      setSelectedAchievement(null);
      setNotes('');
      loadPendingAchievements();
    } else {
      toast.error('Erro ao aprovar recompensa');
    }
  };

  const handleReject = async () => {
    if (!selectedAchievement || !userProfile?.id || !notes) {
      toast.error('Por favor, adicione um motivo para a rejeição');
      return;
    }
    
    const success = await amazonAffiliateService.rejectRewardAchievement(
      selectedAchievement.id,
      userProfile.id,
      notes
    );
    
    if (success) {
      toast.success('Recompensa rejeitada');
      setSelectedAchievement(null);
      setNotes('');
      loadPendingAchievements();
    } else {
      toast.error('Erro ao rejeitar recompensa');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aprovações Pendentes
          </CardTitle>
          <CardDescription>
            {achievements.length} solicitações aguardando aprovação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma solicitação pendente
            </p>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {achievement.amazon_rewards?.image_url && (
                            <img 
                              src={achievement.amazon_rewards.image_url} 
                              alt={achievement.amazon_rewards.reward_name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold">{achievement.amazon_rewards?.reward_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.user_profiles?.name} ({achievement.user_profiles?.email})
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: achievement.amazon_rewards?.currency || 'BRL'
                            }).format(achievement.amazon_rewards?.estimated_price || 0)}
                          </Badge>
                          <Badge variant="outline">
                            {new Date(achievement.achievement_date).toLocaleDateString('pt-BR')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedAchievement(achievement);
                            setAction('approve');
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedAchievement(achievement);
                            setAction('reject');
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                        {achievement.affiliate_link && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(achievement.affiliate_link, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedAchievement !== null} onOpenChange={() => {
        setSelectedAchievement(null);
        setNotes('');
        setAction(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Aprovar Recompensa' : 'Rejeitar Recompensa'}
            </DialogTitle>
            <DialogDescription>
              {selectedAchievement?.amazon_rewards?.reward_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder={action === 'approve' 
                ? 'Observações (opcional)' 
                : 'Motivo da rejeição (obrigatório)'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedAchievement(null);
              setNotes('');
              setAction(null);
            }}>
              Cancelar
            </Button>
            {action === 'approve' ? (
              <Button onClick={handleApprove}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar e Enviar Link
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
