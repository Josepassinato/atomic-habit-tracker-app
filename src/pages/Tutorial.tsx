
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Play } from "lucide-react";

const Tutorial = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleBack = () => {
    navigate(-1);
  };

  const tutorialSteps = [
    {
      title: "Bem-vindo ao Habitus",
      description: "Aprenda como usar nossa plataforma para melhorar sua performance de vendas",
      content: "O Habitus é uma plataforma que combina hábitos atômicos com metas de vendas para maximizar seus resultados."
    },
    {
      title: "Dashboard Principal",
      description: "Visão geral de todas suas métricas importantes",
      content: "No dashboard você encontra um resumo de suas metas, hábitos e performance geral."
    },
    {
      title: "Hábitos Atômicos",
      description: "Como criar e gerenciar seus hábitos diários",
      content: "Crie hábitos pequenos e consistentes que levarão a grandes resultados ao longo do tempo."
    },
    {
      title: "Metas de Vendas",
      description: "Configure e acompanhe suas metas",
      content: "Defina metas realistas e acompanhe seu progresso em tempo real."
    },
    {
      title: "Integração com CRM",
      description: "Conecte com suas ferramentas favoritas",
      content: "Integre com HubSpot, Pipedrive e outras ferramentas para automatizar seu fluxo de trabalho."
    }
  ];

  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      navigate("/dashboard");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {tutorialSteps[currentStep].title}
              </CardTitle>
              <CardDescription>
                {tutorialSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  {tutorialSteps[currentStep].content}
                </p>
              </div>

              <div className="flex justify-center space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                
                <Button onClick={handleNext}>
                  {isLastStep ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Começar
                    </>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
