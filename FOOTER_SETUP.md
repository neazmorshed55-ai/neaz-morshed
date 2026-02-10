# Footer Management System Setup

## Overview
The footer management system allows you to manage footer links across all pages of your website through the admin panel. Changes made in the admin panel are stored in Supabase and automatically reflected on all pages.

## Setup Instructions

### Step 1: Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL file: `supabase_footer_table.sql`

This will create:
- `footer_links` table with columns: id, name, url, order_index, is_active
- Default footer links (Blog, Linktree, LinkedIn, Upwork, Fiverr, Facebook)
- RLS policies for public read and authenticated write access
- Automatic updated_at timestamp trigger

### Step 2: Verify the Table

Run this query in Supabase SQL Editor to verify the table was created successfully:

```sql
SELECT * FROM footer_links ORDER BY order_index;
```

You should see 6 default footer links.

### Step 3: Access the Admin Panel

1. Log in to your admin panel at: https://www.neazmdmorshed.com/admin
2. Click on **Footer Links** in the sidebar
3. You can now:
   - Add new footer links
   - Edit existing links (name and URL)
   - Toggle links active/inactive (only active links appear on website)
   - Delete links
   - Links are ordered by `order_index`

## Files Created/Modified

### New Files:
- `supabase_footer_table.sql` - Database schema and default data
- `components/FooterLinks.tsx` - Reusable footer component that fetches from Supabase
- `app/admin/footer/page.tsx` - Admin page for managing footer links
- `FOOTER_SETUP.md` - This documentation file

### Modified Files:
- `app/page.tsx` - Updated to use FooterLinks component
- `app/resume/page.tsx` - Updated to use FooterLinks component
- `app/experience/page.tsx` - Updated to use FooterLinks component
- `app/skills/page.tsx` - Updated to use FooterLinks component
- `app/reviews/page.tsx` - Updated to use FooterLinks component
- `components/admin/AdminSidebar.tsx` - Added "Footer Links" menu item

## How It Works

1. **FooterLinks Component**: A client-side component that fetches active footer links from Supabase
2. **Fallback**: If Supabase is not configured or fails, it displays default hardcoded links
3. **Loading State**: Shows a skeleton loader while fetching data
4. **Filter**: Only shows links where `is_active = true`
5. **Ordering**: Links are displayed in order of `order_index` (ascending)

## Admin Features

- **Add Link**: Click "Add New Link" button, enter name and URL
- **Edit Link**: Click edit icon on any link to modify name/URL
- **Toggle Active**: Click eye icon to show/hide link on website
- **Delete Link**: Click delete icon to permanently remove link
- **Real-time Updates**: Changes are immediately reflected in the database

## Testing

After setup, verify:
1. Footer appears on all pages (Home, Resume, Experience, Skills, Reviews)
2. Admin panel shows all links correctly
3. Toggle active/inactive works and reflects on website
4. Add/Edit/Delete operations work correctly
5. Footer links open in new tab (target="_blank")

## Troubleshooting

**Issue**: Footer links not showing on website
- **Solution**: Check if Supabase table exists and has data
- **Solution**: Verify RLS policies are enabled
- **Solution**: Check browser console for errors

**Issue**: Can't add/edit links in admin panel
- **Solution**: Ensure you're logged in as admin
- **Solution**: Check Supabase authentication
- **Solution**: Verify RLS policy allows authenticated writes

**Issue**: Changes not reflecting immediately
- **Solution**: Refresh the page (React state should update automatically)
- **Solution**: Check if the link is set to active (is_active = true)

## Database Schema

```sql
footer_links (
  id UUID PRIMARY KEY
  name TEXT NOT NULL
  url TEXT NOT NULL
  order_index INTEGER NOT NULL
  is_active BOOLEAN DEFAULT true
  created_at TIMESTAMPTZ DEFAULT NOW()
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

## Default Links

1. Blog - /blog (order: 1)
2. Linktree - https://linktr.ee/neazmorshed (order: 2)
3. LinkedIn - https://www.linkedin.com/in/neazmorshed222/ (order: 3)
4. Upwork - https://www.upwork.com/freelancers/neazmorshed (order: 4)
5. Fiverr - https://www.fiverr.com/neaz222 (order: 5)
6. Facebook - https://www.facebook.com/neazmorshed001/ (order: 6)

## Future Enhancements

Potential improvements:
- Drag-and-drop reordering of links
- Custom icon selection for each link
- Analytics tracking for link clicks
- Link categories/grouping
- Social media auto-detection and icon display
