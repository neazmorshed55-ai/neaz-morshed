"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowRight, Briefcase,
  Mail, Target,
  Database, Search, ShieldCheck,
  Users, Clock,
  Globe, Video,
  Layout, PenTool,
  TrendingUp, Star,
  Calendar, Building2, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

// CountUp Animation Component
const CountUp = ({ end, suffix = '', duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Typewriter Effect Component
const TypewriterEffect = ({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }: {
  texts: string[],
  speed?: number,
  deleteSpeed?: number,
  pauseTime?: number
}) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className="text-gradient">
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
};

export default function PortfolioPage() {
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1519085195758-2a89f9c3f732?auto=format&fit=crop&q=80&w=800');

  // Typewriter texts
  const typewriterTexts = [
    "Virtual Assistant Expert",
    "Lead Generation Specialist",
    "CRM & Data Management Pro",
    "Next.js & Supabase Developer",
    "Business Process Optimizer",
    "Top Rated Freelancer"
  ];

  // Fetch profile image from Supabase Storage
  useEffect(() => {
    if (supabase) {
      const { data } = supabase.storage.from('images').getPublicUrl('profile.jpg');
      if (data?.publicUrl) {
        // Check if the image exists by attempting to load it
        const img = new Image();
        img.onload = () => setProfileImage(data.publicUrl);
        img.src = data.publicUrl;
      }
    }
  }, []);

  const name = "NEAZ MD. MORSHED";
  const title = "Expert Virtual Assistant & Professional Outsourcer";

  const stats = [
    { label: 'Job Success', value: 100, suffix: '%', icon: <Star className="w-5 h-5 text-[#2ecc71]" /> },
    { label: 'Global Clients', value: 1000, suffix: '+', icon: <Users className="w-5 h-5 text-[#2ecc71]" /> },
    { label: 'Hours Completed', value: 10000, suffix: '+', icon: <Clock className="w-5 h-5 text-[#2ecc71]" /> },
  ];

  const services = [
    {
      id: 1,
      title: 'Virtual Assistant',
      slug: 'virtual-assistant',
      icon: <Briefcase className="w-10 h-10" />,
      desc: 'High-level administrative support, including email filtering, scheduling, and custom business workflows.'
    },
    {
      id: 2,
      title: 'Data & CRM Mastery',
      slug: 'data-crm',
      icon: <Database className="w-10 h-10" />,
      desc: 'Expert data mining, cleaning, and management across HubSpot, Salesforce, and Zoho.'
    },
    {
      id: 3,
      title: 'Lead Generation',
      slug: 'lead-generation',
      icon: <Target className="w-10 h-10" />,
      desc: 'B2B prospect research with verified contact details to fuel your sales pipeline.'
    },
    {
      id: 4,
      title: 'Web & Tech Support',
      slug: 'web-tech-support',
      icon: <Layout className="w-10 h-10" />,
      desc: 'WordPress customization, Wix site management, and technical troubleshooting for your digital presence.'
    }
  ];

  const technicalExperience = [
    { label: 'YouTube Management', years: '4+ Years', icon: <Video size={18} /> },
    { label: 'Market Research', years: '10+ Years', icon: <Search size={18} /> },
    { label: 'Content Operations', years: '5+ Years', icon: <PenTool size={18} /> },
  ];

  // Experience data from Supabase
  interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string[];
    type: 'full-time' | 'part-time' | 'project';
    skills: string[];
    order_index: number;
  }

  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [experienceLoading, setExperienceLoading] = useState(true);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);

  // Fetch experiences from Supabase
  useEffect(() => {
    const fetchExperiences = async () => {
      if (!supabase) {
        setExperienceLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error fetching experiences:', error);
        } else if (data) {
          setExperienceData(data);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
      } finally {
        setExperienceLoading(false);
      }
    };

    fetchExperiences();
  }, []);

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
      <Navbar />

      <main>
        {/* Hero */}
        <section id="home" className="relative min-h-screen flex items-center pt-36 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none animate-subtle-pulse"></div>

          <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center max-w-7xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                <TrendingUp size={14} className="text-[#2ecc71]" />
                Powering Global Business Growth Since 2014
              </div>
              <h1 className="text-6xl lg:text-[90px] font-black leading-[0.9] mb-8 tracking-tighter">
                I AM <br />
                <span className="text-gradient">NEAZ MD.</span> <br />
                <span className="text-gradient">MORSHED</span>
              </h1>
              <div className="text-2xl lg:text-4xl font-bold mb-10 h-[50px] lg:h-[60px]">
                <TypewriterEffect texts={typewriterTexts} speed={80} deleteSpeed={40} pauseTime={1500} />
              </div>
              <p className="text-lg text-slate-400 mb-12 max-w-lg leading-relaxed font-medium">
                I handle the heavy lifting of business operations so you can focus on scale. Powered by modern tech stack.
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <a href="#contact" className="bg-[#2ecc71] text-slate-950 px-14 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(46,204,113,0.3)] uppercase tracking-widest text-sm">
                  Let's Collaborate <ArrowRight size={20} />
                </a>
                <div className="flex gap-6 pl-4 border-l border-white/10">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-2xl font-black text-white">
                        <CountUp end={stat.value} suffix={stat.suffix} duration={2000} />
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative group">
              <div className="relative z-10 w-full aspect-[4/5] rounded-[5rem] overflow-hidden border-[16px] border-white/5 shadow-2xl bg-slate-900">
                <NextImage
                  src={profileImage}
                  alt="Neaz Md. Morshed Portfolio"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
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
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative max-w-sm group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#2ecc71]/20 via-[#2ecc71]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#2ecc71]/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-[#2ecc71]/10 border border-[#2ecc71]/20">
                      <Target className="w-6 h-6 text-[#2ecc71]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-base leading-relaxed mb-2">
                        Custom-tailored <span className="text-[#2ecc71]">outsourcing strategies</span> for modern startups and established enterprises.
                      </p>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse"></span>
                        Trusted by 1000+ businesses
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map(service => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <div className="p-12 bg-slate-900/40 border border-white/5 rounded-[4rem] hover:border-[#2ecc71]/40 hover:bg-slate-900 transition-all group flex flex-col justify-between h-full relative overflow-hidden cursor-pointer">
                    <div>
                      <div className="text-[#2ecc71] mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-flex p-6 bg-white/5 rounded-[2.5rem] border border-white/5">
                        {service.icon}
                      </div>
                      <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter leading-tight group-hover:text-[#2ecc71] transition-colors">{service.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{service.desc}</p>
                    </div>
                    <div className="mt-14 flex items-center gap-3 text-[#2ecc71] text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      View Portfolio <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Timeline Section */}
        <section id="experience" className="py-32 bg-slate-900/10 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#2ecc71]/5 rounded-full blur-[200px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#2ecc71]/3 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Career Journey</span>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                E X P E R I E N C E
              </h2>
              <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
                A decade of professional growth across engineering, IT, and digital services
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Center Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#2ecc71] via-[#2ecc71]/50 to-[#2ecc71]/20 rounded-full hidden lg:block"></div>

              {/* Mobile Timeline Line */}
              <div className="absolute left-8 w-1 h-full bg-gradient-to-b from-[#2ecc71] via-[#2ecc71]/50 to-[#2ecc71]/20 rounded-full lg:hidden"></div>

              {/* Loading State */}
              {experienceLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="w-12 h-12 border-4 border-[#2ecc71]/20 border-t-[#2ecc71] rounded-full animate-spin"></div>
                </div>
              )}

              <div className="space-y-12 lg:space-y-0">
                {experienceData.filter(exp => exp.type === 'full-time').slice(0, 7).map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-center lg:items-stretch ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      } flex-row`}
                  >
                    {/* Timeline Dot - Desktop */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center justify-center z-20">
                      <motion.div
                        whileHover={{ scale: 1.3 }}
                        className={`w-6 h-6 rounded-full border-4 border-[#0b0f1a] cursor-pointer transition-all duration-300 ${activeExperience === exp.id
                          ? 'bg-[#2ecc71] shadow-[0_0_20px_rgba(46,204,113,0.6)]'
                          : 'bg-[#2ecc71]/60 hover:bg-[#2ecc71]'
                          }`}
                        onClick={() => setActiveExperience(activeExperience === exp.id ? null : exp.id)}
                      />
                    </div>

                    {/* Timeline Dot - Mobile */}
                    <div className="absolute left-8 transform -translate-x-1/2 lg:hidden flex items-center justify-center z-20">
                      <motion.div
                        whileHover={{ scale: 1.3 }}
                        className={`w-5 h-5 rounded-full border-4 border-[#0b0f1a] cursor-pointer transition-all duration-300 ${activeExperience === exp.id
                          ? 'bg-[#2ecc71] shadow-[0_0_20px_rgba(46,204,113,0.6)]'
                          : 'bg-[#2ecc71]/60 hover:bg-[#2ecc71]'
                          }`}
                        onClick={() => setActiveExperience(activeExperience === exp.id ? null : exp.id)}
                      />
                    </div>

                    {/* Content Card */}
                    <div className={`w-full lg:w-[calc(50%-40px)] ${index % 2 === 0 ? 'lg:pr-0' : 'lg:pl-0'} pl-16 lg:pl-0`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        onClick={() => setActiveExperience(activeExperience === exp.id ? null : exp.id)}
                        className={`p-8 rounded-3xl border cursor-pointer transition-all duration-500 ${activeExperience === exp.id
                          ? 'bg-[#2ecc71]/10 border-[#2ecc71]/50 shadow-[0_0_40px_rgba(46,204,113,0.2)]'
                          : 'bg-slate-900/60 border-white/5 hover:border-[#2ecc71]/30 hover:bg-slate-900/80'
                          }`}
                      >
                        {/* Date Badge */}
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar size={14} className="text-[#2ecc71]" />
                          <span className="text-[#2ecc71] text-[11px] font-black tracking-wider">
                            {exp.start_date} - {exp.end_date}
                          </span>
                          {exp.end_date === 'Present' && (
                            <span className="ml-2 px-2 py-1 bg-[#2ecc71] text-slate-900 text-[9px] font-black rounded-full uppercase">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Position & Company */}
                        <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight mb-2 leading-tight">
                          {exp.position}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 size={14} className="text-slate-500" />
                          <span className="text-slate-400 text-sm font-semibold">{exp.company}</span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                          {Array.isArray(exp.description) ? exp.description[0] : exp.description}
                        </p>

                        {/* Skills - Expandable */}
                        <AnimatePresence>
                          {activeExperience === exp.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Skills</span>
                                <div className="flex flex-wrap gap-2">
                                  {exp.skills.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-wider hover:bg-[#2ecc71]/10 hover:border-[#2ecc71]/30 transition-all"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expand Indicator */}
                        <div className="flex items-center justify-center mt-4">
                          <ChevronDown
                            size={18}
                            className={`text-slate-500 transition-transform duration-300 ${activeExperience === exp.id ? 'rotate-180 text-[#2ecc71]' : ''
                              }`}
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Year display on opposite side - Desktop only */}
                    <div className="hidden lg:flex lg:w-[calc(50%-40px)] items-center justify-center">
                      <AnimatePresence>
                        {activeExperience === exp.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4 }}
                            className="text-center"
                          >
                            <div className="text-8xl font-black text-[#2ecc71]/20 leading-none">
                              {exp.start_date.split(' ')[1] || exp.start_date}
                            </div>
                            <div className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">
                              {exp.end_date === 'Present' ? 'Present' : (exp.end_date.split(' ')[1] || exp.end_date)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* View All Experience Link */}
            <div className="flex justify-center mt-16">
              <Link
                href="/experience"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#2ecc71]/10 hover:border-[#2ecc71]/30 transition-all group"
              >
                View All Experience <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Technical Experience Summary */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
              {technicalExperience.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center justify-between p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-[#2ecc71]/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-[#2ecc71]/10 rounded-2xl text-[#2ecc71] group-hover:bg-[#2ecc71] group-hover:text-slate-900 transition-all">
                      {exp.icon}
                    </div>
                    <span className="text-lg font-bold uppercase tracking-tighter">{exp.label}</span>
                  </div>
                  <span className="text-[#2ecc71] font-black tracking-widest text-[11px] uppercase">{exp.years}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section id="contact" className="py-32 bg-[#0b0f1a]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="bg-[#0e1526] rounded-[6rem] p-12 lg:p-24 border border-white/10 relative overflow-hidden shadow-2xl text-center">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2ecc71]/5 rounded-full blur-[200px] -z-10 animate-subtle-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2ecc71]/5 rounded-full blur-[200px] -z-10 animate-subtle-pulse"></div>

              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-8 block">Get In Touch</span>
              <h2 className="text-5xl lg:text-7xl font-black mb-8 uppercase leading-[0.9] tracking-tighter">Ready to <br /> <span className="text-slate-600">Connect?</span></h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                Have a project in mind or want to discuss collaboration opportunities? Let's turn your ideas into reality. I respond within 12 hours.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/5">
                  <Mail className="text-[#2ecc71]" />
                  <span className="font-bold">neazmd.tamim@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/5">
                  <Globe className="text-[#2ecc71]" />
                  <span className="font-bold">Available Globally</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-4 px-14 py-6 bg-[#2ecc71] text-slate-950 font-black rounded-2xl text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2ecc71]/20 group"
              >
                Contact Me <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="/blog" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Blog</a>
            <a href="https://linktr.ee/neazmorshed" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Linktree</a>
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neazmorshed001/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-500">Copyright © 2026</span>
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
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
          color: #2ecc71;
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
