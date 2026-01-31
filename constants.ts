
import { Project, Experience, Skill } from './types';

export const COLORS = {
  primary: '#0050FF',
  secondary: '#FFC800',
  lightGray: '#F3F3F3',
  dark: '#222222',
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Project Name 01',
    category: 'UI/UX Design',
    image: 'https://picsum.photos/seed/p1/800/600',
    description: 'I\'m a paragraph. Click here to add your own text and edit me.'
  },
  {
    id: 2,
    title: 'Project Name 02',
    category: 'Branding',
    image: 'https://picsum.photos/seed/p2/800/600',
    description: 'I\'m a paragraph. Click here to add your own text and edit me.'
  },
  {
    id: 3,
    title: 'Project Name 03',
    category: 'Web Design',
    image: 'https://picsum.photos/seed/p3/800/600',
    description: 'I\'m a paragraph. Click here to add your own text and edit me.'
  }
];

export const RESUME_EXPERIENCE: Experience[] = [
  {
    id: 1,
    year: '2023 - Present',
    company: 'Tech Solutions Inc.',
    role: 'Lead UI/UX Designer',
    description: 'Developed user-centric designs for complex SaaS applications, leading a team of 5 designers.'
  },
  {
    id: 2,
    year: '2020 - 2023',
    company: 'Creative Agency',
    role: 'Senior Designer',
    description: 'Spearheaded branding and web design projects for Fortune 500 clients.'
  },
  {
    id: 3,
    year: '2018 - 2020',
    company: 'Startup Hub',
    role: 'Junior UI Designer',
    description: 'Collaborated with cross-functional teams to build intuitive mobile interfaces.'
  }
];

export const SKILLS: Skill[] = [
  { name: 'UI/UX Design', level: 95 },
  { name: 'Visual Branding', level: 85 },
  { name: 'Wireframing', level: 90 },
  { name: 'Product Strategy', level: 80 }
];
