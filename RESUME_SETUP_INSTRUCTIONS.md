# Resume Management System Setup Instructions

## Problem Found

The resume admin pages were showing console errors because the database tables for **experiences**, **education**, and **certifications** were missing from the SQL migration file.

## Fixed

The `supabase_resume_tables.sql` file has been updated to include all 7 required tables:

1. ✅ `resume_settings` - Personal info, contact details, links
2. ✅ `resume_stats` - Achievement statistics
3. ✅ `resume_skills` - Skills by category
4. ✅ `resume_experiences` - Work history (NEW - was missing)
5. ✅ `resume_education` - Educational background (NEW - was missing)
6. ✅ `resume_certifications` - Professional certifications (NEW - was missing)
7. ✅ `resume_capstone` - Research project details

## How to Fix the Console Errors

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **neaz-morshed** (or whatever your project name is)

### Step 2: Open SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Run the Migration
1. Open the file `supabase_resume_tables.sql` from your project
2. Copy the ENTIRE contents of the file
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 4: Verify Tables Were Created
1. Click on **Table Editor** in the left sidebar
2. You should now see all 7 tables:
   - resume_settings
   - resume_stats
   - resume_skills
   - resume_experiences ← Should now exist
   - resume_education ← Should now exist
   - resume_certifications ← Should now exist
   - resume_capstone

### Step 5: Test Admin Pages
1. Go to your website admin panel
2. Navigate to `/admin/resume/experiences`
3. Navigate to `/admin/resume/education`
4. Navigate to `/admin/resume/certifications`
5. Navigate to `/admin/resume/skills`
6. All pages should now work without console errors
7. You should be able to add, edit, and delete resume data

## Default Data Included

The SQL migration includes default data for all tables:

### Experiences (2 entries)
- Upwork - Top Rated Plus Freelancer
- Fiverr - Level 2 Seller

### Education (1 entry)
- Ahsanullah University of Science and Technology - B.Sc. in EEE

### Certifications (2 entries)
- Top Rated Plus (Upwork)
- Level 2 Seller (Fiverr)

### Skills (7 categories)
- Modern Web Stack
- Full-Stack Workflow
- Administrative & VA
- Media & Content
- Web & CMS
- Sales & Marketing
- AI & Automation

You can edit all of this data from the admin panel after running the SQL migration.

## Important Notes

- **RLS (Row Level Security)** is enabled on all tables
- **Public read access** is allowed (so your resume page can display data)
- **Authenticated users** (admin) can insert, update, and delete
- All tables have `created_at` and `updated_at` timestamps
- All tables have `order_index` for custom sorting

## Still Having Issues?

If you still see console errors after running the SQL:

1. Check browser console for the specific error message
2. Verify all 7 tables exist in Supabase Table Editor
3. Check if the table structure matches the admin page expectations
4. Ensure RLS policies are created correctly
5. Verify you're logged in as admin when accessing admin pages

## Need Help?

If you encounter any issues:
1. Share the exact error message from browser console
2. Confirm which tables exist in your Supabase project
3. Check if you can see the tables in Supabase Table Editor
