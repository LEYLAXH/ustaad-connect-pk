CREATE TABLE public.tutors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  area TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Karachi',
  rate_per_hour INTEGER NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  contact_phone TEXT,
  contact_email TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.tutors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutors TO authenticated;
GRANT ALL ON public.tutors TO service_role;

ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutors" ON public.tutors FOR SELECT USING (true);
CREATE POLICY "Anyone can add a tutor" ON public.tutors FOR INSERT WITH CHECK (true);

CREATE INDEX tutors_area_idx ON public.tutors (area);
CREATE INDEX tutors_city_idx ON public.tutors (city);