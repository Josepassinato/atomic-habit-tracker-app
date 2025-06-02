
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Target, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useTeams, useSalesReps } from "@/hooks/use-supabase";

interface Meta {
  id: string;
  nome: string;
  valor: number;
  periodo: "mensal" | "trimestral" | "anual";
  equipeId?: string;
  vendedorId?: string;
}

const GerenciarMetas = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [novaMeta, setNovaMeta] = useState({
    nome: "",
    valor: 0,
    periodo: "mensal" as const,
    equipeId: "",
    vendedorId: ""
  });

  const { teams: equipes, loading: loadingEquipes } = useTeams();
  const { salesReps: vendedores, loading: loadingVendedores } = useSalesReps();

  useEffect(() => {
    // Carregar metas do localStorage ou API
    const metasSalvas = localStorage.getItem('metas');
    if (metasSalvas) {
      setMetas(JSON.parse(metasSalvas));
    } else {
      // Metas de exemplo
      const metasIniciais = [
        {
          id: '1',
          nome: 'Meta Mensal de Vendas',
          valor: 100000,
          periodo: 'mensal' as const,
          equipeId: '1'
        },
        {
          id: '2',
          nome: 'Meta de Prospecção',
          valor: 50,
          periodo: 'mensal' as const,
          vendedorId: '1'
        }
      ];
      setMetas(metasIniciais);
      localStorage.setItem('metas', JSON.stringify(metasIniciais));
    }
  }, []);

  const adicionarMeta = () => {
    if (!novaMeta.nome || novaMeta.valor <= 0) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    const novaMetaCriada = {
      id: Date.now().toString(),
      nome: novaMeta.nome,
      valor: novaMeta.valor,
      periodo: novaMeta.periodo,
      equipeId: novaMeta.equipeId || undefined,
      vendedorId: novaMeta.vendedorId || undefined
    };

    const novasMetas = [...metas, novaMetaCriada];
    setMetas(novasMetas);
    localStorage.setItem('metas', JSON.stringify(novasMetas));
    
    setNovaMeta({
      nome: "",
      valor: 0,
      periodo: "mensal",
      equipeId: "",
      vendedorId: ""
    });
    
    toast.success("Meta adicionada com sucesso!");
  };

  const removerMeta = (id: string) => {
    const novasMetas = metas.filter(meta => meta.id !== id);
    setMetas(novasMetas);
    localStorage.setItem('metas', JSON.stringify(novasMetas));
    toast.success("Meta removida com sucesso!");
  };

  const getNomeEquipe = (id: string) => {
    const equipe = equipes.find(e => e.id === id);
    return equipe ? equipe.name : "Equipe não encontrada";
  };

  const getNomeVendedor = (id: string) => {
    const vendedor = vendedores.find(v => v.id === id);
    return vendedor ? vendedor.name : "Vendedor não encontrado";
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gerenciar Metas</h1>
              <p className="text-muted-foreground">
                Configure e acompanhe as metas da sua equipe
              </p>
            </div>
            <Button onClick={adicionarMeta} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Meta
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Nova Meta</CardTitle>
              <CardDescription>
                Defina metas para equipes ou vendedores individuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Meta</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Meta de Vendas Q3"
                      value={novaMeta.nome}
                      onChange={(e) => setNovaMeta({...novaMeta, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor da Meta</Label>
                    <Input
                      id="valor"
                      type="number"
                      placeholder="Ex: 100000"
                      value={novaMeta.valor}
                      onChange={(e) => setNovaMeta({...novaMeta, valor: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodo">Período</Label>
                    <select
                      id="periodo"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={novaMeta.periodo}
                      onChange={(e) => setNovaMeta({...novaMeta, periodo: e.target.value as any})}
                    >
                      <option value="mensal">Mensal</option>
                      <option value="trimestral">Trimestral</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipe">Equipe (opcional)</Label>
                    <select
                      id="equipe"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={novaMeta.equipeId}
                      onChange={(e) => setNovaMeta({...novaMeta, equipeId: e.target.value, vendedorId: ""})}
                    >
                      <option value="">Selecione uma equipe</option>
                      {equipes.map(equipe => (
                        <option key={equipe.id} value={equipe.id}>{equipe.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendedor">Vendedor (opcional)</Label>
                    <select
                      id="vendedor"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={novaMeta.vendedorId}
                      onChange={(e) => setNovaMeta({...novaMeta, vendedorId: e.target.value, equipeId: ""})}
                      disabled={!!novaMeta.equipeId}
                    >
                      <option value="">Selecione um vendedor</option>
                      {vendedores.map(vendedor => (
                        <option key={vendedor.id} value={vendedor.id}>{vendedor.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button onClick={adicionarMeta} className="w-full">
                  Adicionar Meta
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {metas.map(meta => (
              <Card key={meta.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {meta.nome}
                    </CardTitle>
                    <Badge variant="outline">
                      {meta.periodo === 'mensal' ? 'Mensal' : 
                       meta.periodo === 'trimestral' ? 'Trimestral' : 'Anual'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {meta.equipeId ? `Equipe: ${getNomeEquipe(meta.equipeId)}` : 
                     meta.vendedorId ? `Vendedor: ${getNomeVendedor(meta.vendedorId)}` : 
                     'Meta geral'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Valor da Meta
                      </div>
                      <span className="text-sm font-bold">
                        {meta.valor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removerMeta(meta.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GerenciarMetas;
