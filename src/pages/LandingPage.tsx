
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Como o Habitus transforma sua equipe</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Metas Inteligentes</CardTitle>
                <CardDescription>
                  Defina e monitore metas realistas baseadas em dados do seu mercado
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
                <CardTitle>Hábitos Atômicos</CardTitle>
                <CardDescription>
                  Cultive hábitos diários que levam ao sucesso da sua equipe
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
                <CardTitle>Bônus Automáticos</CardTitle>
                <CardDescription>
                  Calcule e distribua incentivos de forma transparente
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

      {/* Pricing Section */}
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex space-x-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Sobre nós
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Contato
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Habitus © 2025 - O futuro da automação de vendas e performance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
