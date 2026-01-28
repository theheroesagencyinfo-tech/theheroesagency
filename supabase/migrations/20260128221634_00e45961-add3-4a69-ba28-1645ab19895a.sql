-- Create enum for review status
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  star_rating INTEGER NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
  message TEXT NOT NULL,
  email TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'pending',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on both tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for reviews updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for reviews

-- Anyone can insert reviews (for public form submission)
CREATE POLICY "Anyone can submit reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Public can only read approved reviews, admins can read all
CREATE POLICY "Public reads approved, admins read all"
  ON public.reviews
  FOR SELECT
  USING (
    status = 'approved' OR public.is_admin()
  );

-- Only admins can update reviews
CREATE POLICY "Admins can update reviews"
  ON public.reviews
  FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete reviews
CREATE POLICY "Admins can delete reviews"
  ON public.reviews
  FOR DELETE
  USING (public.is_admin());

-- RLS Policies for user_roles

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.is_admin());

-- Create view for public approved reviews (hides email)
CREATE VIEW public.approved_reviews
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  company,
  star_rating,
  message,
  is_featured,
  created_at
FROM public.reviews
WHERE status = 'approved';

-- Create index for faster queries
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_reviews_featured ON public.reviews(is_featured) WHERE is_featured = true;