
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Relatorios = () => {
  const navigate = useNavigate();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"semana" | "mes" | "trimestre" | "ano">("mes");
  const [equipeId, setEquipeId] = useState<string>("");
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    // Aqui faremos a integração com Supabase para verificar autenticação
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Dados fictícios - serão substituídos por dados do Supabase
  const equipes = [
    { id: "1", nome: "Equipe Alfa" },
    { id: "2", nome: "Equipe Beta" },
    { id: "3", nome: "Equipe Delta" }
  ];

  const vendedores = [
    { id: "1", nome: "João Silva", equipe: "1", vendas: 120000, meta: 150000, conversao: 28 },
    { id: "2", nome: "Maria Santos", equipe: "1", vendas: 180000, meta: 150000, conversao: 35 },
    { id: "3", nome: "Pedro Costa", equipe: "2", vendas: 90000, meta: 100000, conversao: 22 },
    { id: "4", nome: "Ana Oliveira", equipe: "2", vendas: 110000, meta: 100000, conversao: 29 },
    { id: "5", nome: "Carlos Mendes", equipe: "3", vendas: 130000, meta: 120000, conversao: 31 }
  ];

  const vendedoresFiltrados = equipeId 
    ? vendedores.filter(vendedor => vendedor.equipe === equipeId)
    : vendedores;

  // Totais para dashboard
  const totalVendas = vendedores.reduce((acc, v) => acc + v.vendas, 0);
  const totalMetas = vendedores.reduce((acc, v) => acc + v.meta, 0);
  const percentualMeta = Math.round((totalVendas / totalMetas) * 100);
  const mediaConversao = Math.round(vendedores.reduce((acc, v) => acc + v.conversao, 0) / vendedores.length);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header isLoggedIn={true} />
      <main className="container flex-1 py-6">
        <h1 className="mb-6 text-3xl font-bold">Relatórios de Desempenho</h1>

        {/* Card de resumo */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalVendas.toLocaleString('pt-BR')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Meta Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalMetas.toLocaleString('pt-BR')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">% da Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{percentualMeta}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaConversao}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de relatório */}
        <div className="my-6 flex flex-wrap items-end gap-4">
          <div>
            <h2 className="mb-2 text-sm font-medium">Período</h2>
            <Select value={periodoSelecionado} onValueChange={(value) => setPeriodoSelecionado(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="mes">Este mês</SelectItem>
                <SelectItem value="trimestre">Este trimestre</SelectItem>
                <SelectItem value="ano">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium">Equipe</h2>
            <Select value={equipeId} onValueChange={setEquipeId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as equipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as equipes</SelectItem>
                {equipes.map(equipe => (
                  <SelectItem key={equipe.id} value={equipe.id}>
                    {equipe.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium">Data específica</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="ml-auto">Gerar Relatório</Button>
        </div>

        {/* Tabs para diferentes visões */}
        <Tabs defaultValue="vendedores" className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
            <TabsTrigger value="equipes">Equipes</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vendedores">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Desempenho de Vendedores</CardTitle>
                <CardDescription>
                  Visão detalhada do desempenho individual dos vendedores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Equipe</TableHead>
                      <TableHead className="text-right">Vendas</TableHead>
                      <TableHead className="text-right">Meta</TableHead>
                      <TableHead className="text-right">% da Meta</TableHead>
                      <TableHead className="text-right">Conv. %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendedoresFiltrados.map((vendedor) => {
                      const equipe = equipes.find(e => e.id === vendedor.equipe);
                      const percentual = Math.round((vendedor.vendas / vendedor.meta) * 100);
                      
                      return (
                        <TableRow key={vendedor.id}>
                          <TableCell className="font-medium">{vendedor.nome}</TableCell>
                          <TableCell>{equipe?.nome}</TableCell>
                          <TableCell className="text-right">
                            R$ {vendedor.vendas.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {vendedor.meta.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">{percentual}%</TableCell>
                          <TableCell className="text-right">{vendedor.conversao}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="equipes">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Desempenho de Equipes</CardTitle>
                <CardDescription>
                  Comparativo entre equipes de vendas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Relatórios de equipes serão implementados após integração com banco de dados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="empresas">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Desempenho por Empresa</CardTitle>
                <CardDescription>
                  Análise consolidada por empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Relatórios por empresa serão implementados após integração com banco de dados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - O futuro da automação de vendas e performance
        </div>
      </footer>
    </div>
  );
};

export default Relatorios;
