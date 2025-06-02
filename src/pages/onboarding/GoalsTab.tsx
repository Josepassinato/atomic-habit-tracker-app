
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Team } from "./types";

interface GoalsTabProps {
  currentTeam: Team | null;
  metaMensal: string;
  setMetaMensal: (value: string) => void;
  metaDiaria: string;
  setMetaDiaria: (value: string) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({
  currentTeam,
  metaMensal,
  setMetaMensal,
  metaDiaria,
  setMetaDiaria
}) => {
  if (!currentTeam) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-medium">Goals for: {currentTeam.name}</h3>
        <Badge variant="outline">{currentTeam.name}</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Set realistic goals for this team to achieve
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="metaMensal">Monthly sales goal ($)</Label>
          <Input 
            id="metaMensal" 
            type="number" 
            placeholder="30000" 
            value={metaMensal}
            onChange={(e) => setMetaMensal(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="metaDiaria">Daily sales goal ($)</Label>
          <Input 
            id="metaDiaria" 
            type="number" 
            placeholder="1500" 
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;
