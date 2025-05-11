
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const Metas = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading and catch potential issues
    const loadData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading goals data:", error);
        toast.error(language === 'en' ? 'Error loading data' : 
                   language === 'es' ? 'Error al cargar datos' : 
                   'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [language]);

  // Translation helper for titles
  const getTitle = () => {
    switch(language) {
      case 'en': return 'Sales Goals';
      case 'es': return 'Metas de Ventas';
      case 'pt': return 'Metas de Vendas';
      default: return 'Metas de Vendas';
    }
  };

  // Translation helper for button text
  const getNewGoalText = () => {
    switch(language) {
      case 'en': return 'New Goal';
      case 'es': return 'Nueva Meta';
      case 'pt': return 'Nova Meta';
      default: return 'Nova Meta';
    }
  };

  const metas = [
    {
      id: 1,
      titulo: language === 'en' ? 'Q2 Sales Goal' : 
              language === 'es' ? 'Meta de ventas Q2' : 
              'Meta de vendas Q2',
      valor: "R$ 100.000,00",
      progresso: 68,
      dataFinal: "30/06/2025",
      status: "em_andamento"
    },
    {
      id: 2,
      titulo: language === 'en' ? 'New Clients' : 
              language === 'es' ? 'Nuevos Clientes' : 
              'Novos clientes',
      valor: language === 'en' ? '15 clients' : 
             language === 'es' ? '15 clientes' : 
             '15 clientes',
      progresso: 40,
      dataFinal: "30/06/2025",
      status: "em_andamento"
    },
    {
      id: 3,
      titulo: language === 'en' ? 'Q1 Sales Goal' : 
              language === 'es' ? 'Meta de ventas Q1' : 
              'Meta de vendas Q1',
      valor: "R$ 85.000,00",
      progresso: 100,
      dataFinal: "31/03/2025",
      status: "concluida"
    }
  ];

  // Translation for active and completed sections
  const getActiveGoalsText = () => {
    switch(language) {
      case 'en': return 'Active Goals';
      case 'es': return 'Metas Activas';
      case 'pt': return 'Metas Ativas';
      default: return 'Metas Ativas';
    }
  };
  
  const getCompletedGoalsText = () => {
    switch(language) {
      case 'en': return 'Completed Goals';
      case 'es': return 'Metas Completadas';
      case 'pt': return 'Metas Concluídas';
      default: return 'Metas Concluídas';
    }
  };

  // Translation for buttons
  const getDetailsText = () => {
    switch(language) {
      case 'en': return 'Details';
      case 'es': return 'Detalles';
      case 'pt': return 'Detalhes';
      default: return 'Detalhes';
    }
  };
  
  const getUpdateText = () => {
    switch(language) {
      case 'en': return 'Update';
      case 'es': return 'Actualizar';
      case 'pt': return 'Atualizar';
      default: return 'Atualizar';
    }
  };

  // Translation for the sidebar
  const getPerformanceText = () => {
    switch(language) {
      case 'en': return 'Overall Performance';
      case 'es': return 'Rendimiento General';
      case 'pt': return 'Desempenho Geral';
      default: return 'Desempenho Geral';
    }
  };
  
  const getCompletionRateText = () => {
    switch(language) {
      case 'en': return 'Completion average';
      case 'es': return 'Media de finalización';
      case 'pt': return 'Média de conclusão';
      default: return 'Média de conclusão';
    }
  };
  
  const getSummaryText = () => {
    switch(language) {
      case 'en': return 'Summary';
      case 'es': return 'Resumen';
      case 'pt': return 'Resumo';
      default: return 'Resumo';
    }
  };
  
  const getTotalText = () => {
    switch(language) {
      case 'en': return 'Total';
      case 'es': return 'Total';
      case 'pt': return 'Total';
      default: return 'Total';
    }
  };
  
  const getActiveText = () => {
    switch(language) {
      case 'en': return 'Active';
      case 'es': return 'Activas';
      case 'pt': return 'Ativas';
      default: return 'Ativas';
    }
  };
  
  const getCompletedText = () => {
    switch(language) {
      case 'en': return 'Completed';
      case 'es': return 'Completadas';
      case 'pt': return 'Concluídas';
      default: return 'Concluídas';
    }
  };
  
  const getTipsText = () => {
    switch(language) {
      case 'en': return 'Tips';
      case 'es': return 'Consejos';
      case 'pt': return 'Dicas';
      default: return 'Dicas';
    }
  };
  
  const getTipsContentText = () => {
    switch(language) {
      case 'en': return [
        'SMART goals are specific, measurable, achievable, relevant, and time-bound.',
        'Break down your big goals into smaller parts to better track your daily progress.',
        'Reevaluate your goals at the end of each cycle to adjust your strategy.'
      ];
      case 'es': return [
        'Las metas SMART son específicas, medibles, alcanzables, relevantes y con tiempo definido.',
        'Divide tus grandes metas en partes más pequeñas para hacer un mejor seguimiento de tu progreso diario.',
        'Reevalúa tus metas al final de cada ciclo para ajustar tu estrategia.'
      ];
      case 'pt': return [
        'Metas SMART são específicas, mensuráveis, alcançáveis, relevantes e com tempo definido.',
        'Divida suas metas grandes em partes menores para acompanhar melhor seu progresso diário.',
        'Reavalie suas metas ao final de cada ciclo para ajustar sua estratégia.'
      ];
      default: return [
        'Metas SMART são específicas, mensuráveis, alcançáveis, relevantes e com tempo definido.',
        'Divida suas metas grandes em partes menores para acompanhar melhor seu progresso diário.',
        'Reavalie suas metas ao final de cada ciclo para ajustar sua estratégia.'
      ];
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{getTitle()}</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center items-center h-32">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
                    <div className="h-2 w-48 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="animate-pulse pt-6">
                <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                <div className="h-2 w-full bg-slate-200 rounded mb-4"></div>
                <div className="h-12 w-full bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
        <Button className="gap-2">
          <PlusCircle size={16} />
          {getNewGoalText()}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">{getActiveGoalsText()}</h2>
          
          {metas
            .filter(meta => meta.status === "em_andamento")
            .map(meta => (
              <Card key={meta.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{meta.titulo}</h3>
                        <p className="text-2xl font-bold mt-1">{meta.valor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {language === 'en' ? 'End date: ' : 
                           language === 'es' ? 'Fecha final: ' : 
                           'Data final: '}{meta.dataFinal}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          {language === 'en' ? 'Progress' : 
                           language === 'es' ? 'Progreso' : 
                           'Progresso'}
                        </span>
                        <span>{meta.progresso}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${meta.progresso}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">{getDetailsText()}</Button>
                      <Button size="sm">{getUpdateText()}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          
          <h2 className="text-xl font-semibold mt-8">{getCompletedGoalsText()}</h2>
          
          {metas
            .filter(meta => meta.status === "concluida")
            .map(meta => (
              <Card key={meta.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          {meta.titulo}
                          <CheckCircle size={16} className="text-green-500" />
                        </h3>
                        <p className="text-2xl font-bold mt-1">{meta.valor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Completed on: ' : 
                           language === 'es' ? 'Completada en: ' : 
                           'Concluída em: '}{meta.dataFinal}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          {language === 'en' ? 'Progress' : 
                           language === 'es' ? 'Progreso' : 
                           'Progresso'}
                        </span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{getPerformanceText()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-100 rounded-lg">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium">{getCompletionRateText()}</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">{getSummaryText()}</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-100 p-2 rounded-md">
                      <div className="text-lg font-bold">3</div>
                      <div className="text-xs text-muted-foreground">{getTotalText()}</div>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-md">
                      <div className="text-lg font-bold">2</div>
                      <div className="text-xs text-muted-foreground">{getActiveText()}</div>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-md">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">{getCompletedText()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{getTipsText()}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              {getTipsContentText().map((tip, index) => (
                <p key={index}>{tip}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Metas;
