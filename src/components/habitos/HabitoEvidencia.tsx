
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileCheck, Image, FileText } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";

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
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [evidenciaTipo, setEvidenciaTipo] = useState<"texto" | "screenshot" | "arquivo">("texto");
  const [evidenciaTexto, setEvidenciaTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (evidenciaTipo === "texto" && !evidenciaTexto.trim()) {
      toast.error("Please enter a description of the evidence");
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
      
      toast.success("Evidence submitted successfully!");
      
      // Limpar o formulário
      setEvidenciaTexto("");
      setEvidenciaTipo("texto");
    }, 800);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        {t('addEvidence')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Evidence for "{titulo}"</DialogTitle>
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
                Description
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
                File
              </Button>
            </div>

            {evidenciaTipo === "texto" && (
              <Textarea
                placeholder="Describe how you completed this habit..."
                value={evidenciaTexto}
                onChange={(e) => setEvidenciaTexto(e.target.value)}
                rows={5}
              />
            )}

            {evidenciaTipo === "screenshot" && (
              <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-slate-50">
                <Image className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-500">
                  Click to upload an image or screenshot
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  (Simulated functionality - full version would allow upload)
                </p>
              </div>
            )}

            {evidenciaTipo === "arquivo" && (
              <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-slate-50">
                <FileCheck className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-500">
                  Click to upload a file (PDF, Excel, etc.)
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  (Simulated functionality - full version would allow upload)
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Evidence"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitoEvidencia;
