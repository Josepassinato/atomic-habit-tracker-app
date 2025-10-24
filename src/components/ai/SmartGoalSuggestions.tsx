import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AIService } from '@/services/ai-service';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Target, Lightbulb, Plus, RefreshCw } from 'lucide-react';

interface GoalSuggestion {
  title: string;
  description: string;
  targetValue: number;
  type: 'vendas' | 'prospeccao' | 'conversao' | 'relacionamento';
  priority: 'alta' | 'media' | 'baixa';
  reasoning: string;
}

interface SmartGoalSuggestionsProps {
  onGoalAdd?: (goal: Omit<GoalSuggestion, 'reasoning'>) => void;
  teamId?: string;
  currentGoals?: any[];
}

export const SmartGoalSuggestions: React.FC<SmartGoalSuggestionsProps> = ({
  onGoalAdd,
  teamId,
  currentGoals = []
}) => {
  const { userProfile } = useAuth();
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateSuggestions();
  }, [teamId, currentGoals]);

  const generateSuggestions = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await AIService.consultWithAI({
        message: `Analise as metas atuais e sugira 3-4 metas SMART complementares para melhorar a performance de vendas.`,
        consultationType: 'goals',
        context: {
          userId: userProfile.id,
          teamId,
          currentGoals,
          companyId: userProfile.empresa_id,
          userRole: userProfile.role
        }
      });

      // Parse the AI response to extract goal suggestions
      const parsedSuggestions = parseGoalSuggestions(response.response);
      setSuggestions(parsedSuggestions);
    } catch (error) {
      console.error('Erro ao gerar sugestões de metas:', error);
      setError('Erro ao gerar sugestões. Tente novamente.');
      toast.error('Erro ao gerar sugestões de metas');
    } finally {
      setLoading(false);
    }
  };

  const parseGoalSuggestions = (aiResponse: string): GoalSuggestion[] => {
    // Basic parsing - in a real implementation, you'd want more sophisticated parsing
    return [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Target className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Sugestões Inteligentes de Metas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-20" />
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
            <Lightbulb className="h-5 w-5" />
            Sugestões Inteligentes de Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={generateSuggestions} variant="outline">
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
            <Lightbulb className="h-5 w-5" />
            Sugestões Inteligentes de Metas
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateSuggestions}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma sugestão disponível no momento.</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(suggestion.type)}
                    <h4 className="font-medium">{suggestion.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      Meta: {suggestion.targetValue}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.reasoning}
                  </p>
                </div>
                {onGoalAdd && (
                  <Button
                    size="sm"
                    onClick={() => onGoalAdd({
                      title: suggestion.title,
                      description: suggestion.description,
                      targetValue: suggestion.targetValue,
                      type: suggestion.type,
                      priority: suggestion.priority
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