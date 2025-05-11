
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold">Pronto para transformar sua equipe de vendas?</h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          Comece hoje a jornada para um time de vendas mais eficiente e motivado
        </p>
        <Button size="lg" onClick={() => navigate("/registro")}>
          Criar sua conta
        </Button>
      </div>
    </section>
  );
};

export default CTA;
