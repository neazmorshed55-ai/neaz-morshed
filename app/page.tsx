"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Briefcase, 
  Mail, Phone, Target, 
  Database, Search, ShieldCheck,
  Github, Linkedin, Award, Users, Clock, 
  Zap, Globe, CheckCircle2, Video, 
  Palette, Layout, Smartphone, PenTool,
  ChevronRight, ExternalLink, MessageSquare,
  TrendingUp, Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PortfolioPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const name = "NEAZ MD. MORSHED";
  const title = "Expert Virtual Assistant & Professional Outsourcer";

  const stats = [
    { label: 'Job Success', value: '100%', icon: <Star className="w-5 h-5" /> },
    { label: 'Global Clients', value: '180+', icon: <Users className="w-5 h-5" /> },
    { label: 'Hours Completed', value: '5,000+', icon: <Clock className="w-5 h-5" /> },
  ];

  const services = [
    {
      id: 1,
      title: 'Virtual Assistant',
      icon: <Briefcase className="w-10 h-10" />,
      desc: 'High-level administrative support, including email filtering, scheduling, and custom business workflows.'
    },
    {
      id: 2,
      title: 'Data & CRM Mastery',
      icon: <Database className="w-10 h-10" />,
      desc: 'Expert data mining, cleaning, and management across HubSpot, Salesforce, and Zoho.'
    },
    {
      id: 3,
      title: 'Lead Generation',
      icon: <Target className="w-10 h-10" />,
      desc: 'B2B prospect research with verified contact details to fuel your sales pipeline.'
    },
    {
      id: 4,
      title: 'Web & Tech Support',
      icon: <Layout className="w-10 h-10" />,
      desc: 'WordPress customization, Wix site management, and technical troubleshooting for your digital presence.'
    }
  ];

  const technicalExperience = [
    { label: 'YouTube Management', years: '4+ Years', icon: <Video size={18} /> },
    { label: 'Market Research', years: '10+ Years', icon: <Search size={18} /> },
    { label: 'Content Operations', years: '5+ Years', icon: <PenTool size={18} /> },
  ];

  return (
    <div className="bg-[#0b0f1a] text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-[#2ecc71] rounded-2xl flex items-center justify-center font-black text-slate-950 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.3)]">NM</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tighter leading-none">NEAZ MORSHED</span>
              <span className="text-[10px] text-[#2ecc71] font-bold tracking-[0.2em] mt-1 uppercase">Top Rated Pro</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Services', 'Experience', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">
                {link}
              </a>
            ))}
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">HIRE ME</a>
          </div>

          <button className="lg:hidden p-2 text-[#2ecc71]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 bg-[#0b0f1a] z-[110] flex flex-col items-center justify-center gap-10 p-6"
          >
            <button className="absolute top-8 right-8 text-[#2ecc71]" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={40} />
            </button>
            {['Home', 'Services', 'Experience', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero */}
        <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
          
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center max-w-7xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                <TrendingUp size={14} className="text-[#2ecc71]" />
                Powering Global Business Growth
              </div>
              <h1 className="text-7xl lg:text-[100px] font-black leading-[0.85] mb-12 tracking-tighter">
                OPTIMIZE <br />
                <span className="text-gradient">OPERATIONS</span> <br />
                FOR <span className="text-[#2ecc71]">SCALE</span>
              </h1>
              <p className="text-xl text-slate-400 mb-14 max-w-lg leading-relaxed font-medium">
                Professional <span className="text-white font-bold">{title}</span>. I handle the complexity so you can focus on high-level strategy and vision.
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-14 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(46,204,113,0.3)] uppercase tracking-widest text-sm">
                  Let's Collaborate <ArrowRight size={20} />
                </a>
                <div className="flex gap-6 pl-4 border-l border-white/10">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-2xl font-black text-white">{stat.value}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative group">
              <div className="relative z-10 w-full aspect-[4/5] rounded-[5rem] overflow-hidden border-[16px] border-white/5 shadow-2xl bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1519085195758-2a89f9c3f732?auto=format&fit=crop&q=80&w=800" 
                  alt="Neaz Md. Morshed" 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center gap-5">
                  <ShieldCheck className="text-[#2ecc71] w-12 h-12" />
                  <div>
                    <div className="text-sm font-black uppercase tracking-[0.1em]">{name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Outsourcing Partner</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#2ecc71]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-32 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div className="max-w-3xl">
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Capabilities</span>
                <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">Strategic <br /> <span className="text-slate-600">Business Support</span></h2>
              </div>
              <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6 font-medium">
                Delivering high-impact assistance designed for the modern remote landscape. Built for reliability and performance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map(service => (
                <div key={service.id} className="p-12 bg-slate-900/40 border border-white/5 rounded-[4rem] hover:border-[#2ecc71]/40 hover:bg-slate-900 transition-all group flex flex-col justify-between h-full relative overflow-hidden">
                  <div>
                    <div className="text-[#2ecc71] mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-flex p-6 bg-white/5 rounded-[2.5rem] border border-white/5">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter leading-tight">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{service.desc}</p>
                  </div>
                  <div className="mt-14 flex items-center gap-3 text-[#2ecc71] text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience / Other Skills */}
        <section id="experience" className="py-32 bg-slate-900/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-8 block">Legacy</span>
                <h2 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12">Years of <br /><span className="text-slate-600">Trust & Reliability</span></h2>
                <div className="space-y-6">
                  {technicalExperience.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-[#2ecc71]/30 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/5 rounded-xl text-[#2ecc71]">
                          {exp.icon}
                        </div>
                        <span className="text-lg font-bold uppercase tracking-tighter">{exp.label}</span>
                      </div>
                      <span className="text-[#2ecc71] font-black tracking-widest text-[11px] uppercase">{exp.years}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 mt-12">
                   <div className="p-10 bg-[#2ecc71] rounded-[4rem] text-slate-950 flex flex-col justify-center items-center text-center aspect-square shadow-2xl">
                      <Star className="w-12 h-12 mb-4" />
                      <div className="text-4xl font-black mb-1">5.0</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Marketplace Rating</div>
                   </div>
                   <div className="p-10 bg-slate-900 border border-white/5 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                      <Globe className="text-[#2ecc71] w-12 h-12 mb-4" />
                      <div className="text-3xl font-black mb-1">Global</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Remote Presence</div>
                   </div>
                </div>
                <div className="space-y-6">
                  <div className="p-10 bg-slate-900 border border-white/5 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                      <Zap className="text-[#2ecc71] w-12 h-12 mb-4" />
                      <div className="text-3xl font-black mb-1">Fast</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Response Time</div>
                   </div>
                   <div className="p-10 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                      <CheckCircle2 className="text-white w-12 h-12 mb-4" />
                      <div className="text-3xl font-black mb-1">Proven</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Track Record</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-[#0e1526] rounded-[6rem] p-16 lg:p-28 border border-white/10 relative overflow-hidden text-center shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2ecc71]/10 rounded-full blur-[200px] -z-10"></div>
              
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-12 block">Final Step</span>
              <h2 className="text-7xl lg:text-[120px] font-black mb-20 uppercase leading-[0.8] tracking-tighter">Let's Build <br /> <span className="text-slate-600">Something</span></h2>
              
              <div className="grid md:grid-cols-2 gap-10 mt-28 mb-24 text-left">
                <div className="p-12 rounded-[4.5rem] bg-white/5 border border-white/10 hover:border-[#2ecc71]/40 transition-all group">
                  <Mail className="text-[#2ecc71] mb-10" size={64} />
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Email</div>
                  <div className="text-2xl font-black text-white hover:text-[#2ecc71] transition-colors break-all">hello@neaz.pro</div>
                </div>
                <div className="p-12 rounded-[4.5rem] bg-white/5 border border-white/10 hover:border-[#2ecc71]/40 transition-all group">
                  <MessageSquare className="text-[#2ecc71] mb-10" size={64} />
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Direct Message</div>
                  <div className="text-2xl font-black text-white hover:text-[#2ecc71] transition-colors">via Fiverr / LinkedIn</div>
                </div>
              </div>

              <a href="https://www.fiverr.com/neaz222" target="_blank" className="w-full py-14 bg-[#2ecc71] text-slate-950 font-black rounded-[4rem] text-3xl uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_70px_rgba(46,204,113,0.4)] flex items-center justify-center gap-10 group">
                Hire Neaz Morshed <ArrowRight size={48} className="group-hover:translate-x-3 transition-transform" />
              </a>
              
              <div className="mt-24 flex justify-center gap-14">
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-all transform hover:scale-125"><Linkedin size={40} /></a>
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-all transform hover:scale-125"><Github size={40} /></a>
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-all transform hover:scale-125"><Globe size={40} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-[#2ecc71] border border-white/10 text-xl shadow-2xl">NM</div>
             <span className="text-[12px] font-black tracking-[0.6em] uppercase text-slate-500">{name}</span>
          </div>
          <p className="text-[12px] font-black text-slate-700 uppercase tracking-[1em]">
            © 2024 • THE PRECISION OUTSOURCER
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: subtle-pulse 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}