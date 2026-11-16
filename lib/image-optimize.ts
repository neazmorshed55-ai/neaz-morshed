/**
 * Browser-side image shrinking for the admin.
 *
 * Phones and full-page screenshot tools produce 5–40 MB files, while the
 * public site never needs more than about 2,000 pixels. Everything here runs
 * in the admin's own browser (decode → canvas → WebP), so it needs no server,
 * no extra service and no secret keys. Any failure keeps the original file.
 */

export interface ShrinkResult {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  /** false when the original was kept (not a photo, already small, or no gain). */
  changed: boolean;
}

/** Long screenshots (height ≥ 2 × width) keep a readable width instead of a capped long side. */
const TALL_RATIO = 2;
const TALL_MAX_WIDTH = 1440;
const MAX_LONG_SIDE = 2048;
/** WebP cannot store more than 16,383 px on a side. */
const WEBP_MAX_SIDE = 16383;
/** Vercel only resizes sources up to 8,192 px on each side. */
const OPTIMIZER_MAX_SIDE = 8192;
/** Small files with sensible dimensions are left exactly as they are. */
const SMALL_ENOUGH_BYTES = 350 * 1024;

const RASTER_TYPES = /^image\/(png|jpe?g|webp|bmp|avif|tiff?)$/i;
const RASTER_EXT = /\.(png|jpe?g|webp|bmp|avif|tiff?)$/i;
const SIZE_SUFFIX = /-\d{2,5}x\d{2,5}(?=\.[^./]+$)/;

/** Photos and screenshots only: GIFs (animation), SVGs, icons and videos are never re-encoded. */
export function isRasterImage(type: string, name = ''): boolean {
  if (/gif|svg|icon|video/i.test(type)) return false;
  if (RASTER_TYPES.test(type)) return true;
  return (!type || type === 'application/octet-stream') && RASTER_EXT.test(name);
}

/** Pixel size the site actually needs for an image of w × h. */
export function targetSize(w: number, h: number): { width: number; height: number } {
  let scale = h / w >= TALL_RATIO ? Math.min(1, TALL_MAX_WIDTH / w) : Math.min(1, MAX_LONG_SIDE / Math.max(w, h));
  scale = Math.min(scale, WEBP_MAX_SIDE / w, WEBP_MAX_SIDE / h);
  return {
    width: Math.min(WEBP_MAX_SIDE, Math.max(1, Math.round(w * scale))),
    height: Math.min(WEBP_MAX_SIDE, Math.max(1, Math.round(h * scale))),
  };
}

/** "portfolio/a-1920x900.png" + 1440 × 675 → "portfolio/a-1440x675.webp" */
export function pathWithSize(path: string, width: number, height: number): string {
  const stem = path.replace(SIZE_SUFFIX, '').replace(/\.[^./]+$/, '');
  return `${stem}-${width}x${height}.webp`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Re-encode an image as WebP at the size the site needs.
 * Returns the original blob (changed: false) whenever that is the better file.
 */
export async function shrinkImage(blob: Blob, name = ''): Promise<ShrinkResult> {
  const keep = (w = 0, h = 0): ShrinkResult => ({ blob, width: w, height: h, originalWidth: w, originalHeight: h, changed: false });
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') return keep();
  if (!isRasterImage(blob.type, name)) return keep();

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob);
  } catch {
    return keep(); // a format this browser cannot decode (HEIC, broken file): upload as is
  }

  const w = bitmap.width;
  const h = bitmap.height;
  const target = targetSize(w, h);
  const resized = target.width !== w || target.height !== h;
  const tooBigForSite = Math.max(w, h) > OPTIMIZER_MAX_SIDE;
  if (!resized && blob.size <= SMALL_ENOUGH_BYTES) {
    bitmap.close();
    return keep(w, h);
  }

  const canvas = document.createElement('canvas');
  canvas.width = target.width;
  canvas.height = target.height;
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return keep(w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, target.width, target.height);
    const quality = h / w >= TALL_RATIO ? 0.8 : 0.82;
    const out = await canvasToBlob(canvas, 'image/webp', quality);
    // Browsers without a WebP encoder (Safari) silently return PNG: keep the original then.
    if (!out || out.type !== 'image/webp') return keep(w, h);
    if (out.size >= blob.size && !tooBigForSite) return keep(w, h);
    return { blob: out, width: target.width, height: target.height, originalWidth: w, originalHeight: h, changed: true };
  } finally {
    bitmap.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}

const UPLOAD_SIZES = new WeakMap<File, { width: number; height: number }>();

/**
 * Smaller WebP copy of an image the admin is about to upload, or the
 * original file when that is not possible or not worth it.
 */
export async function prepareImageUpload(file: File): Promise<File> {
  try {
    const result = await shrinkImage(file, file.name);
    if (!result.changed) return file;
    const base = file.name.replace(/\.[^.]+$/, '').replace(SIZE_SUFFIX, '') || 'image';
    const out = new File([result.blob], `${base}.webp`, { type: 'image/webp', lastModified: Date.now() });
    UPLOAD_SIZES.set(out, { width: result.width, height: result.height });
    return out;
  } catch (error) {
    console.warn('Image optimisation skipped:', error);
    return file;
  }
}

/**
 * "-1440x9000" for files made by prepareImageUpload, "" for anything else.
 * Stored names carry their pixel size so the site can tell long screenshots
 * apart (and skip Vercel resizing for sides over 8,192 px) without loading them.
 */
export function sizeSuffix(file: File): string {
  const size = UPLOAD_SIZES.get(file);
  return size ? `-${size.width}x${size.height}` : '';
}
