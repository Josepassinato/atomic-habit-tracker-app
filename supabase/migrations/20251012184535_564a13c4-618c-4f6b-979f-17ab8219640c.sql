-- Enable realtime for habits table
ALTER TABLE public.habits REPLICA IDENTITY FULL;

-- Enable realtime for goals table
ALTER TABLE public.goals REPLICA IDENTITY FULL;

-- Add habits table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.habits;

-- Add goals table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;