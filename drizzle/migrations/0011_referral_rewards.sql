CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_user_id uuid,
  referred_name text NOT NULL DEFAULT '',
  referred_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','contacted','booked','converted','rejected')),
  approved boolean NOT NULL DEFAULT false,
  project_value numeric(10,2),
  deposit_paid boolean NOT NULL DEFAULT false,
  converted_at timestamptz,
  admin_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX referrals_email_unique ON public.referrals (lower(referred_email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Referrers read own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id);
CREATE POLICY "Admins manage referrals" ON public.referrals FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.tier_overrides (
  user_id uuid PRIMARY KEY,
  tier_level int NOT NULL CHECK (tier_level BETWEEN 1 AND 7),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tier_overrides TO authenticated;
GRANT ALL ON public.tier_overrides TO service_role;
ALTER TABLE public.tier_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own override" ON public.tier_overrides FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage overrides" ON public.tier_overrides FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.book_teaser_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  book_title text NOT NULL,
  release_date date NOT NULL,
  book_cover_url text,
  book_description text NOT NULL,
  call_to_action text NOT NULL,
  preferred_format text NOT NULL CHECK (preferred_format IN ('vertical','horizontal')),
  book_link text NOT NULL,
  first_edition boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','in_production','delivered','rejected')),
  admin_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX teaser_one_per_book ON public.book_teaser_requests (user_id, lower(book_title));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_teaser_requests TO authenticated;
GRANT ALL ON public.book_teaser_requests TO service_role;
ALTER TABLE public.book_teaser_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own teasers" ON public.book_teaser_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users request teasers" ON public.book_teaser_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'requested');
CREATE POLICY "Admins manage teasers" ON public.book_teaser_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.reward_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reward_activity TO authenticated;
GRANT ALL ON public.reward_activity TO service_role;
ALTER TABLE public.reward_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own activity" ON public.reward_activity FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read activity" ON public.reward_activity FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Conversion rules: approval + deposit required; stamps converted_at; logs activity
CREATE OR REPLACE FUNCTION public.referral_rules() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.referred_user_id IS NOT NULL AND NEW.referred_user_id = NEW.referrer_id THEN
    RAISE EXCEPTION 'Self-referrals are not allowed';
  END IF;
  IF EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = NEW.referrer_id AND lower(p.email) = lower(NEW.referred_email)) THEN
    RAISE EXCEPTION 'Self-referrals are not allowed';
  END IF;
  IF NEW.status = 'converted' THEN
    IF NOT NEW.approved THEN RAISE EXCEPTION 'Approve the referral before marking it converted'; END IF;
    IF NOT NEW.deposit_paid THEN RAISE EXCEPTION 'A referral converts only after the deposit or first invoice is paid'; END IF;
    IF NEW.converted_at IS NULL THEN NEW.converted_at := now(); END IF;
  ELSE
    NEW.converted_at := NULL;
  END IF;
  IF NEW.status = 'rejected' THEN NEW.approved := false; END IF;
  IF TG_OP = 'UPDATE' AND NEW.status = 'converted' AND OLD.status <> 'converted' THEN
    INSERT INTO reward_activity(user_id, activity_type, description)
    VALUES (NEW.referrer_id, 'referral_converted', coalesce(nullif(NEW.referred_name,''), NEW.referred_email) || ' became a paying client.');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER referral_rules BEFORE INSERT OR UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.referral_rules();

-- Auto-log a pending referral when a new account signs up with someone's code
CREATE OR REPLACE FUNCTION public.log_signup_referral() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref uuid;
BEGIN
  IF NEW.referred_by IS NULL THEN RETURN NEW; END IF;
  SELECT user_id INTO ref FROM profiles WHERE referral_code = upper(NEW.referred_by) AND user_id <> NEW.user_id;
  IF ref IS NULL THEN RETURN NEW; END IF;
  INSERT INTO referrals(referrer_id, referred_user_id, referred_name, referred_email)
  VALUES (ref, NEW.user_id, NEW.full_name, NEW.email)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN others THEN RETURN NEW;
END $$;
CREATE TRIGGER log_signup_referral AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.log_signup_referral();

-- Teaser rules: release within the last 6 months, first edition, level 4+
CREATE OR REPLACE FUNCTION public.teaser_rules() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE conv int; ov int;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT NEW.first_edition THEN RAISE EXCEPTION 'Only first-edition titles qualify for a free teaser'; END IF;
    IF NEW.release_date < current_date - interval '6 months' THEN RAISE EXCEPTION 'Requests must be made within 6 months of the release date'; END IF;
    SELECT count(*) INTO conv FROM referrals WHERE referrer_id = NEW.user_id AND status = 'converted';
    SELECT tier_level INTO ov FROM tier_overrides WHERE user_id = NEW.user_id;
    IF conv < 3 AND coalesce(ov,0) < 4 THEN RAISE EXCEPTION 'Book teasers unlock at Level 4'; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER teaser_rules BEFORE INSERT ON public.book_teaser_requests FOR EACH ROW EXECUTE FUNCTION public.teaser_rules();

-- Backfill: existing signups that used a code become pending referrals
INSERT INTO public.referrals(referrer_id, referred_user_id, referred_name, referred_email)
SELECT r.user_id, p.user_id, p.full_name, p.email FROM public.profiles p
JOIN public.profiles r ON r.referral_code = upper(p.referred_by) AND r.user_id <> p.user_id
WHERE p.referred_by IS NOT NULL ON CONFLICT DO NOTHING;

CREATE POLICY "Users upload own covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-covers' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own covers" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'book-covers' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));