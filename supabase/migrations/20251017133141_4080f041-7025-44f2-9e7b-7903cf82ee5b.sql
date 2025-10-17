-- Função para adicionar role admin automaticamente para usuários de teste
CREATE OR REPLACE FUNCTION public.handle_test_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se for o usuário de teste, adiciona role admin e perfil
  IF NEW.email = 'teste@habitus.com' THEN
    -- Adiciona role admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Cria perfil se não existir
    INSERT INTO public.user_profiles (user_id, email, name, role)
    VALUES (
      NEW.id, 
      NEW.email,
      'Usuário Teste Admin',
      'admin'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para executar a função quando um usuário fizer signup
DROP TRIGGER IF EXISTS on_test_user_created ON auth.users;
CREATE TRIGGER on_test_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_test_user_signup();