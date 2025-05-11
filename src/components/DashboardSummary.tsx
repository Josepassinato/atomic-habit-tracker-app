
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const DashboardSummary = () => {
  // Dados simulados
  const metaVendas = 85;
  const habitosCumpridos = 92;
  const bonusTotal = 5;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Meta de Vendas</CardTitle>
          <CardDescription>Progresso do mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{metaVendas}%</div>
            <Badge variant={metaVendas >= 100 ? "default" : metaVendas >= 80 ? "secondary" : "outline"}>
              {metaVendas >= 100 ? "Completo" : metaVendas >= 80 ? "No Caminho" : "Em Progresso"}
            </Badge>
          </div>
          <Progress className="mt-2" value={metaVendas} />
          <p className="mt-2 text-sm text-muted-foreground">
            Bônus atual: {metaVendas >= 100 ? "3%" : metaVendas >= 80 ? "1.5%" : "0%"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Hábitos Atômicos</CardTitle>
          <CardDescription>Cumprimento diário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{habitosCumpridos}%</div>
            <Badge variant={habitosCumpridos >= 90 ? "default" : habitosCumpridos >= 70 ? "secondary" : "outline"}>
              {habitosCumpridos >= 90 ? "Excelente" : habitosCumpridos >= 70 ? "Bom" : "Precisa Melhorar"}
            </Badge>
          </div>
          <Progress className="mt-2" value={habitosCumpridos} />
          <p className="mt-2 text-sm text-muted-foreground">
            Bônus atual: {habitosCumpridos >= 90 ? "2%" : habitosCumpridos >= 70 ? "1%" : "0%"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Bônus Total</CardTitle>
          <CardDescription>Premiação acumulada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{bonusTotal}%</div>
            <Badge>Premiação Mensal</Badge>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Meta de Vendas</span>
              <span className="font-medium">3.0%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Cumprimento de Hábitos</span>
              <span className="font-medium">2.0%</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>{bonusTotal}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
