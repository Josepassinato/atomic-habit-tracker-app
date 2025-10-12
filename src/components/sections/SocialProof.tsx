import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, Award } from "lucide-react";

export const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Equipes ativas",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      value: "+28%",
      label: "Média de aumento em vendas",
      color: "text-green-500"
    },
    {
      icon: Target,
      value: "94%",
      label: "Taxa de conclusão de hábitos",
      color: "text-primary"
    },
    {
      icon: Award,
      value: "2.5x",
      label: "ROI médio em 6 meses",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Resultados Comprovados</h3>
          <p className="text-muted-foreground">Dados de equipes reais usando o sistema</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 text-center hover-scale">
                <div className={`w-12 h-12 rounded-full ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Customer quotes */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  "Em 3 meses nossa equipe aumentou 35% nas vendas. O sistema de hábitos diários fez toda a diferença na consistência."
                </p>
                <div>
                  <div className="font-semibold">Carlos Mendes</div>
                  <div className="text-sm text-muted-foreground">Gerente de Vendas, Tech Solutions</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  "A integração com nosso CRM economiza 5 horas por semana. E a gamificação aumentou o engajamento da equipe em 80%."
                </p>
                <div>
                  <div className="font-semibold">Ana Paula Silva</div>
                  <div className="text-sm text-muted-foreground">Diretora Comercial, Growth Corp</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
