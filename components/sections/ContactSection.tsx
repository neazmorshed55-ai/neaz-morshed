"use client";

import React from 'react';
import { Mail, Globe } from 'lucide-react';
import { SectionHeader, Container } from '@/components/ui';

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-page">
      <Container>
        <div className="bg-surface rounded-[3rem] sm:rounded-[4rem] lg:rounded-[6rem] p-6 sm:p-12 lg:p-24 border border-line relative overflow-hidden shadow-2xl text-center">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/5 rounded-full blur-[200px] -z-10 animate-subtle-pulse" />
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-primary/5 rounded-full blur-[200px] -z-10 animate-subtle-pulse" />

          <SectionHeader
            subtitle="Get In Touch"
            title="Ready to Connect?"
            description="Have a project in mind or want to discuss collaboration opportunities? Let's turn your ideas into reality. I respond within 12 hours."
            align="center"
          />

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 ">
            <div className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-surface-2/70 border border-line">
              <Mail className="text-primary w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">contact@neazmdmorshed.com</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-surface-2/70 border border-line">
              <Globe className="text-primary w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">Available Globally</span>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
