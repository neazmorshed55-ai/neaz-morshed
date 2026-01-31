-- Supabase Storage Setup for Client Images
-- Run this in Supabase SQL Editor (SQL Editor > New Query)

-- =====================================================
-- STEP 1: Drop existing policies (if any)
-- =====================================================

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;

-- =====================================================
-- STEP 2: Create new policies for the images bucket
-- =====================================================

-- Allow anyone to view/download images (for public display)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow anyone to upload images (simpler policy - no auth required)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to update images
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Allow anyone to delete images
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- =====================================================
-- VERIFICATION: Check if policies were created
-- =====================================================
SELECT policyname, tablename, cmd
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
