-- 1. Make the 'images' bucket PRIVATE
UPDATE storage.buckets
SET public = false
WHERE id = 'images';

-- 2. Drop the old insecure public policy
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Author can manage images" ON storage.objects;

-- 3. Create the secure Public Policy
-- The public can ONLY read an image if the parent folder (writingId) matches a published writing.
CREATE POLICY "Public can view published writing images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.writings 
    WHERE id::text = (string_to_array(storage.objects.name, '/'))[1] 
    AND status = 'published'
  )
);

-- 4. Create the secure Author Policy
-- The author has full access to read, insert, update, and delete all images in the bucket.
CREATE POLICY "Author can manage images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');
