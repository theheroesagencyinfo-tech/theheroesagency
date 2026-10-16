CREATE TABLE public.project_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project text NOT NULL CHECK (project IN ('daniel-carter','eleanor-whitmore','jonathan-reed')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 1000),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.project_reviews TO service_role;
ALTER TABLE public.project_reviews ENABLE ROW LEVEL SECURITY;