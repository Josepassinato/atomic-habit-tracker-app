-- Create demo_appointments table for scheduling demonstrations
CREATE TABLE IF NOT EXISTS public.demo_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  company_size TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create appointments (public form)
CREATE POLICY "Anyone can create demo appointments"
ON public.demo_appointments
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can view all appointments
CREATE POLICY "Admins can view all demo appointments"
ON public.demo_appointments
FOR SELECT
USING (public.is_admin());

-- Policy: Only admins can update appointments
CREATE POLICY "Admins can update demo appointments"
ON public.demo_appointments
FOR UPDATE
USING (public.is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_demo_appointments_updated_at
BEFORE UPDATE ON public.demo_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_demo_appointments_date ON public.demo_appointments(scheduled_date);
CREATE INDEX idx_demo_appointments_status ON public.demo_appointments(status);