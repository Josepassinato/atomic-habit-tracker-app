
import { UserAuth, UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica se o usuário possui a permissão necessária
 * @param user Objeto do usuário
 * @param requiredRole Papel necessário para acesso
 * @returns true se o usuário tem permissão, false caso contrário
 */
export const hasPermission = (user: UserAuth | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  
  // Normalize roles to handle both English and Portuguese
  const normalizeRole = (role: string): string => {
    if (role === 'salesperson') return 'vendedor';
    return role;
  };
  
  const userRole = normalizeRole(user.role);
  const normalizedRequiredRole = normalizeRole(requiredRole);
  
  // Admins têm acesso a tudo
  if (userRole === 'admin') return true;
  
  // Gerentes têm acesso a gerente e vendedor
  if (userRole === 'gerente' && (normalizedRequiredRole === 'gerente' || normalizedRequiredRole === 'vendedor')) {
    return true;
  }
  
  // Vendedores só têm acesso a funções de vendedor
  if (userRole === 'vendedor' && normalizedRequiredRole === 'vendedor') {
    return true;
  }
  
  return false;
};

/**
 * Verifica se o usuário pode acessar dados de uma empresa específica
 */
export const canAccessCompanyData = async (companyId: string): Promise<boolean> => {
  try {
    const { data } = await supabase.rpc('user_belongs_to_company', { 
      target_company_id: companyId 
    });
    return data || false;
  } catch (error) {
    console.error("Erro ao verificar acesso à empresa:", error);
    return false;
  }
};

/**
 * Verifica se o usuário pode acessar dados de uma equipe específica
 */
export const canAccessTeamData = async (teamId: string): Promise<boolean> => {
  try {
    const { data } = await supabase.rpc('user_can_access_team', { 
      target_team_id: teamId 
    });
    return data || false;
  } catch (error) {
    console.error("Erro ao verificar acesso à equipe:", error);
    return false;
  }
};

/**
 * Obtém o perfil do usuário atual do Supabase
 */
export const getCurrentUserProfile = async (): Promise<UserAuth | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) return null;

    // Busca o role da tabela user_roles (separada por segurança)
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    return {
      id: profile.user_id,
      email: profile.email,
      nome: profile.name,
      role: (roleData?.role as UserRole) || 'vendedor',
      empresa_id: profile.company_id,
      equipe_id: profile.team_ids?.[0] || null
    };
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    return null;
  }
};

/**
 * Obtém o usuário atual (compatibilidade com código legado)
 * @deprecated Use getCurrentUserProfile() ou useAuth() hook instead
 * SECURITY: Never trust client-side storage for authentication
 */
export const getCurrentUser = (): UserAuth | null => {
  console.warn("getCurrentUser() is deprecated and insecure. Use getCurrentUserProfile() or useAuth() hook instead.");
  // REMOVED: localStorage access for security reasons
  // Roles and authentication must always be verified server-side
  return null;
};

/**
 * Verifica se o usuário tem acesso a uma determinada rota
 * @param path Caminho da rota
 * @returns true se o usuário tem acesso, false caso contrário
 */
export const canAccessRoute = (path: string): boolean => {
  const user = getCurrentUser();
  console.log("Checking access for path:", path, "User:", user);
  
  // Rotas públicas
  if (path === '/' || path === '/auth') {
    return true;
  }
  
  if (!user) return false;
  
  // Rotas admin - verificando apenas o papel do usuário
  if (path === '/admin' || path === '/admin-dashboard') {
    return user.role === 'admin';
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
