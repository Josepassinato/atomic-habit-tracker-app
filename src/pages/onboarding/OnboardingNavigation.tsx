
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingNavigationProps {
  isFirstTab: boolean;
  isLastTab: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  isFirstTab,
  isLastTab,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isFirstTab}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      <Button onClick={onNext}>
        {isLastTab ? "Finish Setup" : "Next"}
        {!isLastTab && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
