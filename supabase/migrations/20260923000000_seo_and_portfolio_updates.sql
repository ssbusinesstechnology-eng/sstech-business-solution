-- Create SEO recommendations table
CREATE TABLE IF NOT EXISTS public.seo_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  advice text NOT NULL,
  impact_area text NOT NULL,
  is_implemented boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grant permissions
GRANT SELECT ON public.seo_recommendations TO anon;
GRANT ALL ON public.seo_recommendations TO authenticated;
GRANT ALL ON public.seo_recommendations TO service_role;

-- Enable RLS
ALTER TABLE public.seo_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view SEO recommendations"
  ON public.seo_recommendations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage SEO recommendations"
  ON public.seo_recommendations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed SEO recommendations
INSERT INTO public.seo_recommendations (title, category, priority, advice, impact_area) VALUES
  ('Optimize Meta Titles', 'Technical SEO', 'high', 'Ensure every page has a unique, descriptive meta title under 60 characters.', 'Search CTR'),
  ('Add Alt Text to Images', 'Content SEO', 'medium', 'Include descriptive alt text for all portfolio items to improve image search visibility.', 'Accessibility & Image Search'),
  ('Improve Page Load Speed', 'Performance', 'high', 'Optimize large image assets and ensure proper caching headers are set.', 'User Experience'),
  ('Nairobi Keyword Optimization', 'Local SEO', 'high', 'Naturally integrate keywords like "Web Design Nairobi" and "Graphic Design Kenya" into service page copy.', 'Local Visibility');

-- Seed more portfolio items
INSERT INTO public.portfolio_items (title, category, caption, tags, sort_order) VALUES
  ('SME Hub E-commerce', 'Websites', 'A complete online store solution for a local retail business.', ARRAY['ecommerce', 'web', 'retail'], 5),
  ('Greenleaf Organic Logo', 'Branding & Logos', 'Clean, modern brand identity for an organic food startup.', ARRAY['branding', 'logo', 'organic'], 15),
  ('S&S POS v2 - Cloud Sync', 'Business Systems & POS', 'Latest version of our POS system with real-time cloud synchronization.', ARRAY['pos', 'software', 'cloud'], 25),
  ('Apex Consulting Portfolio', 'Websites', 'Professional portfolio for a financial consultancy firm.', ARRAY['web', 'portfolio', 'finance'], 35);
