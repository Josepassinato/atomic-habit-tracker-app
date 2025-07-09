-- Improve RLS policies that are too permissive
-- Create security definer functions to avoid recursion

-- Function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'user') FROM public.user_profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update admin_settings policies to be more restrictive
DROP POLICY IF EXISTS "Apenas administradores podem acessar configurações" ON public.admin_settings;

CREATE POLICY "Only admins can access admin settings"
ON public.admin_settings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update companies policies to require authentication
DROP POLICY IF EXISTS "Users can view empresas" ON public.companies;
DROP POLICY IF EXISTS "Users can insert empresas" ON public.companies;
DROP POLICY IF EXISTS "Users can update empresas" ON public.companies;

CREATE POLICY "Authenticated users can view companies"
ON public.companies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can insert companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update companies"
ON public.companies
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Update settings policies
DROP POLICY IF EXISTS "Users can view their config" ON public.settings;
DROP POLICY IF EXISTS "Users can insert their config" ON public.settings;
DROP POLICY IF EXISTS "Users can update their config" ON public.settings;

CREATE POLICY "Users can view their own settings"
ON public.settings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own settings"
ON public.settings
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own settings"
ON public.settings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Update user_dashboard_widgets policies
DROP POLICY IF EXISTS "Users can view their widgets" ON public.user_dashboard_widgets;
DROP POLICY IF EXISTS "Users can insert their widgets" ON public.user_dashboard_widgets;
DROP POLICY IF EXISTS "Users can update their widgets" ON public.user_dashboard_widgets;

CREATE POLICY "Users can view their own widgets"
ON public.user_dashboard_widgets
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own widgets"
ON public.user_dashboard_widgets
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own widgets"
ON public.user_dashboard_widgets
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Update team_habits policies to be more restrictive
DROP POLICY IF EXISTS "Users can view habitos_equipe" ON public.team_habits;
DROP POLICY IF EXISTS "Users can insert habitos_equipe" ON public.team_habits;
DROP POLICY IF EXISTS "Users can update habitos_equipe" ON public.team_habits;
DROP POLICY IF EXISTS "Users can delete habitos_equipe" ON public.team_habits;

CREATE POLICY "Users can view team habits for accessible teams"
ON public.team_habits
FOR SELECT
TO authenticated
USING (user_can_access_team(team_id));

CREATE POLICY "Users can insert team habits for accessible teams"
ON public.team_habits
FOR INSERT
TO authenticated
WITH CHECK (user_can_access_team(team_id));

CREATE POLICY "Users can update team habits for accessible teams"
ON public.team_habits
FOR UPDATE
TO authenticated
USING (user_can_access_team(team_id));

CREATE POLICY "Users can delete team habits for accessible teams"
ON public.team_habits
FOR DELETE
TO authenticated
USING (user_can_access_team(team_id));