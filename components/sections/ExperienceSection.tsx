"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Calendar } from 'lucide-react';
import { SectionHeader, Card, Container } from '@/components/ui';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  type: 'full-time' | 'part-time' | 'project';
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-16 sm:py-24 lg:py-32 relative">
      <Container>
        <div className="mb-16 sm:mb-24">
          <SectionHeader
            subtitle="Professional Journey"
            title="Experience"
            align="center"
          />
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl h-full flex flex-col hover:border-[#2ecc71]/30 transition-all group">
                {/* Company & Position */}
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-[#2ecc71]/10 border border-[#2ecc71]/20 group-hover:bg-[#2ecc71]/20 transition-all">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#2ecc71]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-black text-white mb-1 group-hover:text-[#2ecc71] transition-colors">
                        {exp.company}
                      </h3>
                      <p className="text-[#2ecc71] font-semibold text-sm sm:text-base">{exp.position}</p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{exp.start_date} - {exp.end_date}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <ul className="space-y-2 flex-1 mb-4">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-slate-400 text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-[#2ecc71] mt-1.5">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                {/* Type Badge */}
                <div className="mt-auto pt-4 border-t border-white/5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    exp.type === 'full-time' ? 'bg-[#2ecc71]/10 text-[#2ecc71]' :
                    exp.type === 'part-time' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {exp.type.replace('-', ' ')}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Know More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <Link href="/experience">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-[#2ecc71] text-slate-950 font-black rounded-2xl shadow-xl shadow-[#2ecc71]/30 uppercase tracking-wider text-sm sm:text-base hover:shadow-[#2ecc71]/50 transition-all"
            >
              Know More
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
