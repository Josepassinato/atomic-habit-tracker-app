
import React from "react";
import { Brain, AlertCircle } from "lucide-react";
import { openAIService } from "@/services/openai-service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/permissions";

interface FeedbackIAProps {
  feedback: string;
}

const FeedbackIA: React.FC<FeedbackIAProps> = ({ feedback }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";
  
  if (!feedback) return null;
  
  const apiKeyMissing = !openAIService.getApiKey();
  
  const irParaAdmin = () => {
    navigate("/admin");
  };
  
  return (
    <div className={`mt-6 p-4 rounded-md border ${apiKeyMissing ? 'bg-amber-50' : 'bg-slate-50'}`}>
      <div className={`flex items-center gap-2 mb-2 ${apiKeyMissing ? 'text-amber-600' : 'text-primary'}`}>
        {apiKeyMissing ? <AlertCircle size={18} /> : <Brain size={18} />}
        <h4 className="font-medium">{apiKeyMissing ? 'Configuração Necessária' : 'Feedback da IA'}</h4>
      </div>
      <p className="text-sm">{feedback}</p>
      
      {apiKeyMissing && isAdmin && (
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
      
      {apiKeyMissing && !isAdmin && (
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
