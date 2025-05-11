
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Pricing features by language
  const pricingFeatures = {
    en: {
      startup: ["Up to 5 sellers", "Basic goals and habits", "Integration with 1 CRM"],
      business: ["Up to 15 sellers", "Advanced AI consulting", "Multiple CRM integrations", "Advanced reports"],
      enterprise: ["Unlimited sellers", "Custom consulting", "Dedicated API", "Priority support"]
    },
    es: {
      startup: ["Hasta 5 vendedores", "Metas y hábitos básicos", "Integración con 1 CRM"],
      business: ["Hasta 15 vendedores", "Consultoría IA avanzada", "Integraciones con múltiples CRMs", "Informes avanzados"],
      enterprise: ["Vendedores ilimitados", "Consultoría personalizada", "API dedicada", "Soporte prioritario"]
    },
    pt: {
      startup: ["Até 5 vendedores", "Metas e hábitos básicos", "Integração com 1 CRM"],
      business: ["Até 15 vendedores", "Consultoria IA avançada", "Integrações com múltiplos CRMs", "Relatórios avançados"],
      enterprise: ["Vendedores ilimitados", "Consultoria personalizada", "API dedicada", "Suporte prioritário"]
    }
  };

  // Price displays
  const priceDisplay = {
    en: {
      startup: "299",
      business: "699",
      enterprise: "1499"
    },
    es: {
      startup: "299",
      business: "699",
      enterprise: "1499"
    },
    pt: {
      startup: "299",
      business: "699",
      enterprise: "1499"
    }
  };

  // Button texts
  const buttonTexts = {
    en: {
      startup: "Start now",
      business: "Choose Business",
      enterprise: "Talk to sales"
    },
    es: {
      startup: "Comenzar ahora",
      business: "Elegir Business",
      enterprise: "Hablar con ventas"
    },
    pt: {
      startup: "Começar agora",
      business: "Escolher Business",
      enterprise: "Falar com vendas"
    }
  };

  const currentFeatures = pricingFeatures[language];
  const currentPrices = priceDisplay[language];
  const currentButtons = buttonTexts[language];

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">{t('pricingTitle')}</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('startupPlan')}</CardTitle>
              <div className="mt-4 text-4xl font-bold">R${currentPrices.startup}<span className="text-lg font-normal text-muted-foreground">{t('month')}</span></div>
              <CardDescription className="mt-2">
                {t('startupDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {currentFeatures.startup.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate("/registro")}>
                {currentButtons.startup}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <div className="mb-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground w-fit">
                {t('popular')}
              </div>
              <CardTitle>{t('businessPlan')}</CardTitle>
              <div className="mt-4 text-4xl font-bold">R${currentPrices.business}<span className="text-lg font-normal text-muted-foreground">{t('month')}</span></div>
              <CardDescription className="mt-2">
                {t('businessDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {currentFeatures.business.map((feature, index) => (
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
              <div className="mt-4 text-4xl font-bold">R${currentPrices.enterprise}<span className="text-lg font-normal text-muted-foreground">{t('month')}</span></div>
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
