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
import { useLanguage } from "@/i18n";
import { toast } from "sonner";

type PremiationType = 'financeiro' | 'produto' | 'viagem' | 'experiencia' | 'reconhecimento';
type TargetType = 'equipe' | 'vendedor';

interface Premiacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: PremiationType;
  target_type: TargetType;
  target_id: string;
  valor: number;
  meta_relacionada?: string;
  data_entrega: string;
  status: 'pendente' | 'entregue' | 'em_andamento';
  criado_em: string;
}

interface PremiacaoFormData {
  titulo: string;
  descricao: string;
  tipo: PremiationType;
  target_type: TargetType;
  target_id: string;
  valor: number;
  data_entrega: string;
}

const Premiacoes = () => {
  const { t, language } = useLanguage();
  const { vendedores } = useVendedores();
  const { equipes } = useEquipes();
  const [activeTab, setActiveTab] = useState<string>("equipes");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dados fictícios de premiações
  const [premiacoes, setPremiacoes] = useState<Premiacao[]>([
    {
      id: "1",
      titulo: "Bônus Trimestral",
      descricao: "Premiação financeira para meta de vendas Q2",
      tipo: "financeiro",
      target_type: "equipe",
      target_id: "1", // ID da equipe
      valor: 10000,
      data_entrega: "2025-07-05",
      status: "pendente",
      criado_em: "2025-03-15"
    },
    {
      id: "2",
      titulo: "Smartphone de Última Geração",
      descricao: "Prêmio para melhor desempenho individual",
      tipo: "produto",
      target_type: "vendedor",
      target_id: "1", // ID do vendedor
      valor: 5000,
      data_entrega: "2025-07-01",
      status: "pendente",
      criado_em: "2025-05-10"
    },
    {
      id: "3",
      titulo: "Viagem para Caldas Novas",
      descricao: "Viagem de 3 dias para equipe com melhor desempenho",
      tipo: "viagem",
      target_type: "equipe",
      target_id: "2", // ID da equipe
      valor: 15000,
      data_entrega: "2025-08-15",
      status: "em_andamento",
      criado_em: "2025-04-20"
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
    tipo: z.enum(['financeiro', 'produto', 'viagem', 'experiencia', 'reconhecimento']),
    target_type: z.enum(['equipe', 'vendedor']),
    target_id: z.string().min(1, {
      message: language === 'en' 
        ? "Please select a target."
        : language === 'es'
          ? "Por favor, seleccione un objetivo."
          : "Por favor, selecione um alvo."
    }),
    valor: z.coerce.number().nonnegative({
      message: language === 'en' 
        ? "The value must be a non-negative number."
        : language === 'es'
          ? "El valor debe ser un número no negativo."
          : "O valor deve ser um número não negativo."
    }),
    data_entrega: z.string().min(1, {
      message: language === 'en' 
        ? "Please select a delivery date."
        : language === 'es'
          ? "Por favor, seleccione una fecha de entrega."
          : "Por favor, selecione uma data de entrega."
    })
  });

  const form = useForm<PremiacaoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo: "financeiro",
      target_type: activeTab === "equipes" ? "equipe" : "vendedor",
      target_id: "",
      valor: 0,
      data_entrega: ""
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("target_type", value === "equipes" ? "equipe" : "vendedor");
  };

  const handleAddPremiacao = (data: PremiacaoFormData) => {
    // Em uma implementação real, isso enviaria para o Supabase
    console.log("Adicionando premiação:", data);
    
    // Simulação de adição
    const novaPremiacao: Premiacao = {
      id: `${premiacoes.length + 1}`,
      ...data,
      status: 'pendente',
      criado_em: new Date().toISOString()
    };
    
    setPremiacoes([...premiacoes, novaPremiacao]);
    
    toast.success(
      language === 'en' 
        ? "Reward added successfully!" 
        : language === 'es'
          ? "¡Recompensa añadida con éxito!"
          : "Premiação adicionada com sucesso!"
    );
    
    setIsAdding(false);
    form.reset();
  };

  const handleEditPremiacao = (premiacao: Premiacao) => {
    setEditingId(premiacao.id);
    form.reset({
      titulo: premiacao.titulo,
      descricao: premiacao.descricao,
      tipo: premiacao.tipo,
      target_type: premiacao.target_type,
      target_id: premiacao.target_id,
      valor: premiacao.valor,
      data_entrega: premiacao.data_entrega
    });
    setActiveTab(premiacao.target_type === 'equipe' ? 'equipes' : 'vendedores');
    setIsAdding(true);
  };

  // Traduções
  const getTitle = () => {
    switch(language) {
      case 'en': return 'Rewards Management';
      case 'es': return 'Gestión de Recompensas';
      case 'pt': return 'Gerenciamento de Premiações';
      default: return 'Gerenciamento de Premiações';
    }
  };

  const getTabNames = () => {
    switch(language) {
      case 'en': return { teams: 'Team Rewards', salespeople: 'Individual Rewards' };
      case 'es': return { teams: 'Recompensas de Equipo', salespeople: 'Recompensas Individuales' };
      case 'pt': return { teams: 'Premiações de Equipe', salespeople: 'Premiações Individuais' };
      default: return { teams: 'Premiações de Equipe', salespeople: 'Premiações Individuais' };
    }
  };

  const getAddButtonText = () => {
    switch(language) {
      case 'en': return 'Add Reward';
      case 'es': return 'Añadir Recompensa';
      case 'pt': return 'Adicionar Premiação';
      default: return 'Adicionar Premiação';
    }
  };

  const getFormTitle = () => {
    if (editingId) {
      switch(language) {
        case 'en': return 'Edit Reward';
        case 'es': return 'Editar Recompensa';
        case 'pt': return 'Editar Premiação';
        default: return 'Editar Premiação';
      }
    } else {
      switch(language) {
        case 'en': return 'New Reward';
        case 'es': return 'Nueva Recompensa';
        case 'pt': return 'Nova Premiação';
        default: return 'Nova Premiação';
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
        value: 'Value',
        deliveryDate: 'Delivery Date'
      };
      case 'es': return {
        title: 'Título',
        description: 'Descripción',
        type: 'Tipo',
        target: 'Objetivo',
        value: 'Valor',
        deliveryDate: 'Fecha de Entrega'
      };
      case 'pt': return {
        title: 'Título',
        description: 'Descrição',
        type: 'Tipo',
        target: 'Alvo',
        value: 'Valor',
        deliveryDate: 'Data de Entrega'
      };
      default: return {
        title: 'Título',
        description: 'Descrição',
        type: 'Tipo',
        target: 'Alvo',
        value: 'Valor',
        deliveryDate: 'Data de Entrega'
      };
    }
  };

  const getTypeOptions = () => {
    switch(language) {
      case 'en': return {
        financial: 'Financial',
        product: 'Product',
        travel: 'Travel',
        experience: 'Experience',
        recognition: 'Recognition'
      };
      case 'es': return {
        financial: 'Financiero',
        product: 'Producto',
        travel: 'Viaje',
        experience: 'Experiencia',
        recognition: 'Reconocimiento'
      };
      case 'pt': return {
        financial: 'Financeiro',
        product: 'Produto',
        travel: 'Viagem',
        experience: 'Experiência',
        recognition: 'Reconhecimento'
      };
      default: return {
        financial: 'Financeiro',
        product: 'Produto',
        travel: 'Viagem',
        experience: 'Experiência',
        recognition: 'Reconhecimento'
      };
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pendente':
        return language === 'en' ? 'Pending' : language === 'es' ? 'Pendiente' : 'Pendente';
      case 'entregue':
        return language === 'en' ? 'Delivered' : language === 'es' ? 'Entregado' : 'Entregue';
      case 'em_andamento':
        return language === 'en' ? 'In Progress' : language === 'es' ? 'En Progreso' : 'Em Andamento';
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
        return { title: 'Title', target: 'Target', type: 'Type', value: 'Value', deliveryDate: 'Delivery Date', status: 'Status', actions: 'Actions' };
      case 'es': 
        return { title: 'Título', target: 'Objetivo', type: 'Tipo', value: 'Valor', deliveryDate: 'Fecha de Entrega', status: 'Estado', actions: 'Acciones' };
      case 'pt': 
        return { title: 'Título', target: 'Alvo', type: 'Tipo', value: 'Valor', deliveryDate: 'Data de Entrega', status: 'Status', actions: 'Ações' };
      default: 
        return { title: 'Título', target: 'Alvo', type: 'Tipo', value: 'Valor', deliveryDate: 'Data de Entrega', status: 'Status', actions: 'Ações' };
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

  const formatValue = (premiacao: Premiacao) => {
    if (premiacao.tipo === 'financeiro') {
      return formatCurrency(premiacao.valor);
    } else if (premiacao.valor > 0) {
      return formatCurrency(premiacao.valor);
    } else {
      return language === 'en' ? 'N/A' : language === 'es' ? 'N/D' : 'N/A';
    }
  };

  const formatType = (type: PremiationType) => {
    const typeOptions = getTypeOptions();
    switch(type) {
      case 'financeiro': return typeOptions.financial;
      case 'produto': return typeOptions.product;
      case 'viagem': return typeOptions.travel;
      case 'experiencia': return typeOptions.experience;
      case 'reconhecimento': return typeOptions.recognition;
      default: return type;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTargetName = (premiacao: Premiacao) => {
    if (premiacao.target_type === 'equipe') {
      const equipe = equipes.find(e => e.id === premiacao.target_id);
      return equipe ? equipe.nome : premiacao.target_id;
    } else {
      const vendedor = vendedores.find(v => v.id === premiacao.target_id);
      return vendedor ? vendedor.nome : premiacao.target_id;
    }
  };

  const tabNames = getTabNames();
  const fieldLabels = getFieldLabels();
  const typeOptions = getTypeOptions();
  const tableHeaders = getTableHeaders();

  // Filtragem de premiações com base na tab ativa
  const premiacoesFiltradas = premiacoes.filter(premiacao => 
    (activeTab === "equipes" && premiacao.target_type === "equipe") || 
    (activeTab === "vendedores" && premiacao.target_type === "vendedor")
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
              <form onSubmit={form.handleSubmit(handleAddPremiacao)} className="space-y-4">
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
                            <SelectItem value="financeiro">{typeOptions.financial}</SelectItem>
                            <SelectItem value="produto">{typeOptions.product}</SelectItem>
                            <SelectItem value="viagem">{typeOptions.travel}</SelectItem>
                            <SelectItem value="experiencia">{typeOptions.experience}</SelectItem>
                            <SelectItem value="reconhecimento">{typeOptions.recognition}</SelectItem>
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
                    name="data_entrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.deliveryDate}</FormLabel>
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
            <Users size={16} />
            {tabNames.teams}
          </TabsTrigger>
          <TabsTrigger value="vendedores" className="flex items-center gap-2">
            <User size={16} />
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
                    <TableHead>{tableHeaders.type}</TableHead>
                    <TableHead>{tableHeaders.value}</TableHead>
                    <TableHead>{tableHeaders.deliveryDate}</TableHead>
                    <TableHead>{tableHeaders.status}</TableHead>
                    <TableHead className="text-right">{tableHeaders.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {premiacoesFiltradas.map((premiacao) => (
                    <TableRow key={premiacao.id}>
                      <TableCell className="font-medium">{premiacao.titulo}</TableCell>
                      <TableCell>{getTargetName(premiacao)}</TableCell>
                      <TableCell>{formatType(premiacao.tipo)}</TableCell>
                      <TableCell>{formatValue(premiacao)}</TableCell>
                      <TableCell>{formatDate(premiacao.data_entrega)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                          ${premiacao.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 
                          premiacao.status === 'entregue' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'}`}>
                          {getStatusLabel(premiacao.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPremiacao(premiacao)}>
                          <Pencil size={16} className="mr-2" />
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
                    <TableHead>{tableHeaders.type}</TableHead>
                    <TableHead>{tableHeaders.value}</TableHead>
                    <TableHead>{tableHeaders.deliveryDate}</TableHead>
                    <TableHead>{tableHeaders.status}</TableHead>
                    <TableHead className="text-right">{tableHeaders.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {premiacoesFiltradas.map((premiacao) => (
                    <TableRow key={premiacao.id}>
                      <TableCell className="font-medium">{premiacao.titulo}</TableCell>
                      <TableCell>{getTargetName(premiacao)}</TableCell>
                      <TableCell>{formatType(premiacao.tipo)}</TableCell>
                      <TableCell>{formatValue(premiacao)}</TableCell>
                      <TableCell>{formatDate(premiacao.data_entrega)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                          ${premiacao.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 
                          premiacao.status === 'entregue' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'}`}>
                          {getStatusLabel(premiacao.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPremiacao(premiacao)}>
                          <Pencil size={16} className="mr-2" />
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

export default Premiacoes;
