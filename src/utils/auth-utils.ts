
import { storageService } from "@/services/storage-service";
import { toast } from "sonner";

export const performLogout = (redirectTo: string = '/') => {
  try {
    // Clear all possible user data
    storageService.removeItem('user');
    
    // Clear any other authentication-related data
    localStorage.removeItem('habitus-user');
    sessionStorage.clear();
    
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
