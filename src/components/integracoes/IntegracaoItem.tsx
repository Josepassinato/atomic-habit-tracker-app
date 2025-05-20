
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Integracao } from "./types";

interface IntegracaoItemProps {
  integracao: Integracao;
  onConfigClick: (integracao: Integracao) => void;
}

const IntegracaoItem: React.FC<IntegracaoItemProps> = ({ integracao, onConfigClick }) => {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{integracao.nome}</h4>
          {integracao.conectado && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Conectado
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {integracao.integracoes.join(", ")}
        </p>
      </div>
      <Button 
        variant={integracao.conectado ? "outline" : "default"} 
        size="sm"
        onClick={() => onConfigClick(integracao)}
      >
        {integracao.conectado ? "Configurar" : "Conectar"}
      </Button>
    </div>
  );
};

export default IntegracaoItem;
