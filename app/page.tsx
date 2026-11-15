import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import FooterLinks from '@/components/FooterLinks';
import IPadShowcase from '@/components/IPadShowcase';
import VideoReviews from '@/components/VideoReviews';
import {
  HeroSection,
  SkillsSection,
  ServicesSection,
  ExperienceSection,
  // ContactSection is intentionally not used on the portfolio variant
} from '@/components/sections';
import { getHomepageData } from '@/lib/homepage-data';

// Rendered on the server and cached; refreshed in the background at most
// once a minute, so admin edits show up within about a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const { hero, profileImage, skills, services, experiences, portfolio } = await getHomepageData({
    portfolioLimit: 60,
  });

  return (
    <div className="bg-page text-ink min-h-screen">
      <Navbar />

      <main>
        <HeroSection
          name={hero.hero_name}
          title={hero.hero_title_prefix}
          subtitle={hero.hero_subtitle}
          typewriterTexts={hero.hero_typewriter_texts}
          description={hero.hero_description}
          stats={hero.hero_stats}
          profileImage={profileImage}
        />

        {/* Featured video testimonial — the full list lives on /reviews */}
        <VideoReviews limit={1} className="mt-16 sm:mt-24" />

        {skills.length > 0 && <SkillsSection skills={skills} />}

        {/* iPad Portfolio Showcase */}
        <IPadShowcase items={portfolio} />

        {services.length > 0 && <ServicesSection services={services} />}

        {experiences.length > 0 && <ExperienceSection experiences={experiences} />}
      </main>

      {/* Footer */}
      <footer className="py-8 sm:py-10 border-t border-line bg-surface mt-16 sm:mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <FooterLinks />
            <p className="text-muted text-xs sm:text-sm font-medium">
              Designed and Developed by{' '}
              <span className="text-primary font-semibold">Neaz Morshed</span> •{' '}
              <span className="text-muted">Copyright © {new Date().getFullYear()}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
