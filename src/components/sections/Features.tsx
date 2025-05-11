
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();
  
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
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Sugestões personalizadas por IA</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Ajuste automático baseado no histórico</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Visualização clara do progresso</span>
                </li>
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
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Check-ins diários automatizados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Lembretes personalizados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Gamificação para maior engajamento</span>
                </li>
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
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Cálculo automático de premiações</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Relatórios de desempenho detalhados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Integração com sistemas de pagamento</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
