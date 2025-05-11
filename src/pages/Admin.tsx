
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/use-supabase";
import { BarChart, Key, PieChart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { openAIService } from "@/services/openai-service";

// Tipos para os dados do painel administrativo
type EmpresaAdmin = {
  id: string;
  nome: string;
  segmento: string;
  plano: string;
  data_cadastro: string;
  tokens_consumidos: number;
  tokens_limite: number;
  status: "ativo" | "inativo" | "trial";
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  const [apiKey, setApiKey] = useState("");

  // Estatísticas gerais
  const [estatisticas, setEstatisticas] = useState({
    totalEmpresas: 0,
    empresasAtivas: 0,
    empresasInativas: 0,
    empresasTrial: 0,
    tokensTotais: 0,
    receitaMensal: 0,
  });

  // Verifica se o usuário atual é admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!supabase) return;
      
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        const userObj = JSON.parse(user);
        
        // Esse é um exemplo simples. Em produção, você deve verificar isso no backend
        // com Supabase RLS ou uma função de borda.
        // Aqui assumimos que o seu email é o admin
        const isAdminUser = userObj.email === "admin@habitus.com";
        setIsAdmin(isAdminUser);
        
        if (!isAdminUser) {
          navigate("/dashboard");
        } else {
          // Se for admin, carrega os dados
          await carregarDadosAdmin();
          carregarApiKey();
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [navigate, supabase]);

  // Carregar API Key do OpenAI
  const carregarApiKey = () => {
    const savedApiKey = localStorage.getItem("admin-openai-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  };

  // Salvar API Key do OpenAI
  const salvarApiKey = () => {
    try {
      if (apiKey.trim()) {
        localStorage.setItem("admin-openai-api-key", apiKey);
        openAIService.setApiKey(apiKey);
        toast.success("Chave da API salva com sucesso!");
      } else {
        toast.error("Por favor, insira uma chave API válida.");
      }
    } catch (error) {
      console.error("Erro ao salvar a chave API:", error);
      toast.error("Erro ao salvar a chave API.");
    }
  };

  // Função para carregar os dados do painel administrativo
  const carregarDadosAdmin = async () => {
    // Em um app real, estes dados viriam do Supabase
    // Por enquanto, usamos dados fictícios para demonstração
    const dadosFicticios: EmpresaAdmin[] = [
      {
        id: "1",
        nome: "TechSolutions Ltda",
        segmento: "Tecnologia",
        plano: "Enterprise",
        data_cadastro: "2025-02-15",
        tokens_consumidos: 125000,
        tokens_limite: 500000,
        status: "ativo"
      },
      {
        id: "2",
        nome: "Vendas Globais SA",
        segmento: "Varejo",
        plano: "Professional",
        data_cadastro: "2025-03-21",
        tokens_consumidos: 43200,
        tokens_limite: 100000,
        status: "ativo"
      },
      {
        id: "3",
        nome: "Marketing Digital Express",
        segmento: "Marketing",
        plano: "Starter",
        data_cadastro: "2025-04-05",
        tokens_consumidos: 9800,
        tokens_limite: 50000,
        status: "trial"
      },
      {
        id: "4",
        nome: "Consultoria Nexus",
        segmento: "Consultoria",
        plano: "Professional",
        data_cadastro: "2025-03-10",
        tokens_consumidos: 78500,
        tokens_limite: 100000,
        status: "ativo"
      },
      {
        id: "5",
        nome: "Imobiliária Futuro",
        segmento: "Imobiliário",
        plano: "Starter",
        data_cadastro: "2025-02-28",
        tokens_consumidos: 12300,
        tokens_limite: 50000,
        status: "inativo"
      }
    ];

    setEmpresas(dadosFicticios);

    // Calcula estatísticas
    const ativas = dadosFicticios.filter(e => e.status === "ativo").length;
    const inativas = dadosFicticios.filter(e => e.status === "inativo").length;
    const trial = dadosFicticios.filter(e => e.status === "trial").length;
    const tokens = dadosFicticios.reduce((acc, emp) => acc + emp.tokens_consumidos, 0);
    
    // Cálculo simplificado da receita
    const receita = dadosFicticios.reduce((acc, emp) => {
      if (emp.status !== "ativo") return acc;
      switch(emp.plano) {
        case "Enterprise": return acc + 997;
        case "Professional": return acc + 497;
        case "Starter": return acc + 197;
        default: return acc;
      }
    }, 0);

    setEstatisticas({
      totalEmpresas: dadosFicticios.length,
      empresasAtivas: ativas,
      empresasInativas: inativas,
      empresasTrial: trial,
      tokensTotais: tokens,
      receitaMensal: receita
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
    return null; // Componente será desmontado quando navigate é chamado
  }

  // Formatar para real brasileiro
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
            Acesso Restrito
          </div>
        </div>

        {/* Cards com métricas principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Empresas
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.totalEmpresas}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticas.empresasAtivas} ativas, {estatisticas.empresasTrial} em trial
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatarMoeda(estatisticas.receitaMensal)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                MRR atual
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tokens Consumidos
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.tokensTotais.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de tokens usados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Card para configurar chave da API OpenAI */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configuração da API OpenAI
            </CardTitle>
            <CardDescription>
              Configure aqui a chave da API da OpenAI que será usada por todos os clientes do SaaS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Esta chave será usada para todas as solicitações de IA dos clientes do SaaS.
                Os tokens consumidos serão contabilizados por empresa.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={salvarApiKey} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Salvar Chave da API
            </Button>
          </CardFooter>
        </Card>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="empresas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="consumo">Consumo de Tokens</TabsTrigger>
            <TabsTrigger value="planos">Distribuição de Planos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="empresas">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Empresas</CardTitle>
                <CardDescription>
                  Visão geral de todas as empresas cadastradas no sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Lista de empresas cadastradas no SaaS</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Consumo de Tokens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empresas.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell className="font-medium">{empresa.nome}</TableCell>
                        <TableCell>{empresa.segmento}</TableCell>
                        <TableCell>{empresa.plano}</TableCell>
                        <TableCell>
                          {new Date(empresa.data_cadastro).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            empresa.status === "ativo" 
                              ? "bg-green-100 text-green-800" 
                              : empresa.status === "trial" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-red-100 text-red-800"
                          }`}>
                            {empresa.status === "ativo" 
                              ? "Ativo" 
                              : empresa.status === "trial" 
                                ? "Trial" 
                                : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {empresa.tokens_consumidos.toLocaleString()} / {empresa.tokens_limite.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="consumo">
            <Card>
              <CardHeader>
                <CardTitle>Consumo de Tokens</CardTitle>
                <CardDescription>
                  Análise detalhada do consumo de tokens por empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {empresas.map((empresa) => (
                    <div key={empresa.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{empresa.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((empresa.tokens_consumidos / empresa.tokens_limite) * 100)}% utilizado
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${Math.min(100, (empresa.tokens_consumidos / empresa.tokens_limite) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {empresa.tokens_consumidos.toLocaleString()} / {empresa.tokens_limite.toLocaleString()} tokens
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planos">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
                <CardDescription>
                  Visão geral da distribuição de planos entre as empresas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Para cada tipo de plano, vamos calcular e exibir */}
                  {["Starter", "Professional", "Enterprise"].map(plano => {
                    const empresasNoPlano = empresas.filter(e => e.plano === plano);
                    const countTotal = empresasNoPlano.length;
                    const countAtivas = empresasNoPlano.filter(e => e.status === "ativo").length;
                    
                    // Receita deste plano
                    let valorPlano = 0;
                    switch(plano) {
                      case "Enterprise": valorPlano = 997; break;
                      case "Professional": valorPlano = 497; break;
                      case "Starter": valorPlano = 197; break;
                    }
                    const receitaPlano = countAtivas * valorPlano;
                    
                    return (
                      <div key={plano} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg">{plano}</h3>
                          <div className="text-sm text-muted-foreground">
                            {countTotal} empresas ({countAtivas} ativas)
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-1">
                          <span>Valor do plano:</span>
                          <span className="font-medium">{formatarMoeda(valorPlano)}/mês</span>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-4">
                          <span>Receita total:</span>
                          <span className="font-medium">{formatarMoeda(receitaPlano)}/mês</span>
                        </div>
                        
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              plano === "Enterprise" ? "bg-primary" : 
                              plano === "Professional" ? "bg-orange-400" : 
                              "bg-orange-300"
                            }`} 
                            style={{ width: `${(countTotal / empresas.length) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.round((countTotal / empresas.length) * 100)}% das empresas
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
