# iPad Showcase Component

## Overview
A stunning, eye-catching iPad showcase component that displays your portfolio items with advanced animations and 3D effects.

## Features

### 1. **Multi-iPad Grid View**
- Shows up to 12 iPads in a responsive grid layout
- 3D parallax effects on hover
- Glowing highlight on the currently active item
- Smooth transitions between items

### 2. **Zoomed Single iPad View**
- Automatically zooms into a single iPad to showcase the current project
- Displays full project details with video/image content
- Smooth slide transitions between projects
- Progress indicator showing current item number

### 3. **Advanced Animations**
- **Zoom In/Out**: Smooth transitions between grid and single view
- **3D Effects**: Mouse-tracking 3D tilt effects
- **Slide Transitions**: Horizontal slide animations when changing projects
- **Parallax**: Interactive mouse movement creates depth
- **Glow Effects**: Pulsating glow on active items
- **Background Orbs**: Animated gradient orbs in the background

### 4. **Automatic Slideshow**
The component runs an automatic sequence:
1. Shows grid view for 2 seconds
2. Zooms into first item
3. Displays each portfolio item for 3 seconds
4. Cycles through all items
5. Zooms back out to grid view
6. Repeats the cycle

## Data Source
The component fetches portfolio items from the `portfolio_items` table in Supabase with the following fields:
- `id`: Unique identifier
- `title`: Project title
- `description`: Project description
- `video_url`: Optional video URL
- `image_url`: Optional image URL
- `thumbnail_url`: Optional thumbnail
- `order_index`: Display order

## Styling
- Uses Tailwind CSS for responsive design
- Custom gradient backgrounds with brand colors (#2ecc71, #27ae60)
- 3D transforms with perspective effects
- Blur effects and shadows for depth

## Responsive Design
- Mobile: 3-column grid
- Tablet and up: 4-column grid
- Fully responsive aspect ratios
- Touch-friendly interactions

## Performance
- Optimized animations using Framer Motion
- Lazy loading of media content
- Efficient re-renders with React hooks
- GPU-accelerated transforms

## Customization
You can customize:
- Animation durations in the `useEffect` hook
- Colors by changing Tailwind classes
- Grid layout by modifying `grid-cols-*` classes
- Item display time by adjusting `setTimeout` values
- Number of items shown by changing the `limit` in the query

## Installation
The component is already integrated into the homepage at `app/page.tsx` and appears after the Skills section.

## Dependencies
- `framer-motion`: For smooth animations
- `@supabase/supabase-js`: For database queries
- React hooks: useState, useEffect, useRef

## Browser Support
Works on all modern browsers with CSS transforms and animations support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Tips for Best Results
1. **Upload high-quality videos/images** to your portfolio items
2. **Keep descriptions concise** for better display in the overlay
3. **Order items strategically** using `order_index` to highlight your best work first
4. **Use consistent aspect ratios** for media to ensure uniform display
5. **Test on mobile devices** to ensure smooth performance

---

**Created by**: Neaz Morshed
**Date**: February 2026
**Tech Stack**: Next.js, React, Framer Motion, Tailwind CSS, Supabase
