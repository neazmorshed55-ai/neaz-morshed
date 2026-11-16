import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Blog',
  description: 'Practical guides on virtual assistance, outsourcing, web design and social media marketing from Neaz Md. Morshed.',
  path: '/blog',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
