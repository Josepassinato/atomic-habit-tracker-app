
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileCheck, Image, FileText } from "lucide-react";
import { toast } from "sonner";

interface HabitoEvidenciaProps {
  habitoId: number;
  titulo: string;
  onEvidenciaSubmitted: (habitoId: number, evidencia: HabitoEvidenciaType) => void;
}

export type HabitoEvidenciaType = {
  tipo: "texto" | "screenshot" | "arquivo";
  conteudo: string;
  timestamp: string;
};

const HabitoEvidencia: React.FC<HabitoEvidenciaProps> = ({
  habitoId,
  titulo,
  onEvidenciaSubmitted,
}) => {
  const [open, setOpen] = useState(false);
  const [evidenciaTipo, setEvidenciaTipo] = useState<"texto" | "screenshot" | "arquivo">("texto");
  const [evidenciaTexto, setEvidenciaTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (evidenciaTipo === "texto" && !evidenciaTexto.trim()) {
      toast.error("Por favor, insira uma descrição da evidência");
      return;
    }

    setIsSubmitting(true);

    // Criar objeto de evidência
    const evidencia: HabitoEvidenciaType = {
      tipo: evidenciaTipo,
      conteudo: evidenciaTexto,
      timestamp: new Date().toISOString(),
    };

    // Simular um atraso de envio para melhor feedback ao usuário
    setTimeout(() => {
      onEvidenciaSubmitted(habitoId, evidencia);
      setIsSubmitting(false);
      setOpen(false);
      
      toast.success("Evidência enviada com sucesso!");
      
      // Limpar o formulário
      setEvidenciaTexto("");
      setEvidenciaTipo("texto");
    }, 800);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Adicionar Evidência
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Evidência para "{titulo}"</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex gap-2 border rounded-md overflow-hidden">
              <Button 
                type="button"
                className={`flex-1 rounded-none ${evidenciaTipo === 'texto' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-transparent hover:bg-slate-100'}`} 
                variant="ghost"
                onClick={() => setEvidenciaTipo("texto")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Descrição
              </Button>
              <Button 
                type="button"
                className={`flex-1 rounded-none ${evidenciaTipo === 'screenshot' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-transparent hover:bg-slate-100'}`} 
                variant="ghost"
                onClick={() => setEvidenciaTipo("screenshot")}
              >
                <Image className="h-4 w-4 mr-2" />
                Screenshot
              </Button>
              <Button 
                type="button"
                className={`flex-1 rounded-none ${evidenciaTipo === 'arquivo' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-transparent hover:bg-slate-100'}`}
                variant="ghost"
                onClick={() => setEvidenciaTipo("arquivo")}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Arquivo
              </Button>
            </div>

            {evidenciaTipo === "texto" && (
              <Textarea
                placeholder="Descreva como você concluiu este hábito..."
                value={evidenciaTexto}
                onChange={(e) => setEvidenciaTexto(e.target.value)}
                rows={5}
              />
            )}

            {evidenciaTipo === "screenshot" && (
              <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-slate-50">
                <Image className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-500">
                  Clique para fazer upload de uma imagem ou screenshot
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  (Funcionalidade simulada - na versão completa permitiria upload)
                </p>
              </div>
            )}

            {evidenciaTipo === "arquivo" && (
              <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-slate-50">
                <FileCheck className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-500">
                  Clique para fazer upload de um arquivo (PDF, Excel, etc.)
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  (Funcionalidade simulada - na versão completa permitiria upload)
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Evidência"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitoEvidencia;
