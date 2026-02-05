# Skill Portfolio Tags Setup Guide

## Overview
Portfolio gallery items (images/videos/documents) can now be tagged with up to 3 skill portfolio names. Tagged items will automatically sync to the skill portfolio gallery.

## Database Setup Required

### Step 1: Run the Migration SQL

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy and paste the content from `database/migrations/add_portfolio_skill_tags.sql`
3. Click **Run**

This will:
- Create `portfolio_gallery_skill_tags` table (junction table)
- Create automatic sync trigger to `skill_gallery` table
- Set up proper indexes and RLS policies

### Step 2: Verify Tables Exist

Make sure these tables exist in your database:
- ✅ `portfolio_gallery`
- ✅ `sub_skills`
- ✅ `skill_gallery`
- ✅ `portfolio_gallery_skill_tags` (new)

## How It Works

### 1. Add Gallery Item with Tags

When you add an image/video/document to a portfolio item:

1. Upload the file or paste URL
2. Select up to **3 skill portfolio names** (e.g., "Web Design", "Brochure Design")
3. Click **Add**
4. The image is saved to `portfolio_gallery`
5. Tags are saved to `portfolio_gallery_skill_tags`
6. **Automatically synced** to each tagged skill's `skill_gallery` table

### 2. Auto-Sync to Skill Gallery

When you tag an image with "Brochure Design":
- The image URL, alt text, and type are **automatically copied** to `skill_gallery` table
- The image now appears in the "Brochure Design" skill portfolio gallery
- No manual work needed!

### 3. Example Flow

```
Portfolio Item: "Corporate Branding Project"
↓
Add Image: corporate-logo.jpg
↓
Tag with: ["Brochure Design", "Logo Design", "Canva Design"]
↓
Image automatically appears in:
  - Brochure Design gallery
  - Logo Design gallery
  - Canva Design gallery
```

## UI Features

### Tag Selection
- **Chip-style buttons** for each skill portfolio
- **Green background** when selected
- **Disabled state** after selecting 3 tags
- **Click again** to remove a tag

### Visual Feedback
- Shows "Selected: 2/3" counter
- Info text: "Image will auto-sync to selected skill galleries"

## Database Schema

### portfolio_gallery_skill_tags Table
```sql
- id (UUID)
- portfolio_gallery_id (FK → portfolio_gallery)
- sub_skill_id (FK → sub_skills)
- created_at (timestamp)
```

### Trigger Function
`sync_portfolio_to_skill_gallery()` - Automatically runs when tag is added

## Code Changes

### Files Modified
1. `app/admin/portfolio/page.tsx` - Added tag selection UI and logic
2. `database/migrations/add_portfolio_skill_tags.sql` - New migration

### Key Functions
- `addSkillTagsToGalleryItem()` - Adds tags to gallery item
- `sync_portfolio_to_skill_gallery()` - DB trigger for auto-sync

## Testing

1. Go to `/admin/portfolio`
2. Edit any portfolio item
3. Add a new image/video
4. Select 1-3 skill tags
5. Click Add
6. Go to `/admin/skill-portfolio`
7. Check the tagged skills - your image should appear there!

## Troubleshooting

**Tags not showing up?**
- Make sure you ran the migration SQL
- Check that `sub_skills` table has data (run `complete_skill_setup.sql` first)

**Images not syncing to skill gallery?**
- Check Supabase logs for trigger errors
- Verify `skill_gallery` table exists
- Check RLS policies are enabled

**Can't select more than 3 tags?**
- This is intentional! Max 3 tags per image

## Future Enhancements

- [ ] Show which skills are tagged on gallery items
- [ ] Bulk tag existing gallery items
- [ ] Remove tags from gallery items
- [ ] Filter gallery by tags
