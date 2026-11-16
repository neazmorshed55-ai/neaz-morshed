import type { Metadata } from 'next';
import { SITE_URL } from './site';

export const SITE_NAME = 'Neaz Md. Morshed';
export const SITE_TAGLINE = 'Virtual Assistant & Outsourcing Expert';

/** The portfolio copy of the site is shared on freelance platforms and links nowhere else. */
export const IS_PORTFOLIO_COPY = /\/\/portfolio\./.test(SITE_URL);

/** Title, description, canonical and social tags for one page. */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
  extra?: Metadata;
}): Metadata {
  const { title, description, path, image, type = 'website', extra } = opts;
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale: 'en_US',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...extra,
  };
}

/** Safe JSON for an inline <script type="application/ld+json">. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function breadcrumbList(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
