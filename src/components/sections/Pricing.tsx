
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">Planos Habitus</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Startup</CardTitle>
              <div className="mt-4 text-4xl font-bold">R$299<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <CardDescription className="mt-2">
                Para pequenas equipes começando sua jornada de vendas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Até 5 vendedores</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Metas e hábitos básicos</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Integração com 1 CRM</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/registro")}>
                Começar agora
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <div className="mb-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground w-fit">
                POPULAR
              </div>
              <CardTitle>Business</CardTitle>
              <div className="mt-4 text-4xl font-bold">R$699<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <CardDescription className="mt-2">
                Para equipes em crescimento buscando escalar vendas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Até 15 vendedores</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Consultoria IA avançada</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Integrações com múltiplos CRMs</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Relatórios avançados</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => navigate("/registro")}>
                Escolher Business
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="mt-4 text-4xl font-bold">R$1499<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
              <CardDescription className="mt-2">
                Para grandes equipes com necessidades complexas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Vendedores ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Consultoria personalizada</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>API dedicada</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Falar com vendas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
