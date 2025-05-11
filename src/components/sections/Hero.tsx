
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Transforme sua <span className="text-primary">equipe de vendas</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          Monitore metas, desenvolva hábitos atômicos e aumente o desempenho da sua equipe com automação inteligente e consultoria por IA.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/registro")}>
            Comece agora
          </Button>
          <Button variant="outline" size="lg">
            Agendar demonstração
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
