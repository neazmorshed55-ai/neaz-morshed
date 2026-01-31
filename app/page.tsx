
"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, CheckCircle2, ArrowRight, Briefcase, 
  Mail, Phone, Send, ExternalLink, Target, 
  Database, Search, BarChart3, Globe, ShieldCheck,
  Github, Linkedin, Award, Layout
} from 'lucide-react';

// Supabase Readiness
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function PortfolioPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const name = "NEAZ MD. MORSHED";
  const title = "Virtual Assistant & Professional Outsourcer";

  const skills = [
    { name: 'B2B Lead Generation', level: 95 },
    { name: 'Data Entry & Mining', level: 98 },
    { name: 'SEO Strategy', level: 85 },
    { name: 'E-commerce Ops', level: 90 },
    { name: 'Cold Emailing', level: 88 }
  ];

  const experience = [
    {
      id: 1,
      year: '2022 - Present',
      role: 'Top Rated Virtual Assistant',
      company: 'Upwork Global',
      desc: 'Helping international clients scale with precise lead generation and admin support.'
    },
    {
      id: 2,
      year: '2020 - 2022',
      role: 'Lead Data Specialist',
      company: 'Outsource Pro Ltd.',
      desc: 'Directed high-volume data extraction projects for global real estate firms.'
    },
    {
      id: 3,
      year: '2018 - 2020',
      role: 'Junior VA',
      company: 'Tech Solutions Hub',
      desc: 'Assisted in daily operations and CRM management for growing startups.'
    }
  ];

  const portfolio = [
    { id: 1, title: 'Real Estate Leads', cat: 'Lead Gen', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Shopify Store Ops', cat: 'VA Support', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Market Research 2024', cat: 'Data Analysis', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="bg-[#0b0f1a] text-white selection:bg-[#2ecc71] selection:text-slate-950">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center font-black text-slate-950 group-hover:rotate-6 transition-transform shadow-[0_0_20px_rgba(46,204,113,0.3)]">
              NM
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">NEAZ MORSHED</span>
              <span className="text-[10px] font-bold text-[#2ecc71] tracking-[0.3em] uppercase mt-1">Professional</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Skills', 'Experience', 'Portfolio'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-black tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-colors uppercase">
                {link}
              </a>
            ))}
            <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-8 py-3 rounded-full font-black text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">
              Hire Me
            </a>
          </div>

          <button className="lg:hidden text-[#2ecc71]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 bg-[#0b0f1a] z-[60] p-12 flex flex-col justify-center gap-10"
          >
            {['Home', 'Skills', 'Experience', 'Portfolio', 'Contact'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-5xl font-black text-white hover:text-[#2ecc71] transition-colors flex items-center justify-between"
              >
                {link} <ArrowRight className="text-[#2ecc71]" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center pt-24 relative overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2ecc71]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#2ecc71]/5 rounded-full blur-[100px] -z-10"></div>

          <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center max-w-7xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] mb-10">
                <span className="w-2 h-2 bg-[#2ecc71] rounded-full animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operations Expert</span>
              </div>
              <h1 className="text-6xl lg:text-9xl font-black leading-[0.9] mb-8">
                I'M <br />
                <span className="text-gradient drop-shadow-[0_0_20px_rgba(46,204,113,0.3)]">NEAZ MD.</span> <br />
                <span className="text-gradient drop-shadow-[0_0_20px_rgba(46,204,113,0.3)]">MORSHED</span>
              </h1>
              <p className="text-xl lg:text-2xl font-medium text-slate-400 mb-12 max-w-xl leading-relaxed">
                Expert <span className="text-white font-bold">Virtual Assistant</span> & Professional Outsourcer focused on helping businesses scale with 100% accuracy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <a href="#portfolio" className="w-full sm:w-auto px-12 py-5 bg-[#2ecc71] text-slate-950 font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_20px_40px_rgba(46,204,113,0.3)] uppercase tracking-widest text-sm">
                  View Work <ArrowRight size={20} />
                </a>
                <div className="flex gap-6 items-center">
                  <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors"><Linkedin /></a>
                  <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors"><Github /></a>
                  <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors"><Globe /></a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative p-6">
                <div className="aspect-[4/5] w-full max-w-md mx-auto rounded-[3.5rem] bg-slate-900 border-8 border-white/5 overflow-hidden shadow-3xl relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                    alt="Neaz Morshed" 
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>
                </div>
                
                {/* Floating Badges */}
                <div className="absolute -bottom-4 -left-4 bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl animate-bounce-slow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#2ecc71] rounded-2xl flex items-center justify-center text-slate-950"><ShieldCheck size={32} /></div>
                    <div>
                      <p className="text-2xl font-black text-white">99%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-24">
              <div>
                <span className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.4em] mb-4 inline-block">Specialization</span>
                <h2 className="text-4xl lg:text-6xl font-black mb-12">MY CORE <br /> <span className="text-[#2ecc71]">EXPERTISE</span></h2>
                <div className="space-y-10">
                  {skills.map((skill, index) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{skill.name}</span>
                        <span className="text-[#2ecc71] font-black">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className="h-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60] rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: <Target className="w-8 h-8" />, title: 'Lead Gen', desc: 'Precise B2B lead hunting.' },
                  { icon: <Briefcase className="w-8 h-8" />, title: 'VA Support', desc: 'Daily business management.' },
                  { icon: <Database className="w-8 h-8" />, title: 'Data Entry', desc: 'High volume, high accuracy.' },
                  { icon: <Search className="w-8 h-8" />, title: 'SEO Ops', desc: 'Boosting digital visibility.' }
                ].map((item, i) => (
                  <div key={i} className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-[#2ecc71]/30 transition-all group hover:-translate-y-2 duration-300">
                    <div className="text-[#2ecc71] mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="experience" className="py-32 bg-[#0e1422]">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-24">
              <span className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.4em] mb-4 inline-block">Journey</span>
              <h2 className="text-4xl lg:text-6xl font-black">PROFESSIONAL HISTORY</h2>
            </div>

            <div className="relative">
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-[#2ecc71]/20 -translate-x-1/2 hidden md:block"></div>

              <div className="space-y-24">
                {experience.map((exp, index) => (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="md:w-1/2 text-center md:text-left">
                      <span className="text-[#2ecc71] font-black text-xl mb-4 block tracking-tighter">{exp.year}</span>
                      <h4 className="text-2xl font-black mb-2 uppercase">{exp.role}</h4>
                      <p className="text-[#2ecc71] font-bold text-[10px] uppercase tracking-[0.3em] mb-6">{exp.company}</p>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">{exp.desc}</p>
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full bg-[#0b0f1a] border-4 border-[#2ecc71] flex items-center justify-center text-[#2ecc71] shadow-[0_0_20px_rgba(46,204,113,0.3)] shrink-0">
                      <CheckCircle2 size={24} />
                    </div>

                    <div className="md:w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section id="portfolio" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div>
                <span className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.4em] mb-4 inline-block">Portfolio</span>
                <h2 className="text-4xl lg:text-6xl font-black uppercase">Recent <span className="text-[#2ecc71]">Work</span></h2>
              </div>
              <p className="text-slate-500 max-w-xs text-sm font-medium uppercase tracking-widest text-center md:text-right">A collection of verified results delivered to clients.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {portfolio.map((item) => (
                <motion.div 
                  key={item.id} 
                  whileHover={{ y: -15 }}
                  className="group relative bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5 transition-all duration-500 hover:border-[#2ecc71]/40 shadow-2xl"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="p-10">
                    <span className="text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em]">{item.cat}</span>
                    <h3 className="text-xl font-black mt-3 mb-6 tracking-tight uppercase">{item.title}</h3>
                    <a href="#" className="inline-flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest hover:text-[#2ecc71] transition-colors">
                      Project Info <ExternalLink size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-[#0e1422] rounded-[4rem] p-12 lg:p-24 border border-white/5 shadow-3xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ecc71]/5 rounded-full blur-3xl"></div>
              
              <h2 className="text-5xl lg:text-8xl font-black mb-12 leading-tight uppercase relative z-10">
                Let's Build <br /> <span className="text-[#2ecc71]">Together</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 mt-20 text-left relative z-10">
                <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-20 h-20 bg-[#2ecc71] rounded-3xl flex items-center justify-center text-slate-950 group-hover:rotate-12 transition-all shadow-xl shadow-[#2ecc71]/20">
                    <Mail size={36} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Me</p>
                    <p className="text-2xl font-black tracking-tighter">hello@neaz.pro</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#2ecc71] group-hover:-rotate-12 transition-all border border-white/10">
                    <Phone size={36} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">WhatsApp</p>
                    <p className="text-2xl font-black tracking-tighter">+880 123 456 789</p>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-24 w-full py-8 bg-[#2ecc71] text-slate-950 font-black rounded-3xl flex items-center justify-center gap-4 shadow-2xl shadow-[#2ecc71]/20 text-xl uppercase tracking-widest"
              >
                Send Message <Send size={24} />
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center gap-8 mb-10">
          <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors uppercase font-black text-[10px] tracking-widest">LinkedIn</a>
          <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors uppercase font-black text-[10px] tracking-widest">Upwork</a>
          <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors uppercase font-black text-[10px] tracking-widest">Twitter</a>
        </div>
        <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.5em]">
          © 2024 {name} • Built with Excellence
        </p>
      </footer>

      {/* Back to top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#2ecc71] text-slate-950 rounded-3xl flex items-center justify-center shadow-2xl shadow-[#2ecc71]/30 hover:scale-110 transition-all z-[100] group"
      >
        <ArrowRight size={32} className="-rotate-90 group-hover:-translate-y-1 transition-transform" />
      </button>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
