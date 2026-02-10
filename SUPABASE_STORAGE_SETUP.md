# Supabase Storage Bucket Setup Guide

## Overview
This guide will help you create the `images` storage bucket in Supabase for uploading blog cover images and media files.

## Step-by-Step Instructions

### 1. Access Supabase Storage

1. Go to your Supabase project dashboard
2. Click on **Storage** in the left sidebar
3. You should see the Storage page

### 2. Create the `images` Bucket

1. Click the **"New bucket"** button (green button on the right)
2. Fill in the following details:
   - **Name**: `images`
   - **Public bucket**: ✅ **Enable** (Check this box!)
   - **File size limit**: Leave default or set to 50MB
   - **Allowed MIME types**: Leave empty (allows all image types)

3. Click **"Create bucket"**

### 3. Set Bucket Policies (Important!)

After creating the bucket, you need to set up policies:

1. Click on the `images` bucket you just created
2. Go to **Policies** tab
3. Click **"New Policy"**

#### Policy 1: Public Read Access
- **Policy name**: `Public read access`
- **Allowed operation**: SELECT
- **Target roles**: `public`
- **Policy definition**:
```sql
(bucket_id = 'images'::text)
```

#### Policy 2: Authenticated Upload
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: INSERT
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'images'::text)
```

#### Policy 3: Authenticated Update
- **Policy name**: `Authenticated users can update`
- **Allowed operation**: UPDATE
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'images'::text)
```

#### Policy 4: Authenticated Delete
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: DELETE
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
(bucket_id = 'images'::text)
```

### 4. Verify Setup

Run this query in **SQL Editor** to verify the bucket exists:

```sql
SELECT * FROM storage.buckets WHERE name = 'images';
```

You should see one row with:
- `name`: images
- `public`: true

### 5. Test Upload

1. Go to your admin panel: https://www.neazmdmorshed.com/admin/blog
2. Create or edit a blog post
3. Try uploading an image using the upload button
4. If successful, you should see "Image uploaded successfully"

## Quick SQL Setup (Alternative Method)

If you prefer SQL, you can run this in the Supabase SQL Editor:

```sql
-- Create the images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

-- Create policies
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

## Folder Structure

After setup, images will be organized as:
```
images/
  └── media/
      ├── abc123.jpg   (blog uploads)
      ├── def456.png   (media library uploads)
      └── ...
```

## Troubleshooting

### Error: "Bucket not found"
- **Solution**: Make sure you created the `images` bucket (not `portfolio-assets`)
- **Check**: Go to Storage → should see `images` bucket listed

### Error: "new row violates row-level security policy"
- **Solution**: Enable RLS policies as described in Step 3
- **Check**: Go to Storage → `images` bucket → Policies tab

### Images not loading on website
- **Solution**: Make sure "Public bucket" is enabled
- **Check**: Storage → `images` bucket → Settings → Public bucket should be ON

### Upload button not working
- **Solution**: Make sure you're logged in to admin panel
- **Check**: Authentication policies are set correctly

## Next Steps

After setup:
1. ✅ Upload images from blog admin page
2. ✅ Browse and select from Media Library
3. ✅ Images will appear on both admin and public pages

## Notes

- **Public bucket** means anyone can view images (required for website)
- **Authenticated policies** mean only logged-in admins can upload/edit/delete
- Images uploaded from blog admin are automatically added to Media Library
- Maximum file size: 50MB (configurable)
- Supported formats: JPG, PNG, GIF, WebP, SVG

## Security Best Practices

1. ✅ Public read access (required for website images)
2. ✅ Authenticated write access (only admins can upload)
3. ✅ File size limits (prevents abuse)
4. ✅ Bucket is separate from authentication data

Your images are secure and publicly accessible for your website visitors!
