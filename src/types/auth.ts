
export type UserRole = 'admin' | 'gerente' | 'vendedor' | 'salesperson';

export interface UserAuth {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  empresa_id?: string;
  equipe_id?: string;
}
