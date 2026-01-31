"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Briefcase, 
  Mail, Phone, Target, 
  Database, Search, ShieldCheck,
  Github, Linkedin, Award, Users, Rocket,
  CheckCircle, Globe, Zap, Clock, ExternalLink, ChevronRight,
  TrendingUp, Layers, Check
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
  const role = "Expert Virtual Assistant & B2B Outsourcing Partner";

  const stats = [
    { label: 'Job Success', value: '100%', icon: <Award className="w-5 h-5" /> },
    { label: 'Global Clients', value: '180+', icon: <Users className="w-5 h-5" /> },
    { label: 'Hours Completed', value: '5,000+', icon: <Clock className="w-5 h-5" /> },
  ];

  const services = [
    {
      id: 1,
      title: 'B2B Lead Generation',
      icon: <Target className="w-12 h-12" />,
      desc: 'Sourcing high-quality B2B leads with verified emails and decision-maker contact details for your sales pipeline.'
    },
    {
      id: 2,
      title: 'Data & CRM Solutions',
      icon: <Database className="w-12 h-12" />,
      desc: 'Comprehensive data entry, mining, and management across platforms like HubSpot, Salesforce, and Pipedrive.'
    },
    {
      id: 3,
      title: 'Virtual Assistance',
      icon: <Briefcase className="w-12 h-12" />,
      desc: 'Taking the load off your plate with administrative support, calendar management, and specialized research.'
    },
    {
      id: 4,
      title: 'Market Intelligence',
      icon: <Search className="w-12 h-12" />,
      desc: 'In-depth market research and competitor analysis to give you a strategic advantage in your industry.'
    }
  ];

  const portfolio = [
    { id: 1, title: 'Real Estate Data Mining', cat: 'Lead Generation', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'SaaS Outreach Campaign', cat: 'Marketing', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Store Ops Optimization', cat: 'Operations', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }
  ];

  const skills = [
    { name: 'Lead Research', level: 98 },
    { name: 'CRM Management', level: 95 },
    { name: 'Data Mining', level: 97 },
    { name: 'Admin Support', level: 99 },
    { name: 'E-commerce Management', level: 92 },
    { name: 'Market Research', level: 94 }
  ];

  return (
    <div className="bg-[#0b0f1a] text-white selection:bg-[#2ecc71] selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] min-h-screen">
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
            {['Home', 'Services', 'Work', 'Skills'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">
                {link}
              </a>
            ))}
            <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">Start Project</a>
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
            {['Home', 'Services', 'Work', 'Skills', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
          
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center max-w-7xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                <Zap size={14} className="fill-[#2ecc71]" />
                Building Success Through Precision
              </div>
              <h1 className="text-7xl lg:text-[100px] font-black leading-[0.85] mb-12 tracking-tighter">
                SCALE <br />
                <span className="text-gradient">OPERATIONS</span> <br />
                WITH <span className="text-[#2ecc71]">SPEED</span>
              </h1>
              <p className="text-xl text-slate-400 mb-14 max-w-lg leading-relaxed font-medium">
                Professional <span className="text-white font-bold">{role}</span>. I deliver the strategic support your business needs to grow exponentially while you focus on the big picture.
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-14 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(46,204,113,0.3)] uppercase tracking-widest text-sm">
                  Let's Collaborate <ArrowRight size={20} />
                </a>
                <div className="flex gap-4 pl-4 border-l border-white/10">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-2xl font-black">{stat.value}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative group">
              <div className="relative z-10 w-full aspect-[4/5] rounded-[5rem] overflow-hidden border-[16px] border-white/5 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Professional VA Neaz Morshed" 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
                  <div className="flex items-center gap-5">
                    <ShieldCheck className="text-[#2ecc71] w-12 h-12" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-[0.1em]">{name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Outsourcing Partner</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#2ecc71]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 bg-slate-900/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div className="max-w-3xl">
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Capabilities</span>
                <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">High-Impact <br /> <span className="text-slate-600">Operations</span></h2>
              </div>
              <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6 font-medium">
                I specialize in high-stakes administrative and marketing operations that require precision and a data-first approach.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map(service => (
                <div key={service.id} className="p-12 bg-slate-900/40 border border-white/5 rounded-[4rem] hover:border-[#2ecc71]/40 hover:bg-slate-900 transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[#2ecc71] mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-flex p-5 bg-white/5 rounded-3xl border border-white/5">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter leading-tight">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{service.desc}</p>
                  </div>
                  <div className="mt-12 flex items-center gap-3 text-[#2ecc71] text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    View Case Study <ArrowRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work Portfolio */}
        <section id="work" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-24">
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Our Impact</span>
              <h2 className="text-7xl lg:text-[110px] font-black uppercase tracking-tighter leading-none">Success <br /><span className="text-slate-600">Gallery</span></h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {portfolio.map(item => (
                <motion.div 
                  key={item.id} 
                  whileHover={{ y: -20 }} 
                  className="group bg-slate-900 rounded-[5rem] overflow-hidden border border-white/5 hover:border-[#2ecc71]/40 transition-all duration-700 shadow-2xl"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <div className="p-3 bg-[#2ecc71] rounded-2xl text-slate-950">
                        <ExternalLink size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-12">
                    <span className="text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.4em]">{item.cat}</span>
                    <h3 className="text-3xl font-black mt-4 uppercase tracking-tighter leading-tight group-hover:text-[#2ecc71] transition-colors">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-slate-900/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-8 block">Expertise</span>
                <h2 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-16">Technical <br /><span className="text-slate-600">Competence</span></h2>
                <div className="space-y-10">
                  {skills.map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-4">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{skill.name}</span>
                        <span className="text-[#2ecc71] font-black">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          whileInView={{ width: `${skill.level}%` }} 
                          transition={{ duration: 1.5, ease: "circOut" }} 
                          className="h-full bg-[#2ecc71] rounded-full shadow-[0_0_20px_rgba(46,204,113,0.5)]"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 relative">
                <div className="space-y-8 mt-16">
                  <div className="p-12 bg-[#2ecc71] rounded-[4rem] text-slate-950 flex flex-col justify-center items-center text-center aspect-square shadow-2xl shadow-[#2ecc71]/20">
                    <TrendingUp className="w-12 h-12 mb-6" />
                    <div className="text-5xl font-black mb-1 tracking-tighter">98%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Accuracy Rate</div>
                  </div>
                  <div className="p-12 bg-white/5 border border-white/10 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                    <Layers className="text-[#2ecc71] w-12 h-12 mb-6" />
                    <div className="text-4xl font-black mb-1 text-white">Top Rated</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="p-12 bg-slate-900 border border-white/5 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                    <Globe className="text-[#2ecc71] w-12 h-12 mb-6" />
                    <div className="text-4xl font-black mb-1 text-white">Global</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Network</div>
                  </div>
                  <div className="p-12 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                    <Rocket className="text-white w-12 h-12 mb-6" />
                    <div className="text-4xl font-black mb-1 text-white tracking-tighter">Scalable</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-[#0e1526] rounded-[6rem] p-16 lg:p-28 border border-white/10 relative overflow-hidden text-center shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2ecc71]/10 rounded-full blur-[200px] -z-10"></div>
              
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-12 block">Final Step</span>
              <h2 className="text-7xl lg:text-[120px] font-black mb-20 uppercase leading-[0.8] tracking-tighter">Ready to <br /> <span className="text-slate-600">Elevate?</span></h2>
              
              <div className="grid md:grid-cols-2 gap-10 mt-28 mb-24 text-left">
                <div className="p-12 rounded-[4.5rem] bg-white/5 border border-white/10 hover:border-[#2ecc71]/40 transition-all group">
                  <Mail className="text-[#2ecc71] mb-10" size={64} />
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Official Mail</div>
                  <div className="text-2xl font-black text-white hover:text-[#2ecc71] transition-colors break-all">hello@neaz.pro</div>
                </div>
                <div className="p-12 rounded-[4.5rem] bg-white/5 border border-white/10 hover:border-[#2ecc71]/40 transition-all group">
                  <Phone className="text-[#2ecc71] mb-10" size={64} />
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Direct Link</div>
                  <div className="text-2xl font-black text-white hover:text-[#2ecc71] transition-colors">+880 123 456 789</div>
                </div>
              </div>

              <button className="w-full py-14 bg-[#2ecc71] text-slate-950 font-black rounded-[4rem] text-3xl uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_70px_rgba(46,204,113,0.4)] flex items-center justify-center gap-10 group">
                Hire Neaz Morshed <ArrowRight size={48} className="group-hover:translate-x-3 transition-transform" />
              </button>
              
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
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
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
        html {
          scroll-behavior: smooth;
        }
        body {
          background-color: #0b0f1a;
          color: white;
        }
      `}</style>
    </div>
  );
}
