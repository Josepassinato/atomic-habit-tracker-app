
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { supabaseService } from "@/services/supabase";
import { useLanguage } from "@/i18n";

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
  const { t } = useLanguage();
  
  const handleSync = async () => {
    if (!isConfigured) {
      toast.error(t('supabaseNotConfigured'));
      return;
    }
    
    try {
      setIsSyncing(true);
      toast.loading(t('syncing'));
      
      const success = await supabaseService.syncAllDataToSupabase();
      
      toast.dismiss();
      if (success) {
        toast.success(t('syncSuccess'));
      } else {
        toast.warning(t('partialSync'));
      }
    } catch (error) {
      console.error("Erro ao sincronizar com o Supabase:", error);
      toast.dismiss();
      toast.error(t('syncError'));
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
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
      {isSyncing ? t('syncing') : t('save')}
    </Button>
  );
};

export default SupabaseSyncButton;
