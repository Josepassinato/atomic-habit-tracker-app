-- Habilitar real-time para todas as tabelas principais
ALTER TABLE public.habits REPLICA IDENTITY FULL;
ALTER TABLE public.goals REPLICA IDENTITY FULL;
ALTER TABLE public.sales_reps REPLICA IDENTITY FULL;
ALTER TABLE public.teams REPLICA IDENTITY FULL;

-- Adicionar tabela para templates de onboarding
CREATE TABLE public.onboarding_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment TEXT NOT NULL,
  description TEXT,
  default_habits JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggested_integrations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de templates
ALTER TABLE public.onboarding_templates ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de templates por todos
CREATE POLICY "Templates são visíveis para todos" 
ON public.onboarding_templates 
FOR SELECT 
USING (true);

-- Adicionar coluna para rastreamento de verificação automática
ALTER TABLE public.habits ADD COLUMN auto_verified BOOLEAN DEFAULT false;
ALTER TABLE public.habits ADD COLUMN verification_score NUMERIC DEFAULT NULL;
ALTER TABLE public.habits ADD COLUMN verification_notes TEXT DEFAULT NULL;

-- Trigger para updated_at em templates
CREATE TRIGGER update_onboarding_templates_updated_at
BEFORE UPDATE ON public.onboarding_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir templates padrão por segmento
INSERT INTO public.onboarding_templates (name, segment, description, default_habits, default_goals, suggested_integrations) VALUES
('Vendas B2B Tech', 'tecnologia', 'Template otimizado para empresas de tecnologia B2B', 
 '[
   {"title": "Prospecção Matinal", "description": "15 mins de prospecção focada", "schedule": "09:00"},
   {"title": "Follow-up CRM", "description": "Atualizar todos os contatos no CRM", "schedule": "17:00"},
   {"title": "LinkedIn Outreach", "description": "5 conexões qualificadas no LinkedIn", "schedule": "14:00"}
 ]'::jsonb,
 '[
   {"name": "Meta Mensal Vendas", "target": 50000, "type": "vendas"},
   {"name": "Demos Semanais", "target": 10, "type": "atividades"}
 ]'::jsonb,
 '["HubSpot", "LinkedIn Sales Navigator", "Slack"]'::jsonb),

('Vendas Consultiva', 'consultoria', 'Para empresas de consultoria e serviços profissionais',
 '[
   {"title": "Research de Cliente", "description": "Pesquisar background antes das reuniões", "schedule": "08:30"},
   {"title": "Proposta Personalizada", "description": "Criar proposta baseada em descoberta", "schedule": "16:00"},
   {"title": "Follow-up Pós-Reunião", "description": "Enviar resumo em 2h após reunião", "schedule": "imediato"}
 ]'::jsonb,
 '[
   {"name": "Contratos Fechados", "target": 3, "type": "vendas"},
   {"name": "Pipeline Qualificado", "target": 100000, "type": "oportunidades"}
 ]'::jsonb,
 '["Pipedrive", "Calendly", "DocuSign"]'::jsonb),

('Vendas Varejo', 'varejo', 'Para equipes de vendas em varejo e e-commerce',
 '[
   {"title": "Análise de Concorrência", "description": "Verificar preços da concorrência", "schedule": "10:00"},
   {"title": "Atendimento Proativo", "description": "Contatar leads abandono de carrinho", "schedule": "15:00"},
   {"title": "Upsell Ativo", "description": "Identificar oportunidades de upsell", "schedule": "13:00"}
 ]'::jsonb,
 '[
   {"name": "Vendas Diárias", "target": 5000, "type": "vendas"},
   {"name": "Conversão", "target": 15, "type": "percentual"}
 ]'::jsonb,
 '["Shopify", "WooCommerce", "WhatsApp Business"]'::jsonb);