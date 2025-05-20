
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";

interface Meta {
  id: number;
  nome: string;
  valor: number;
  atual: number;
  percentual: number;
}

const metasIniciais = [
  {
    id: 1,
    nome: "Meta Principal",
    valor: 120000,
    atual: 102000,
    percentual: 85,
  },
  {
    id: 2,
    nome: "Meta de Prospecção",
    valor: 50,
    atual: 45,
    percentual: 90,
  },
  {
    id: 3,
    nome: "Meta de Conversão",
    valor: 30,
    atual: 18,
    percentual: 60,
  },
];

const MetasVendas = () => {
  const { supabase } = useSupabase();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [sugestaoIA, setSugestaoIA] = useState<string>("Concentre-se na meta de conversão aumentando o número de follow-ups para cada lead qualificado.");
  
  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    setLoading(true);
    
    try {
      if (supabase) {
        // Buscar metas do Supabase
        const { data, error } = await supabase
          .from('metas')
          .select('*')
          .order('id');
        
        if (error) {
          console.error("Erro ao buscar metas:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setMetas(data);
        } else {
          // Se não houver dados, inicializa com dados padrão
          const { error: insertError } = await supabase
            .from('metas')
            .upsert(metasIniciais);
          
          if (insertError) {
            console.error("Erro ao inserir metas:", insertError);
          }
          
          setMetas(metasIniciais);
        }
        
        // Buscar sugestão da IA
        const { data: sugestaoData, error: sugestaoError } = await supabase
          .from('sugestoes_ia')
          .select('texto')
          .eq('tipo', 'meta')
          .limit(1)
          .single();
        
        if (!sugestaoError && sugestaoData) {
          setSugestaoIA(sugestaoData.texto);
        }
      } else {
        // Fallback para dados locais
        const salvasMetas = localStorage.getItem('metas');
        if (salvasMetas) {
          setMetas(JSON.parse(salvasMetas));
        } else {
          setMetas(metasIniciais);
          localStorage.setItem('metas', JSON.stringify(metasIniciais));
        }
        
        const salvaSugestao = localStorage.getItem('sugestao_metas');
        if (salvaSugestao) {
          setSugestaoIA(salvaSugestao);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      toast.error("Não foi possível carregar as metas");
      setMetas(metasIniciais);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Metas de Vendas</CardTitle>
            <CardDescription>Mês de {new Date().toLocaleDateString('pt-BR', { month: 'long' })}, {new Date().getFullYear()}</CardDescription>
          </div>
          <Badge className="flex items-center gap-1" variant="outline">
            <TrendingUp className="h-3 w-3" />
            Definido pela IA
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : (
          <div className="space-y-6">
            {metas.map((meta) => (
              <div key={meta.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">{meta.nome}</h4>
                    <div className="text-sm text-muted-foreground">
                      {meta.nome === "Meta Principal"
                        ? `R$ ${meta.atual.toLocaleString()} de R$ ${meta.valor.toLocaleString()}`
                        : `${meta.atual} de ${meta.valor}`}
                    </div>
                  </div>
                  <Badge
                    variant={meta.percentual >= 80 ? "secondary" : meta.percentual >= 50 ? "outline" : "destructive"}
                  >
                    {meta.percentual}%
                  </Badge>
                </div>
                <Progress value={meta.percentual} className="h-2" />
              </div>
            ))}
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Sugestão da IA:</p>
              <p className="mt-1 text-muted-foreground">
                {sugestaoIA}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetasVendas;
