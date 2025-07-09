-- 1. Criar sistema de autenticação adequado
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gerente', 'vendedor')),
  team_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Função para obter perfil do usuário atual (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(
  user_id UUID,
  company_id UUID,
  role TEXT,
  team_ids JSONB
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    up.user_id,
    up.company_id,
    up.role,
    up.team_ids
  FROM public.user_profiles up
  WHERE up.user_id = auth.uid();
$$;

-- 3. Função para verificar se usuário pertence à empresa
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.get_current_user_profile()
    WHERE company_id = target_company_id OR role = 'admin'
  );
$$;

-- 4. Função para verificar se usuário pode acessar equipe
CREATE OR REPLACE FUNCTION public.user_can_access_team(target_team_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.get_current_user_profile() profile
    WHERE profile.role = 'admin' 
    OR (profile.role = 'gerente' AND profile.company_id = (
      SELECT company_id FROM teams WHERE id = target_team_id
    ))
    OR (profile.team_ids ? target_team_id::text)
  );
$$;

-- 5. Habilitar RLS nas tabelas de perfis
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Policy para perfis - usuários só veem perfis da sua empresa
DROP POLICY IF EXISTS "Users can view profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON public.user_profiles;

CREATE POLICY "Users can view profiles from same company"
ON public.user_profiles FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.user_belongs_to_company(company_id)
);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Atualizar policies de hábitos para isolamento por empresa
DROP POLICY IF EXISTS "Users can view habitos" ON public.habits;
DROP POLICY IF EXISTS "Users can insert habitos" ON public.habits;
DROP POLICY IF EXISTS "Users can update habitos" ON public.habits;
DROP POLICY IF EXISTS "Users can delete habitos" ON public.habits;

CREATE POLICY "Users can view habits from accessible teams"
ON public.habits FOR SELECT
USING (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

CREATE POLICY "Users can insert habits for accessible teams"
ON public.habits FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

CREATE POLICY "Users can update habits for accessible teams"
ON public.habits FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

CREATE POLICY "Users can delete habits for accessible teams"
ON public.habits FOR DELETE
USING (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

-- 8. Atualizar policies de metas para isolamento por empresa
DROP POLICY IF EXISTS "Users can view metas" ON public.goals;
DROP POLICY IF EXISTS "Users can insert metas" ON public.goals;
DROP POLICY IF EXISTS "Users can update metas" ON public.goals;
DROP POLICY IF EXISTS "Users can delete metas" ON public.goals;

CREATE POLICY "Users can view goals from accessible teams"
ON public.goals FOR SELECT
USING (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

CREATE POLICY "Users can insert goals for accessible teams"
ON public.goals FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

CREATE POLICY "Users can update goals for accessible teams"
ON public.goals FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

CREATE POLICY "Users can delete goals for accessible teams"
ON public.goals FOR DELETE
USING (
  user_id = auth.uid()
  OR public.user_can_access_team(team_id)
);

-- 9. Atualizar policies de vendedores para isolamento por empresa
DROP POLICY IF EXISTS "Users can view vendedores" ON public.sales_reps;
DROP POLICY IF EXISTS "Users can insert vendedores" ON public.sales_reps;
DROP POLICY IF EXISTS "Users can update vendedores" ON public.sales_reps;

CREATE POLICY "Users can view sales reps from same company"
ON public.sales_reps FOR SELECT
USING (public.user_belongs_to_company(company_id));

CREATE POLICY "Users can insert sales reps for same company"
ON public.sales_reps FOR INSERT
WITH CHECK (public.user_belongs_to_company(company_id));

CREATE POLICY "Users can update sales reps for same company"
ON public.sales_reps FOR UPDATE
USING (public.user_belongs_to_company(company_id));

-- 10. Atualizar policies de equipes para isolamento por empresa
DROP POLICY IF EXISTS "Users can view equipes" ON public.teams;
DROP POLICY IF EXISTS "Users can insert equipes" ON public.teams;
DROP POLICY IF EXISTS "Users can update equipes" ON public.teams;

CREATE POLICY "Users can view teams from same company"
ON public.teams FOR SELECT
USING (public.user_belongs_to_company(company_id));

CREATE POLICY "Users can insert teams for same company"
ON public.teams FOR INSERT
WITH CHECK (public.user_belongs_to_company(company_id));

CREATE POLICY "Users can update teams for same company"
ON public.teams FOR UPDATE
USING (public.user_belongs_to_company(company_id));

-- 11. Trigger para atualizar updated_at em user_profiles
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Criar índices para performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_company_id ON public.user_profiles(company_id);
CREATE INDEX idx_habits_team_id ON public.habits(team_id);
CREATE INDEX idx_goals_team_id ON public.goals(team_id);
CREATE INDEX idx_sales_reps_company_id ON public.sales_reps(company_id);
CREATE INDEX idx_teams_company_id ON public.teams(company_id);