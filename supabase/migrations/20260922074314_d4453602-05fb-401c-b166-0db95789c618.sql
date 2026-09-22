CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','manager','staff','content_manager')
  )
$$;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION private.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Staff can read quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Staff can update quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Staff can read contact leads" ON public.contact_leads;
DROP POLICY IF EXISTS "Staff can update contact leads" ON public.contact_leads;
CREATE POLICY "Staff can read quote requests" ON public.quote_requests
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update quote requests" ON public.quote_requests
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can read contact leads" ON public.contact_leads
  FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update contact leads" ON public.contact_leads
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can update portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can delete portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Published portfolio items are public" ON public.portfolio_items;
CREATE POLICY "Published portfolio items are public" ON public.portfolio_items
  FOR SELECT USING (published OR (auth.uid() IS NOT NULL AND private.is_staff(auth.uid())));
CREATE POLICY "Admins can insert portfolio items" ON public.portfolio_items
  FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can update portfolio items" ON public.portfolio_items
  FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete portfolio items" ON public.portfolio_items
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;
CREATE POLICY "Admins can upload portfolio images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio' AND private.is_staff(auth.uid()));
CREATE POLICY "Admins can update portfolio images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'portfolio' AND private.is_staff(auth.uid()));
CREATE POLICY "Admins can delete portfolio images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'portfolio' AND private.is_staff(auth.uid()));

DROP FUNCTION IF EXISTS public.is_staff(uuid);
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);