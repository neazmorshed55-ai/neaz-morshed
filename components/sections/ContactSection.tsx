"use client";

import React from 'react';
import { Mail, Globe, ArrowRight } from 'lucide-react';
import { Button, SectionHeader, Container } from '@/components/ui';

export default function ContactSection() {
  return (
    <section id="contact" className="py-8 sm:py-12 lg:py-16 bg-page">
      <Container>
        <div className="bg-surface rounded-[3rem] sm:rounded-[4rem] lg:rounded-[6rem] p-6 sm:p-12 lg:p-24 border border-line relative overflow-hidden shadow-2xl text-center">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full -z-10 np-orb [--c:87_119_255] [--a:0.11]" />
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full -z-10 np-orb [--c:87_119_255] [--a:0.11]" />

          <SectionHeader
            subtitle="Get In Touch"
            title="Ready to Connect?"
            description="Have a project in mind or want to discuss collaboration opportunities? Let's turn your ideas into reality. I respond within 12 hours."
            align="center"
          />

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-surface-2/70 border border-line">
              <Mail className="text-primary w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">contact@neazmdmorshed.com</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-surface-2/70 border border-line">
              <Globe className="text-primary w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">Available Globally</span>
            </div>
          </div>

          <Button href="/contact" icon={ArrowRight} size="lg">
            Contact Me
          </Button>
        </div>
      </Container>
    </section>
  );
}
