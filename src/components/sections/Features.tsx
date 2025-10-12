
import React from "react";
import { Check, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
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
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('featuresTitle')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Baseado nos princípios de Hábitos Atômicos de James Clear
          </p>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/entenda-produto")}
            className="gap-2"
          >
            <BookOpen className="h-5 w-5" />
            Entenda como funciona o método
          </Button>
        </div>
        
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
