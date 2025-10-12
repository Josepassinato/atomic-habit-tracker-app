import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, CheckCircle2, Trophy } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <div className="relative">
      {/* Main preview card */}
      <Card className="overflow-hidden border-2 shadow-2xl animate-fade-in">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">Dashboard</h3>
              <p className="text-sm text-muted-foreground">Visão geral de performance</p>
            </div>
            <Badge className="bg-green-500">Ao vivo</Badge>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Meta Mensal</span>
              </div>
              <div className="text-2xl font-bold">R$ 45.2k</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs. mês passado
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Hábitos Hoje</span>
              </div>
              <div className="text-2xl font-bold">8/10</div>
              <div className="text-xs text-muted-foreground">80% completo</div>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Ranking</span>
              </div>
              <div className="text-2xl font-bold">#2</div>
              <div className="text-xs text-muted-foreground">de 15 vendedores</div>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Progresso</span>
              </div>
              <div className="text-2xl font-bold">73%</div>
              <div className="text-xs text-green-500">Meta em dia</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meta do Dia</span>
              <span className="font-medium">R$ 1.8k / R$ 2.5k</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary/80 w-[72%] rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Habits section */}
        <div className="p-4 bg-card border-t">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Ligar para 10 leads</span>
              </div>
              <Badge variant="secondary" className="text-xs">Completo</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Atualizar CRM</span>
              </div>
              <Badge variant="secondary" className="text-xs">Completo</Badge>
            </div>
            <div className="flex items-center justify-between text-sm opacity-50">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2" />
                <span>Enviar 5 propostas</span>
              </div>
              <Badge variant="outline" className="text-xs">Pendente</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating elements for visual interest */}
      <div className="absolute -top-4 -right-4 bg-primary/20 rounded-full p-3 animate-pulse">
        <Trophy className="h-6 w-6 text-primary" />
      </div>
      <div className="absolute -bottom-4 -left-4 bg-green-500/20 rounded-full p-3 animate-pulse delay-75">
        <TrendingUp className="h-6 w-6 text-green-500" />
      </div>
    </div>
  );
};
