
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Integracao } from "./types";

interface IntegracaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCrm: Integracao | null;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  onSave: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

const IntegracaoDialog: React.FC<IntegracaoDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedCrm,
  apiUrl,
  setApiUrl,
  apiKey,
  setApiKey,
  onSave,
  onDisconnect,
  isConnecting
}) => {
  if (!selectedCrm) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {selectedCrm.conectado ? `Configurar ${selectedCrm.nome}` : `Conectar com ${selectedCrm.nome}`}
          </DialogTitle>
          <DialogDescription>
            {selectedCrm.conectado 
              ? "Atualize as configurações da sua integração" 
              : "Configure a integração para sincronizar dados"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-url">URL da API</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.exemplo.com"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api-key">Chave da API</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Sua chave API secreta"
            />
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {selectedCrm.conectado && (
            <Button
              variant="destructive"
              onClick={onDisconnect}
              disabled={isConnecting}
            >
              Desconectar
            </Button>
          )}
          <Button
            onClick={onSave}
            disabled={!apiUrl || !apiKey || isConnecting}
          >
            {isConnecting ? "Processando..." : selectedCrm.conectado ? "Atualizar" : "Conectar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntegracaoDialog;
