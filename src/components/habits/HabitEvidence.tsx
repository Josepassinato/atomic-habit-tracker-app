
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileCheck, Image, FileText } from "lucide-react";
import { toast } from "sonner";

interface HabitEvidenceProps {
  habitId: number;
  title: string;
  onEvidenceSubmitted: (habitId: number, evidence: HabitEvidenceType) => void;
}

export type HabitEvidenceType = {
  type: "text" | "screenshot" | "file";
  content: string;
  timestamp: string;
};

const HabitEvidence: React.FC<HabitEvidenceProps> = ({
  habitId,
  title,
  onEvidenceSubmitted,
}) => {
  const [open, setOpen] = useState(false);
  const [evidenceType, setEvidenceType] = useState<"text" | "screenshot" | "file">("text");
  const [evidenceText, setEvidenceText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (evidenceType === "text" && !evidenceText.trim()) {
      toast.error("Please enter a description of the evidence");
      return;
    }

    setIsSubmitting(true);

    // Create evidence object
    const evidence: HabitEvidenceType = {
      type: evidenceType,
      content: evidenceText,
      timestamp: new Date().toISOString(),
    };

    // Simulate upload delay for better user feedback
    setTimeout(() => {
      onEvidenceSubmitted(habitId, evidence);
      setIsSubmitting(false);
      setOpen(false);
      
      toast.success("Evidence submitted successfully!");
      
      // Clear form
      setEvidenceText("");
      setEvidenceType("text");
    }, 800);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Add Evidence
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Evidence for "{title}"</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex gap-2 border rounded-md overflow-hidden">
              <Button 
                type="button"
                className={`flex-1 rounded-none ${evidenceType === 'text' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-transparent hover:bg-slate-100'}`} 
                variant="ghost"
                onClick={() => setEvidenceType("text")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Description
              </Button>
              <Button 
                type="button"
                className={`flex-1 rounded-none ${evidenceType === 'screenshot' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-transparent hover:bg-slate-100'}`} 
                variant="ghost"
                onClick={() => setEvidenceType("screenshot")}
              >
                <Image className="h-4 w-4 mr-2" />
                Screenshot
              </Button>
              <Button 
                type="button"
                className={`flex-1 rounded-none ${evidenceType === 'file' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-transparent hover:bg-slate-100'}`}
                variant="ghost"
                onClick={() => setEvidenceType("file")}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                File
              </Button>
            </div>

            {evidenceType === "text" && (
              <Textarea
                placeholder="Describe how you completed this habit..."
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                rows={5}
              />
            )}

            {evidenceType === "screenshot" && (
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

            {evidenceType === "file" && (
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
              Cancel
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

export default HabitEvidence;
