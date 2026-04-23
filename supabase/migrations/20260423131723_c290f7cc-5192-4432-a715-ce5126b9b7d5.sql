-- Recreate view with security_invoker so it respects caller's RLS / column grants
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public
WITH (security_invoker = true) AS
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

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Add anon SELECT policy (row-level allow-all). Column-level grants below
-- will restrict which columns anon can actually read.
DROP POLICY IF EXISTS "Profiles readable by anon (column restricted)" ON public.profiles;
CREATE POLICY "Profiles readable by anon (column restricted)"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);

-- Reset and re-apply column-level privileges for anon: only safe columns.
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT (id, user_id, name, age, job, city, district, avatar_url, created_at)
  ON public.profiles TO anon;