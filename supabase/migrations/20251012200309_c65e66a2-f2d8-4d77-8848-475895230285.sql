-- Fix remaining SECURITY DEFINER functions missing search_path

CREATE OR REPLACE FUNCTION public.log_user_action(
  p_action TEXT, 
  p_resource_type TEXT, 
  p_resource_id UUID DEFAULT NULL, 
  p_old_values JSONB DEFAULT NULL, 
  p_new_values JSONB DEFAULT NULL, 
  p_company_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_trail (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    company_id,
    compliance_flags
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    COALESCE(p_company_id, (SELECT company_id FROM public.user_profiles WHERE user_id = auth.uid())),
    CASE 
      WHEN p_action IN ('DELETE', 'EXPORT_DATA', 'DELETE_ACCOUNT') THEN '["high_risk"]'::jsonb
      WHEN p_resource_type = 'user_profiles' THEN '["personal_data"]'::jsonb
      ELSE '[]'::jsonb
    END
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.audit_trail a
  USING public.privacy_settings p
  WHERE a.user_id = p.user_id
    AND a.timestamp < (now() - (p.data_retention_days || ' days')::interval)
    AND a.compliance_flags ?& array['personal_data']
    AND NOT (a.compliance_flags ?& array['high_risk']);
  
  INSERT INTO public.audit_trail (
    user_id,
    action,
    resource_type,
    resource_id,
    new_values,
    compliance_flags
  ) VALUES (
    NULL,
    'DATA_CLEANUP',
    'system',
    NULL,
    jsonb_build_object('cleanup_timestamp', now()),
    '["automated", "data_retention"]'::jsonb
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_roi_score(
  p_company_id UUID, 
  p_period_start DATE, 
  p_period_end DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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