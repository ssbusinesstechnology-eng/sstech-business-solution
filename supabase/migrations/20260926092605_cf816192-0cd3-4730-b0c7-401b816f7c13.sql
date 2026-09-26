DROP FUNCTION IF EXISTS public.claim_admin();

DROP POLICY IF EXISTS "Portfolio images are readable" ON storage.objects;
CREATE POLICY "Staff can read portfolio images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio' AND private.is_staff(auth.uid()));