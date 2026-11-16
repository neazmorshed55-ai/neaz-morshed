'use client';

import { useState } from 'react';
import NextImage, { type ImageProps } from 'next/image';
import { canOptimizeImage } from '../lib/image-src';

/**
 * next/image with two safety nets for images stored in the database:
 * - URLs Vercel cannot resize (unknown hosts, sides over 8,192 px) load directly;
 * - if a resize still fails, the original file is loaded once instead,
 *   so a picture is never left blank.
 */
export default function SiteImage({ unoptimized, onError, ...props }: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const direct = unoptimized ?? (src ? !canOptimizeImage(src) || failedSrc === src : false);

  return (
    <NextImage
      {...props}
      unoptimized={direct}
      onError={(event) => {
        if (src && !direct) setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
