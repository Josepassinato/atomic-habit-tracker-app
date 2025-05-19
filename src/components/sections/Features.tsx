
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n";

const Features = () => {
  const { t, language } = useLanguage();
  
  // Features lists translations
  const featureLists = {
    en: {
      smartGoals: [
        "Personalized AI suggestions",
        "Automatic adjustment based on history",
        "Clear progress visualization"
      ],
      atomicHabits: [
        "Automated daily check-ins",
        "Custom reminders",
        "Gamification for greater engagement"
      ],
      autoRewards: [
        "Automatic award calculation",
        "Detailed performance reports",
        "Integration with payment systems"
      ]
    },
    es: {
      smartGoals: [
        "Sugerencias personalizadas por IA",
        "Ajuste automático basado en historial",
        "Visualización clara del progreso"
      ],
      atomicHabits: [
        "Check-ins diarios automatizados",
        "Recordatorios personalizados",
        "Gamificación para mayor participación"
      ],
      autoRewards: [
        "Cálculo automático de premios",
        "Informes de rendimiento detallados",
        "Integración con sistemas de pago"
      ]
    },
    pt: {
      smartGoals: [
        "Sugestões personalizadas por IA",
        "Ajuste automático baseado no histórico",
        "Visualização clara do progresso"
      ],
      atomicHabits: [
        "Check-ins diários automatizados",
        "Lembretes personalizados",
        "Gamificação para maior engajamento"
      ],
      autoRewards: [
        "Cálculo automático de premiações",
        "Relatórios de desempenho detalhados",
        "Integração com sistemas de pagamento"
      ]
    }
  };

  const currentFeatures = featureLists[language];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">{t('featuresTitle')}</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('smartGoalsTitle')}</CardTitle>
              <CardDescription>
                {t('smartGoalsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentFeatures.smartGoals.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('atomicHabitsTitle')}</CardTitle>
              <CardDescription>
                {t('atomicHabitsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentFeatures.atomicHabits.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('autoRewardsTitle')}</CardTitle>
              <CardDescription>
                {t('autoRewardsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentFeatures.autoRewards.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
