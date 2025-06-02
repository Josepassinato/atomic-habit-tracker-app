
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Filter, 
  FileText, 
  FileSpreadsheet, 
  FileImage,
  Calendar,
  Search,
  Users,
  TrendingUp,
  BarChart3,
  Settings
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface FiltroRelatorio {
  periodo: {
    tipo: "personalizado" | "ultima_semana" | "ultimo_mes" | "ultimo_trimestre" | "ultimo_ano";
    dataInicio?: Date;
    dataFim?: Date;
  };
  equipes: string[];
  vendedores: string[];
  produtos: string[];
  regioes: string[];
  statusVenda: string[];
  valorMinimo?: number;
  valorMaximo?: number;
}

interface FormatoExportacao {
  tipo: "pdf" | "excel" | "csv" | "png";
  nome: string;
  icone: React.ReactNode;
  descricao: string;
}

const RelatoriosAvancados: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltroRelatorio>({
    periodo: { tipo: "ultimo_mes" },
    equipes: [],
    vendedores: [],
    produtos: [],
    regioes: [],
    statusVenda: []
  });

  const [tipoRelatorio, setTipoRelatorio] = useState<string>("vendas");
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);
  const [exportandoRelatorio, setExportandoRelatorio] = useState(false);

  const formatosExportacao: FormatoExportacao[] = [
    {
      tipo: "pdf",
      nome: "PDF",
      icone: <FileText className="h-4 w-4" />,
      descricao: "Relatório completo formatado"
    },
    {
      tipo: "excel",
      nome: "Excel",
      icone: <FileSpreadsheet className="h-4 w-4" />,
      descricao: "Planilha com dados detalhados"
    },
    {
      tipo: "csv",
      nome: "CSV",
      icone: <FileText className="h-4 w-4" />,
      descricao: "Dados brutos para análise"
    },
    {
      tipo: "png",
      nome: "Imagem",
      icone: <FileImage className="h-4 w-4" />,
      descricao: "Gráficos em alta resolução"
    }
  ];

  const tiposRelatorio = [
    { valor: "vendas", nome: "Vendas Detalhadas", icone: <TrendingUp className="h-4 w-4" /> },
    { valor: "equipes", nome: "Performance de Equipes", icone: <Users className="h-4 w-4" /> },
    { valor: "produtos", nome: "Análise de Produtos", icone: <BarChart3 className="h-4 w-4" /> },
    { valor: "habitos", nome: "Relatório de Hábitos", icone: <Calendar className="h-4 w-4" /> },
    { valor: "personalizado", nome: "Relatório Personalizado", icone: <Settings className="h-4 w-4" /> }
  ];

  const equipes = [
    { id: "1", nome: "Equipe Alfa" },
    { id: "2", nome: "Equipe Beta" },
    { id: "3", nome: "Equipe Delta" }
  ];

  const vendedores = [
    { id: "1", nome: "João Silva" },
    { id: "2", nome: "Maria Santos" },
    { id: "3", nome: "Pedro Costa" },
    { id: "4", nome: "Ana Oliveira" }
  ];

  const handleFiltroEquipe = (equipeId: string, checked: boolean) => {
    setFiltros(prev => ({
      ...prev,
      equipes: checked 
        ? [...prev.equipes, equipeId]
        : prev.equipes.filter(id => id !== equipeId)
    }));
  };

  const handleFiltroVendedor = (vendedorId: string, checked: boolean) => {
    setFiltros(prev => ({
      ...prev,
      vendedores: checked 
        ? [...prev.vendedores, vendedorId]
        : prev.vendedores.filter(id => id !== vendedorId)
    }));
  };

  const exportarRelatorio = async (formato: FormatoExportacao) => {
    setExportandoRelatorio(true);
    
    try {
      // Simula a geração do relatório
      toast.loading(`Gerando relatório em ${formato.nome}...`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula o download
      const dadosRelatorio = {
        tipo: tipoRelatorio,
        filtros,
        formato: formato.tipo,
        dataGeracao: new Date().toISOString(),
        dados: {
          totalVendas: 1500000,
          vendas: [
            { vendedor: "João Silva", valor: 120000, meta: 150000 },
            { vendedor: "Maria Santos", valor: 180000, meta: 150000 }
          ],
          equipes: [
            { nome: "Equipe Alfa", vendas: 300000, meta: 300000 },
            { nome: "Equipe Beta", vendas: 200000, meta: 200000 }
          ]
        }
      };

      // Cria o blob com os dados
      const jsonString = JSON.stringify(dadosRelatorio, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Cria o link para download
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-${tipoRelatorio}-${format(new Date(), "yyyy-MM-dd")}.${formato.tipo === "excel" ? "xlsx" : formato.tipo}`;
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      toast.dismiss();
      toast.success(`Relatório ${formato.nome} baixado com sucesso!`);
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.dismiss();
      toast.error("Erro ao gerar relatório");
    } finally {
      setExportandoRelatorio(false);
    }
  };

  const limparFiltros = () => {
    setFiltros({
      periodo: { tipo: "ultimo_mes" },
      equipes: [],
      vendedores: [],
      produtos: [],
      regioes: [],
      statusVenda: []
    });
    toast.success("Filtros limpos");
  };

  return (
    <div className="space-y-6">
      {/* Seletor de tipo de relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Relatórios Avançados
          </CardTitle>
          <CardDescription>
            Gere relatórios detalhados com filtros avançados e múltiplos formatos de exportação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {tiposRelatorio.map((tipo) => (
              <Card 
                key={tipo.valor}
                className={`cursor-pointer transition-colors ${
                  tipoRelatorio === tipo.valor 
                    ? "border-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setTipoRelatorio(tipo.valor)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    {tipo.icone}
                  </div>
                  <p className="text-sm font-medium">{tipo.nome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros avançados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
              >
                {filtrosExpandidos ? "Ocultar" : "Expandir"} Filtros
              </Button>
              <Button variant="outline" size="sm" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Período */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select 
                value={filtros.periodo.tipo} 
                onValueChange={(value) => 
                  setFiltros(prev => ({ 
                    ...prev, 
                    periodo: { ...prev.periodo, tipo: value as any } 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ultima_semana">Última semana</SelectItem>
                  <SelectItem value="ultimo_mes">Último mês</SelectItem>
                  <SelectItem value="ultimo_trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ultimo_ano">Último ano</SelectItem>
                  <SelectItem value="personalizado">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtros.periodo.tipo === "personalizado" && (
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label>Data início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {filtros.periodo.dataInicio 
                          ? format(filtros.periodo.dataInicio, "PPP", { locale: ptBR })
                          : "Selecionar"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filtros.periodo.dataInicio}
                        onSelect={(date) => 
                          setFiltros(prev => ({
                            ...prev,
                            periodo: { ...prev.periodo, dataInicio: date }
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Data fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {filtros.periodo.dataFim 
                          ? format(filtros.periodo.dataFim, "PPP", { locale: ptBR })
                          : "Selecionar"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filtros.periodo.dataFim}
                        onSelect={(date) => 
                          setFiltros(prev => ({
                            ...prev,
                            periodo: { ...prev.periodo, dataFim: date }
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {filtrosExpandidos && (
            <>
              {/* Filtros de equipes */}
              <div>
                <Label>Equipes</Label>
                <div className="grid gap-2 md:grid-cols-3 mt-2">
                  {equipes.map((equipe) => (
                    <div key={equipe.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`equipe-${equipe.id}`}
                        checked={filtros.equipes.includes(equipe.id)}
                        onCheckedChange={(checked) => 
                          handleFiltroEquipe(equipe.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`equipe-${equipe.id}`} className="text-sm">
                        {equipe.nome}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtros de vendedores */}
              <div>
                <Label>Vendedores</Label>
                <div className="grid gap-2 md:grid-cols-4 mt-2">
                  {vendedores.map((vendedor) => (
                    <div key={vendedor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`vendedor-${vendedor.id}`}
                        checked={filtros.vendedores.includes(vendedor.id)}
                        onCheckedChange={(checked) => 
                          handleFiltroVendedor(vendedor.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`vendedor-${vendedor.id}`} className="text-sm">
                        {vendedor.nome}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtros de valor */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="valorMinimo">Valor mínimo (R$)</Label>
                  <Input
                    id="valorMinimo"
                    type="number"
                    placeholder="0"
                    value={filtros.valorMinimo || ""}
                    onChange={(e) => 
                      setFiltros(prev => ({
                        ...prev,
                        valorMinimo: e.target.value ? Number(e.target.value) : undefined
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="valorMaximo">Valor máximo (R$)</Label>
                  <Input
                    id="valorMaximo"
                    type="number"
                    placeholder="999999"
                    value={filtros.valorMaximo || ""}
                    onChange={(e) => 
                      setFiltros(prev => ({
                        ...prev,
                        valorMaximo: e.target.value ? Number(e.target.value) : undefined
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Opções de exportação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Relatório
          </CardTitle>
          <CardDescription>
            Escolha o formato de exportação do seu relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {formatosExportacao.map((formato) => (
              <Card 
                key={formato.tipo}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => exportarRelatorio(formato)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {formato.icone}
                    <span className="font-medium">{formato.nome}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formato.descricao}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    disabled={exportandoRelatorio}
                  >
                    {exportandoRelatorio ? "Gerando..." : "Baixar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros ativos */}
      {(filtros.equipes.length > 0 || filtros.vendedores.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filtros Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filtros.equipes.map(equipeId => {
                const equipe = equipes.find(e => e.id === equipeId);
                return (
                  <Badge key={equipeId} variant="outline">
                    Equipe: {equipe?.nome}
                  </Badge>
                );
              })}
              {filtros.vendedores.map(vendedorId => {
                const vendedor = vendedores.find(v => v.id === vendedorId);
                return (
                  <Badge key={vendedorId} variant="outline">
                    Vendedor: {vendedor?.nome}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RelatoriosAvancados;
