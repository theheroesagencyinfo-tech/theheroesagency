CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  referral_code text NOT NULL UNIQUE,
  referred_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.referral_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL CHECK (char_length(code) BETWEEN 4 AND 20),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.referral_visits TO anon, authenticated;
GRANT SELECT ON public.referral_visits TO authenticated;
GRANT ALL ON public.referral_visits TO service_role;
ALTER TABLE public.referral_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone logs a referral visit" ON public.referral_visits FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.referral_code = upper(code)));
CREATE POLICY "Admins read visits" ON public.referral_visits FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.new_referral_code() RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE c text;
BEGIN
  LOOP
    c := 'HERO-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = c);
  END LOOP;
  RETURN c;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r text := upper(NULLIF(NEW.raw_user_meta_data ->> 'ref', ''));
BEGIN
  IF r IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = r) THEN r := NULL; END IF;
  INSERT INTO public.profiles (user_id, email, full_name, referral_code, referred_by)
  VALUES (NEW.id, coalesce(NEW.email, ''), coalesce(NEW.raw_user_meta_data ->> 'full_name', ''), public.new_referral_code(), r)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

INSERT INTO public.profiles (user_id, email, full_name, referral_code)
SELECT u.id, coalesce(u.email, ''), coalesce(u.raw_user_meta_data ->> 'full_name', ''), public.new_referral_code() FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.my_referral_stats() RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH me AS (SELECT referral_code FROM public.profiles WHERE user_id = auth.uid())
  SELECT json_build_object(
    'code', (SELECT referral_code FROM me),
    'visits', (SELECT count(*) FROM public.referral_visits v, me WHERE v.code = me.referral_code),
    'signups', (SELECT count(*) FROM public.profiles p, me WHERE p.referred_by = me.referral_code),
    'projects', (SELECT count(DISTINCT o.id) FROM public.package_orders o JOIN public.profiles p ON lower(p.email) = lower(o.email), me WHERE p.referred_by = me.referral_code)
  )
$$;

CREATE OR REPLACE FUNCTION public.referral_leaderboard() RETURNS TABLE (user_id uuid, email text, full_name text, avatar_url text, referral_code text, referred_by text, created_at timestamptz, visits bigint, signups bigint, projects bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN QUERY SELECT p.user_id, p.email, p.full_name, p.avatar_url, p.referral_code, p.referred_by, p.created_at,
    (SELECT count(*) FROM public.referral_visits v WHERE v.code = p.referral_code),
    (SELECT count(*) FROM public.profiles r WHERE r.referred_by = p.referral_code),
    (SELECT count(DISTINCT o.id) FROM public.package_orders o JOIN public.profiles r ON lower(r.email) = lower(o.email) WHERE r.referred_by = p.referral_code)
  FROM public.profiles p ORDER BY 9 DESC, 8 DESC;
END $$;
GRANT EXECUTE ON FUNCTION public.my_referral_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.referral_leaderboard() TO authenticated;

CREATE POLICY "Avatar public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);