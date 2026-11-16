import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description: 'Contact Neaz Md. Morshed for virtual assistant, web design, video editing and social media marketing work. Replies within 12 hours.',
  path: '/contact',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
