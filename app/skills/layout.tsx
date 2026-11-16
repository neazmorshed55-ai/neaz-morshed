import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Skills',
  description: 'Skills and services offered by Neaz Md. Morshed: virtual assistance, web design, video editing, social media marketing, content writing and admin support.',
  path: '/skills',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
