"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Target, LucideIcon } from 'lucide-react';
import { SectionHeader, Card, Container } from '@/components/ui';

interface Service {
  id: number;
  title: string;
  slug: string;
  icon: React.ReactNode;
  desc: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 relative">
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
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2ecc71]/20 via-[#2ecc71]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#2ecc71]/30 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#2ecc71]/10 border border-[#2ecc71]/20">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#2ecc71]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base leading-relaxed mb-2">
                    Custom-tailored <span className="text-[#2ecc71]">outsourcing strategies</span> for modern startups and established enterprises.
                  </p>
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse" />
                    Trusted by 1000+ businesses
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <Card className="p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] flex flex-col justify-between h-full relative overflow-hidden cursor-pointer group">
                <div>
                  <div className="text-[#2ecc71] mb-8 sm:mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-flex p-4 sm:p-6 bg-white/5 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5">
                    {service.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 uppercase tracking-tighter leading-tight group-hover:text-[#2ecc71] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{service.desc}</p>
                </div>
                <div className="mt-10 sm:mt-14 flex items-center gap-3 text-[#2ecc71] text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  View Portfolio <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
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
              className="flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-[#2ecc71] text-slate-950 font-black rounded-2xl shadow-xl shadow-[#2ecc71]/30 uppercase tracking-wider text-sm sm:text-base hover:shadow-[#2ecc71]/50 transition-all"
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
