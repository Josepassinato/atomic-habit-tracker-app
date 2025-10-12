-- ========================================
-- CRITICAL SECURITY FIX: Separate User Roles Table
-- ========================================

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'gerente', 'vendedor');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create SECURITY DEFINER function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- FIX: Add search_path to SECURITY DEFINER functions
-- ========================================

-- Fix get_current_user_role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    'vendedor'
  );
$$;

-- Fix is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Fix user_belongs_to_company
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
      AND (up.company_id = target_company_id OR public.is_admin())
  );
$$;

-- Fix user_can_access_team
CREATE OR REPLACE FUNCTION public.user_can_access_team(target_team_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles profile
    WHERE profile.user_id = auth.uid()
      AND (
        public.is_admin()
        OR (public.has_role(auth.uid(), 'gerente') AND profile.company_id = (
          SELECT company_id FROM teams WHERE id = target_team_id
        ))
        OR (profile.team_ids ? target_team_id::text)
      )
  );
$$;

-- Fix get_current_user_profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(user_id UUID, company_id UUID, role TEXT, team_ids JSONB)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    up.user_id,
    up.company_id,
    COALESCE(
      (SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = auth.uid() LIMIT 1),
      'vendedor'
    ) as role,
    COALESCE(up.team_ids, '[]'::jsonb) as team_ids
  FROM public.user_profiles up
  WHERE up.user_id = auth.uid();
$$;

-- ========================================
-- Migrate existing roles from user_profiles to user_roles
-- ========================================
INSERT INTO public.user_roles (user_id, role)
SELECT 
  user_id,
  CASE 
    WHEN role = 'admin' THEN 'admin'::public.app_role
    WHEN role = 'gerente' THEN 'gerente'::public.app_role
    ELSE 'vendedor'::public.app_role
  END
FROM public.user_profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Create trigger to update updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);