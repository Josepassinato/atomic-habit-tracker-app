
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Trophy, Medal, Gift, Percent } from "lucide-react";
import { Team } from "./types";

interface RewardsTabProps {
  currentTeam: Team | null;
  recompensaTipo: string;
  setRecompensaTipo: (tipo: string) => void;
  recompensaDescricao: string;
  setRecompensaDescricao: (descricao: string) => void;
  recompensasMetas: {descricao: string; tipo: string}[];
  adicionarRecompensa: () => void;
  removerRecompensa: (index: number) => void;
  comissaoBase: string;
  setComissaoBase: (comissao: string) => void;
  comissaoHabitos: string;
  setComissaoHabitos: (comissao: string) => void;
  isComissaoAberta: boolean;
  setIsComissaoAberta: (aberta: boolean) => void;
}

const RewardsTab: React.FC<RewardsTabProps> = ({
  currentTeam,
  recompensaTipo,
  setRecompensaTipo,
  recompensaDescricao,
  setRecompensaDescricao,
  recompensasMetas,
  adicionarRecompensa,
  removerRecompensa,
  comissaoBase,
  setComissaoBase,
  comissaoHabitos,
  setComissaoHabitos,
  isComissaoAberta,
  setIsComissaoAberta
}) => {
  if (!currentTeam) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-medium">Rewards for: {currentTeam.name}</h3>
        <Badge variant="outline">{currentTeam.name}</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Set incentives to celebrate goal and habit achievements
      </p>
      
      {/* Commissions Section */}
      <Collapsible 
        open={isComissaoAberta} 
        onOpenChange={setIsComissaoAberta}
        className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2 text-blue-800">
              <Percent className="h-5 w-5" />
              <h4 className="font-semibold">Commission Percentages</h4>
            </div>
            <Button variant="ghost" size="sm">
              {isComissaoAberta ? "Close" : "Open"}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="comissaoBase" className="text-blue-700">
                Base commission on sales (%)
              </Label>
              <Input 
                id="comissaoBase" 
                type="number" 
                placeholder="3" 
                value={comissaoBase}
                onChange={(e) => setComissaoBase(e.target.value)}
                className="bg-white mt-1"
              />
              <p className="text-xs text-blue-600 mt-1">
                Standard percentage on all sales
              </p>
            </div>
            <div>
              <Label htmlFor="comissaoHabitos" className="text-blue-700">
                Bonus for completing habits (%)
              </Label>
              <Input 
                id="comissaoHabitos" 
                type="number" 
                placeholder="2" 
                value={comissaoHabitos}
                onChange={(e) => setComissaoHabitos(e.target.value)}
                className="bg-white mt-1"
              />
              <p className="text-xs text-blue-600 mt-1">
                Additional percentage when achieving 100% of habits
              </p>
            </div>
          </div>
          <div className="bg-blue-100 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              Total potential: <span className="font-bold">{Number(comissaoBase) + Number(comissaoHabitos)}%</span> 
              (Base commission: {comissaoBase}% + Habit bonus: {comissaoHabitos}%)
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="bg-purple-50 p-4 rounded-md mb-4 border border-purple-100">
        <div className="flex items-center gap-2 mb-2 text-purple-800">
          <Trophy className="h-5 w-5" />
          <h4 className="font-semibold">Why are rewards important?</h4>
        </div>
        <p className="text-sm text-purple-700">
          Rewards increase motivation and engagement, reinforcing positive behaviors 
          and helping to create a culture of recognition in the team.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="recompensaDescricao">Reward description</Label>
          <Textarea 
            id="recompensaDescricao" 
            placeholder="Ex: $100 gift card for whoever hits 120% of goal" 
            value={recompensaDescricao}
            onChange={(e) => setRecompensaDescricao(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Reward type</Label>
          <RadioGroup value={recompensaTipo} onValueChange={setRecompensaTipo} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="equipe" id="equipe" />
              <Label htmlFor="equipe" className="cursor-pointer">Team</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button onClick={adicionarRecompensa} className="w-full">
          <Gift className="mr-2 h-4 w-4" />
          Add reward
        </Button>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Added rewards:</h4>
        {recompensasMetas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rewards added yet</p>
        ) : (
          <div className="space-y-3">
            {recompensasMetas.map((recompensa, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {recompensa.tipo === "individual" ? (
                      <Medal className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Trophy className="h-4 w-4 text-purple-600" />
                    )}
                    <span>{recompensa.descricao}</span>
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {recompensa.tipo === "individual" ? "Individual" : "Team"}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removerRecompensa(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsTab;
