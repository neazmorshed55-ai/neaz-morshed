"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Target,
  Briefcase,
  Database,
  Layout,
  Video,
  Search,
  Star,
  PenTool,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeader, Card, Container } from '@/components/ui';
import { Reveal } from '@/components/motion/Reveal';

interface Service {
  id: string | number;
  title: string;
  slug: string;
  /** lucide icon name stored in the database, e.g. "Briefcase" */
  icon: React.ReactNode | string | null;
  desc: string;
}

const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  Database,
  Target,
  Layout,
  Video,
  Search,
  Star,
  PenTool,
  Globe,
};

function ServiceIcon({ icon }: { icon: Service['icon'] }) {
  if (icon && typeof icon !== 'string') return <>{icon}</>;
  const Icon = (typeof icon === 'string' && ICONS[icon]) || Briefcase;
  return <Icon className="w-8 h-8 sm:w-10 sm:h-10" />;
}

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-6 sm:py-8 lg:py-10 relative">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 sm:mb-24 gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <SectionHeader
              subtitle="What I Offer"
              title="Services"
              align="left"
            />
          </div>

          {/* Feature Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full lg:max-w-sm group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-surface-2 to-transparent border border-line hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-ink font-semibold text-sm sm:text-base leading-relaxed mb-2">
                    Custom-tailored <span className="text-primary">outsourcing strategies</span> for modern startups and established enterprises.
                  </p>
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-muted font-bold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Trusted by 1000+ businesses
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.08}>
            <Link href={`/services/${service.slug}`} className="block h-full">
              <Card className="p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] flex flex-col justify-between h-full relative overflow-hidden cursor-pointer group">
                <div>
                  <div className="text-primary mb-8 sm:mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-flex p-4 sm:p-6 bg-surface-2/70 rounded-[2rem] sm:rounded-[2.5rem] border border-line">
                    <ServiceIcon icon={service.icon} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed font-medium">{service.desc}</p>
                </div>
                <div className="mt-10 sm:mt-14 flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  View Portfolio <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
            </Reveal>
          ))}
        </div>

        {/* See More Services Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 uppercase tracking-wider text-sm sm:text-base hover:shadow-primary/50 transition-all"
            >
              See More Services
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
