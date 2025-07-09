-- Create audit trail table for compliance
CREATE TABLE public.audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  company_id UUID,
  compliance_flags JSONB DEFAULT '[]'::jsonb
);

-- Create index for performance
CREATE INDEX idx_audit_trail_user_id ON public.audit_trail(user_id);
CREATE INDEX idx_audit_trail_timestamp ON public.audit_trail(timestamp);
CREATE INDEX idx_audit_trail_company_id ON public.audit_trail(company_id);
CREATE INDEX idx_audit_trail_action ON public.audit_trail(action);

-- Enable RLS
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- Create policies for audit trail
CREATE POLICY "Users can view their own audit logs"
ON public.audit_trail
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "System can insert audit logs"
ON public.audit_trail
FOR INSERT
TO authenticated
WITH CHECK (true);

-- No update or delete policies for audit integrity
-- Only admins can access all audit logs

-- Create function to log user actions
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

-- Create privacy settings table
CREATE TABLE public.privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  analytics_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  functional_consent BOOLEAN DEFAULT true,
  ai_processing_consent BOOLEAN DEFAULT false,
  data_retention_days INTEGER DEFAULT 365,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_updated_ip INET,
  consent_version TEXT DEFAULT '1.0'
);

-- Enable RLS
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own privacy settings"
ON public.privacy_settings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own privacy settings"
ON public.privacy_settings
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own privacy settings"
ON public.privacy_settings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_privacy_settings_updated_at
  BEFORE UPDATE ON public.privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create data retention cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired audit logs based on user privacy settings
  DELETE FROM public.audit_trail a
  USING public.privacy_settings p
  WHERE a.user_id = p.user_id
    AND a.timestamp < (now() - (p.data_retention_days || ' days')::interval)
    AND a.compliance_flags ?& array['personal_data']
    AND NOT (a.compliance_flags ?& array['high_risk']);
  
  -- Log cleanup action
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