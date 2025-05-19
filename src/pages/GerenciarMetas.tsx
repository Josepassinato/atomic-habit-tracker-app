
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVendedores, useEquipes } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { CalendarDays, Trophy, Flag, CheckCircle, PlusCircle, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type MetaType = 'vendas' | 'clientes' | 'taxa_conversao' | 'custom';
type TargetType = 'equipe' | 'vendedor';

interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: MetaType;
  target_type: TargetType;
  target_id: string;
  valor: number;
  valor_atual: number;
  data_inicio: string;
  data_fim: string;
  status: 'ativa' | 'concluida' | 'atrasada' | 'cancelada';
  criado_em: string;
}

interface MetaFormData {
  titulo: string;
  descricao: string;
  tipo: MetaType;
  target_type: TargetType;
  target_id: string;
  valor: number;
  data_inicio: string;
  data_fim: string;
}

const GerenciarMetas = () => {
  const { t, language } = useLanguage();
  const { vendedores } = useVendedores();
  const { equipes } = useEquipes();
  const [activeTab, setActiveTab] = useState<string>("equipes");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dados fictícios de metas
  const [metas, setMetas] = useState<Meta[]>([
    {
      id: "1",
      titulo: "Meta Q2 - Equipe Comercial",
      descricao: "Meta de vendas para o segundo trimestre",
      tipo: "vendas",
      target_type: "equipe",
      target_id: "1", // ID da equipe
      valor: 200000,
      valor_atual: 125000,
      data_inicio: "2025-04-01",
      data_fim: "2025-06-30",
      status: "ativa",
      criado_em: "2025-03-15"
    },
    {
      id: "2",
      titulo: "Meta Mensal - João Silva",
      descricao: "Meta de vendas individual para Junho",
      tipo: "vendas",
      target_type: "vendedor",
      target_id: "1", // ID do vendedor
      valor: 50000,
      valor_atual: 32000,
      data_inicio: "2025-06-01",
      data_fim: "2025-06-30",
      status: "ativa",
      criado_em: "2025-05-25"
    },
    {
      id: "3",
      titulo: "Novos Clientes - Equipe Beta",
      descricao: "Meta de aquisição de novos clientes",
      tipo: "clientes",
      target_type: "equipe",
      target_id: "2", // ID da equipe
      valor: 20,
      valor_atual: 12,
      data_inicio: "2025-05-01",
      data_fim: "2025-07-31",
      status: "ativa",
      criado_em: "2025-04-25"
    },
  ]);

  const formSchema = z.object({
    titulo: z.string().min(3, {
      message: language === 'en' 
        ? "Title must be at least 3 characters."
        : language === 'es'
          ? "El título debe tener al menos 3 caracteres."
          : "O título deve ter pelo menos 3 caracteres."
    }),
    descricao: z.string().min(10, {
      message: language === 'en' 
        ? "Description must be at least 10 characters."
        : language === 'es'
          ? "La descripción debe tener al menos 10 caracteres."
          : "A descrição deve ter pelo menos 10 caracteres."
    }),
    tipo: z.enum(['vendas', 'clientes', 'taxa_conversao', 'custom']),
    target_type: z.enum(['equipe', 'vendedor']),
    target_id: z.string().min(1, {
      message: language === 'en' 
        ? "Please select a target."
        : language === 'es'
          ? "Por favor, seleccione un objetivo."
          : "Por favor, selecione um alvo."
    }),
    valor: z.coerce.number().positive({
      message: language === 'en' 
        ? "The goal value must be a positive number."
        : language === 'es'
          ? "El valor de la meta debe ser un número positivo."
          : "O valor da meta deve ser um número positivo."
    }),
    data_inicio: z.string().min(1, {
      message: language === 'en' 
        ? "Please select a start date."
        : language === 'es'
          ? "Por favor, seleccione una fecha de inicio."
          : "Por favor, selecione uma data de início."
    }),
    data_fim: z.string().min(1, {
      message: language === 'en' 
        ? "Please select an end date."
        : language === 'es'
          ? "Por favor, seleccione una fecha de fin."
          : "Por favor, selecione uma data de término."
    })
  }).refine(data => {
    const start = new Date(data.data_inicio);
    const end = new Date(data.data_fim);
    return end > start;
  }, {
    message: language === 'en' 
      ? "End date must be after start date."
      : language === 'es'
        ? "La fecha de fin debe ser posterior a la fecha de inicio."
        : "A data de término deve ser posterior à data de início.",
    path: ['data_fim']
  });

  const form = useForm<MetaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo: "vendas",
      target_type: activeTab === "equipes" ? "equipe" : "vendedor",
      target_id: "",
      valor: 0,
      data_inicio: "",
      data_fim: ""
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("target_type", value === "equipes" ? "equipe" : "vendedor");
  };

  const handleAddMeta = (data: MetaFormData) => {
    // Em uma implementação real, isso enviaria para o Supabase
    console.log("Adicionando meta:", data);
    
    // Simulação de adição
    const novaMeta: Meta = {
      id: `${metas.length + 1}`,
      ...data,
      valor_atual: 0,
      status: 'ativa',
      criado_em: new Date().toISOString()
    };
    
    setMetas([...metas, novaMeta]);
    
    toast.success(
      language === 'en' 
        ? "Goal added successfully!" 
        : language === 'es'
          ? "¡Meta añadida con éxito!"
          : "Meta adicionada com sucesso!"
    );
    
    setIsAdding(false);
    form.reset();
  };

  const handleEditMeta = (meta: Meta) => {
    setEditingId(meta.id);
    form.reset({
      titulo: meta.titulo,
      descricao: meta.descricao,
      tipo: meta.tipo,
      target_type: meta.target_type,
      target_id: meta.target_id,
      valor: meta.valor,
      data_inicio: meta.data_inicio,
      data_fim: meta.data_fim
    });
    setActiveTab(meta.target_type === 'equipe' ? 'equipes' : 'vendedores');
    setIsAdding(true);
  };

  // Traduções
  const getTitle = () => {
    switch(language) {
      case 'en': return 'Goals Management';
      case 'es': return 'Gestión de Metas';
      case 'pt': return 'Gerenciamento de Metas';
      default: return 'Gerenciamento de Metas';
    }
  };

  const getTabNames = () => {
    switch(language) {
      case 'en': return { teams: 'Team Goals', salespeople: 'Individual Goals' };
      case 'es': return { teams: 'Metas de Equipo', salespeople: 'Metas Individuales' };
      case 'pt': return { teams: 'Metas de Equipe', salespeople: 'Metas Individuais' };
      default: return { teams: 'Metas de Equipe', salespeople: 'Metas Individuais' };
    }
  };

  const getAddButtonText = () => {
    switch(language) {
      case 'en': return 'Add Goal';
      case 'es': return 'Añadir Meta';
      case 'pt': return 'Adicionar Meta';
      default: return 'Adicionar Meta';
    }
  };

  const getFormTitle = () => {
    if (editingId) {
      switch(language) {
        case 'en': return 'Edit Goal';
        case 'es': return 'Editar Meta';
        case 'pt': return 'Editar Meta';
        default: return 'Editar Meta';
      }
    } else {
      switch(language) {
        case 'en': return 'New Goal';
        case 'es': return 'Nueva Meta';
        case 'pt': return 'Nova Meta';
        default: return 'Nova Meta';
      }
    }
  };

  const getFieldLabels = () => {
    switch(language) {
      case 'en': return {
        title: 'Title',
        description: 'Description',
        type: 'Type',
        target: 'Target',
        value: 'Target Value',
        startDate: 'Start Date',
        endDate: 'End Date'
      };
      case 'es': return {
        title: 'Título',
        description: 'Descripción',
        type: 'Tipo',
        target: 'Objetivo',
        value: 'Valor Objetivo',
        startDate: 'Fecha de Inicio',
        endDate: 'Fecha Final'
      };
      case 'pt': return {
        title: 'Título',
        description: 'Descrição',
        type: 'Tipo',
        target: 'Alvo',
        value: 'Valor Alvo',
        startDate: 'Data de Início',
        endDate: 'Data Final'
      };
      default: return {
        title: 'Título',
        description: 'Descrição',
        type: 'Tipo',
        target: 'Alvo',
        value: 'Valor Alvo',
        startDate: 'Data de Início',
        endDate: 'Data Final'
      };
    }
  };

  const getTypeOptions = () => {
    switch(language) {
      case 'en': return {
        sales: 'Sales',
        clients: 'New Clients',
        conversion: 'Conversion Rate',
        custom: 'Custom'
      };
      case 'es': return {
        sales: 'Ventas',
        clients: 'Nuevos Clientes',
        conversion: 'Tasa de Conversión',
        custom: 'Personalizada'
      };
      case 'pt': return {
        sales: 'Vendas',
        clients: 'Novos Clientes',
        conversion: 'Taxa de Conversão',
        custom: 'Personalizada'
      };
      default: return {
        sales: 'Vendas',
        clients: 'Novos Clientes',
        conversion: 'Taxa de Conversão',
        custom: 'Personalizada'
      };
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'ativa':
        return language === 'en' ? 'Active' : language === 'es' ? 'Activa' : 'Ativa';
      case 'concluida':
        return language === 'en' ? 'Completed' : language === 'es' ? 'Completada' : 'Concluída';
      case 'atrasada':
        return language === 'en' ? 'Delayed' : language === 'es' ? 'Retrasada' : 'Atrasada';
      case 'cancelada':
        return language === 'en' ? 'Canceled' : language === 'es' ? 'Cancelada' : 'Cancelada';
      default:
        return status;
    }
  };

  const getSaveButtonText = () => {
    switch(language) {
      case 'en': return editingId ? 'Update' : 'Save';
      case 'es': return editingId ? 'Actualizar' : 'Guardar';
      case 'pt': return editingId ? 'Atualizar' : 'Salvar';
      default: return editingId ? 'Atualizar' : 'Salvar';
    }
  };

  const getCancelButtonText = () => {
    switch(language) {
      case 'en': return 'Cancel';
      case 'es': return 'Cancelar';
      case 'pt': return 'Cancelar';
      default: return 'Cancelar';
    }
  };

  const getTableHeaders = () => {
    switch(language) {
      case 'en': 
        return { title: 'Title', target: 'Target', value: 'Value', progress: 'Progress', endDate: 'End Date', status: 'Status', actions: 'Actions' };
      case 'es': 
        return { title: 'Título', target: 'Objetivo', value: 'Valor', progress: 'Progreso', endDate: 'Fecha Final', status: 'Estado', actions: 'Acciones' };
      case 'pt': 
        return { title: 'Título', target: 'Alvo', value: 'Valor', progress: 'Progresso', endDate: 'Data Final', status: 'Status', actions: 'Ações' };
      default: 
        return { title: 'Título', target: 'Alvo', value: 'Valor', progress: 'Progresso', endDate: 'Data Final', status: 'Status', actions: 'Ações' };
    }
  };

  const getEditButtonText = () => {
    switch(language) {
      case 'en': return 'Edit';
      case 'es': return 'Editar';
      case 'pt': return 'Editar';
      default: return 'Editar';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR',
      options
    );
  };

  const formatValue = (meta: Meta) => {
    if (meta.tipo === 'vendas') {
      return formatCurrency(meta.valor);
    } else if (meta.tipo === 'taxa_conversao') {
      return `${meta.valor}%`;
    } else {
      return meta.valor.toString();
    }
  };

  const formatProgress = (meta: Meta) => {
    const progress = Math.round((meta.valor_atual / meta.valor) * 100);
    return `${progress}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTargetName = (meta: Meta) => {
    if (meta.target_type === 'equipe') {
      const equipe = equipes.find(e => e.id === meta.target_id);
      return equipe ? equipe.nome : meta.target_id;
    } else {
      const vendedor = vendedores.find(v => v.id === meta.target_id);
      return vendedor ? vendedor.nome : meta.target_id;
    }
  };

  const tabNames = getTabNames();
  const fieldLabels = getFieldLabels();
  const typeOptions = getTypeOptions();
  const tableHeaders = getTableHeaders();

  // Filtragem de metas com base na tab ativa
  const metasFiltradas = metas.filter(meta => 
    (activeTab === "equipes" && meta.target_type === "equipe") || 
    (activeTab === "vendedores" && meta.target_type === "vendedor")
  );

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
        {!isAdding && (
          <Button onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            form.reset({
              ...form.getValues(),
              target_type: activeTab === "equipes" ? "equipe" : "vendedor"
            });
          }} className="flex items-center gap-2">
            <PlusCircle size={16} />
            {getAddButtonText()}
          </Button>
        )}
      </div>

      {isAdding ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{getFormTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddMeta)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.title}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.type}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vendas">{typeOptions.sales}</SelectItem>
                            <SelectItem value="clientes">{typeOptions.clients}</SelectItem>
                            <SelectItem value="taxa_conversao">{typeOptions.conversion}</SelectItem>
                            <SelectItem value="custom">{typeOptions.custom}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="target_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.target}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                language === 'en' 
                                ? 'Select a target' 
                                : language === 'es' 
                                  ? 'Seleccione un objetivo' 
                                  : 'Selecione um alvo'
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {form.watch('target_type') === 'equipe' 
                              ? equipes.map(equipe => (
                                  <SelectItem key={equipe.id} value={equipe.id}>{equipe.nome}</SelectItem>
                                ))
                              : vendedores.map(vendedor => (
                                  <SelectItem key={vendedor.id} value={vendedor.id}>{vendedor.nome}</SelectItem>
                                ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.value}</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.startDate}</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data_fim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.endDate}</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldLabels.description}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                      setIsAdding(false);
                      form.reset();
                    }}
                  >
                    {getCancelButtonText()}
                  </Button>
                  <Button type="submit">
                    {getSaveButtonText()}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : null}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="equipes" className="flex items-center gap-2">
            <Flag size={16} />
            {tabNames.teams}
          </TabsTrigger>
          <TabsTrigger value="vendedores" className="flex items-center gap-2">
            <Trophy size={16} />
            {tabNames.salespeople}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipes">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tableHeaders.title}</TableHead>
                    <TableHead>{tableHeaders.target}</TableHead>
                    <TableHead>{tableHeaders.value}</TableHead>
                    <TableHead>{tableHeaders.progress}</TableHead>
                    <TableHead>{tableHeaders.endDate}</TableHead>
                    <TableHead>{tableHeaders.status}</TableHead>
                    <TableHead className="text-right">{tableHeaders.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metasFiltradas.map((meta) => (
                    <TableRow key={meta.id}>
                      <TableCell className="font-medium">{meta.titulo}</TableCell>
                      <TableCell>{getTargetName(meta)}</TableCell>
                      <TableCell>{formatValue(meta)}</TableCell>
                      <TableCell>{formatProgress(meta)}</TableCell>
                      <TableCell>{formatDate(meta.data_fim)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                          ${meta.status === 'ativa' ? 'bg-green-100 text-green-800' : 
                          meta.status === 'concluida' ? 'bg-blue-100 text-blue-800' :
                          meta.status === 'atrasada' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'}`}>
                          {getStatusLabel(meta.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMeta(meta)}>
                          <Edit size={16} className="mr-2" />
                          {getEditButtonText()}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendedores">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tableHeaders.title}</TableHead>
                    <TableHead>{tableHeaders.target}</TableHead>
                    <TableHead>{tableHeaders.value}</TableHead>
                    <TableHead>{tableHeaders.progress}</TableHead>
                    <TableHead>{tableHeaders.endDate}</TableHead>
                    <TableHead>{tableHeaders.status}</TableHead>
                    <TableHead className="text-right">{tableHeaders.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metasFiltradas.map((meta) => (
                    <TableRow key={meta.id}>
                      <TableCell className="font-medium">{meta.titulo}</TableCell>
                      <TableCell>{getTargetName(meta)}</TableCell>
                      <TableCell>{formatValue(meta)}</TableCell>
                      <TableCell>{formatProgress(meta)}</TableCell>
                      <TableCell>{formatDate(meta.data_fim)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                          ${meta.status === 'ativa' ? 'bg-green-100 text-green-800' : 
                          meta.status === 'concluida' ? 'bg-blue-100 text-blue-800' :
                          meta.status === 'atrasada' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'}`}>
                          {getStatusLabel(meta.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMeta(meta)}>
                          <Edit size={16} className="mr-2" />
                          {getEditButtonText()}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciarMetas;
