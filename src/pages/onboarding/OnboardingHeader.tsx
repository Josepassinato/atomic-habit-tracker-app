
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OnboardingHeaderProps {
  onBack: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ onBack }) => {
  return (
    <div className="p-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft size={16} />
        Voltar
      </Button>
    </div>
  );
};

export default OnboardingHeader;
