"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Database, Target, Layout, ArrowRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FooterLinks from '@/components/FooterLinks';
import IPadShowcase from '@/components/IPadShowcase';
import {
  HeroSection,
  SkillsSection,
  // ContactSection removed
} from '@/components/sections';
import { Card, Container, SectionHeader } from '@/components/ui';
import { supabase } from '@/lib/supabase';

// Setup fallback data just in case DB is empty or fails
const defaultHero = {
  hero_subtitle: 'Powering Global Business Growth Since 2014',
  hero_title_prefix: 'I AM',
  hero_name: 'NEAZ MORSHED',
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
  const [heroContent, setHeroContent] = useState(defaultHero);
  const [skills, setSkills] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all data in parallel for faster loading
        const [heroResponse, skillsResult, servicesResult, experiencesResult] = await Promise.all([
          fetch('/api/homepage', {
            next: { revalidate: 300 } // Cache for 5 minutes
          }),
          supabase
            ? supabase
              .from('skills')
              .select('*')
              .order('order_index', { ascending: true })
              .limit(6)
            : Promise.resolve({ data: null }),
          supabase
            ? supabase
              .from('services')
              .select('*')
              .order('order_index', { ascending: true })
              .limit(4)
            : Promise.resolve({ data: null }),
          supabase
            ? supabase
              .from('experiences')
              .select('*')
              .order('start_date', { ascending: false })
              .limit(5)
            : Promise.resolve({ data: null })
        ]);

        // Process hero data
        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData && !heroData.error) {
            setHeroContent(heroData);
          }
        }

        // Process skills data
        if (skillsResult.data) {
          setSkills(skillsResult.data.map(s => ({
            name: s.name,
            level: s.proficiency
          })));
        }

        // Process services data
        if (servicesResult.data) {
          setServices(servicesResult.data.map(s => ({
            id: s.id,
            title: s.title,
            slug: s.slug,
            icon: getIcon(s.icon),
            desc: s.description
          })));
        }

        // Process experiences data
        if (experiencesResult.data) {
          setExperiences(experiencesResult.data);
        }

      } catch (error) {
        console.error('Error fetching homepage data:', error);
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

        {/* iPad Portfolio Showcase */}
        <IPadShowcase />

        {/* Services Section - Inline */}
        {services.length > 0 && (
          <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0b0f1a] via-[#0f1419] to-[#0b0f1a]">
            <Container>
              <SectionHeader
                title="Services"
                subtitle="What I Offer"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mt-12">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/services/${service.slug}`}>
                      <Card className="h-full group hover:border-[#2ecc71]/50 transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col h-full">
                          <div className="text-[#2ecc71] mb-4 group-hover:scale-110 transition-transform duration-300">
                            {service.icon}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-[#2ecc71] transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="text-slate-400 text-sm sm:text-base leading-relaxed flex-grow">
                            {service.desc}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center mt-12"
              >
                <Link href="/services">
                  <button className="group px-8 py-4 bg-[#2ecc71] text-slate-900 font-semibold rounded-lg hover:bg-[#27ae60] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-[#2ecc71]/20">
                    See More Services
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </motion.div>
            </Container>
          </section>
        )}

        {/* Experiences Section - Inline */}
        {experiences.length > 0 && (
          <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0b0f1a] via-[#0f1419] to-[#0b0f1a]">
            <Container>
              <SectionHeader
                title="Experience"
                subtitle="Professional Journey"
              />

              <div className="grid grid-cols-1 gap-6 mt-12">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group hover:border-[#2ecc71]/50 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-[#2ecc71] transition-colors duration-300">
                            {exp.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm sm:text-base mb-3">
                            <span className="font-semibold text-[#2ecc71]">{exp.company}</span>
                            {exp.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {exp.location}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {' - '}
                              {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center mt-12"
              >
                <Link href="/experience">
                  <button className="group px-8 py-4 bg-[#2ecc71] text-slate-900 font-semibold rounded-lg hover:bg-[#27ae60] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-[#2ecc71]/20">
                    Know More
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </motion.div>
            </Container>
          </section>
        )}

        {/* ContactSection removed */}
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
