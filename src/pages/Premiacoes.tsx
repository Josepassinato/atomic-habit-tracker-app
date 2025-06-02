import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Gift, Medal } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useTeams, useSalesReps } from "@/hooks/use-supabase";

interface Premiacao {
  id: string;
  nome: string;
  descricao: string;
  criterio: string;
  valor: number;
  tipo: "individual" | "equipe";
  status: "ativa" | "pausada" | "finalizada";
  vencedores?: string[];
}

const Premiacoes = () => {
  const [premiacoes, setPremiacoes] = useState<Premiacao[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  
  const { teams: equipes, loading: loadingEquipes } = useTeams();
  const { salesReps: vendedores, loading: loadingVendedores } = useSalesReps();

  useEffect(() => {
    // Aqui faremos a integração com Supabase para buscar as premiações
    const fetchPremiacoes = async () => {
      // Simulação de dados vindos do Supabase
      const samplePremiacoes = [
        {
          id: "1",
          nome: "Vendedor do Mês",
          descricao: "Premiação para o vendedor com maior volume de vendas no mês.",
          criterio: "Maior volume de vendas",
          valor: 1000,
          tipo: "individual",
          status: "ativa",
          vencedores: ["João Silva"]
        },
        {
          id: "2",
          nome: "Meta Trimestral Alcançada",
          descricao: "Premiação para a equipe que atingir a meta trimestral.",
          criterio: "Atingir meta trimestral",
          valor: 5000,
          tipo: "equipe",
          status: "ativa",
          vencedores: ["Equipe Alpha"]
        }
      ];
      setPremiacoes(samplePremiacoes);

      // Simulação de ranking
      const sampleRanking = [
        { nome: "João Silva", vendas: 150000 },
        { nome: "Maria Souza", vendas: 130000 },
        { nome: "Carlos Pereira", vendas: 120000 }
      ];
      setRanking(sampleRanking);
    };

    fetchPremiacoes();
  }, []);

  const criarPremiacao = () => {
    toast.success("Implementar lógica de criação de premiação");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Sistema de Premiações</h1>
              <p className="text-muted-foreground">
                Gamifique a experiência da sua equipe de vendas
              </p>
            </div>
            <Button onClick={criarPremiacao} className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Nova Premiação
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {premiacoes.map((premiacao) => (
              <Card key={premiacao.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {premiacao.tipo === "individual" ? <Star className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                    {premiacao.nome}
                  </CardTitle>
                  <CardDescription>{premiacao.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Critério:</strong> {premiacao.criterio}</p>
                    <p><strong>Valor:</strong> R$ {premiacao.valor}</p>
                    <Badge variant="secondary">{premiacao.status}</Badge>
                    {premiacao.vencedores && premiacao.vencedores.length > 0 && (
                      <p><strong>Vencedores:</strong> {premiacao.vencedores.join(", ")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Ranking de Vendas</h2>
            <Card>
              <CardHeader>
                <CardTitle>Top Vendedores</CardTitle>
                <CardDescription>Ranking mensal de vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Colocação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                      {ranking.map((vendedor, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vendedor.nome}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">R$ {vendedor.vendas}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Premiacoes;
