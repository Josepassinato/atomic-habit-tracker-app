
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, HelpCircle } from "lucide-react";
import ConsultoriaIA from "@/components/ConsultoriaIA";
import { Team } from "./types";

interface HabitsTabProps {
  currentTeam: Team | null;
  habitosSelecionados: string[];
  handleHabitoToggle: (habito: string) => void;
}

const HabitsTab: React.FC<HabitsTabProps> = ({
  currentTeam,
  habitosSelecionados,
  handleHabitoToggle
}) => {
  const habitosRecomendados = [
    "Make 10 calls per day",
    "Record all interactions in CRM",
    "Follow up within 24 hours",
    "Hold daily planning meetings",
    "Study the market for 15 minutes daily",
    "Request feedback after each negotiation"
  ];

  if (!currentTeam) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-medium">Habits for: {currentTeam.name}</h3>
        <Badge variant="outline">{currentTeam.name}</Badge>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Choose habits that will help this team achieve their goals
        </p>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-2">
              <HelpCircle className="h-4 w-4" />
              AI Help
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <ConsultoriaIA />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2 mt-4">
        {habitosRecomendados.map((habito) => (
          <Button
            key={habito}
            variant={habitosSelecionados.includes(habito) ? "default" : "outline"}
            className="w-full justify-start mb-2 text-left"
            onClick={() => handleHabitoToggle(habito)}
          >
            {habitosSelecionados.includes(habito) && (
              <Check className="mr-2 h-4 w-4" />
            )}
            {habito}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HabitsTab;
