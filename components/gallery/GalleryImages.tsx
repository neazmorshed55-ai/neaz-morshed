'use client';

import { useState } from 'react';
import SiteImage from '../SiteImage';
import { imageSizeFromUrl } from '../../lib/image-src';

type Size = { width: number; height: number };

const ratio = (size: Size | null) => (size ? size.height / size.width : 0);

/** Cropped tile (grid card, cover). Long screenshots show their top instead of a slice from the middle. */
export function CoverImage({
  src,
  alt,
  sizes,
  className = '',
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [size, setSize] = useState<Size | null>(() => imageSizeFromUrl(src));
  return (
    <SiteImage
      src={src}
      alt={alt}
      fill
      crop
      sizes={sizes}
      priority={priority}
      className={`${className} ${ratio(size) >= 1.3 ? 'object-top' : ''}`}
      onLoad={(event) => {
        const img = event.currentTarget;
        if (img.naturalWidth) setSize({ width: img.naturalWidth, height: img.naturalHeight });
      }}
    />
  );
}

/**
 * Full view inside a lightbox. A full-page website screenshot opens as a
 * scrollable column at a readable width instead of a thin unreadable strip.
 * Give it key={src} so each image starts fresh.
 */
export function LightboxImage({ src, alt, frameClassName }: { src: string; alt: string; frameClassName: string }) {
  const [size, setSize] = useState<Size | null>(() => imageSizeFromUrl(src));

  if (size && ratio(size) >= 1.8) {
    return (
      <div
        className="mx-auto h-[85vh] max-h-full w-full max-w-[1100px] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl"
        data-lenis-prevent
      >
        <SiteImage
          src={src}
          alt={alt}
          width={size.width}
          height={size.height}
          sizes="(max-width: 1100px) 70vw, 1100px"
          className="block h-auto w-full"
        />
      </div>
    );
  }

  return (
    <div className={frameClassName}>
      <SiteImage
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-contain"
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth) setSize({ width: img.naturalWidth, height: img.naturalHeight });
        }}
      />
    </div>
  );
}
