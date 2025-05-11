
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Equipe {
  id: string;
  nome: string;
}

interface RelatorioFiltrosProps {
  periodoSelecionado: "semana" | "mes" | "trimestre" | "ano";
  setPeriodoSelecionado: (periodo: "semana" | "mes" | "trimestre" | "ano") => void;
  equipeId: string;
  setEquipeId: (id: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  equipes: Equipe[];
  onGenerateReport: () => void;
}

export const RelatorioFiltros: React.FC<RelatorioFiltrosProps> = ({
  periodoSelecionado,
  setPeriodoSelecionado,
  equipeId,
  setEquipeId,
  date,
  setDate,
  equipes,
  onGenerateReport,
}) => {
  return (
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
            <SelectItem value="todas">Todas as equipes</SelectItem>
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
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button className="ml-auto" onClick={onGenerateReport}>Gerar Relatório</Button>
    </div>
  );
};
