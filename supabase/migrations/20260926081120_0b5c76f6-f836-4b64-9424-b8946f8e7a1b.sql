CREATE TABLE public.seo_search_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_url text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  previous_start date NOT NULL,
  previous_end date NOT NULL,
  query_rows jsonb NOT NULL DEFAULT '[]'::jsonb,
  page_rows jsonb NOT NULL DEFAULT '[]'::jsonb,
  totals jsonb NOT NULL DEFAULT '{}'::jsonb,
  refreshed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_search_snapshots TO authenticated;
GRANT ALL ON public.seo_search_snapshots TO service_role;
ALTER TABLE public.seo_search_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read SEO snapshots" ON public.seo_search_snapshots
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can create SEO snapshots" ON public.seo_search_snapshots
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update SEO snapshots" ON public.seo_search_snapshots
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete SEO snapshots" ON public.seo_search_snapshots
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

CREATE TABLE public.seo_ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id uuid NOT NULL REFERENCES public.seo_search_snapshots(id) ON DELETE CASCADE,
  priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  title text NOT NULL,
  evidence text NOT NULL,
  target text NOT NULL,
  action text NOT NULL,
  generated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_ai_recommendations TO authenticated;
GRANT ALL ON public.seo_ai_recommendations TO service_role;
ALTER TABLE public.seo_ai_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read SEO recommendations" ON public.seo_ai_recommendations
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can create SEO recommendations" ON public.seo_ai_recommendations
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update SEO recommendations" ON public.seo_ai_recommendations
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete SEO recommendations" ON public.seo_ai_recommendations
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_seo_search_snapshots_updated_at
  BEFORE UPDATE ON public.seo_search_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_seo_ai_recommendations_updated_at
  BEFORE UPDATE ON public.seo_ai_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "Published portfolio items are public" ON public.portfolio_items;
CREATE POLICY "Published portfolio items are public" ON public.portfolio_items
  FOR SELECT TO anon USING (published);
CREATE POLICY "Staff can read all portfolio items" ON public.portfolio_items
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));