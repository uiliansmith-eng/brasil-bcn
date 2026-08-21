-- ============================================================
-- REFERRALS
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN referral_code TEXT UNIQUE,
  ADD COLUMN referred_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX idx_profiles_referred_by ON profiles(referred_by);

-- Backfill existing users with a code derived from their id
UPDATE profiles SET referral_code = substr(replace(id::text, '-', ''), 1, 8) WHERE referral_code IS NULL;

ALTER TABLE profiles ALTER COLUMN referral_code SET NOT NULL;

-- Assign a code to new signups and resolve the inviting profile from
-- the ?ref=<code> value forwarded as auth metadata (see middleware.ts)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  ref_profile_id UUID;
BEGIN
  IF NEW.raw_user_meta_data->>'ref' IS NOT NULL THEN
    SELECT id INTO ref_profile_id
    FROM public.profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'ref';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    substr(replace(NEW.id::text, '-', ''), 1, 8),
    ref_profile_id
  );
  RETURN NEW;
END;
$function$;
