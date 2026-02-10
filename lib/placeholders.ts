/**
 * Placeholder Image Generator
 * Replaces external Unsplash CDN with local generated placeholders
 */

// Category to color mapping
const categoryColors: Record<string, string> = {
  // Services
  'video-production': '3498db',
  'graphic-design': 'e74c3c',
  'content-writing': '2ecc71',
  'ebook-formatting': '9b59b6',
  'virtual-assistant': 'f39c12',
  'social-media': '1abc9c',
  'wordpress-design': '34495e',
  'lead-generation': 'e67e22',
  'data-entry': '95a5a6',
  'podcast-creation': '16a085',

  // Skills
  'youtube-thumbnails': 'c0392b',
  'brochure-design': '8e44ad',
  'tshirt-design': 'd35400',
  'research': '2c3e50',

  // Fallback
  'default': '7f8c8d',
};

/**
 * Generate a placeholder image URL
 * Uses simple colored backgrounds instead of external CDN
 */
export function getPlaceholderImage(
  category: string = 'default',
  width: number = 800,
  height?: number
): string {
  const h = height || width; // Square by default
  const color = categoryColors[category.toLowerCase()] || categoryColors.default;
  const text = category.replace(/-/g, ' ').toUpperCase();

  // Using data URI with SVG (no external dependencies)
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${h}'%3E%3Crect width='${width}' height='${h}' fill='%23${color}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Plus Jakarta Sans, sans-serif' font-size='24' fill='white' opacity='0.9'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}

/**
 * Generate thumbnail size placeholder (800px)
 */
export function getThumbnailPlaceholder(category: string = 'default'): string {
  return getPlaceholderImage(category, 800);
}

/**
 * Generate full size placeholder (1200px)
 */
export function getFullSizePlaceholder(category: string = 'default'): string {
  return getPlaceholderImage(category, 1200);
}

/**
 * Generate gradient background as fallback
 */
export function getGradientBackground(category: string = 'default'): string {
  const color = categoryColors[category.toLowerCase()] || categoryColors.default;

  // Generate complementary gradient
  return `linear-gradient(135deg, #${color} 0%, #${color}CC 100%)`;
}

/**
 * Extract category from old Unsplash URL (for migration)
 */
export function extractCategoryFromUrl(url: string): string {
  // Try to guess category from Unsplash photo ID or context
  // This is a helper for migration purposes
  if (url.includes('photo-1611162616475')) return 'youtube-thumbnails';
  if (url.includes('photo-1460925895917')) return 'lead-generation';
  if (url.includes('photo-1544716278')) return 'ebook-formatting';
  if (url.includes('photo-1467232004584')) return 'wordpress-design';
  if (url.includes('photo-1536240478700')) return 'video-production';

  return 'default';
}
