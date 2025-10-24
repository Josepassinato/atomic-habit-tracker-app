import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n";
import habitosAtomicosLivro from "@/assets/habitos-atomicos-livro.jpeg";

const ProductHighlight = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <Card className="max-w-6xl mx-auto p-8 md:p-12 border-2 border-primary/20 bg-gradient-to-br from-card/95 to-card shadow-2xl hover:shadow-primary/20 transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Book image */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
                <img 
                  src={habitosAtomicosLivro} 
                  alt="Hábitos Atômicos - James Clear" 
                  className="relative rounded-lg shadow-2xl max-w-xs md:max-w-sm w-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Best-Seller do New York Times</span>
              </div>
              
              {/* Main heading */}
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Hábitos Atômicos
              </h2>
              
              <p className="text-base md:text-lg font-semibold text-muted-foreground">
                Um Método Fácil e Comprovado de Criar Bons Hábitos e Se Livrar dos Maus
              </p>
              
              {/* Description */}
              <p className="text-base text-muted-foreground">
                De James Clear, é um best-seller de desenvolvimento pessoal que se concentra na ideia de que pequenas mudanças consistentes levam a resultados impressionantes ao longo do tempo. O autor argumenta que a melhoria de apenas 1% ao dia pode levar a um progresso significativo.
              </p>

              {/* Key Concepts */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">As Quatro Leis da Mudança de Comportamento:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm"><strong>Torná-lo óbvio:</strong> Crie estímulos claros para iniciar o hábito</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm"><strong>Torná-lo atraente:</strong> Associe o novo hábito a algo que lhe dê prazer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm"><strong>Torná-lo fácil:</strong> Reduza o esforço necessário para realizar o hábito</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm"><strong>Torná-lo satisfatório:</strong> Ofereça uma recompensa imediata para reforçar o comportamento</span>
                  </li>
                </ul>
              </div>

              {/* Stats */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-sm font-semibold text-primary">
                  📚 Mais de 25 milhões de cópias vendidas • Traduzido para +60 idiomas
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Uma cópia vendida a cada 15 segundos em 2025
                </p>
              </div>
              
              {/* CTA Button */}
              <div className="pt-2">
                <Button 
                  size="lg" 
                  className="text-base px-6 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 bg-primary hover:bg-primary/90 w-full md:w-auto"
                  onClick={() => navigate("/entenda-produto")}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t('learnAboutHabitus')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProductHighlight;