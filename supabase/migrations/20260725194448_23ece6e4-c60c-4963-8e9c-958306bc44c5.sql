
-- Tutors: ownership + admin verified flag
ALTER TABLE public.tutors
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

-- Reviews: ownership + one-per-user-per-tutor
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_tutor_user_unique
  ON public.reviews (tutor_id, user_id)
  WHERE user_id IS NOT NULL;

-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Tighten tutors policies
DROP POLICY IF EXISTS "Anyone can add a tutor" ON public.tutors;
CREATE POLICY "Authenticated users can add a tutor" ON public.tutors
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owner or admin can update tutor" ON public.tutors
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Tighten reviews policies
DROP POLICY IF EXISTS "Anyone can add a review" ON public.reviews;
CREATE POLICY "Authenticated users can add a review" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON public.tutors TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.tutors TO authenticated;
GRANT INSERT ON public.reviews TO authenticated;
GRANT UPDATE ON public.tutors TO authenticated;
GRANT ALL ON public.tutors TO service_role;
GRANT ALL ON public.reviews TO service_role;
