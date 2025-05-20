
import { UserAuth, UserRole } from "@/types/auth";
import { storageService } from "@/services/storage-service";

/**
 * Verifica se o usuário possui a permissão necessária
 * @param user Objeto do usuário
 * @param requiredRole Papel necessário para acesso
 * @returns true se o usuário tem permissão, false caso contrário
 */
export const hasPermission = (user: UserAuth | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  
  // Admins têm acesso a tudo
  if (user.role === 'admin') return true;
  
  // Gerentes têm acesso a gerente e vendedor
  if (user.role === 'gerente' && (requiredRole === 'gerente' || requiredRole === 'vendedor')) {
    return true;
  }
  
  // Vendedores só têm acesso a funções de vendedor
  if (user.role === 'vendedor' && requiredRole === 'vendedor') {
    return true;
  }
  
  return false;
};

/**
 * Obtém o usuário atual do armazenamento persistente
 */
export const getCurrentUser = (): UserAuth | null => {
  try {
    const user = storageService.getItem<UserAuth>("user");
    return user;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return null;
  }
};

/**
 * Verifica se o usuário tem acesso a uma determinada rota
 * @param path Caminho da rota
 * @returns true se o usuário tem acesso, false caso contrário
 */
export const canAccessRoute = (path: string): boolean => {
  const user = getCurrentUser();
  
  // Rotas públicas
  if (path === '/' || path === '/login' || path === '/registro') {
    return true;
  }
  
  if (!user) return false;
  
  // Rotas admin
  if (path === '/admin') {
    return hasPermission(user, 'admin');
  }
  
  // Rotas específicas para gerentes
  if (
    path.includes('/relatorios') || 
    path.includes('/metas') || 
    path.includes('/gerenciar-metas') || 
    path.includes('/vendedores') || 
    path.includes('/premiacoes')
  ) {
    return hasPermission(user, 'gerente');
  }
  
  // Outras rotas requerem pelo menos permissão de vendedor
  return hasPermission(user, 'vendedor');
};
