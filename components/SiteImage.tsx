'use client';

import { useState } from 'react';
import NextImage, { type ImageProps } from 'next/image';
import { canOptimizeImage, isSupabaseStorageUrl, resizerUrl } from '../lib/image-src';

/**
 * next/image with safety nets for images stored in the database:
 * - pictures Vercel cannot resize (sides over 8,192 px) and pictures whose
 *   resize failed go through our own /api/img resizer, so a phone never
 *   receives a 40 MB original;
 * - hosts we cannot resize at all (not Supabase storage) load directly.
 * `crop` asks the resizer for just the top of a tall screenshot (card covers).
 */
export default function SiteImage({
  unoptimized,
  onError,
  crop,
  ...props
}: ImageProps & { crop?: boolean }) {
  const src = typeof props.src === 'string' ? props.src : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const needsResizer = !!src && (!canOptimizeImage(src) || failedSrc === src);
  const forceDirect = unoptimized === true && !isSupabaseStorageUrl(src);
  const viaResizer = !forceDirect && needsResizer && isSupabaseStorageUrl(src);
  const direct = forceDirect || (needsResizer && !viaResizer);

  return (
    <NextImage
      {...props}
      unoptimized={direct}
      loader={
        viaResizer
          ? ({ src: s, width, quality }) => resizerUrl(s, width, quality || 70, !!crop)
          : undefined
      }
      onError={(event) => {
        if (src && !direct && !viaResizer) setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
