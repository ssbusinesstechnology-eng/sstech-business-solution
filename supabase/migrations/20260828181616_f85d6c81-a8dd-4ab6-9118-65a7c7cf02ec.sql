CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RETURN false;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(_uid, 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  caption text,
  tags text[] NOT NULL DEFAULT '{}',
  image_path text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published portfolio items are public"
  ON public.portfolio_items FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert portfolio items"
  ON public.portfolio_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio items"
  ON public.portfolio_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio items"
  ON public.portfolio_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Portfolio images are readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.portfolio_items (title, category, caption, tags, sort_order) VALUES
  ('Creative Vibes — Day Event Poster', 'Event & Occasion Posters', 'Bold day-party poster designed for social sharing.', ARRAY['poster','event','social'], 10),
  ('Nairobi Nights — Club Flyer', 'Event & Occasion Posters', 'High-contrast club flyer built for Instagram stories.', ARRAY['flyer','nightlife'], 20),
  ('Harvest Sunday — Church Poster', 'Event & Occasion Posters', 'Warm, welcoming church service announcement.', ARRAY['church','poster'], 30),
  ('Team Victor Campaign', 'Political & Campaign Branding', 'Candidate identity and rally poster system.', ARRAY['campaign','branding'], 40),
  ('Ward Rally — Civic Awareness', 'Political & Campaign Branding', 'Civic awareness creative for a ward-level rally.', ARRAY['campaign','civic'], 50),
  ('Merry & Bright — Festive Card', 'Festive & Personal Greetings', 'Festive greeting card for a corporate client.', ARRAY['festive','greeting'], 60),
  ('Eid Mubarak Greeting', 'Festive & Personal Greetings', 'Elegant Eid greeting for social channels.', ARRAY['festive','greeting'], 70),
  ('Pizza Time Product Poster', 'Business & Organisational Ads', 'Appetite-first product promotion poster.', ARRAY['product','ad'], 80),
  ('We Are Hiring — Recruitment Ad', 'Business & Organisational Ads', 'Clean recruitment ad formatted for LinkedIn.', ARRAY['recruitment','ad'], 90);