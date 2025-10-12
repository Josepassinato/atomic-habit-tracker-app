import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, TrendingUp, Users, Zap, CheckCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/index";
import LandingHeader from "@/components/LandingHeader";
import Footer from "@/components/sections/Footer";

const EntendaProduto = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <LandingHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Entenda o Produto
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Como transformar metas impossíveis em hábitos sustentáveis
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Atomic Habits Principle */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-3xl">O Princípio dos Hábitos Atômicos</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Baseado no best-seller de James Clear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg">
              <p className="leading-relaxed">
                O livro "Hábitos Atômicos" revolucionou a forma como entendemos o sucesso. A premissa é simples mas poderosa: 
                <span className="font-semibold text-primary"> pequenas mudanças diárias geram resultados extraordinários a longo prazo</span>.
              </p>
              <p className="leading-relaxed">
                Em vez de focar em metas ambiciosas que frequentemente causam frustração, o foco está em construir 
                <span className="font-semibold"> sistemas e hábitos sustentáveis</span> que levam naturalmente aos resultados desejados.
              </p>
              <div className="bg-muted/50 p-6 rounded-lg border">
                <p className="text-xl font-semibold text-center">
                  "Você não sobe ao nível de suas metas. Você cai ao nível de seus sistemas."
                </p>
                <p className="text-center text-muted-foreground mt-2">- James Clear</p>
              </div>
            </CardContent>
          </Card>

          {/* Silicon Valley Approach */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-3xl">A Revolução do Vale do Silício</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Como as empresas mais modernas do mundo estão alcançando resultados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg">
              <p className="leading-relaxed">
                As maiores e mais modernas empresas do Vale do Silício descobriram algo revolucionário: 
                <span className="font-semibold text-primary"> metas agressivas sem sistemas adequados levam à exaustão e rotatividade</span>.
              </p>
              <p className="leading-relaxed">
                Hoje, empresas como Google, Meta e Amazon estão dando <span className="font-semibold">menos ênfase em metas por metas</span> e 
                <span className="font-semibold text-primary"> mais ênfase na implementação de hábitos e processos consistentes</span>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">❌</span> Abordagem Tradicional
                  </h4>
                  <ul className="space-y-2 text-base">
                    <li>• Metas agressivas mensais</li>
                    <li>• Pressão constante</li>
                    <li>• Palestras motivacionais caras</li>
                    <li>• Alto turnover</li>
                    <li>• Resultados inconsistentes</li>
                  </ul>
                </div>
                
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">✅</span> Abordagem Moderna
                  </h4>
                  <ul className="space-y-2 text-base">
                    <li>• Hábitos diários rastreados</li>
                    <li>• Melhoria contínua</li>
                    <li>• Sistemas automatizados</li>
                    <li>• Time engajado</li>
                    <li>• Crescimento sustentável</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-3xl">Resultados Comprovados</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="text-6xl md:text-7xl font-bold text-primary mb-4">
                  +37%
                </div>
                <p className="text-2xl font-semibold mb-2">
                  Aumento nos Resultados
                </p>
                <p className="text-lg text-muted-foreground">
                  Sem palestras motivacionais onerosas ou treinamentos caros
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Mais Eficiência</h4>
                  <p className="text-sm text-muted-foreground">
                    Processos otimizados através de hábitos consistentes
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Menos Rotatividade</h4>
                  <p className="text-sm text-muted-foreground">
                    Times mais engajados e motivados naturalmente
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Crescimento Sustentável</h4>
                  <p className="text-sm text-muted-foreground">
                    Resultados consistentes mês após mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-3xl">Como Funciona na Prática</CardTitle>
              <CardDescription className="text-lg">
                O sistema que transforma teoria em resultados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Defina Hábitos-Chave</h4>
                    <p className="text-muted-foreground">
                      Identifique os comportamentos diários que levam aos resultados desejados (ex: 5 ligações por dia, 
                      3 follow-ups, atualização de CRM)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Rastreie Consistência</h4>
                    <p className="text-muted-foreground">
                      Acompanhe a execução diária dos hábitos, não apenas os resultados finais
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Ajuste com Dados</h4>
                    <p className="text-muted-foreground">
                      Use analytics e IA para identificar quais hábitos geram mais impacto e otimize o processo
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Celebre Progresso</h4>
                    <p className="text-muted-foreground">
                      Gamificação e recompensas por consistência, não apenas por metas batidas
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Revolucionar seus Resultados?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se às empresas que escolheram crescimento sustentável ao invés de pressão insustentável
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/schedule-demo">
                <Button size="lg" className="text-lg px-8">
                  Agendar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Começar Gratuitamente
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EntendaProduto;