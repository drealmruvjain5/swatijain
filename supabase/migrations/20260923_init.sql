-- 1. Create the 'writings' table
CREATE TABLE writings (
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

-- 2. Create the 'site_settings' table
CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    author_name TEXT NOT NULL DEFAULT 'Author Name',
    bio TEXT,
    contact_email TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for writings
-- Public can read published works
CREATE POLICY "Public can view published writings" 
ON writings FOR SELECT 
TO anon, authenticated
USING (status = 'published');

-- Authenticated (Author) has full access
CREATE POLICY "Author has full access to writings" 
ON writings FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 5. RLS Policies for site_settings
-- Public can read settings
CREATE POLICY "Public can view settings" 
ON site_settings FOR SELECT 
TO anon, authenticated
USING (true);

-- Authenticated (Author) has full access
CREATE POLICY "Author has full access to settings" 
ON site_settings FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. Storage Bucket for Cover Images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- 7. Storage RLS Policies
-- Public can read images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Authenticated (Author) can insert, update, and delete images
CREATE POLICY "Author can manage images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 8. Trigger to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_writings_modtime
BEFORE UPDATE ON writings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
