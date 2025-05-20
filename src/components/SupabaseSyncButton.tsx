
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { supabaseService } from "@/services/supabase";

interface SupabaseSyncButtonProps {
  size?: "sm" | "default" | "lg" | "icon" | null;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  className?: string;
}

const SupabaseSyncButton: React.FC<SupabaseSyncButtonProps> = ({ 
  size = "sm", 
  variant = "outline",
  className = ""
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { isConfigured } = useSupabase();
  
  const handleSync = async () => {
    if (!isConfigured) {
      toast.error("Supabase não está configurado. Configure antes de sincronizar dados.");
      return;
    }
    
    try {
      setIsSyncing(true);
      toast.loading("Sincronizando dados com o Supabase...");
      
      const success = await supabaseService.syncAllDataToSupabase();
      
      toast.dismiss();
      if (success) {
        toast.success("Dados sincronizados com sucesso!");
      } else {
        toast.warning("Alguns dados não foram sincronizados completamente.");
      }
    } catch (error) {
      console.error("Erro ao sincronizar com o Supabase:", error);
      toast.dismiss();
      toast.error("Erro ao sincronizar dados com o Supabase.");
    } finally {
      setIsSyncing(false);
    }
  };
  
  if (!isConfigured) {
    return null;
  }
  
  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleSync}
      disabled={isSyncing}
      className={`flex items-center gap-2 ${className}`}
    >
      <Database className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
      {isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
    </Button>
  );
};

export default SupabaseSyncButton;
