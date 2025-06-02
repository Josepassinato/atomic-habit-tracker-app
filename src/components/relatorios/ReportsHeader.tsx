
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";

interface ReportsHeaderProps {
  onDownloadReport: () => void;
  onOpenEmailDialog: () => void;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onDownloadReport,
  onOpenEmailDialog,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="text-muted-foreground">Reports, alerts and real-time analytics</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownloadReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button onClick={onOpenEmailDialog} className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Send by Email
        </Button>
      </div>
    </div>
  );
};
