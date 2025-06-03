
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n";
import { plansLimitService } from "@/services/plans-service";
import { PlansConfiguration } from "@/types/admin";

const Pricing = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [plansConfig, setPlansConfig] = useState<PlansConfiguration>(() => {
    // Force reload from service to get updated prices
    return plansLimitService.getPlansConfig();
  });

  // Carrega configurações de planos do serviço
  useEffect(() => {
    // Clear any cached config and reload
    const freshConfig = plansLimitService.getPlansConfig();
    setPlansConfig(freshConfig);
  }, []);

  // Pricing features by language
  const generatePricingFeatures = (lang: string) => {
    const localizedFeatures: Record<string, Record<string, string[]>> = {
      en: {
        starter: [
          `Up to ${plansConfig.starter.usersLimit} sellers`,
          "Basic goals and habits",
          `Integration with ${plansConfig.starter.features.crmIntegrations} CRM`
        ],
        professional: [
          `Up to ${plansConfig.professional.usersLimit} sellers`,
          plansConfig.professional.features.aiConsulting ? "Advanced AI consulting" : "Basic AI consulting",
          `Multiple CRM integrations (${plansConfig.professional.features.crmIntegrations})`,
          plansConfig.professional.features.advancedReports ? "Advanced reports" : "Basic reports"
        ],
        enterprise: [
          `${plansConfig.enterprise.usersLimit}+ sellers`,
          "Custom consulting",
          plansConfig.enterprise.features.customApi ? "Dedicated API" : "API access",
          plansConfig.enterprise.features.prioritySupport ? "Priority support" : "Premium support"
        ]
      },
      es: {
        starter: [
          `Hasta ${plansConfig.starter.usersLimit} vendedores`,
          "Metas y hábitos básicos",
          `Integración con ${plansConfig.starter.features.crmIntegrations} CRM`
        ],
        professional: [
          `Hasta ${plansConfig.professional.usersLimit} vendedores`,
          plansConfig.professional.features.aiConsulting ? "Consultoría IA avanzada" : "Consultoría IA básica",
          `Integraciones con múltiples CRMs (${plansConfig.professional.features.crmIntegrations})`,
          plansConfig.professional.features.advancedReports ? "Informes avanzados" : "Informes básicos"
        ],
        enterprise: [
          `${plansConfig.enterprise.usersLimit}+ vendedores`,
          "Consultoría personalizada",
          plansConfig.enterprise.features.customApi ? "API dedicada" : "Acceso API",
          plansConfig.enterprise.features.prioritySupport ? "Soporte prioritario" : "Soporte premium"
        ]
      },
      pt: {
        starter: [
          `Até ${plansConfig.starter.usersLimit} vendedores`,
          "Metas e hábitos básicos",
          `Integração com ${plansConfig.starter.features.crmIntegrations} CRM`
        ],
        professional: [
          `Até ${plansConfig.professional.usersLimit} vendedores`,
          plansConfig.professional.features.aiConsulting ? "Consultoria IA avançada" : "Consultoria IA básica",
          `Integrações com múltiplos CRMs (${plansConfig.professional.features.crmIntegrations})`,
          plansConfig.professional.features.advancedReports ? "Relatórios avançados" : "Relatórios básicos"
        ],
        enterprise: [
          `${plansConfig.enterprise.usersLimit}+ vendedores`,
          "Consultoria personalizada",
          plansConfig.enterprise.features.customApi ? "API dedicada" : "Acesso API",
          plansConfig.enterprise.features.prioritySupport ? "Suporte prioritário" : "Suporte premium"
        ]
      }
    };

    return localizedFeatures[lang] || localizedFeatures.en;
  };

  const pricingFeatures = generatePricingFeatures(language);

  // Button texts
  const buttonTexts = {
    en: {
      starter: "Start now",
      business: "Choose Business", 
      enterprise: "Talk to sales"
    },
    es: {
      starter: "Comenzar ahora",
      business: "Elegir Business",
      enterprise: "Hablar con ventas"
    },
    pt: {
      starter: "Começar agora",
      business: "Escolher Business",
      enterprise: "Falar com vendas"
    }
  };

  const currentFeatures = pricingFeatures;
  const currentButtons = buttonTexts[language];

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">{t('pricingTitle')}</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('startupPlan')}</CardTitle>
              <div className="mt-4 text-4xl font-bold">${plansConfig.starter.price}<span className="text-lg font-normal text-muted-foreground">{t('month')}</span></div>
              <CardDescription className="mt-2">
                {t('startupDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {currentFeatures.starter.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate("/registro")}>
                {currentButtons.starter}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <div className="mb-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground w-fit">
                {t('popular')}
              </div>
              <CardTitle>{t('businessPlan')}</CardTitle>
              <div className="mt-4 text-4xl font-bold">${plansConfig.professional.price}<span className="text-lg font-normal text-muted-foreground">{t('month')}</span></div>
              <CardDescription className="mt-2">
                {t('businessDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {currentFeatures.professional.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate("/registro")}>
                {currentButtons.business}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('enterprisePlan')}</CardTitle>
              <div className="mt-4 text-4xl font-bold">${plansConfig.enterprise.price}<span className="text-lg font-normal text-muted-foreground">{t('month')}</span></div>
              <CardDescription className="mt-2">
                {t('enterpriseDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {currentFeatures.enterprise.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                {currentButtons.enterprise}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
