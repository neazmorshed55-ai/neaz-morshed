"use client";

import React from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { SectionHeader, SkillBar, StatCard, Container } from '@/components/ui';

interface Skill {
  name: string;
  level: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-16 sm:py-24 lg:py-32 bg-slate-900/10">
      <Container>
        <SectionHeader
          subtitle="Expertise"
          title="Technical Competence"
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Skills */}
          <div className="space-y-8 sm:space-y-10">
            {skills.map((skill) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            <StatCard
              label="Accuracy"
              value={98}
              suffix="%"
              icon={TrendingUp}
              variant="highlight"
            />
            <StatCard
              label="Global Status"
              value={0}
              suffix=""
              icon={Star}
              variant="default"
            >
              <Star className="text-[#2ecc71] w-8 h-8 sm:w-12 sm:h-12 mb-4" />
              <div className="text-3xl sm:text-4xl font-black mb-1">Top Rated</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</div>
            </StatCard>
          </div>
        </div>
      </Container>
    </section>
  );
}
