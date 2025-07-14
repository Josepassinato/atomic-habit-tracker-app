
import React, { useState, useEffect } from "react";
import { Brain, AlertCircle, Loader2 } from "lucide-react";
import { AIService } from "@/services/ai-service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/i18n";
import { toast } from "sonner";

interface FeedbackIAProps {
  feedback?: string;
  habitId?: string;
  habitTitle?: string;
  habitDescription?: string;
  autoGenerate?: boolean;
}

const FeedbackIA: React.FC<FeedbackIAProps> = ({ 
  feedback, 
  habitId, 
  habitTitle, 
  habitDescription, 
  autoGenerate = false 
}) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === "admin";
  const { t } = useLanguage();
  const [generatedFeedback, setGeneratedFeedback] = useState<string>(feedback || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (autoGenerate && habitId && habitTitle && !feedback) {
      generateFeedback();
    }
  }, [autoGenerate, habitId, habitTitle, feedback]);

  const generateFeedback = async () => {
    if (!habitId || !habitTitle) return;
    
    setLoading(true);
    try {
      const response = await AIService.consultWithAI({
        message: `Analise este hábito e forneça feedback personalizado: ${habitTitle}. ${habitDescription ? `Descrição: ${habitDescription}` : ''}`,
        consultationType: 'habits',
        context: {
          habitId,
          habitTitle,
          habitDescription,
          userId: userProfile?.id
        }
      });
      
      setGeneratedFeedback(response.response);
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      toast.error('Erro ao gerar feedback da IA');
      setGeneratedFeedback('Configure a API da OpenAI no painel administrativo para receber feedback personalizado da IA.');
    } finally {
      setLoading(false);
    }
  };
  
  const currentFeedback = generatedFeedback;
  
  if (!currentFeedback && !loading) return null;
  
  const irParaAdmin = () => {
    navigate("/admin");
  };
  
  return (
    <div className="mt-6 p-4 rounded-md border bg-slate-50">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
        <h4 className="font-medium">
          {loading ? 'Gerando Feedback da IA...' : 'Feedback da IA'}
        </h4>
        {!loading && !autoGenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={generateFeedback}
            disabled={loading}
            className="ml-auto"
          >
            Atualizar Feedback
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          <span>Analisando seu hábito e gerando feedback personalizado...</span>
        </div>
      ) : currentFeedback ? (
        <p className="text-sm whitespace-pre-wrap">{currentFeedback}</p>
      ) : null}
      
      {currentFeedback?.includes('Configure a API') && isAdmin && (
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={irParaAdmin}
            className="text-amber-600 border-amber-200 hover:bg-amber-100"
          >
            Configurar API da OpenAI no Painel Admin
          </Button>
        </div>
      )}
      
      {currentFeedback?.includes('Configure a API') && !isAdmin && (
        <div className="mt-3">
          <p className="text-xs text-amber-600">
            O administrador do sistema precisa configurar a API da OpenAI para habilitar esta funcionalidade.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackIA;
