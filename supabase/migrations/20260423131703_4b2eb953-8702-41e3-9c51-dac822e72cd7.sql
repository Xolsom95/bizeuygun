-- Drop previous attempt artifacts
DROP VIEW IF EXISTS public.profiles_public;

-- Make sure base table stays authenticated-only
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Create the safe public view (SECURITY DEFINER by default — runs as view owner,
-- so it bypasses the base-table RLS, but only exposes the safe columns)
CREATE VIEW public.profiles_public AS
SELECT
  id,
  user_id,
  upper(
    left(split_part(name, ' ', 1), 1) ||
    CASE
      WHEN position(' ' in name) > 0
        THEN left(split_part(name, ' ', -1), 1)
      ELSE ''
    END
  ) AS initials,
  age,
  job,
  city,
  district,
  avatar_url,
  created_at
FROM public.profiles;

-- Grant read access to anon and authenticated
GRANT SELECT ON public.profiles_public TO anon, authenticated;