
"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, CheckCircle2, ArrowRight, Briefcase, 
  Mail, Phone, Send, ExternalLink, Target, 
  Database, Search, BarChart3, Globe, ShieldCheck,
  Github, Linkedin
} from 'lucide-react';

// Mock Supabase client for demonstration (would use real env vars in production)
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key');

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
    { name: 'Lead Generation', level: 95 },
    { name: 'Data Entry & Mining', level: 98 },
    { name: 'SEO Strategy', level: 85 },
    { name: 'E-commerce Ops', level: 90 },
    { name: 'Cold Email Marketing', level: 88 }
  ];

  const services = [
    {
      id: 1,
      title: 'B2B Lead Generation',
      icon: <Target className="w-8 h-8" />,
      desc: 'Deeply researched leads with verified contact details for your sales funnel.'
    },
    {
      id: 2,
      title: 'Data Solutions',
      icon: <Database className="w-8 h-8" />,
      desc: 'Expert data mining, entry, and cleanup to keep your CRM organized.'
    },
    {
      id: 3,
      title: 'Digital Assistance',
      icon: <Briefcase className="w-8 h-8" />,
      desc: 'Daily administrative support ensuring your operations run like clockwork.'
    },
    {
      id: 4,
      title: 'SEO & Research',
      icon: <Search className="w-8 h-8" />,
      desc: 'Market research and SEO ops to improve your competitive advantage.'
    }
  ];

  const experience = [
    {
      id: 1,
      year: '2022 - Present',
      role: 'Top Rated Virtual Assistant',
      company: 'Upwork Global',
      desc: 'Managing operations for high-ticket clients with a focus on efficiency.'
    },
    {
      id: 2,
      year: '2020 - 2022',
      role: 'Project Lead',
      company: 'Outsource Dynamics',
      desc: 'Led a data team for large-scale real estate lead generation campaigns.'
    }
  ];

  const portfolio = [
    { id: 1, title: 'Real Estate Leads', cat: 'Lead Gen', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Store Management', cat: 'E-com', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Market Research', cat: 'Data', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="bg-[#0b0f1a] text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4 shadow-xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center font-black text-slate-950 group-hover:rotate-6 transition-transform shadow-[0_0_20px_rgba(46,204,113,0.3)]">NM</div>
            <span className="text-xl font-black tracking-tighter">NEAZ MORSHED</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Skills', 'Experience', 'Portfolio'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-black tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-colors uppercase">
                {link}
              </a>
            ))}
            <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-8 py-3 rounded-full font-black text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#2ecc71]/20">HIRE ME</a>
          </div>

          <button className="lg:hidden text-[#2ecc71]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 bg-[#0b0f1a] z-[60] p-12 flex flex-col justify-center gap-10"
          >
            {['Home', 'Skills', 'Experience', 'Portfolio', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black text-white hover:text-[#2ecc71] transition-colors">{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center pt-24 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2ecc71]/10 rounded-full blur-[120px] -z-10"></div>
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center max-w-7xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block px-4 py-1 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              Available for Hire
            </div>
            <h1 className="text-6xl lg:text-[100px] font-black leading-[0.9] mb-10">
              I'M <br />
              <span className="text-gradient drop-shadow-[0_0_20px_rgba(46,204,113,0.3)]">NEAZ MD.</span> <br />
              <span className="text-gradient drop-shadow-[0_0_20px_rgba(46,204,113,0.3)]">MORSHED</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed">
              Scale your business with an expert <span className="text-white font-bold">{title}</span>. Precision, speed, and reliability in every task.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="#portfolio" className="bg-[#2ecc71] text-slate-950 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_20px_40px_rgba(46,204,113,0.3)]">
                VIEW WORK <ArrowRight size={20} />
              </a>
              <div className="flex gap-6 items-center justify-center sm:justify-start">
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors"><Linkedin size={24} /></a>
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-colors"><Github size={24} /></a>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] bg-slate-900 rounded-[3rem] border-8 border-white/5 overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Profile" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl">
              <ShieldCheck className="text-[#2ecc71] w-12 h-12" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-32 bg-[#0b0f1a]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-24">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black mb-12">MY <span className="text-[#2ecc71]">EXPERTISE</span></h2>
              <div className="space-y-10">
                {skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-4">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{skill.name}</span>
                      <span className="text-[#2ecc71] font-black">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1.5 }} className="h-full bg-[#2ecc71] rounded-full"></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map(service => (
                <div key={service.id} className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-[#2ecc71]/30 transition-all group">
                  <div className="text-[#2ecc71] mb-8 group-hover:scale-110 transition-transform">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-32 bg-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-black text-center mb-24 uppercase">Journey <span className="text-[#2ecc71]">Timeline</span></h2>
          <div className="space-y-16">
            {experience.map(exp => (
              <div key={exp.id} className="flex flex-col md:flex-row gap-12 items-start md:items-center p-12 bg-slate-900 rounded-[3rem] border border-white/5">
                <div className="text-[#2ecc71] font-black text-4xl shrink-0">{exp.year}</div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase">{exp.role}</h3>
                  <p className="text-[#2ecc71] font-bold text-[10px] uppercase tracking-widest mb-6">{exp.company}</p>
                  <p className="text-slate-400 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-32 bg-[#0b0f1a]">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-4xl lg:text-6xl font-black mb-20 text-center">LATEST <span className="text-[#2ecc71]">WORK</span></h2>
          <div className="grid md:grid-cols-3 gap-10">
            {portfolio.map(item => (
              <motion.div key={item.id} whileHover={{ y: -10 }} className="group bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500" />
                </div>
                <div className="p-10">
                  <span className="text-[#2ecc71] text-[10px] font-black uppercase tracking-widest">{item.cat}</span>
                  <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 bg-[#0b0f1a]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-[#0e1422] rounded-[4rem] p-12 lg:p-24 border border-white/10 relative overflow-hidden text-center">
            <h2 className="text-5xl lg:text-8xl font-black mb-12 uppercase leading-tight">LET'S <br /> <span className="text-[#2ecc71]">WORK</span></h2>
            <div className="flex flex-col md:flex-row gap-12 justify-center items-center mt-20">
              <div className="flex flex-col items-center">
                <Mail className="text-[#2ecc71] mb-4" size={40} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Email</p>
                <p className="text-xl font-bold">hello@neaz.pro</p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block"></div>
              <div className="flex flex-col items-center">
                <Phone className="text-[#2ecc71] mb-4" size={40} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">WhatsApp</p>
                <p className="text-xl font-bold">+880 123 456 789</p>
              </div>
            </div>
            <button className="mt-20 w-full py-8 bg-[#2ecc71] text-slate-950 font-black rounded-3xl text-xl uppercase tracking-widest hover:scale-105 transition-all">SEND MESSAGE</button>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center text-slate-600 font-black text-[10px] uppercase tracking-[0.5em]">
        © 2024 NEAZ MD. MORSHED • PROFESSIONAL OUTSOURCING
      </footer>
    </div>
  );
}
