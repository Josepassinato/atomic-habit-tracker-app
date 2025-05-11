
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, List, Trophy } from "lucide-react";
import { toast } from "sonner";

import { useHabitos } from "./hooks/useHabitos";
import HabitosList from "./components/HabitosList";
import HabitosCalendario from "./components/HabitosCalendario";
import HabitosDesempenho from "./components/HabitosDesempenho";
import { useNotificacoes } from "@/components/notificacoes/NotificacoesProvider";

const HabitosPage = () => {
  const [activeTab, setActiveTab] = useState<string>("lista");
  const { adicionarNotificacao } = useNotificacoes();
  const { 
    habitos, 
    conquistasRecentes,
    pontos,
    nivel,
    habitosPorDia,
    handleAddNewHabito, 
    handleEvidenciaSubmitted, 
    handleMarcarConcluido,
    handleCalendarDaySelect
  } = useHabitos();

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hábitos Atômicos</h1>
        <Button className="gap-2" onClick={handleAddNewHabito}>
          <PlusCircle size={16} />
          Novo Hábito
        </Button>
      </div>
      
      <Tabs defaultValue="lista" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <List size={16} />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar size={16} />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="desempenho" className="flex items-center gap-2">
            <Trophy size={16} />
            Desempenho
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista" className="mt-0">
          <HabitosList 
            habitos={habitos}
            onEvidenciaSubmitted={handleEvidenciaSubmitted}
            onMarcarConcluido={handleMarcarConcluido}
            conquistasRecentes={conquistasRecentes}
            pontos={pontos}
            nivel={nivel}
          />
        </TabsContent>
        
        <TabsContent value="calendario" className="mt-0">
          <HabitosCalendario 
            habitos={habitos}
            habitosPorDia={habitosPorDia}
            onSelectDay={handleCalendarDaySelect}
            conquistasRecentes={conquistasRecentes}
            pontos={pontos}
            nivel={nivel}
          />
        </TabsContent>
        
        <TabsContent value="desempenho" className="mt-0">
          <HabitosDesempenho 
            habitos={habitos}
            conquistasRecentes={conquistasRecentes}
            pontos={pontos}
            nivel={nivel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitosPage;
