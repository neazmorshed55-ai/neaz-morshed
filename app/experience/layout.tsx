import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Work Experience',
  description: 'Work history of Neaz Md. Morshed: roles, companies and results across virtual assistance, outsourcing, web design and digital marketing.',
  path: '/experience',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
