
import React, { useState } from "react";
import { useVendedores, useEquipes } from "@/hooks/use-supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, UserCog } from "lucide-react";

interface VendedorFormData {
  nome: string;
  email: string;
  equipe_id: string;
  meta_atual: number;
}

const Vendedores = () => {
  const { t, language } = useLanguage();
  const { vendedores, loading: loadingVendedores } = useVendedores();
  const { equipes, loading: loadingEquipes } = useEquipes();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formSchema = z.object({
    nome: z.string().min(2, {
      message: language === 'en' 
        ? "Name must be at least 2 characters."
        : language === 'es'
          ? "El nombre debe tener al menos 2 caracteres."
          : "O nome deve ter pelo menos 2 caracteres."
    }),
    email: z.string().email({
      message: language === 'en' 
        ? "Please enter a valid email."
        : language === 'es'
          ? "Por favor, introduce un correo electrónico válido."
          : "Por favor, digite um email válido."
    }),
    equipe_id: z.string({
      required_error: language === 'en' 
        ? "Please select a team."
        : language === 'es'
          ? "Por favor, seleccione un equipo."
          : "Por favor, selecione uma equipe."
    }),
    meta_atual: z.coerce.number().positive({
      message: language === 'en' 
        ? "The goal must be a positive number."
        : language === 'es'
          ? "La meta debe ser un número positivo."
          : "A meta deve ser um número positivo."
    })
  });

  const form = useForm<VendedorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      equipe_id: "",
      meta_atual: 0
    }
  });

  const handleAddVendedor = (data: VendedorFormData) => {
    // Em uma implementação real, isso enviaria para o Supabase
    console.log("Adicionando vendedor:", data);
    
    // Simulação de adição bem-sucedida
    toast.success(
      language === 'en' 
        ? "Salesperson added successfully!" 
        : language === 'es'
          ? "¡Vendedor añadido con éxito!"
          : "Vendedor adicionado com sucesso!"
    );
    
    setIsAdding(false);
    form.reset();
  };

  const handleEditVendedor = (vendedor: any) => {
    setEditingId(vendedor.id);
    form.reset({
      nome: vendedor.nome,
      email: vendedor.email,
      equipe_id: vendedor.equipe_id,
      meta_atual: vendedor.meta_atual
    });
    setIsAdding(true);
  };

  const getTitle = () => {
    switch(language) {
      case 'en': return 'Salespeople';
      case 'es': return 'Vendedores';
      case 'pt': return 'Vendedores';
      default: return 'Vendedores';
    }
  };

  const getAddButtonText = () => {
    switch(language) {
      case 'en': return 'Add Salesperson';
      case 'es': return 'Añadir Vendedor';
      case 'pt': return 'Adicionar Vendedor';
      default: return 'Adicionar Vendedor';
    }
  };

  const getFormTitle = () => {
    if (editingId) {
      switch(language) {
        case 'en': return 'Edit Salesperson';
        case 'es': return 'Editar Vendedor';
        case 'pt': return 'Editar Vendedor';
        default: return 'Editar Vendedor';
      }
    } else {
      switch(language) {
        case 'en': return 'New Salesperson';
        case 'es': return 'Nuevo Vendedor';
        case 'pt': return 'Novo Vendedor';
        default: return 'Novo Vendedor';
      }
    }
  };

  const getNameLabel = () => {
    switch(language) {
      case 'en': return 'Name';
      case 'es': return 'Nombre';
      case 'pt': return 'Nome';
      default: return 'Nome';
    }
  };

  const getTeamLabel = () => {
    switch(language) {
      case 'en': return 'Team';
      case 'es': return 'Equipo';
      case 'pt': return 'Equipe';
      default: return 'Equipe';
    }
  };

  const getGoalLabel = () => {
    switch(language) {
      case 'en': return 'Current Goal';
      case 'es': return 'Meta Actual';
      case 'pt': return 'Meta Atual';
      default: return 'Meta Atual';
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
        return { name: 'Name', email: 'Email', team: 'Team', sales: 'Sales', goal: 'Goal', conversion: 'Conversion', actions: 'Actions' };
      case 'es': 
        return { name: 'Nombre', email: 'Correo', team: 'Equipo', sales: 'Ventas', goal: 'Meta', conversion: 'Conversión', actions: 'Acciones' };
      case 'pt': 
        return { name: 'Nome', email: 'Email', team: 'Equipe', sales: 'Vendas', goal: 'Meta', conversion: 'Conversão', actions: 'Ações' };
      default: 
        return { name: 'Nome', email: 'Email', team: 'Equipe', sales: 'Vendas', goal: 'Meta', conversion: 'Conversão', actions: 'Ações' };
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

  const tableHeaders = getTableHeaders();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getEquipeName = (equipeId: string) => {
    const equipe = equipes.find(e => e.id === equipeId);
    return equipe ? equipe.nome : equipeId;
  };

  if (loadingVendedores || loadingEquipes) {
    return <div className="container py-6">Carregando...</div>;
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
        {!isAdding && (
          <Button onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            form.reset();
          }} className="flex items-center gap-2">
            <UserPlus size={16} />
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
              <form onSubmit={form.handleSubmit(handleAddVendedor)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getNameLabel()}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="equipe_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getTeamLabel()}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                language === 'en' 
                                ? 'Select a team' 
                                : language === 'es' 
                                  ? 'Seleccione un equipo' 
                                  : 'Selecione uma equipe'
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipes.map(equipe => (
                              <SelectItem key={equipe.id} value={equipe.id}>{equipe.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meta_atual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getGoalLabel()}</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tableHeaders.name}</TableHead>
                <TableHead>{tableHeaders.email}</TableHead>
                <TableHead>{tableHeaders.team}</TableHead>
                <TableHead>{tableHeaders.sales}</TableHead>
                <TableHead>{tableHeaders.goal}</TableHead>
                <TableHead>{tableHeaders.conversion}</TableHead>
                <TableHead className="text-right">{tableHeaders.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendedores.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  <TableCell>{vendedor.nome}</TableCell>
                  <TableCell>{vendedor.email}</TableCell>
                  <TableCell>{getEquipeName(vendedor.equipe_id)}</TableCell>
                  <TableCell>{formatCurrency(vendedor.vendas_total)}</TableCell>
                  <TableCell>{formatCurrency(vendedor.meta_atual)}</TableCell>
                  <TableCell>{vendedor.taxa_conversao}%</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditVendedor(vendedor)}>
                      <UserCog size={16} className="mr-2" />
                      {getEditButtonText()}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendedores;
