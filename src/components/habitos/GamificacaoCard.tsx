
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Conquista {
  id: number;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  progresso: number;
  completa: boolean;
}

interface GamificacaoCardProps {
  pontos: number;
  nivel: number;
  proximoNivel: number;
  conquistasRecentes: Conquista[];
}

const GamificacaoCard: React.FC<GamificacaoCardProps> = ({
  pontos,
  nivel,
  proximoNivel,
  conquistasRecentes,
}) => {
  const progressoProximoNivel = Math.min((pontos / proximoNivel) * 100, 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Minha Performance</CardTitle>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {pontos} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Nível {nivel}</span>
              <span className="text-xs text-muted-foreground">{pontos}/{proximoNivel} pontos</span>
            </div>
            <Progress value={progressoProximoNivel} className="h-2" />
          </div>
        </div>

        <h4 className="font-medium text-sm mb-3">Conquistas Recentes</h4>
        <div className="space-y-3">
          {conquistasRecentes.map((conquista) => (
            <div key={conquista.id} className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${conquista.completa ? 'bg-green-100' : 'bg-slate-100'}`}>
                {conquista.icone}
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium">{conquista.titulo}</h5>
                <p className="text-xs text-muted-foreground">{conquista.descricao}</p>
              </div>
              {conquista.completa ? (
                <Badge className="bg-green-500">Completa</Badge>
              ) : (
                <div className="w-10 h-1 bg-slate-200 rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${conquista.progresso}%` }} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificacaoCard;
