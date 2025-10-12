import React from "react";
import { Card } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n";

interface OnboardingProgressProps {
  currentStep: string;
  completedSteps: string[];
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  completedSteps
}) => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 'teams', label: t('setupTeam'), icon: '👥' },
    { id: 'goals', label: t('defineGoals'), icon: '🎯' },
    { id: 'habits', label: t('selectHabits'), icon: '✅' },
    { id: 'rewards', label: t('configureRewards'), icon: '🏆' },
    { id: 'integrations', label: t('connectCRM'), icon: '🔗' }
  ];

  const progress = (completedSteps.length / steps.length) * 100;
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{t('setupProgress')}</h3>
            <p className="text-sm text-muted-foreground">
              {completedSteps.length} {t('of')} {steps.length} {t('completed')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />

        {/* Steps List */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isPast = index < currentStepIndex;
            
            return (
              <div
                key={step.id}
                className={`
                  flex flex-col items-center p-3 rounded-lg border-2 transition-all
                  ${isCurrent ? 'border-primary bg-primary/5' : ''}
                  ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
                  ${!isCompleted && !isCurrent ? 'border-muted' : ''}
                `}
              >
                <div className="text-2xl mb-2">{step.icon}</div>
                <div className="text-xs text-center font-medium mb-2">
                  {step.label}
                </div>
                {isCompleted ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : isCurrent ? (
                  <Circle className="h-4 w-4 text-primary fill-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
