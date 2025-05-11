
import React from "react";
import { Brain, AlertCircle } from "lucide-react";
import { openAIService } from "@/services/openai-service";

interface FeedbackIAProps {
  feedback: string;
}

const FeedbackIA: React.FC<FeedbackIAProps> = ({ feedback }) => {
  if (!feedback) return null;
  
  const apiKeyMissing = !openAIService.getApiKey();
  
  return (
    <div className={`mt-6 p-4 rounded-md border ${apiKeyMissing ? 'bg-amber-50' : 'bg-slate-50'}`}>
      <div className={`flex items-center gap-2 mb-2 ${apiKeyMissing ? 'text-amber-600' : 'text-primary'}`}>
        {apiKeyMissing ? <AlertCircle size={18} /> : <Brain size={18} />}
        <h4 className="font-medium">{apiKeyMissing ? 'Configuração Necessária' : 'Feedback da IA'}</h4>
      </div>
      <p className="text-sm">{feedback}</p>
    </div>
  );
};

export default FeedbackIA;
