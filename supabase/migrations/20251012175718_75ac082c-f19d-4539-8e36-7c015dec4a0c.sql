-- Create CRM integrations table
CREATE TABLE IF NOT EXISTS public.crm_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('salesforce', 'hubspot', 'pipedrive')),
  api_key TEXT NOT NULL,
  instance_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'hourly' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')),
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, provider)
);

-- Add external tracking columns to sales_reps
ALTER TABLE public.sales_reps ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE public.sales_reps ADD COLUMN IF NOT EXISTS external_source TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_sales_reps_external ON public.sales_reps(external_id, external_source) WHERE external_id IS NOT NULL;

-- Create ROI analytics table
CREATE TABLE IF NOT EXISTS public.roi_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  sales_rep_id UUID REFERENCES public.sales_reps(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  habits_completed INTEGER DEFAULT 0,
  habits_target INTEGER DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  revenue_target NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  habit_completion_rate NUMERIC DEFAULT 0,
  roi_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, team_id, sales_rep_id, period_start, period_end)
);

-- Add unique constraint to onboarding_templates if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'onboarding_templates_name_segment_key'
  ) THEN
    ALTER TABLE public.onboarding_templates ADD CONSTRAINT onboarding_templates_name_segment_key UNIQUE (name, segment);
  END IF;
END $$;

-- Insert templates with proper handling
INSERT INTO public.onboarding_templates (name, segment, description, default_habits, default_goals, suggested_integrations) 
SELECT * FROM (VALUES
  (
    'SaaS Sales Excellence',
    'SaaS',
    'Template otimizado para empresas SaaS com ciclo de vendas médio (30-90 dias)',
    '[
      {"title": "Daily Product Demo Practice", "description": "Practice 15min demo of key features", "recurrence": "diario", "verification_required": true},
      {"title": "Prospect 10 Qualified Leads", "description": "Research and add 10 leads matching ICP to CRM", "recurrence": "diario", "verification_required": false},
      {"title": "Follow-up 5 Warm Leads", "description": "Send personalized follow-ups to engaged prospects", "recurrence": "diario", "verification_required": false},
      {"title": "Weekly Value-Add Touchpoint", "description": "Share relevant content with prospects (case study, article)", "recurrence": "semanal", "verification_required": false},
      {"title": "Competitor Analysis Review", "description": "Review competitor updates and positioning", "recurrence": "semanal", "verification_required": false}
    ]'::jsonb,
    '[
      {"name": "Monthly MRR Target", "type": "vendas", "target_value": 50000},
      {"name": "Qualified Demos Booked", "type": "atividades", "target_value": 20},
      {"name": "Trial-to-Paid Conversion", "type": "conversao", "target_value": 25}
    ]'::jsonb,
    '[
      {"name": "HubSpot", "description": "Sync contacts, deals, and activities"},
      {"name": "Salesforce", "description": "Enterprise CRM integration"},
      {"name": "Calendly", "description": "Track demo bookings automatically"}
    ]'::jsonb
  ),
  (
    'Retail & E-commerce',
    'Varejo',
    'Template para equipes de vendas no varejo físico e online',
    '[
      {"title": "Morning Product Knowledge Quiz", "description": "5min quiz on new products and promotions", "recurrence": "diario", "verification_required": true},
      {"title": "Customer Success Stories Share", "description": "Document one customer success story", "recurrence": "diario", "verification_required": false},
      {"title": "Upsell 3 Existing Customers", "description": "Reach out to customers with complementary products", "recurrence": "diario", "verification_required": false},
      {"title": "Store Walkthrough", "description": "Check merchandising and identify improvement opportunities", "recurrence": "diario", "verification_required": false},
      {"title": "Inventory & Trends Review", "description": "Review best sellers and stock levels", "recurrence": "semanal", "verification_required": false}
    ]'::jsonb,
    '[
      {"name": "Weekly Sales Revenue", "type": "vendas", "target_value": 25000},
      {"name": "Average Ticket Value", "type": "ticket_medio", "target_value": 150},
      {"name": "Customer Satisfaction Score", "type": "satisfacao", "target_value": 4.5}
    ]'::jsonb,
    '[
      {"name": "Shopify", "description": "E-commerce sales sync"},
      {"name": "PipeDrive", "description": "Sales pipeline management"},
      {"name": "Google Analytics", "description": "Track online conversion metrics"}
    ]'::jsonb
  ),
  (
    'Insurance & Financial Services',
    'Seguros',
    'Template para vendas consultivas de seguros e serviços financeiros',
    '[
      {"title": "Client Portfolio Review", "description": "Review 5 client files for upsell opportunities", "recurrence": "diario", "verification_required": false},
      {"title": "Regulatory Update Study", "description": "15min reading on industry regulations and compliance", "recurrence": "diario", "verification_required": true},
      {"title": "Referral Request Calls", "description": "Ask 3 satisfied clients for referrals", "recurrence": "diario", "verification_required": false},
      {"title": "Risk Assessment Practice", "description": "Complete practice risk assessment scenarios", "recurrence": "semanal", "verification_required": true},
      {"title": "Market Trends Analysis", "description": "Review economic indicators affecting insurance needs", "recurrence": "semanal", "verification_required": false}
    ]'::jsonb,
    '[
      {"name": "Monthly Premium Revenue", "type": "vendas", "target_value": 75000},
      {"name": "New Policies Sold", "type": "apolices", "target_value": 15},
      {"name": "Client Retention Rate", "type": "retencao", "target_value": 95}
    ]'::jsonb,
    '[
      {"name": "Salesforce Financial Services", "description": "Industry-specific CRM"},
      {"name": "DocuSign", "description": "Digital signatures for contracts"},
      {"name": "Zendesk", "description": "Client support integration"}
    ]'::jsonb
  )
) AS v(name, segment, description, default_habits, default_goals, suggested_integrations)
WHERE NOT EXISTS (
  SELECT 1 FROM public.onboarding_templates t 
  WHERE t.name = v.name AND t.segment = v.segment
);

-- Enable RLS
ALTER TABLE public.crm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roi_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_integrations
CREATE POLICY "Users can view CRM integrations from same company"
  ON public.crm_integrations FOR SELECT
  USING (user_belongs_to_company(company_id));

CREATE POLICY "Admins and managers can manage CRM integrations"
  ON public.crm_integrations FOR ALL
  USING (
    user_belongs_to_company(company_id) AND 
    get_current_user_role() IN ('admin', 'gerente')
  );

-- RLS Policies for roi_analytics
CREATE POLICY "Users can view ROI analytics from same company"
  ON public.roi_analytics FOR SELECT
  USING (user_belongs_to_company(company_id));

CREATE POLICY "System can insert ROI analytics"
  ON public.roi_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage ROI analytics"
  ON public.roi_analytics FOR ALL
  USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_crm_integrations_updated_at
  BEFORE UPDATE ON public.crm_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate ROI score
CREATE OR REPLACE FUNCTION public.calculate_roi_score(
  p_company_id UUID,
  p_period_start DATE,
  p_period_end DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.roi_analytics (
    company_id,
    team_id,
    sales_rep_id,
    period_start,
    period_end,
    habits_completed,
    revenue_generated,
    habit_completion_rate,
    roi_score
  )
  SELECT 
    sr.company_id,
    sr.team_id,
    sr.id as sales_rep_id,
    p_period_start,
    p_period_end,
    COUNT(h.id) FILTER (WHERE h.completed = true) as habits_completed,
    sr.total_sales as revenue_generated,
    ROUND((COUNT(h.id) FILTER (WHERE h.completed = true)::numeric / NULLIF(COUNT(h.id), 0) * 100), 2) as habit_completion_rate,
    ROUND((sr.total_sales / NULLIF(COUNT(h.id) FILTER (WHERE h.completed = true), 0)), 2) as roi_score
  FROM public.sales_reps sr
  LEFT JOIN public.habits h ON h.user_id = sr.id::text::uuid 
    AND h.created_at BETWEEN p_period_start AND p_period_end
  WHERE sr.company_id = p_company_id
  GROUP BY sr.id, sr.company_id, sr.team_id, sr.total_sales
  ON CONFLICT (company_id, team_id, sales_rep_id, period_start, period_end) 
  DO UPDATE SET
    habits_completed = EXCLUDED.habits_completed,
    revenue_generated = EXCLUDED.revenue_generated,
    habit_completion_rate = EXCLUDED.habit_completion_rate,
    roi_score = EXCLUDED.roi_score;
END;
$$;
