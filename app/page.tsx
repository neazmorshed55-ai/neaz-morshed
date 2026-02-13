"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Database, Target, Layout, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FooterLinks from '@/components/FooterLinks';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import {
  HeroSection,
  SkillsSection,
  ServicesSection,
  ExperienceSection,
  ContactSection,
} from '@/components/sections';
import { supabase } from '@/lib/supabase';

// Setup fallback data just in case DB is empty or fails
const defaultHero = {
  hero_subtitle: 'Powering Global Business Growth Since 2014',
  hero_title_prefix: 'I AM',
  hero_name: 'Neaz Md. Morshed',
  hero_description: 'I handle the heavy lifting of business operations so you can focus on scale. Powered by modern tech stack.',
  hero_typewriter_texts: [
    'Virtual Assistant Expert',
    'Lead Generation Specialist',
    'CRM & Data Management Pro',
    'Next.js & Supabase Developer',
    'Business Process Optimizer',
    'Top Rated Freelancer',
  ],
  hero_stats: [
    { label: 'Job Success', value: 100, suffix: '%' },
    { label: 'Global Clients', value: 1000, suffix: '+' },
    { label: 'Hours Completed', value: 10000, suffix: '+' },
  ]
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState(defaultHero);
  const [skills, setSkills] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Hero Content from API route (with no-cache)
        const heroResponse = await fetch('/api/homepage', {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache' }
        });

        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          console.log('Fetched hero data from API:', heroData);
          if (heroData && !heroData.error) {
            setHeroContent(heroData);
          }
        } else {
          console.error('Failed to fetch hero data:', heroResponse.status, heroResponse.statusText);
        }

        // Fetch Skills (Top 6 by order) - using supabase for now
        if (supabase) {
          const { data: skillsData } = await supabase
            .from('skills')
            .select('*')
            .order('order_index', { ascending: true })
            .limit(6);

          if (skillsData) {
            setSkills(skillsData.map(s => ({
              name: s.name,
              level: s.proficiency
            })));
          }

          // Fetch Services (Top 4)
          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .order('order_index', { ascending: true })
            .limit(4);

          if (servicesData) {
            setServices(servicesData.map(s => ({
              id: s.id,
              title: s.title,
              slug: s.slug,
              icon: getIcon(s.icon),
              desc: s.description
            })));
          }

          // Fetch Experiences (Top 4)
          const { data: experiencesData } = await supabase
            .from('experiences')
            .select('*')
            .order('order_index', { ascending: true })
            .limit(4);

          if (experiencesData) {
            setExperiences(experiencesData);
          }
        }

      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Helper to map icon string to React Node
  const getIcon = (iconName: string) => {
    const props = { className: "w-8 h-8 sm:w-10 sm:h-10" };
    switch (iconName) {
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Database': return <Database {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Layout': return <Layout {...props} />;
      default: return <Briefcase {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0b0f1a] text-white selection:bg-[#2ecc71] selection:text-slate-900 min-h-screen">
      <Navbar />

      <main>
        <HeroSection
          name={heroContent.hero_name}
          title={heroContent.hero_title_prefix}
          subtitle={heroContent.hero_subtitle}
          typewriterTexts={heroContent.hero_typewriter_texts}
          description={heroContent.hero_description}
          stats={heroContent.hero_stats}
        />

        {skills.length > 0 && <SkillsSection skills={skills} />}

        {/* Portfolio Grid Showcase */}
        <PortfolioShowcase />

        {services.length > 0 && <ServicesSection services={services} />}

        {experiences.length > 0 && <ExperienceSection experiences={experiences} />}

        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <FooterLinks />
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Designed and Developed by{' '}
              <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> •{' '}
              <span className="text-slate-500">Copyright © 2026</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
