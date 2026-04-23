-- Add columns to contact_submissions for System Audit lead enrichment
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS lead_type text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS store_type text,
  ADD COLUMN IF NOT EXISTS goals text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS assigned_reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_lead_type ON public.contact_submissions(lead_type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_reviewer ON public.contact_submissions(assigned_reviewer_id);
