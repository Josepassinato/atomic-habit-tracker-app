
import React from "react";
import { Brain } from "lucide-react";

interface FeedbackIAProps {
  feedback: string;
}

const FeedbackIA: React.FC<FeedbackIAProps> = ({ feedback }) => {
  if (!feedback) return null;
  
  return (
    <div className="mt-6 bg-slate-50 p-4 rounded-md border">
      <div className="flex items-center gap-2 mb-2 text-primary">
        <Brain size={18} />
        <h4 className="font-medium">Feedback da IA</h4>
      </div>
      <p className="text-sm">{feedback}</p>
    </div>
  );
};

export default FeedbackIA;
