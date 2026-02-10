"use client";

import React from 'react';
import { Briefcase, Database, Target, Layout } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  HeroSection,
  SkillsSection,
  ServicesSection,
  // ContactSection removed
} from '@/components/sections';

export default function HomePage() {
  // Configuration
  const config = {
    name: 'NEAZ MD. MORSHED',
    title: 'Expert Virtual Assistant & Professional Outsourcer',
    subtitle: 'Powering Global Business Growth Since 2014',
    description: 'I handle the heavy lifting of business operations so you can focus on scale. Powered by modern tech stack.',
    typewriterTexts: [
      'Virtual Assistant Expert',
      'Lead Generation Specialist',
      'CRM & Data Management Pro',
      'Next.js & Supabase Developer',
      'Business Process Optimizer',
      'Top Rated Freelancer',
    ],
    stats: [
      { label: 'Job Success', value: 100, suffix: '%' },
      { label: 'Global Clients', value: 1000, suffix: '+' },
      { label: 'Hours Completed', value: 10000, suffix: '+' },
    ],
    skills: [
      { name: 'Lead Research', level: 98 },
      { name: 'CRM Management', level: 95 },
      { name: 'Data Mining', level: 97 },
      { name: 'Admin Support', level: 99 },
      { name: 'Video Production', level: 95 },
      { name: 'Web Development', level: 92 },
    ],
    services: [
      {
        id: 1,
        title: 'Virtual Assistant',
        slug: 'virtual-assistant',
        icon: <Briefcase className="w-8 h-8 sm:w-10 sm:h-10" />,
        desc: 'High-level administrative support, including email filtering, scheduling, and custom business workflows.',
      },
      {
        id: 2,
        title: 'Data & CRM Mastery',
        slug: 'data-crm',
        icon: <Database className="w-8 h-8 sm:w-10 sm:h-10" />,
        desc: 'Expert data mining, cleaning, and management across HubSpot, Salesforce, and Zoho.',
      },
      {
        id: 3,
        title: 'Lead Generation',
        slug: 'lead-generation',
        icon: <Target className="w-8 h-8 sm:w-10 sm:h-10" />,
        desc: 'B2B prospect research with verified contact details to fuel your sales pipeline.',
      },
      {
        id: 4,
        title: 'Web & Tech Support',
        slug: 'web-tech-support',
        icon: <Layout className="w-8 h-8 sm:w-10 sm:h-10" />,
        desc: 'WordPress customization, Wix site management, and technical troubleshooting for your digital presence.',
      },
    ],
  };

  return (
    <div className="bg-[#0b0f1a] text-white selection:bg-[#2ecc71] selection:text-slate-900 min-h-screen">
      <Navbar />

      <main>
        <HeroSection
          name={config.name}
          title={config.title}
          subtitle={config.subtitle}
          typewriterTexts={config.typewriterTexts}
          description={config.description}
          stats={config.stats}
        />

        <SkillsSection skills={config.skills} />

        <ServicesSection services={config.services} />

        {/* ContactSection removed */}
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {/* Links hidden as per request */}
          </div>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Designed and Developed by{' '}
            <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> •{' '}
            <span className="text-slate-500">Copyright © 2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
