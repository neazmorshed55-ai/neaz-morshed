import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Client Reviews',
  description: 'Client reviews and video testimonials for Neaz Md. Morshed from freelance clients and businesses around the world.',
  path: '/reviews',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
