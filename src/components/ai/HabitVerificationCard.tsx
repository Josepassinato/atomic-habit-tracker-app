import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Brain, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface HabitVerificationProps {
  habit: {
    id: string;
    title: string;
    description: string;
    schedule?: string;
    auto_verified?: boolean;
    verification_score?: number;
    verification_notes?: string;
  };
  onVerificationComplete?: (result: any) => void;
}

export const HabitVerificationCard: React.FC<HabitVerificationProps> = ({ 
  habit, 
  onVerificationComplete 
}) => {
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerification = async () => {
    if (!evidence.trim()) {
      toast.error('Por favor, forneça evidência da execução do hábito');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('habits-verification', {
        body: {
          habitId: habit.id,
          habitTitle: habit.title,
          habitDescription: habit.description,
          evidence: {
            type: 'text',
            content: evidence,
            metadata: {
              timestamp: new Date().toISOString(),
              source: 'manual_input'
            }
          },
          schedule: habit.schedule,
          expectedOutcome: 'Execução completa e efetiva do hábito'
        }
      });

      if (error) {
        throw error;
      }

      setVerificationResult(data.verification);
      onVerificationComplete?.(data);

      if (data.autoApproved) {
        toast.success('Hábito verificado e aprovado automaticamente! 🎉');
      } else if (data.verification.verified) {
        toast.success('Hábito verificado com sucesso! ✅');
      } else {
        toast.warning('Evidência insuficiente. Tente novamente com mais detalhes.');
      }

    } catch (error) {
      console.error('Erro na verificação:', error);
      toast.error('Erro ao verificar hábito. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (quality: string) => {
    const variants = {
      excellent: 'default',
      good: 'secondary',
      fair: 'outline',
      poor: 'destructive'
    } as const;
    
    return <Badge variant={variants[quality as keyof typeof variants] || 'outline'}>
      {quality === 'excellent' ? 'Excelente' :
       quality === 'good' ? 'Boa' :
       quality === 'fair' ? 'Regular' : 'Insuficiente'}
    </Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Verificação Inteligente de Hábito
        </CardTitle>
        <CardDescription>
          <strong>{habit.title}</strong>
          {habit.description && <span> - {habit.description}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        {habit.auto_verified !== undefined && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            {habit.auto_verified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm">
              Status: {habit.auto_verified ? 'Verificado automaticamente' : 'Não verificado'}
            </span>
            {habit.verification_score && (
              <Badge variant="outline" className={getScoreColor(habit.verification_score)}>
                {habit.verification_score}/100
              </Badge>
            )}
          </div>
        )}

        {/* Evidence Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Evidência da Execução
          </label>
          <Textarea
            placeholder="Descreva como você executou o hábito. Seja específico sobre o que fez, quando fez, e os resultados alcançados..."
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhada a evidência, mais precisa será a verificação.
          </p>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleVerification} 
          disabled={loading || !evidence.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Verificar com IA
            </>
          )}
        </Button>

        {/* Verification Result */}
        {verificationResult && (
          <div className="space-y-3 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Resultado da Verificação</h4>
              <div className="flex items-center gap-2">
                {verificationResult.verified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className={`text-sm ${getScoreColor(verificationResult.score)}`}>
                  {verificationResult.score}/100
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Qualidade da evidência:</span>
                {getQualityBadge(verificationResult.evidenceQuality)}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Confiança:</span>
                <Badge variant="outline">
                  {verificationResult.confidence}%
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium">Feedback:</h5>
              <p className="text-sm text-muted-foreground">
                {verificationResult.feedback}
              </p>
            </div>

            {verificationResult.suggestions?.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Sugestões:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {verificationResult.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Previous Notes */}
        {habit.verification_notes && !verificationResult && (
          <div className="p-3 bg-muted rounded-lg">
            <h5 className="text-sm font-medium mb-1">Nota da última verificação:</h5>
            <p className="text-sm text-muted-foreground">
              {habit.verification_notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};