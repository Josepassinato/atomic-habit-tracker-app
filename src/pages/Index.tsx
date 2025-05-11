
import React from "react";
import Header from "@/components/Header";
import DashboardSummary from "@/components/DashboardSummary";
import HabitosTracker from "@/components/HabitosTracker";
import MetasVendas from "@/components/MetasVendas";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Toaster richColors closeButton position="top-right" />
      <Header />
      <main className="container flex-1 py-6">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <DashboardSummary />
        
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xl font-semibold">Desempenho de Vendas</h2>
                <MetasVendas />
              </div>
              <div>
                <h2 className="mb-3 text-xl font-semibold">Hábitos Atômicos</h2>
                <HabitosTracker />
              </div>
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold">Assistente IA</h2>
            <ConsultoriaIA />
            <div className="mt-6">
              <IntegracoesCRM />
            </div>
          </div>
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

export default Index;
