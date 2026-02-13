# iPad Showcase Animation Fix

## Problem

The iPad showcase was showing slides too quickly after the first 3-4 items. The animation would:
1. Show first 3-4 items correctly (3 seconds each)
2. Then rapidly flash through remaining items
3. Repeat this erratic behavior

## Root Cause

The issue was in the `useEffect` dependency array and how the animation sequence was managed:

1. **Multiple Sequences Running Simultaneously**: When `currentPage` changed, it triggered a new `useEffect`, but the old animation sequence was still running
2. **Interval Conflicts**: The old `setInterval` wasn't being properly cleaned up before starting a new one
3. **State Race Conditions**: Multiple sequences were updating `currentIndex` and `isZoomed` at the same time

### Before (Buggy Code):
```typescript
useEffect(() => {
  if (portfolioItems.length === 0) return;

  const sequence = async () => {
    // Animation sequence...
  };

  const interval = setInterval(() => {
    sequence();
  }, (portfolioItems.length * 3000) + 6000);

  sequence();

  return () => clearInterval(interval);
}, [portfolioItems, totalPages]); // ❌ portfolioItems changes when page changes
```

**Problems:**
- Used `portfolioItems` in dependencies (changes every time page changes)
- Had `setInterval` that wasn't properly cancelled
- No cancellation flag for async sequences
- Multiple overlapping animations

## Solution

Implemented proper cancellation and cleanup:

### After (Fixed Code):
```typescript
useEffect(() => {
  if (allPortfolioItems.length === 0) return;

  let isCancelled = false; // ✅ Cancellation flag

  const sequence = async () => {
    if (isCancelled) return; // ✅ Check before each step

    // Get current page items dynamically
    const currentItems = allPortfolioItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    // ... animation steps with cancellation checks
    if (isCancelled) return;

    // Move to next page at the end
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  sequence(); // ✅ Run once per page, no interval

  return () => {
    isCancelled = true; // ✅ Cancel on cleanup
  };
}, [allPortfolioItems, currentPage, totalPages, itemsPerPage]);
```

## Key Changes

### 1. ✅ Removed `setInterval`
**Before:** Used interval to repeat sequence
**After:** Page change triggers new sequence automatically via useEffect

### 2. ✅ Added Cancellation Flag
```typescript
let isCancelled = false;

// Check before each async step
if (isCancelled) return;

// Cleanup
return () => {
  isCancelled = true;
};
```

This ensures when the component re-renders or page changes, the old sequence stops immediately.

### 3. ✅ Use `allPortfolioItems` Instead of `portfolioItems`
**Before:** `portfolioItems` was recalculated on every render
**After:** Use stable `allPortfolioItems` and slice dynamically inside the sequence

### 4. ✅ Proper Dependencies
```typescript
}, [allPortfolioItems, currentPage, totalPages, itemsPerPage]);
```
- Tracks `currentPage` to trigger new sequence when page changes
- Only re-runs when actually needed

## Flow Chart

```
Page 0 starts
  ↓
Grid view (2s) → Zoom in → Item 0 (3s) → Item 1 (3s) → ... → Item 11 (3s)
  ↓
Zoom out (2s)
  ↓
setCurrentPage(1) ← This triggers useEffect again
  ↓
Old sequence cancelled (isCancelled = true)
  ↓
Page 1 starts
  ↓
Grid view (2s) → Zoom in → Item 12 (3s) → Item 13 (3s) → ... → Item 23 (3s)
  ↓
... continues infinitely
```

## Testing Results

✅ First 12 items show correctly (3 seconds each)
✅ Smooth transition to next page
✅ All items in page 2 show correctly (3 seconds each)
✅ Clean loop back to page 1
✅ No flickering or rapid flashing
✅ Consistent timing throughout

## Timing Breakdown

For 12 items per page:
- Grid view: **2 seconds**
- Zoom in + First item: **3 seconds**
- Items 2-12: **11 × 3 = 33 seconds**
- Zoom out: **2 seconds**
- **Total per page: 40 seconds**

For 24 total items (2 pages):
- **Full cycle: 80 seconds**

## Additional Notes

### Why Not Use `setInterval`?
- Intervals can overlap and cause race conditions
- Hard to cancel properly
- State updates can conflict
- Memory leaks if not cleaned up correctly

### Why Use `isCancelled` Flag?
- Async sequences can't be stopped mid-execution
- The flag allows checking between each step
- Clean and predictable cleanup
- Prevents state updates on unmounted components

## Files Modified

- `components/IPadShowcase.tsx`

## Related Error (Image 400)

The console also shows an image loading error:
```
Failed to load resource: the server responded with a status of 400 ()
/_next/image?url=%2F..e..jpg&w=1080&q=75:1
```

This is a separate issue related to Next.js Image Optimization. The animation fix doesn't address this - it's likely a malformed image URL in your database. Check your portfolio_items table for any invalid image_url values.
