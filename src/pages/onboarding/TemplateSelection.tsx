import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Template, onboardingTemplates } from "./templates";

interface TemplateSelectionProps {
  onSelectTemplate: (template: Template) => void;
  onSkip: () => void;
}

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  onSelectTemplate,
  onSkip
}) => {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = Object.values(onboardingTemplates);

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('chooseTemplate')}</h2>
        <p className="text-muted-foreground">
          {t('templateDescription')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'border-primary border-2' : ''
            }`}
            onClick={() => handleSelect(template)}
          >
            <CardHeader>
              <div className="text-4xl mb-3">{template.icon}</div>
              <CardTitle className="flex items-center justify-between">
                {t(template.name.toLowerCase().replace(/\s+/g, ''))}
                {selectedTemplate === template.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </CardTitle>
              <CardDescription>{t(template.description)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="font-medium">{t('includes')}:</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {template.defaultHabits.length} {t('preConfiguredHabits')}</li>
                  <li>• {t('suggestedGoals')}</li>
                  <li>• {template.defaultRewards.length} {t('rewardIdeas')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="ghost" onClick={onSkip}>
          {t('skipTemplate')}
        </Button>
      </div>
    </div>
  );
};
