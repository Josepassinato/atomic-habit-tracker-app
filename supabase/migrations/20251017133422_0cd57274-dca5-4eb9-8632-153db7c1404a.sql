-- Remove o campo 'role' inseguro da tabela user_profiles
-- As roles devem vir APENAS da tabela user_roles
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS role;

-- Atualiza a função para não tentar inserir role no user_profiles
CREATE OR REPLACE FUNCTION public.handle_test_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se for o usuário de teste, adiciona role admin e perfil
  IF NEW.email = 'teste@habitus.com' THEN
    -- Adiciona role admin na tabela correta (user_roles)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Cria perfil sem o campo role (removido)
    INSERT INTO public.user_profiles (user_id, email, name)
    VALUES (
      NEW.id, 
      NEW.email,
      'Usuário Teste Admin'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email, name = EXCLUDED.name;
  END IF;
  
  RETURN NEW;
END;
$$;