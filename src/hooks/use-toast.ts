
import { toast } from "@/components/ui/sonner";
import { useToast as originalUseToast } from "@/components/ui/toast"

export { toast };
export const useToast = originalUseToast;
