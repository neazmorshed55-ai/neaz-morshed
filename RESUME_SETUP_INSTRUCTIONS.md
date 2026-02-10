# Resume Management System - Complete Setup Guide

## 📋 Overview

Complete resume management system with admin interface and public resume page, fully connected to Supabase database.

### System Components:
- **Public Resume Page**: `https://www.neazmdmorshed.com/resume`
- **Admin Dashboard**: `https://www.neazmdmorshed.com/admin/resume`
- **Admin Pages**:
  - `/admin/resume/experiences` - Manage work experiences
  - `/admin/resume/education` - Manage education
  - `/admin/resume/certifications` - Manage certifications
  - `/admin/resume/skills` - Manage skills by category
  - `/admin/resume/stats` - Manage achievement statistics

### Database Tables (7 total):
1. ✅ `resume_settings` - Personal info, contact details, links
2. ✅ `resume_stats` - Achievement statistics (Job Success, Hours, etc.)
3. ✅ `resume_skills` - Skills organized by category
4. ✅ `resume_experiences` - Work history (Full-time, Part-time, Project-based)
5. ✅ `resume_education` - Educational background
6. ✅ `resume_certifications` - Professional certifications
7. ✅ `resume_capstone` - Research/capstone project details

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the SQL Migration
1. Open the file `supabase_resume_tables_fixed.sql` from your project root
2. Copy the **ENTIRE** contents of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Everything Works
1. Go to **Table Editor** in Supabase
2. Confirm all 7 tables exist with data
3. Visit your admin page: `/admin/resume`
4. Test each sub-page (experiences, education, certifications, skills, stats)
5. Visit your public resume page: `/resume`
6. All data should display correctly!

---

## 📊 Default Data Included

The SQL script includes comprehensive default data from your current resume:

### Experiences (2 default entries)
- Upwork - Top Rated Plus Freelancer (Sep 2021 - Present)
- Fiverr - Level 2 Seller (Jan 2020 - Present)

### Education (4 entries)
- American International University-Bangladesh (AIUB) - EMBA in MIS
- North South University - B.Sc. in Electrical & Electronic Engineering
- Dr. Abdur Razzak Municipal College - H.S.C in Science
- Daud Public School - S.S.C in Science

### Certifications (5 entries)
- Builders Guide to the AI SDK (Vercel)
- Next.js App Router Fundamentals (Vercel)
- Government Certified Freelancer (ICT Division Bangladesh)
- ITES Foundation Skills Training (Ernst & Young LLP)
- Social Media Marketing (HubSpot Academy)

### Skills (7 categories with multiple skills each)
- Modern Web Stack
- Full-Stack Workflow
- Administrative & VA
- Media & Content
- Web & CMS
- Sales & Marketing
- AI & Automation

### Stats (4 achievement statistics)
- Job Success: 100%
- Hours Completed: 5,000+
- Global Clients: 180+
- Years Experience: 12+

---

## 🔄 Data Flow

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Admin Makes    │  →   │  Supabase        │  →   │  Public Resume  │
│  Changes        │      │  Database Tables │      │  Page Shows     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
   /admin/resume/*           Data Storage              /resume
   (Add/Edit/Delete)        (7 Tables)              (Display Data)
```

**Key Point**: Any change you make in the admin panel (`/admin/resume/*`) is immediately saved to Supabase and will appear on the public resume page (`/resume`) after refresh.

---

## 📝 Database Schema Details

### `resume_experiences`
```sql
- id: UUID (Primary Key)
- company: Text
- position: Text
- location: Text
- start_date: Text (e.g., "January 2020")
- end_date: Text (e.g., "Present")
- description: Text[] (Array of bullet points)
- type: Text (full-time | part-time | project)
- order_index: Integer (for sorting)
```

### `resume_education`
```sql
- id: UUID (Primary Key)
- institution: Text
- degree: Text
- field: Text
- location: Text
- start_date: Text
- end_date: Text
- order_index: Integer
```

### `resume_certifications`
```sql
- id: UUID (Primary Key)
- title: Text
- issuer: Text
- date: Text (Issue date)
- expiry: Text (Optional expiry date)
- credential_url: Text (Optional URL)
- order_index: Integer
```

### `resume_skills`
```sql
- id: UUID (Primary Key)
- category: Text (e.g., "Modern Web Stack")
- skills: Text[] (Array of skills)
- order_index: Integer
```

### `resume_stats`
```sql
- id: UUID (Primary Key)
- label: Text (e.g., "Job Success")
- value: Text (e.g., "100%")
- icon: Text (Icon name: Zap, Sparkles, Globe, Briefcase)
- order_index: Integer
```

### `resume_settings`
```sql
- id: UUID (Primary Key)
- name: Text
- title: Text (Your job title)
- email: Text
- phone: Text
- location: Text
- linkedin_url: Text
- upwork_url: Text
- fiverr_url: Text
- portfolio_url: Text
- pdf_download_url: Text (Google Drive link)
```

### `resume_capstone`
```sql
- id: UUID (Primary Key)
- title: Text
- description: Text
- year: Text
- doi: Text
- publication_url: Text
- badges: Text[] (e.g., ["IEEE Published"])
```

---

## 🔒 Security (Row Level Security)

All tables have RLS enabled with these policies:

✅ **Public Read Access**: Anyone can view data (for public resume page)
✅ **Authenticated Write Access**: Only logged-in admin can create/update/delete

This means:
- Your public resume page (`/resume`) can display all data
- Only you (as admin) can edit data through `/admin/resume/*`
- Data is secure from unauthorized modifications

---

## 🧪 Testing Checklist

After running the SQL script:

- [ ] All 7 tables exist in Supabase Table Editor
- [ ] Each table has default data
- [ ] `/admin/resume` page loads without errors
- [ ] `/admin/resume/experiences` allows add/edit/delete
- [ ] `/admin/resume/education` allows add/edit/delete
- [ ] `/admin/resume/certifications` allows add/edit/delete
- [ ] `/admin/resume/skills` allows add/edit/delete
- [ ] `/admin/resume/stats` allows editing stats
- [ ] `/resume` public page displays all data correctly
- [ ] Changes made in admin appear on public page after refresh

---

## 🔧 Troubleshooting

### Tables Not Showing Up
**Problem**: Can't see tables in Supabase Table Editor
**Solution**:
1. Check SQL Editor for error messages
2. Make sure you ran the entire SQL script (not just part of it)
3. Refresh your Supabase dashboard
4. Check the "Logs" section for errors

### Data Not Appearing on Resume Page
**Problem**: `/resume` page shows default hardcoded data instead of Supabase data
**Solution**:
1. Open browser console (F12) and check for errors
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`
3. Check if tables have data in Supabase Table Editor
4. Check Network tab to see if API calls are succeeding
5. Look for error messages in browser console

### Admin Pages Showing Errors
**Problem**: Console errors when accessing admin pages
**Solution**:
1. Ensure you're logged in with admin credentials
2. Check browser console for specific error message
3. Verify all 7 tables exist in Supabase
4. Check that table field names match (especially `date` in certifications, not `issue_date`)

### Changes Not Reflecting
**Problem**: Edited data in admin but not showing on resume page
**Solution**:
1. Refresh the `/resume` page (data fetches on page load)
2. Check if changes were saved in Supabase Table Editor
3. Clear browser cache
4. Check browser console for fetch errors

### RLS Policy Errors
**Problem**: "new row violates row-level security policy" error
**Solution**:
1. Make sure you're logged in as admin
2. Check if RLS policies were created correctly (they should be in the SQL script)
3. In Supabase, go to Authentication → Policies and verify policies exist

---

## 🎨 Customization

### Change Default Data
Edit the INSERT statements in `supabase_resume_tables_fixed.sql` before running it.

### Add New Fields to Tables
1. Update SQL schema in `supabase_resume_tables_fixed.sql`
2. Update TypeScript interfaces in respective page files
3. Update admin forms to include new fields
4. Update public resume page to display new fields

### Change Styling
Edit Tailwind CSS classes in the page components:
- `/app/resume/page.tsx` - Public resume page styling
- `/app/admin/resume/*/page.tsx` - Admin page styling

### Add New Sections
1. Create new table in Supabase
2. Create new admin page under `/app/admin/resume/`
3. Add fetching logic to `/app/resume/page.tsx`
4. Add display component to public resume page

---

## 📚 Additional Information

### Icon Options for Stats
Available icons in the stats admin page:
- Zap (⚡)
- Sparkles (✨)
- Globe (🌐)
- Briefcase (💼)
- Award (🏆)
- Star (⭐)
- TrendingUp (📈)
- Users (👥)
- Clock (⏱️)
- Target (🎯)

### Experience Types
- **full-time**: Traditional full-time employment
- **part-time**: Part-time or ongoing contract work
- **project**: One-time project-based work

### Order Index
All tables have `order_index` field to control display order:
- Lower numbers appear first
- You can manually set this when adding/editing entries
- Default order is chronological for experiences and education

---

## ⚠️ Important Notes

1. **Don't run the SQL script multiple times** unless you want to reset all data
2. The SQL script uses `IF NOT EXISTS` and conditional inserts to prevent duplicates
3. **Backup your data** before making schema changes
4. Environment variables must be set for Supabase connection to work
5. All date fields are stored as text for flexible formatting

---

## 💡 Tips

- Use the admin interface to manage content (don't edit Supabase tables directly)
- Keep your `order_index` values organized (1, 2, 3...) for easier management
- Use consistent date formats (e.g., "January 2020" not "Jan 2020")
- Test changes on `/resume` page after editing in admin
- Keep your PDF resume link updated in `resume_settings` table

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for error messages
2. Verify all environment variables are set
3. Confirm you're logged in as admin
4. Check Supabase logs for database errors
5. Verify table structures match the schema above

---

**✅ Setup Complete!**

Your resume management system is now fully connected to Supabase. Any changes you make in the admin interface will automatically appear on your public resume page!
