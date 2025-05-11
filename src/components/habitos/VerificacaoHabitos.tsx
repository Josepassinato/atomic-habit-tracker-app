
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileCheck, FileText, Image, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { HabitoEvidenciaType } from "./HabitoEvidencia";

interface Habito {
  id: number;
  titulo: string;
  descricao: string;
  cumprido: boolean;
  horario: string;
  evidencia?: HabitoEvidenciaType;
  verificacaoNecessaria?: boolean;
  verificado?: boolean;
}

interface Vendedor {
  id: string;
  nome: string;
  habitos: Habito[];
}

// Dados fictícios para demonstração
const vendedoresDemo: Vendedor[] = [
  {
    id: "v1",
    nome: "Ana Silva",
    habitos: [
      {
        id: 1,
        titulo: "Check-in Matinal",
        descricao: "Definir metas diárias para vendas",
        cumprido: true,
        horario: "08:30",
        verificacaoNecessaria: true,
        evidencia: {
          tipo: "texto",
          conteudo: "Realizei o check-in às 8:15 e defini meta de 3 demonstrações para hoje",
          timestamp: new Date(new Date().setHours(8, 15)).toISOString()
        }
      },
      {
        id: 2,
        titulo: "Follow-up Sistemático",
        descricao: "Verificar se contatos foram registrados no CRM",
        cumprido: true,
        horario: "12:00",
        verificacaoNecessaria: true,
        evidencia: {
          tipo: "texto",
          conteudo: "Atualizei 8 registros de clientes no CRM com detalhes das reuniões de ontem",
          timestamp: new Date(new Date().setHours(12, 5)).toISOString()
        }
      }
    ]
  },
  {
    id: "v2",
    nome: "Carlos Mendes",
    habitos: [
      {
        id: 1,
        titulo: "Check-in Matinal",
        descricao: "Definir metas diárias para vendas",
        cumprido: true,
        horario: "08:30",
        verificacaoNecessaria: true,
        evidencia: {
          tipo: "texto",
          conteudo: "Fiz o planejamento do dia e defini 5 leads para qualificar hoje",
          timestamp: new Date(new Date().setHours(8, 45)).toISOString()
        }
      },
      {
        id: 3,
        titulo: "Treinamento em Micro Doses",
        descricao: "Ler conteúdo e validar aprendizado",
        cumprido: true,
        horario: "15:00",
        verificacaoNecessaria: true,
        evidencia: {
          tipo: "texto",
          conteudo: "Realizei o treinamento sobre objeções comuns e pratiquei com a equipe",
          timestamp: new Date(new Date().setHours(15, 20)).toISOString()
        }
      }
    ]
  }
];

const VerificacaoHabitos: React.FC = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>(vendedoresDemo);
  const [evidenciaDialog, setEvidenciaDialog] = useState<{
    aberto: boolean;
    vendedor?: string;
    habito?: Habito;
  }>({
    aberto: false
  });

  const verEvidencia = (vendedorId: string, habito: Habito) => {
    const vendedor = vendedores.find(v => v.id === vendedorId);
    setEvidenciaDialog({
      aberto: true,
      vendedor: vendedor?.nome,
      habito
    });
  };

  const verificarHabito = (vendedorId: string, habitoId: number) => {
    setVendedores(vendedores.map(vendedor => 
      vendedor.id === vendedorId
        ? {
            ...vendedor,
            habitos: vendedor.habitos.map(habito =>
              habito.id === habitoId
                ? { ...habito, verificado: true }
                : habito
            )
          }
        : vendedor
    ));
    
    setEvidenciaDialog({ aberto: false });
    toast.success("Hábito verificado com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificação de Hábitos</CardTitle>
        <CardDescription>
          Verifique os hábitos completados pela sua equipe de vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {vendedores.map(vendedor => (
          <div key={vendedor.id} className="mb-6 last:mb-0">
            <h3 className="text-lg font-medium mb-2">{vendedor.nome}</h3>
            
            <div className="space-y-3">
              {vendedor.habitos
                .filter(habito => habito.cumprido && !habito.verificado)
                .map(habito => (
                  <div 
                    key={habito.id} 
                    className="flex justify-between items-center bg-white p-3 rounded-md border"
                  >
                    <div>
                      <div className="font-medium">{habito.titulo}</div>
                      <div className="text-sm text-muted-foreground">{habito.descricao}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {habito.evidencia?.tipo === "texto" && (
                          <Badge variant="outline" className="bg-blue-50">
                            <FileText className="h-3 w-3 mr-1" /> Descrição
                          </Badge>
                        )}
                        {habito.evidencia?.tipo === "screenshot" && (
                          <Badge variant="outline" className="bg-purple-50">
                            <Image className="h-3 w-3 mr-1" /> Screenshot
                          </Badge>
                        )}
                        {habito.evidencia?.tipo === "arquivo" && (
                          <Badge variant="outline" className="bg-amber-50">
                            <FileCheck className="h-3 w-3 mr-1" /> Arquivo
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {habito.evidencia 
                            ? new Date(habito.evidencia.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) 
                            : ""}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => verEvidencia(vendedor.id, habito)}
                      >
                        Ver Evidência
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => verificarHabito(vendedor.id, habito.id)}
                      >
                        Verificar
                      </Button>
                    </div>
                  </div>
                ))}
              
              {vendedor.habitos.filter(h => h.cumprido && !h.verificado).length === 0 && (
                <p className="text-sm text-muted-foreground p-3 bg-slate-50 rounded-md">
                  Não há novos hábitos para verificação deste vendedor.
                </p>
              )}
            </div>
            
            <Separator className="mt-4" />
          </div>
        ))}

        {vendedores.filter(v => v.habitos.some(h => h.cumprido && !h.verificado)).length === 0 && (
          <div className="text-center py-8">
            <Check className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-20" />
            <p>Todos os hábitos foram verificados!</p>
            <p className="text-sm text-muted-foreground">
              Não há nenhum hábito pendente de verificação no momento.
            </p>
          </div>
        )}

        <Dialog 
          open={evidenciaDialog.aberto} 
          onOpenChange={(open) => setEvidenciaDialog({ ...evidenciaDialog, aberto: open })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Evidência de Hábito</DialogTitle>
            </DialogHeader>
            
            {evidenciaDialog.habito && evidenciaDialog.vendedor && (
              <div className="py-4">
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Vendedor:</p>
                  <p>{evidenciaDialog.vendedor}</p>
                  
                  <p className="text-sm font-medium">Hábito:</p>
                  <p>{evidenciaDialog.habito.titulo}</p>
                  
                  <p className="text-sm font-medium">Horário:</p>
                  <p>{evidenciaDialog.habito.evidencia && new Date(evidenciaDialog.habito.evidencia.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-1">Evidência:</p>
                  
                  {evidenciaDialog.habito.evidencia?.tipo === "texto" && (
                    <p className="whitespace-pre-wrap">{evidenciaDialog.habito.evidencia.conteudo}</p>
                  )}
                  
                  {evidenciaDialog.habito.evidencia?.tipo === "screenshot" && (
                    <div className="text-center p-8 bg-white border rounded-md">
                      <Image className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Visualização de screenshot</p>
                    </div>
                  )}
                  
                  {evidenciaDialog.habito.evidencia?.tipo === "arquivo" && (
                    <div className="text-center p-8 bg-white border rounded-md">
                      <FileCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Visualização de arquivo</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEvidenciaDialog({ aberto: false })}>
                Fechar
              </Button>
              {evidenciaDialog.habito && evidenciaDialog.vendedor && (
                <Button 
                  onClick={() => verificarHabito(
                    vendedores.find(v => v.nome === evidenciaDialog.vendedor)?.id || "", 
                    evidenciaDialog.habito?.id || 0
                  )}
                >
                  Verificar Hábito
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VerificacaoHabitos;
