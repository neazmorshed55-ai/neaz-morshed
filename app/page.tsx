
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, CheckCircle2, ArrowRight, Briefcase, 
  Mail, Phone, Send, ExternalLink, Target, 
  Database, Search, ShieldCheck,
  Github, Linkedin, Award, Users, Rocket
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PortfolioPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const name = "NEAZ MD. MORSHED";
  const title = "Professional Virtual Assistant & Outsourcing Expert";

  const stats = [
    { label: 'Success Rate', value: '99%', icon: <Award className="w-5 h-5" /> },
    { label: 'Happy Clients', value: '150+', icon: <Users className="w-5 h-5" /> },
    { label: 'Projects Done', value: '500+', icon: <Rocket className="w-5 h-5" /> },
  ];

  const skills = [
    { name: 'B2B Lead Generation', level: 98 },
    { name: 'Data Entry & Mining', level: 99 },
    { name: 'Market Research', level: 92 },
    { name: 'E-commerce Management', level: 90 },
    { name: 'Email Marketing (Cold)', level: 88 },
    { name: 'CRM Management', level: 95 }
  ];

  const services = [
    {
      id: 1,
      title: 'Precision Lead Gen',
      icon: <Target className="w-10 h-10" />,
      desc: 'Highly targeted B2B leads with 100% verified contact details to fuel your sales pipeline.'
    },
    {
      id: 2,
      title: 'Smart Data Solutions',
      icon: <Database className="w-10 h-10" />,
      desc: 'Efficient data mining, cleaning, and organization tailored to your business needs.'
    },
    {
      id: 3,
      title: 'Executive Assistance',
      icon: <Briefcase className="w-10 h-10" />,
      desc: 'Top-tier administrative support allowing you to focus on high-level decision making.'
    },
    {
      id: 4,
      title: 'SEO & Research',
      icon: <Search className="w-10 h-10" />,
      desc: 'In-depth market analysis and SEO operations to give you a competitive edge.'
    }
  ];

  const portfolio = [
    { id: 1, title: 'B2B Real Estate Campaign', cat: 'Lead Generation', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Shopify Store Operations', cat: 'E-commerce', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'LinkedIn Outreach Program', cat: 'Marketing', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="bg-[#0b0f1a] text-white selection:bg-[#2ecc71] selection:text-slate-950">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-[#2ecc71] rounded-2xl flex items-center justify-center font-black text-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_30px_rgba(46,204,113,0.4)]">NM</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">NEAZ MORSHED</span>
              <span className="text-[10px] text-[#2ecc71] font-bold tracking-[0.2em] mt-1 uppercase">Professional Outsourcer</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Skills', 'Portfolio', 'Experience'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">
                {link}
              </a>
            ))}
            <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">Get in Touch</a>
          </div>

          <button className="lg:hidden p-2 text-[#2ecc71]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 bg-[#0b0f1a] z-[90] flex flex-col items-center justify-center gap-12 p-6"
          >
            {['Home', 'Skills', 'Portfolio', 'Experience', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-24">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#2ecc71]/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center max-w-7xl">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ecc71] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ecc71]"></span>
                </span>
                Available for Projects
              </div>
              <h1 className="text-7xl lg:text-[110px] font-black leading-[0.85] mb-10 tracking-tighter">
                TRANSFORM <br />
                <span className="text-gradient">OPERATIONS</span> <br />
                INTO <span className="text-[#2ecc71]">RESULTS</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed font-medium">
                Professional <span className="text-white font-bold">Virtual Assistance</span> and <span className="text-white font-bold">B2B Outsourcing</span> that scales your business while you focus on the big picture.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-12 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(46,204,113,0.3)] uppercase tracking-widest text-sm">
                  Let's Talk <ArrowRight size={20} />
                </a>
                <div className="flex items-center gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="px-6 py-2 border-l border-white/10">
                      <div className="text-xl font-black text-white">{stat.value}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative">
              <div className="relative z-10 w-full aspect-[4/5] rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1519085195758-2a89f9c3f732?auto=format&fit=crop&q=80&w=800" 
                  alt="Neaz Md. Morshed" 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-4 mb-2">
                    <ShieldCheck className="text-[#2ecc71] w-8 h-8" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-[0.2em]">{name}</div>
                      <div className="text-[10px] text-[#2ecc71] font-bold uppercase tracking-widest">Certified Professional</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2ecc71] rounded-3xl -rotate-12 -z-10 blur-2xl opacity-20 animate-pulse"></div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 bg-white/2">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Our Solutions</span>
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">High-Impact <br /> <span className="text-slate-600">Business Services</span></h2>
              </div>
              <p className="text-slate-400 max-w-xs text-sm leading-relaxed mb-4">
                We provide the structural support your business needs to grow exponentially.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map(service => (
                <div key={service.id} className="p-12 bg-slate-900/50 border border-white/5 rounded-[3rem] hover:border-[#2ecc71]/40 hover:bg-slate-900 transition-all group flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[#2ecc71] mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block p-4 bg-white/5 rounded-3xl">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 text-[#2ecc71] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.4em] mb-6 block">Capabilities</span>
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12">Engineered for <br /><span className="text-slate-600">Performance</span></h2>
                <div className="space-y-12">
                  {skills.map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-4">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{skill.name}</span>
                        <span className="text-[#2ecc71] font-black text-sm">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }} 
                          whileInView={{ width: `${skill.level}%` }} 
                          transition={{ duration: 1.5, ease: "easeOut" }} 
                          className="h-full bg-[#2ecc71] rounded-full shadow-[0_0_15px_rgba(46,204,113,0.5)]"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6 mt-12">
                    <div className="bg-[#2ecc71] p-10 rounded-[3rem] text-slate-950 flex flex-col justify-center aspect-square">
                      <div className="text-5xl font-black mb-2 tracking-tighter">5+</div>
                      <div className="text-xs font-black uppercase tracking-widest leading-tight">Years of Experience</div>
                    </div>
                    <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] flex flex-col justify-center aspect-square">
                      <div className="text-4xl font-black mb-2 text-white">Top Rated</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">Upwork Badge</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col justify-center aspect-square">
                      <div className="text-4xl font-black mb-2 text-[#2ecc71]">24/7</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Support Readiness</div>
                    </div>
                    <div className="bg-[#2ecc71]/20 p-10 rounded-[3rem] flex flex-col justify-center aspect-square border border-[#2ecc71]/30">
                      <div className="text-4xl font-black mb-2 text-white tracking-tighter">100%</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Manual Verification</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-32 bg-slate-900/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-24">
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Showcase</span>
              <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-8">Selected <br /><span className="text-slate-600">Deliverables</span></h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {portfolio.map(item => (
                <motion.div 
                  key={item.id} 
                  whileHover={{ y: -15 }} 
                  className="group bg-slate-900 rounded-[4rem] overflow-hidden border border-white/5 hover:border-[#2ecc71]/30 transition-all duration-500 shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 scale-110 group-hover:scale-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-10 left-10 p-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <ExternalLink className="text-[#2ecc71] w-8 h-8" />
                    </div>
                  </div>
                  <div className="p-12">
                    <span className="text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em]">{item.cat}</span>
                    <h3 className="text-2xl font-black mt-4 uppercase tracking-tighter leading-tight group-hover:text-[#2ecc71] transition-colors">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-24 text-center">
              <button className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 hover:text-[#2ecc71] transition-all flex items-center justify-center gap-4 mx-auto group">
                See all Projects <div className="w-12 h-px bg-white/10 group-hover:bg-[#2ecc71] transition-all"></div>
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[5rem] p-12 lg:p-24 border border-white/10 relative overflow-hidden text-center shadow-2xl">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#2ecc71]/10 rounded-full blur-[100px]"></div>
              
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.4em] mb-8 block">Next Step</span>
              <h2 className="text-6xl lg:text-9xl font-black mb-16 uppercase leading-[0.85] tracking-tighter">Ready to <br /> <span className="text-slate-600">Elevate?</span></h2>
              
              <div className="grid md:grid-cols-2 gap-12 mt-20 mb-20 text-left">
                <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-[#2ecc71]/30 transition-all group">
                  <Mail className="text-[#2ecc71] mb-6 group-hover:scale-110 transition-transform" size={48} />
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Direct Mail</div>
                  <div className="text-2xl font-black text-white hover:text-[#2ecc71] transition-colors break-all">hello@neaz.pro</div>
                </div>
                <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-[#2ecc71]/30 transition-all group">
                  <Phone className="text-[#2ecc71] mb-6 group-hover:scale-110 transition-transform" size={48} />
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">WhatsApp / Call</div>
                  <div className="text-2xl font-black text-white hover:text-[#2ecc71] transition-colors">+880 123 456 789</div>
                </div>
              </div>

              <button className="w-full py-10 bg-[#2ecc71] text-slate-950 font-black rounded-[2.5rem] text-2xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#2ecc71]/30 flex items-center justify-center gap-6">
                Start a Project <ArrowRight size={32} />
              </button>
              
              <div className="mt-16 flex justify-center gap-10">
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-all"><Linkedin size={28} /></a>
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-all"><Github size={28} /></a>
                <a href="#" className="text-slate-500 hover:text-[#2ecc71] transition-all"><ExternalLink size={28} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-[#2ecc71] border border-white/10">NM</div>
             <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Neaz Md. Morshed</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
            © 2024 • CRAFTED WITH PRECISION
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @font-face {
          font-family: 'Plus Jakarta Sans';
          font-display: swap;
        }
        .text-gradient {
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-nav {
          background: rgba(11, 15, 26, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0b0f1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #232a3d;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2ecc71;
        }
      `}</style>
    </div>
  );
}
