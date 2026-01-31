-- Supabase Storage Setup for Client Images
-- Run this in Supabase SQL Editor (SQL Editor > New Query)

-- =====================================================
-- STEP 1: Create the 'images' bucket if it doesn't exist
-- =====================================================
-- Go to Storage in Supabase Dashboard and create a bucket named 'images'
-- Make sure to set it as PUBLIC bucket

-- =====================================================
-- STEP 2: Enable RLS and create policies for the images bucket
-- =====================================================

-- Allow anyone to view/download images (for public display)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- =====================================================
-- ALTERNATIVE: If above doesn't work, use this simpler version
-- =====================================================

-- Drop existing policies first (if any)
-- DROP POLICY IF EXISTS "Public Access" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Create a single permissive policy for all operations
-- CREATE POLICY "Allow all operations on images bucket"
-- ON storage.objects
-- FOR ALL
-- USING (bucket_id = 'images')
-- WITH CHECK (bucket_id = 'images');

-- =====================================================
-- MANUAL STEPS IN SUPABASE DASHBOARD
-- =====================================================
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click on 'images' bucket (or create it if it doesn't exist)
-- 3. Click on the three dots (...) and select 'Edit bucket'
-- 4. Make sure 'Public bucket' is ENABLED
-- 5. Go to Policies tab and add:
--    - Policy name: "Allow public read"
--    - Allowed operation: SELECT
--    - Policy definition: true
-- 6. Add another policy:
--    - Policy name: "Allow authenticated upload"
--    - Allowed operation: INSERT
--    - Policy definition: true (or auth.role() = 'authenticated')
