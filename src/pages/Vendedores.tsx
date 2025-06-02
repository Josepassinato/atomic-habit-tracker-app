import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Target, Plus, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useTeams, useSalesReps } from "@/hooks/use-supabase";

const Vendedores = () => {
  const [vendedorSelecionado, setVendedorSelecionado] = useState<string>("");
  const [filtroEquipe, setFiltroEquipe] = useState<string>("");
  const [novoVendedor, setNovoVendedor] = useState({
    nome: "",
    email: "",
    equipeId: "",
    meta: 100000
  });

  const { teams: equipes, loading: loadingEquipes } = useTeams();
  const { salesReps: vendedores, loading: loadingVendedores } = useSalesReps();

  const vendedoresFiltrados = filtroEquipe
    ? vendedores.filter((vendedor) => vendedor.equipe_id === filtroEquipe)
    : vendedores;

  const [editMode, setEditMode] = useState(false);
  const [editingVendedorId, setEditingVendedorId] = useState<string | null>(null);
  const [editingVendedor, setEditingVendedor] = useState({
    nome: "",
    email: "",
    equipeId: "",
    meta: 100000
  });

  useEffect(() => {
    if (vendedorSelecionado) {
      const vendedor = vendedores.find((vendedor) => vendedor.id === vendedorSelecionado);
      if (vendedor) {
        setEditingVendedor({
          nome: vendedor.name,
          email: vendedor.email,
          equipeId: vendedor.equipe_id,
          meta: vendedor.meta_atual
        });
      }
    }
  }, [vendedorSelecionado, vendedores]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoVendedor({
      ...novoVendedor,
      [e.target.name]: e.target.value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingVendedor({
      ...editingVendedor,
      [e.target.name]: e.target.value
    });
  };

  const handleEquipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNovoVendedor({
      ...novoVendedor,
      equipeId: e.target.value
    });
  };

  const handleEditEquipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditingVendedor({
      ...editingVendedor,
      equipeId: e.target.value
    });
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoVendedor({
      ...novoVendedor,
      meta: parseInt(e.target.value)
    });
  };

  const handleEditMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingVendedor({
      ...editingVendedor,
      meta: parseInt(e.target.value)
    });
  };

  const handleFiltroEquipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEquipe(e.target.value);
  };

  const adicionarVendedor = () => {
    toast.success("Vendedor adicionado com sucesso!");
  };

  const salvarVendedor = () => {
    toast.success("Vendedor salvo com sucesso!");
  };

  const excluirVendedor = () => {
    toast.success("Vendedor excluído com sucesso!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gerenciar Vendedores</h1>
              <p className="text-muted-foreground">
                Acompanhe o desempenho e gerencie sua equipe de vendas
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Vendedor
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Vendedor</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para adicionar um novo vendedor à sua
                equipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    type="text"
                    id="nome"
                    name="nome"
                    value={novoVendedor.nome}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={novoVendedor.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipe">Equipe</Label>
                  <select
                    id="equipe"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={novoVendedor.equipeId}
                    onChange={handleEquipeChange}
                  >
                    <option value="">Selecione uma equipe</option>
                    {equipes.map((equipe) => (
                      <option key={equipe.id} value={equipe.id}>
                        {equipe.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="meta">Meta Mensal</Label>
                  <Input
                    type="number"
                    id="meta"
                    name="meta"
                    value={novoVendedor.meta}
                    onChange={handleMetaChange}
                  />
                </div>
              </div>
              <Button onClick={adicionarVendedor}>Adicionar Vendedor</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Vendedores</CardTitle>
                <select
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filtroEquipe}
                  onChange={handleFiltroEquipeChange}
                >
                  <option value="">Todas as Equipes</option>
                  {equipes.map((equipe) => (
                    <option key={equipe.id} value={equipe.id}>
                      {equipe.name}
                    </option>
                  ))}
                </select>
              </div>
              <CardDescription>
                Acompanhe o desempenho individual de cada vendedor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progresso
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendedoresFiltrados.map((vendedor) => (
                      <tr key={vendedor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {vendedor.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {vendedor.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {
                              equipes.find((equipe) => equipe.id === vendedor.equipe_id)?.name
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            ${vendedor.meta_atual.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24">
                              <Progress value={60} />
                            </div>
                            <div className="ml-2 text-sm text-gray-500">
                              60%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditMode(true);
                              setVendedorSelecionado(vendedor.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={excluirVendedor}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Vendedores;
