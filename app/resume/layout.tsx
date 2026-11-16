import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Resume',
  description: 'Resume of Neaz Md. Morshed, Virtual Assistant and Outsourcing Expert: experience, education, skills and certifications.',
  path: '/resume',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
