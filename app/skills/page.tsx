"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Download, ExternalLink,
  TrendingUp, Star, Video, Search, PenTool,
  Database, Target, Briefcase, Layout, Code,
  CheckCircle2
} from 'lucide-react';

export default function SkillsPage() {
  const skills = [
    { name: 'Lead Research', level: 98 },
    { name: 'CRM Management', level: 95 },
    { name: 'Data Mining', level: 97 },
    { name: 'Admin Support', level: 99 },
    { name: 'Video Production', level: 95 },
    { name: 'Web Development', level: 92 }
  ];

  const technicalExperience = [
    { label: 'YouTube Management', years: '4+ Years', icon: <Video size={24} /> },
    { label: 'Market Research', years: '10+ Years', icon: <Search size={24} /> },
    { label: 'Content Operations', years: '5+ Years', icon: <PenTool size={24} /> },
  ];

  const skillCategories = [
    {
      title: 'Administrative & VA',
      icon: <Briefcase size={28} />,
      skills: ['Email Management', 'Calendar Scheduling', 'Travel Arrangements', 'Document Preparation', 'Meeting Coordination', 'Task Prioritization']
    },
    {
      title: 'Data & Research',
      icon: <Database size={28} />,
      skills: ['Data Entry', 'Data Mining', 'Web Scraping', 'Lead Generation', 'Market Research', 'Competitor Analysis']
    },
    {
      title: 'CRM & Tools',
      icon: <Target size={28} />,
      skills: ['HubSpot', 'Salesforce', 'Zoho CRM', 'Monday.com', 'Asana', 'Trello']
    },
    {
      title: 'Web & Design',
      icon: <Layout size={28} />,
      skills: ['WordPress', 'Wix', 'Canva', 'Photoshop', 'HTML/CSS', 'Responsive Design']
    },
    {
      title: 'Video & Content',
      icon: <Video size={28} />,
      skills: ['Video Editing', 'YouTube SEO', 'Thumbnail Design', 'Content Writing', 'Social Media', 'Channel Management']
    },
    {
      title: 'Technical',
      icon: <Code size={28} />,
      skills: ['Google Workspace', 'Microsoft Office', 'Zapier', 'API Integration', 'Automation', 'Reporting']
    }
  ];

  const pdfUrl = "https://3a1ca1eb-d638-4203-b0b1-2302cab10e23.filesusr.com/ugd/d8469f_9322816617d04ddb9ef23edefa7fad5b.pdf";

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <Link href="/" className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-[#2ecc71] rounded-2xl flex items-center justify-center font-black text-slate-950 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.3)]">NM</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tighter leading-none">NEAZ MORSHED</span>
              <span className="text-[10px] text-[#2ecc71] font-bold tracking-[0.2em] mt-1 uppercase">Top Rated Pro</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Home</Link>
            <Link href="/skills" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Skills</Link>
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/experience" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Experience</Link>
            <Link href="/reviews" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Reviews</Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">HIRE ME</a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Skill Showcase */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 top-0 w-1/4 h-full bg-slate-800/30"></div>
          <div className="absolute right-0 top-0 w-1/4 h-full bg-slate-800/30"></div>
        </div>
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Decorative Arc */}
            <div className="flex justify-center mb-8">
              <svg width="200" height="60" viewBox="0 0 200 60" fill="none" className="text-[#2ecc71]">
                <path d="M10 50 Q100 0 190 50" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
              <span className="text-[#2ecc71]">SKILL</span> SHOWCASE
            </h1>

            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              If you want one stop administrative support then you can give your attention to this profile. You can spend few time to save your valuable time. I have 10+ years working experience in online and offline marketplace.
            </p>

            <Link
              href="/skills/portfolio"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-[#2ecc71] text-white font-black rounded-xl hover:bg-[#2ecc71] hover:text-slate-900 transition-all uppercase tracking-widest text-sm group"
            >
              View Full Skill Portfolio
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Technical Competence Section */}
      <section className="py-20 bg-slate-900/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Expertise</span>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              Technical <span className="text-slate-600">Competence</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Skill Bars */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{skill.name}</span>
                    <span className="text-[#2ecc71] font-black">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                      className="h-full bg-[#2ecc71] rounded-full shadow-[0_0_20px_rgba(46,204,113,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="p-10 bg-[#2ecc71] rounded-[3rem] text-slate-950 flex flex-col justify-center items-center text-center aspect-square shadow-2xl shadow-[#2ecc71]/20">
                <TrendingUp className="w-10 h-10 mb-4" />
                <div className="text-5xl font-black mb-1">98%</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Accuracy</div>
              </div>
              <div className="p-10 bg-slate-900 border border-white/10 rounded-[3rem] flex flex-col justify-center items-center text-center aspect-square">
                <Star className="text-[#2ecc71] w-10 h-10 mb-4" />
                <div className="text-4xl font-black mb-1">Top Rated</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Capabilities</span>
            <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
              Skill <span className="text-slate-600">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-slate-900/60 border border-white/5 rounded-3xl hover:border-[#2ecc71]/30 transition-all group"
              >
                <div className="text-[#2ecc71] mb-6 p-4 bg-white/5 rounded-2xl inline-flex group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-6">{category.title}</h3>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-3 text-slate-400 text-sm">
                      <CheckCircle2 size={14} className="text-[#2ecc71]" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Experience Summary */}
      <section className="py-20 bg-slate-900/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Experience</span>
            <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
              Years of <span className="text-slate-600">Expertise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technicalExperience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="flex items-center justify-between p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-[#2ecc71]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-[#2ecc71]/10 rounded-2xl text-[#2ecc71] group-hover:bg-[#2ecc71] group-hover:text-slate-900 transition-all">
                    {exp.icon}
                  </div>
                  <span className="text-lg font-bold uppercase tracking-tighter">{exp.label}</span>
                </div>
                <span className="text-[#2ecc71] font-black tracking-widest text-sm uppercase">{exp.years}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-16 bg-slate-900/60 border border-white/10 rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#2ecc71]/10 rounded-full blur-[100px] -z-10"></div>

            <h3 className="text-4xl font-black uppercase tracking-tight mb-6">
              Ready to Work Together?
            </h3>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Let's discuss how my skills can help your business grow and succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="px-10 py-5 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-sm flex items-center gap-3"
              >
                Contact Me <ArrowRight size={18} />
              </Link>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:border-[#2ecc71] transition-all uppercase tracking-widest text-sm flex items-center gap-3"
              >
                Download PDF <Download size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Neaz Md. Morshed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
