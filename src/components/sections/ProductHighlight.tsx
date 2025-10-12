import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductHighlight = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 border-2 border-primary/20 bg-gradient-to-br from-card/95 to-card shadow-2xl hover:shadow-primary/20 transition-all duration-300">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Metodologia Comprovada</span>
            </div>
            
            {/* Main heading */}
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Descubra o <span className="text-primary">Segredo</span> das Empresas
              <br />
              do Vale do Silício
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Como as empresas mais inovadoras aumentaram seus resultados em{" "}
              <span className="font-bold text-primary">+37%</span> sem palestras motivacionais caras,
              apenas implementando <span className="font-semibold">hábitos estratégicos</span>
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/entenda-produto")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Entenda o Produto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Small caption */}
            <p className="text-sm text-muted-foreground">
              ⚡ Leitura de 5 minutos • Baseado em Hábitos Atômicos de James Clear
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProductHighlight;