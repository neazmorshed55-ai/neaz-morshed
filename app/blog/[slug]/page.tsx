import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSupabase } from '../../../lib/supabase-server';
import { SITE_URL } from '../../../lib/site';
import { SITE_NAME, breadcrumbList, pageMeta } from '../../../lib/seo';
import JsonLd from '../../../components/JsonLd';
import BlogDetailClient, { type BlogPost } from './Client';

// Posts are rendered on the server and refreshed every minute.
export const revalidate = 60;

/** undefined = could not ask (fall back to the browser), null = no such post. */
async function loadPost(slug: string): Promise<BlogPost | null | undefined> {
  const db = getServerSupabase();
  if (!db) return undefined;
  const { data, error } = await db.from('blogs').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
  if (error) return undefined;
  return (data as BlogPost | null) ?? null;
}

export async function generateStaticParams() {
  const db = getServerSupabase();
  if (!db) return [];
  const { data } = await db.from('blogs').select('slug').eq('is_published', true);
  return (data || []).filter((r: { slug: string | null }) => r.slug).map((r: { slug: string }) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await loadPost(params.slug);
  if (!post) return {};
  const description = (post.excerpt || post.content || '').replace(/\s+/g, ' ').trim().slice(0, 158);
  return pageMeta({
    title: post.title,
    description,
    path: `/blog/${params.slug}`,
    image: post.cover_image || null,
    type: 'article',
    extra: {
      authors: [{ name: post.author || SITE_NAME }],
      keywords: post.tags?.length ? post.tags : undefined,
      openGraph: {
        type: 'article',
        url: `/blog/${params.slug}`,
        title: `${post.title} | ${SITE_NAME}`,
        description,
        siteName: SITE_NAME,
        publishedTime: post.published_at,
        authors: [post.author || SITE_NAME],
        tags: post.tags || undefined,
        ...(post.cover_image ? { images: [{ url: post.cover_image, alt: post.cover_image_alt_text || post.title }] } : {}),
      },
    },
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await loadPost(params.slug);
  if (post === null) notFound();

  const url = `${SITE_URL}/blog/${params.slug}`;
  return (
    <>
      {post && (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
              headline: post.title,
              description: (post.excerpt || '').slice(0, 300) || undefined,
              image: post.cover_image || undefined,
              datePublished: post.published_at,
              dateModified: post.published_at,
              author: { '@type': 'Person', name: post.author || SITE_NAME, url: SITE_URL },
              publisher: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
              keywords: post.tags?.length ? post.tags.join(', ') : undefined,
              inLanguage: 'en',
            },
            breadcrumbList([
              { name: 'Home', path: '' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path: `/blog/${params.slug}` },
            ]),
          ]}
        />
      )}
      <BlogDetailClient params={params} initial={post ?? undefined} />
    </>
  );
}
