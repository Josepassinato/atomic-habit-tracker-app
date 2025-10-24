import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AIService } from '@/services/ai-service';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Zap, Clock, Star, Plus, RefreshCw, TrendingUp } from 'lucide-react';

interface HabitRecommendation {
  title: string;
  description: string;
  category: 'produtividade' | 'relacionamento' | 'prospeccao' | 'organizacao';
  difficulty: 'facil' | 'medio' | 'dificil';
  estimatedImpact: 'alto' | 'medio' | 'baixo';
  timeRequired: string;
  reasoning: string;
  suggestedSchedule: string;
}

interface HabitRecommendationsProps {
  onHabitAdd?: (habit: Omit<HabitRecommendation, 'reasoning'>) => void;
  currentHabits?: any[];
  userGoals?: any[];
}

export const HabitRecommendations: React.FC<HabitRecommendationsProps> = ({
  onHabitAdd,
  currentHabits = [],
  userGoals = []
}) => {
  const { userProfile } = useAuth();
  const [recommendations, setRecommendations] = useState<HabitRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateRecommendations();
  }, [currentHabits, userGoals]);

  const generateRecommendations = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await AIService.consultWithAI({
        message: `Baseado nos hábitos atuais e metas do usuário, sugira 4-5 hábitos atômicos que podem acelerar os resultados em vendas.`,
        consultationType: 'habits',
        context: {
          userId: userProfile.id,
          currentHabits,
          userGoals,
          companyId: userProfile.empresa_id,
          userRole: userProfile.role
        }
      });

      const parsedRecommendations = parseHabitRecommendations(response.response);
      setRecommendations(parsedRecommendations);
    } catch (error) {
      console.error('Erro ao gerar recomendações de hábitos:', error);
      setError('Erro ao gerar recomendações. Tente novamente.');
      toast.error('Erro ao gerar recomendações de hábitos');
    } finally {
      setLoading(false);
    }
  };

  const parseHabitRecommendations = (aiResponse: string): HabitRecommendation[] => {
    return [];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'secondary';
      case 'medio': return 'default';
      case 'dificil': return 'destructive';
      default: return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'default';
      case 'medio': return 'secondary';
      case 'baixo': return 'outline';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'produtividade': return <Zap className="h-4 w-4" />;
      case 'relacionamento': return <Star className="h-4 w-4" />;
      case 'prospeccao': return <TrendingUp className="h-4 w-4" />;
      case 'organizacao': return <Clock className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recomendações de Hábitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recomendações de Hábitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={generateRecommendations} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recomendações de Hábitos
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateRecommendations}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma recomendação disponível no momento.</p>
          </div>
        ) : (
          recommendations.map((recommendation, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(recommendation.category)}
                    <h4 className="font-medium">{recommendation.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={getDifficultyColor(recommendation.difficulty)}>
                      {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                    </Badge>
                    <Badge variant={getImpactColor(recommendation.estimatedImpact)}>
                      Impacto {recommendation.estimatedImpact}
                    </Badge>
                    <Badge variant="outline">
                      {recommendation.timeRequired}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Horário sugerido:</strong> {recommendation.suggestedSchedule}</p>
                    <p>{recommendation.reasoning}</p>
                  </div>
                </div>
                
                {onHabitAdd && (
                  <Button
                    size="sm"
                    onClick={() => onHabitAdd({
                      title: recommendation.title,
                      description: recommendation.description,
                      category: recommendation.category,
                      difficulty: recommendation.difficulty,
                      estimatedImpact: recommendation.estimatedImpact,
                      timeRequired: recommendation.timeRequired,
                      suggestedSchedule: recommendation.suggestedSchedule
                    })}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};