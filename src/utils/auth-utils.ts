
import { storageService } from "@/services/storage-service";
import { toast } from "sonner";

export const clearAllAuthData = () => {
  // Clear all Supabase auth keys
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      key === 'habitus-user' ||
      key === 'user'
    ) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear all session storage
  sessionStorage.clear();
  
  // Clear storage service user data
  storageService.removeItem('user');
};

export const performLogout = (redirectTo: string = '/') => {
  try {
    clearAllAuthData();
    
    toast.success('Logout realizado com sucesso');
    
    // Force redirect with page reload to ensure clean state
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 500);
  } catch (error) {
    console.error('Error during logout:', error);
    toast.error('Erro ao fazer logout');
    
    // Fallback: force redirect anyway
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 1000);
  }
};

export const isUserLoggedIn = (): boolean => {
  try {
    const user = storageService.getItem('user');
    return !!user;
  } catch {
    return false;
  }
};
