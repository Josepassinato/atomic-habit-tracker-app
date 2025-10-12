-- Tabela de recompensas Amazon
CREATE TABLE public.amazon_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- 'goal_monthly', 'goal_daily', 'habit_streak', 'level_up', etc
  achievement_level TEXT NOT NULL, -- 'bronze', 'silver', 'gold', 'platinum'
  reward_name TEXT NOT NULL,
  reward_description TEXT,
  amazon_asin TEXT NOT NULL, -- Amazon product ID
  estimated_price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  category TEXT NOT NULL, -- 'electronics', 'books', 'sports', etc
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de recompensas conquistadas/aprovadas
CREATE TABLE public.reward_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.amazon_rewards(id),
  achievement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'purchased', 'rejected'
  affiliate_link TEXT,
  purchase_confirmed BOOLEAN DEFAULT false,
  purchase_date TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Configuração de afiliados Amazon por região
CREATE TABLE public.amazon_affiliate_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL UNIQUE, -- 'BR', 'US', 'ES'
  affiliate_tag TEXT NOT NULL,
  marketplace_domain TEXT NOT NULL, -- 'amazon.com.br', 'amazon.com', 'amazon.es'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.amazon_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amazon_affiliate_config ENABLE ROW LEVEL SECURITY;

-- Policies para amazon_rewards
CREATE POLICY "Empresas podem gerenciar suas recompensas"
ON public.amazon_rewards
FOR ALL
USING (user_belongs_to_company(company_id));

CREATE POLICY "Todos podem ver recompensas ativas"
ON public.amazon_rewards
FOR SELECT
USING (is_active = true);

-- Policies para reward_achievements
CREATE POLICY "Usuários veem suas conquistas"
ON public.reward_achievements
FOR SELECT
USING (user_id = auth.uid() OR user_belongs_to_company(company_id));

CREATE POLICY "Sistema pode criar conquistas"
ON public.reward_achievements
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Gerentes podem aprovar conquistas"
ON public.reward_achievements
FOR UPDATE
USING (user_belongs_to_company(company_id) AND get_current_user_role() IN ('admin', 'gerente'));

-- Policies para amazon_affiliate_config
CREATE POLICY "Admins gerenciam configuração de afiliados"
ON public.amazon_affiliate_config
FOR ALL
USING (is_admin());

CREATE POLICY "Todos podem ver configurações ativas"
ON public.amazon_affiliate_config
FOR SELECT
USING (is_active = true);

-- Trigger para updated_at
CREATE TRIGGER update_amazon_rewards_updated_at
BEFORE UPDATE ON public.amazon_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_amazon_affiliate_config_updated_at
BEFORE UPDATE ON public.amazon_affiliate_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão de afiliados (você precisará atualizar com suas tags reais)
INSERT INTO public.amazon_affiliate_config (region, affiliate_tag, marketplace_domain) VALUES
('BR', 'seutag-20', 'amazon.com.br'),
('US', 'yourtag-20', 'amazon.com'),
('ES', 'tutag-21', 'amazon.es');