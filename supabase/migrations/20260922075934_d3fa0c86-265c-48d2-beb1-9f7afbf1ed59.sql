-- 1. Unified CRM status
CREATE TYPE public.crm_status AS ENUM ('new','contacted','qualified','proposal_sent','in_discussion','won','lost');

ALTER TABLE public.quote_requests ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.quote_requests ALTER COLUMN status TYPE public.crm_status
  USING (CASE status::text
    WHEN 'approved' THEN 'won'
    WHEN 'declined' THEN 'lost'
    WHEN 'completed' THEN 'won'
    ELSE status::text END)::public.crm_status;
ALTER TABLE public.quote_requests ALTER COLUMN status SET DEFAULT 'new';

ALTER TABLE public.contact_leads ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.contact_leads ALTER COLUMN status TYPE public.crm_status
  USING (CASE status::text
    WHEN 'approved' THEN 'won'
    WHEN 'declined' THEN 'lost'
    WHEN 'completed' THEN 'won'
    ELSE status::text END)::public.crm_status;
ALTER TABLE public.contact_leads ALTER COLUMN status SET DEFAULT 'new';

CREATE TYPE public.project_status AS ENUM ('planning','in_progress','review','completed','on_hold','cancelled');

-- 2. Staff directory (populated by staff themselves on sign-in)
CREATE TABLE public.staff_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.staff_profiles TO authenticated;
GRANT ALL ON public.staff_profiles TO service_role;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read staff profiles" ON public.staff_profiles
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Users manage their own staff profile" ON public.staff_profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update their own staff profile" ON public.staff_profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER set_staff_profiles_updated_at BEFORE UPDATE ON public.staff_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX customers_email_key ON public.customers (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX customers_phone_key ON public.customers (phone) WHERE phone IS NOT NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read customers" ON public.customers
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can create customers" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update customers" ON public.customers
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete customers" ON public.customers
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  name text NOT NULL,
  service_type text,
  description text,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.project_status NOT NULL DEFAULT 'planning',
  start_date date,
  due_date date,
  completed_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read projects" ON public.projects
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can create projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX projects_status_idx ON public.projects (status);

-- 5. Service catalogue
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  short_description text,
  description text,
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active services are public" ON public.services
  FOR SELECT USING (active OR (auth.uid() IS NOT NULL AND private.is_staff(auth.uid())));
CREATE POLICY "Staff can create services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update services" ON public.services
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete services" ON public.services
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (name, category, short_description, display_order) VALUES
  ('Digital Presence & Web Solutions', 'Digital & Web Solutions', 'Websites, e-commerce, hosting, domains, professional email and maintenance.', 1),
  ('Branding & Online Brand Presence', 'Branding & Online Presence', 'Brand identity, logos, corporate branding and digital assets.', 2),
  ('Business Technology Solutions', 'Business Technology', 'S&S POS, inventory systems, custom software, dashboards and business applications.', 3),
  ('Digital Marketing & Growth', 'Digital Marketing & Growth', 'SEO, digital marketing, social media and online visibility.', 4),
  ('Professional & Financial Services Solutions', 'Professional & Corporate Solutions', 'Digital solutions for advisors, consultants and financial professionals.', 5),
  ('Corporate & Organisational Solutions', 'Professional & Corporate Solutions', 'Websites, branding and systems for corporates, SMEs, cooperatives and organisations.', 6);

-- 6. Assignment, notes and customer links on existing lead tables
ALTER TABLE public.quote_requests
  ADD COLUMN assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN internal_notes text,
  ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;
ALTER TABLE public.contact_leads
  ADD COLUMN assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN internal_notes text,
  ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

-- 7. Lightweight activity log
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read activity" ON public.activity_log
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE INDEX activity_log_created_idx ON public.activity_log (created_at DESC);

CREATE OR REPLACE FUNCTION private.log_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_action text;
  v_detail text;
BEGIN
  IF TG_TABLE_NAME = 'portfolio_items' THEN
    IF TG_OP = 'INSERT' THEN v_action := 'portfolio_created'; v_detail := NEW.title;
    ELSIF TG_OP = 'DELETE' THEN
      INSERT INTO public.activity_log (actor_id, action, entity_type, entity_id, detail)
      VALUES (auth.uid(), 'portfolio_deleted', TG_TABLE_NAME, OLD.id, OLD.title);
      RETURN OLD;
    ELSIF NEW.published IS DISTINCT FROM OLD.published THEN
      v_action := CASE WHEN NEW.published THEN 'portfolio_published' ELSE 'portfolio_hidden' END;
      v_detail := NEW.title;
    ELSE RETURN NEW;
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    v_action := TG_TABLE_NAME || '_created';
  ELSIF TG_TABLE_NAME = 'projects' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := 'project_status_changed'; v_detail := OLD.status || ' -> ' || NEW.status;
    ELSIF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      v_action := 'project_assigned';
    ELSE RETURN NEW;
    END IF;
  ELSE
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := TG_TABLE_NAME || '_status_changed'; v_detail := OLD.status || ' -> ' || NEW.status;
    ELSIF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      v_action := TG_TABLE_NAME || '_assigned';
    ELSE RETURN NEW;
    END IF;
  END IF;

  INSERT INTO public.activity_log (actor_id, action, entity_type, entity_id, detail)
  VALUES (auth.uid(), v_action, TG_TABLE_NAME, NEW.id, v_detail);
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION private.log_activity() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER log_quote_requests AFTER UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION private.log_activity();
CREATE TRIGGER log_contact_leads AFTER UPDATE ON public.contact_leads
  FOR EACH ROW EXECUTE FUNCTION private.log_activity();
CREATE TRIGGER log_projects AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION private.log_activity();
CREATE TRIGGER log_portfolio AFTER INSERT OR UPDATE OR DELETE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION private.log_activity();