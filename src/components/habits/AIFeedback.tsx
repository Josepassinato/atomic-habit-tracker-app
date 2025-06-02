
import React from "react";
import { Brain, AlertCircle } from "lucide-react";
import { openAIService } from "@/services/openai-service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/permissions";

interface AIFeedbackProps {
  feedback: string;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";
  
  if (!feedback) return null;
  
  const apiKeyMissing = !openAIService.getApiKey();
  
  const goToAdmin = () => {
    navigate("/admin");
  };
  
  return (
    <div className={`mt-6 p-4 rounded-md border ${apiKeyMissing ? 'bg-amber-50' : 'bg-slate-50'}`}>
      <div className={`flex items-center gap-2 mb-2 ${apiKeyMissing ? 'text-amber-600' : 'text-primary'}`}>
        {apiKeyMissing ? <AlertCircle size={18} /> : <Brain size={18} />}
        <h4 className="font-medium">{apiKeyMissing ? 'Configuration Required' : 'AI Feedback'}</h4>
      </div>
      <p className="text-sm">{feedback}</p>
      
      {apiKeyMissing && isAdmin && (
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToAdmin}
            className="text-amber-600 border-amber-200 hover:bg-amber-100"
          >
            Configure OpenAI API in Admin Panel
          </Button>
        </div>
      )}
      
      {apiKeyMissing && !isAdmin && (
        <div className="mt-3">
          <p className="text-xs text-amber-600">
            The system administrator needs to configure the OpenAI API to enable this functionality.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIFeedback;
