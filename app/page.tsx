"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Briefcase, 
  Mail, Phone, Target, 
  Database, Search, ShieldCheck,
  Award, Users, Clock, 
  Zap, Globe, CheckCircle2, Video, 
  Palette, Layout, PenTool,
  TrendingUp, Star, Send, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PortfolioPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const name = "NEAZ MD. MORSHED";
  const title = "Expert Virtual Assistant & Professional Outsourcer";

  const stats = [
    { label: 'Job Success', value: '100%', icon: <Star className="w-5 h-5 text-[#2ecc71]" /> },
    { label: 'Global Clients', value: '180+', icon: <Users className="w-5 h-5 text-[#2ecc71]" /> },
    { label: 'Hours Completed', value: '5,000+', icon: <Clock className="w-5 h-5 text-[#2ecc71]" /> },
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

  const skills = [
    { name: 'Lead Research', level: 98 },
    { name: 'CRM Management', level: 95 },
    { name: 'Data Mining', level: 97 },
    { name: 'Admin Support', level: 99 },
    { name: 'Video Production', level: 95 },
    { name: 'Web Development', level: 92 }
  ];

  return (
    <div className="bg-[#0b0f1a] text-white selection:bg-[#2ecc71] selection:text-slate-900">
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
            {['Home', 'Skills', 'Services', 'Contact'].map(link => (
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
            {['Home', 'Skills', 'Services', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">{link}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero */}
        <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none animate-subtle-pulse"></div>
          
          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center max-w-7xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                <TrendingUp size={14} className="text-[#2ecc71]" />
                Powering Global Business Growth Since 2014
              </div>
              <h1 className="text-7xl lg:text-[100px] font-black leading-[0.85] mb-12 tracking-tighter">
                I AM <br />
                <span className="text-gradient">NEAZ MD.</span> <br />
                <span className="text-gradient">MORSHED</span>
              </h1>
              <p className="text-xl text-slate-400 mb-14 max-w-lg leading-relaxed font-medium">
                Professional <span className="text-white font-bold">{title}</span>. I handle the heavy lifting of business operations so you can focus on scale.
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
                  alt="Neaz Md. Morshed Portfolio" 
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
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#2ecc71]/20 rounded-full blur-3xl -z-10 animate-subtle-pulse"></div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-slate-900/10">
          <div className="container mx-auto px-6 max-w-7xl">
             <div className="text-center mb-24">
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Expertise</span>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Technical <br /><span className="text-slate-600">Competence</span></h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-20 items-center">
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
              <div className="grid grid-cols-2 gap-8">
                <div className="p-12 bg-[#2ecc71] rounded-[4rem] text-slate-950 flex flex-col justify-center items-center text-center aspect-square shadow-2xl">
                  <TrendingUp className="w-12 h-12 mb-4" />
                  <div className="text-5xl font-black mb-1">98%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Accuracy</div>
                </div>
                <div className="p-12 bg-white/5 border border-white/10 rounded-[4rem] flex flex-col justify-center items-center text-center aspect-square">
                  <Star className="text-[#2ecc71] w-12 h-12 mb-4" />
                  <div className="text-4xl font-black mb-1">Top Rated</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-32 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div className="max-w-3xl">
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Our Solutions</span>
                <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">High-Impact <br /> <span className="text-slate-600">Business Services</span></h2>
              </div>
              <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6 font-medium">
                Custom-tailored outsourcing strategies for modern startups and established enterprises.
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
                    View Details <ArrowRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-32 bg-slate-900/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-8 block">Career Path</span>
                <h2 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12">Proven <br /><span className="text-slate-600">Global Expertise</span></h2>
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
              <div className="bg-slate-900/50 p-12 rounded-[5rem] border border-white/5 relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2ecc71]/10 rounded-full blur-3xl"></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">Selected Clients</h3>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-1 bg-[#2ecc71] rounded-full"></div>
                    <div>
                      <div className="text-[#2ecc71] font-black uppercase tracking-widest text-[10px] mb-1">Aura Relax (Current)</div>
                      <h4 className="text-xl font-bold uppercase mb-2">Video Production Lead</h4>
                      <p className="text-slate-400 text-sm">Managing YouTube content and relaxation video operations.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-1 bg-slate-800 rounded-full"></div>
                    <div>
                      <div className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-1">Release Media Inc.</div>
                      <h4 className="text-xl font-bold uppercase mb-2">Primary VA</h4>
                      <p className="text-slate-400 text-sm">Orchestrating administrative workflows and digital content.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-1 bg-slate-800 rounded-full"></div>
                    <div>
                      <div className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-1">GLOCAL Org.</div>
                      <h4 className="text-xl font-bold uppercase mb-2">Web Design Coordinator</h4>
                      <p className="text-slate-400 text-sm">Leading development for international organizational sites.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="bg-[#0e1526] rounded-[6rem] p-12 lg:p-24 border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2ecc71]/5 rounded-full blur-[200px] -z-10 animate-subtle-pulse"></div>
              
              <div className="grid lg:grid-cols-2 gap-20">
                <div className="text-left">
                  <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-12 block">Inquiry</span>
                  <h2 className="text-6xl lg:text-8xl font-black mb-12 uppercase leading-[0.9] tracking-tighter">Ready to <br /> <span className="text-slate-600">Connect?</span></h2>
                  <p className="text-slate-400 text-lg mb-12 max-w-md">
                    Send a message to discuss your project requirements or hiring inquiries. I respond within 12 hours.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5">
                      <Mail className="text-[#2ecc71]" />
                      <span className="text-lg font-bold">hello@neaz.pro</span>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5">
                      <Globe className="text-[#2ecc71]" />
                      <span className="text-lg font-bold">Available Globally (Remote)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b0f1a] p-10 lg:p-14 rounded-[4rem] border border-white/5">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl p-6 focus:border-[#2ecc71] focus:outline-none transition-all placeholder:text-slate-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl p-6 focus:border-[#2ecc71] focus:outline-none transition-all placeholder:text-slate-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Your Message</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl p-6 focus:border-[#2ecc71] focus:outline-none transition-all placeholder:text-slate-700 font-bold resize-none"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={formStatus === 'loading'}
                      className="w-full py-6 bg-[#2ecc71] text-slate-900 font-black rounded-2xl text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#2ecc71]/20 flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'loading' ? (
                        <>Processing... <Loader2 className="animate-spin" /></>
                      ) : formStatus === 'success' ? (
                        <>Message Sent! <CheckCircle2 /></>
                      ) : formStatus === 'error' ? (
                        <>Error Occurred</>
                      ) : (
                        <>Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                      )}
                    </button>
                  </form>
                </div>
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
          <div className="flex gap-10">
            <a href="https://www.linkedin.com" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-black tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-black tracking-widest">Fiverr</a>
            <a href="https://github.com" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-black tracking-widest">GitHub</a>
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
        .animate-subtle-pulse {
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