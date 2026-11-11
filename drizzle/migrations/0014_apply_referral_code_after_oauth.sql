-- Google sign-in creates the account before any app code runs, so a referral code cannot be
-- carried in auth metadata the way email signup does. A signed-in client applies the
-- code it arrived with. Only brand-new, still-unattributed accounts may claim one,
-- and never their own code.
CREATE OR REPLACE FUNCTION public.apply_referral_code(p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_code text := upper(btrim(coalesce(p_code, '')));
  v_referrer uuid;
  v_me record;
BEGIN
  IF v_code !~ '^HERO-[A-Z0-9]{6}$' THEN RETURN false; END IF;

  SELECT user_id INTO v_referrer FROM public.profiles WHERE referral_code = v_code;
  IF v_referrer IS NULL THEN RETURN false; END IF;

  SELECT user_id, referred_by, created_at, full_name, email INTO v_me
    FROM public.profiles WHERE user_id = auth.uid();
  IF v_me.user_id IS NULL THEN RETURN false; END IF;
  IF v_me.referred_by IS NOT NULL THEN RETURN false; END IF;
  IF v_me.created_at < now() - interval '30 minutes' THEN RETURN false; END IF;
  IF v_me.user_id = v_referrer THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = v_referrer AND lower(p.email) = lower(v_me.email)) THEN RETURN false; END IF;

  UPDATE public.profiles SET referred_by = v_code WHERE user_id = v_me.user_id;
  INSERT INTO public.referrals (referrer_id, referred_user_id, referred_name, referred_email)
    VALUES (v_referrer, v_me.user_id, v_me.full_name, v_me.email)
    ON CONFLICT DO NOTHING;
  RETURN true;
END
$function$;

REVOKE EXECUTE ON FUNCTION public.apply_referral_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;