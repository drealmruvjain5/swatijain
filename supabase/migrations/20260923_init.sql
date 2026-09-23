-- Master SQL Initialization Script (Phase 10: Secure Image Storage)
-- You can run this entire script safely. It will update existing structures or create them if missing.

-- 1. Create the 'writings' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.writings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    category TEXT CHECK (category IN ('poem', 'essay', 'story', 'blog', 'reflection')) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
    cover_image TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create the 'site_settings' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    author_name TEXT NOT NULL DEFAULT 'Author Name',
    bio TEXT,
    contact_email TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.writings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Clean up old table RLS policies to prevent conflicts
DROP POLICY IF EXISTS "Public can view published writings" ON public.writings;
DROP POLICY IF EXISTS "Author has full access to writings" ON public.writings;
DROP POLICY IF EXISTS "Public can view settings" ON public.site_settings;
DROP POLICY IF EXISTS "Author has full access to settings" ON public.site_settings;

-- 5. Create fresh Table RLS Policies
CREATE POLICY "Public can view published writings" 
ON public.writings FOR SELECT 
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Author has full access to writings" 
ON public.writings FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view settings" 
ON public.site_settings FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Author has full access to settings" 
ON public.site_settings FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. Setup Secure Storage Bucket
-- Create the bucket if it doesn't exist, and force it to be PRIVATE (public = false)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 7. Clean up old storage policies to prevent conflicts
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Author can manage images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view published writing images" ON storage.objects;

-- 8. Create Secure Storage RLS Policies
-- The public API can ONLY read an image if its folder (writingId) matches a published writing.
CREATE POLICY "Public can view published writing images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.writings 
    WHERE id::text = (string_to_array(storage.objects.name, '/'))[1] 
    AND status = 'published'
  )
);

-- The author has full access to read, insert, update, and delete all images in the bucket.
CREATE POLICY "Author can manage images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 9. Setup Trigger for 'updated_at'
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_writings_modtime ON public.writings;
CREATE TRIGGER update_writings_modtime
BEFORE UPDATE ON public.writings
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();
