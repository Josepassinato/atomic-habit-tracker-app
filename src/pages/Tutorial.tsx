
import React, { useState } from "react";
import Header from "@/components/Header";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  Checkbox
} from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Info } from "lucide-react";

interface TutorialStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  index: number;
}

const TutorialStep = ({ title, description, children, index }: TutorialStepProps) => {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <Card className="mb-6 border-l-4 border-l-primary/70">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="rounded-full bg-primary/10 p-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            {index}
          </span>
        </div>
        <div className="flex-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="mt-1.5">{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`step-${index}`} 
            checked={isCompleted} 
            onCheckedChange={() => setIsCompleted(!isCompleted)}
          />
          <label htmlFor={`step-${index}`} className="text-sm font-medium">
            Concluído
          </label>
        </div>
      </CardHeader>
      <CardContent className={isCompleted ? "opacity-60" : ""}>
        {children}
      </CardContent>
    </Card>
  );
};

const Tutorial = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Tutorial</span>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Tutorial do Habitus
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Bem-vindo ao tutorial passo a passo do Habitus! Este guia vai te ajudar a configurar
            e começar a usar nossa plataforma para melhorar a performance da sua equipe de vendas.
          </p>
          
          <Alert className="mt-4 max-w-3xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Dica importante</AlertTitle>
            <AlertDescription>
              Para obter melhores resultados, recomendamos seguir cada passo na ordem. 
              Você pode marcar os passos como concluídos à medida que avança.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="max-w-3xl">
          <TutorialStep 
            title="Configuração inicial" 
            description="Configure seus primeiros objetivos e metas" 
            index={1}
          >
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <p className="font-medium">Acesse a página de Onboarding</p>
                <p className="text-muted-foreground">
                  Navegue até a <Link to="/onboarding" className="text-primary hover:underline">
                    página de onboarding
                  </Link> para configurar suas metas iniciais.
                </p>
              </li>
              <li>
                <p className="font-medium">Defina suas metas de vendas</p>
                <p className="text-muted-foreground">
                  Estabeleça metas mensais e diárias para sua equipe. Estas metas 
                  serão utilizadas para medir o desempenho e calcular recomendações.
                </p>
              </li>
              <li>
                <p className="font-medium">Selecione hábitos atômicos</p>
                <p className="text-muted-foreground">
                  Escolha os hábitos que considera mais importantes para sua equipe. 
                  Você pode selecionar os recomendados ou criar seus próprios hábitos.
                </p>
                
                <Collapsible className="mt-2 border rounded-md p-2">
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
                    <span>Ver exemplos de hábitos efetivos</span>
                    <ChevronRight className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <ul className="list-disc pl-6 text-sm">
                      <li>Fazer 10 ligações para prospects por dia</li>
                      <li>Registrar todos os contatos no CRM em até 1 hora</li>
                      <li>Enviar follow-up em até 24 horas após reunião</li>
                      <li>Estudar sobre o produto por 15 minutos diariamente</li>
                      <li>Realizar reunião de planejamento semanal com a equipe</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            </ol>
            
            <div className="mt-6">
              <Button asChild>
                <Link to="/onboarding">Ir para a configuração</Link>
              </Button>
            </div>
          </TutorialStep>
          
          <TutorialStep 
            title="Monitorando hábitos e metas" 
            description="Aprenda a usar o dashboard para acompanhar seu progresso" 
            index={2}
          >
            <p className="mb-4">
              Após configurar suas metas e hábitos, você poderá monitorá-los diariamente
              no dashboard principal. Aqui está como usar os principais recursos:
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Dashboard Principal</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    O dashboard principal exibe um resumo geral do seu desempenho, 
                    incluindo:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Progresso atual em relação às metas mensais</li>
                    <li>Total de vendas realizadas no mês</li>
                    <li>Consistência nos hábitos atômicos</li>
                    <li>Previsão de resultados baseada no desempenho atual</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Rastreador de Hábitos</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    O rastreador de hábitos permite:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Marcar hábitos como concluídos diariamente</li>
                    <li>Visualizar sua consistência ao longo do tempo</li>
                    <li>Receber feedback da IA sobre seu desempenho</li>
                    <li>Adicionar ou remover hábitos conforme necessário</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Desempenho de Vendas</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    No painel de desempenho de vendas, você pode:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Registrar novas vendas ou oportunidades</li>
                    <li>Comparar resultados com períodos anteriores</li>
                    <li>Visualizar gráficos de progresso</li>
                    <li>Identificar tendências e padrões</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6">
              <Button asChild>
                <Link to="/dashboard">Ir para o Dashboard</Link>
              </Button>
            </div>
          </TutorialStep>
          
          <TutorialStep 
            title="Utilizando a IA do Habitus" 
            description="Aproveite o poder da nossa IA para melhorar sua performance" 
            index={3}
          >
            <p className="mb-4">
              A IA do Habitus é uma ferramenta poderosa que pode ajudar você a otimizar 
              seus resultados de várias formas:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Análise de Hábitos</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    A IA analisa seus hábitos e identifica quais têm maior 
                    impacto nos seus resultados de vendas.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sugestões Personalizadas</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    Receba sugestões de novos hábitos baseados no seu modelo 
                    de negócio e metas específicas.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Feedback Diário</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    Obtenha análises diárias sobre seu progresso e dicas 
                    para melhorar seu desempenho.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Previsões de Resultados</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    Veja projeções de resultados baseadas no seu ritmo atual 
                    e receba sugestões para atingir suas metas.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <p className="mt-6 text-sm bg-muted p-3 rounded-md">
              <strong className="font-medium">Dica avançada:</strong> Para obter os melhores 
              resultados da IA, certifique-se de registrar seus hábitos diariamente e 
              fornecer informações detalhadas sobre seu modelo de negócio nas configurações.
            </p>
          </TutorialStep>
          
          <TutorialStep 
            title="Integrações e Ajustes Avançados" 
            description="Configure integrações com outros sistemas e personalize sua experiência" 
            index={4}
          >
            <p className="mb-4">
              O Habitus pode ser integrado com várias ferramentas de CRM e vendas 
              para centralizar seus dados e otimizar seu fluxo de trabalho:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium">HubSpot</h4>
                  <p className="text-sm text-muted-foreground">
                    Sincronize contatos, negócios e atividades automaticamente
                  </p>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium">Pipedrive</h4>
                  <p className="text-sm text-muted-foreground">
                    Importe oportunidades e exporte atividades do Habitus
                  </p>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium">WhatsApp Business</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações e lembretes diretamente no WhatsApp
                  </p>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
            </div>
            
            <Alert className="mt-6 bg-primary/5">
              <AlertTitle>Próximos passos</AlertTitle>
              <AlertDescription>
                Agora que você completou o tutorial básico, recomendamos explorar 
                a documentação completa para recursos avançados e personalizações 
                adicionais.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6">
              <Button>Ver documentação completa</Button>
            </div>
          </TutorialStep>
        </div>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - O futuro da automação de vendas e performance
        </div>
      </footer>
    </div>
  );
};

export default Tutorial;
