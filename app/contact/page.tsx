"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Mail, Globe, CheckCircle2, Send, Loader2,
  MapPin, Clock, MessageSquare, Linkedin, Facebook
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import VideoBackground from '../../components/VideoBackground';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Calendly lazy loading states
  const [isCalendlyVisible, setIsCalendlyVisible] = useState(false);
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const calendlySectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for lazy loading Calendly
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isCalendlyVisible) {
            setIsCalendlyVisible(true);
            // Load Calendly script asynchronously
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => setIsCalendlyLoaded(true);
            document.body.appendChild(script);
          }
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (calendlySectionRef.current) {
      observer.observe(calendlySectionRef.current);
    }

    return () => observer.disconnect();
  }, [isCalendlyVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    try {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('All fields are required.');
      }

      if (!supabase) {
        console.error('Supabase client is null. Check environment variables.');
        setFormStatus('error');
        alert('Form submission is currently unavailable. Please contact hello@neaz.pro directly.');
        return;
      }

      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            status: 'new'
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

  const contactInfo = [
    { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'hello@neaz.pro', href: 'mailto:hello@neaz.pro' },
    { icon: <Globe className="w-6 h-6" />, label: 'Availability', value: 'Global (Remote)', href: null },
    { icon: <Clock className="w-6 h-6" />, label: 'Response Time', value: 'Within 12 hours', href: null },
    { icon: <MapPin className="w-6 h-6" />, label: 'Location', value: 'Bangladesh', href: null },
  ];

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/neazmorshed222/' },
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', href: 'https://www.facebook.com/neazmorshed001' },
  ];

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen selection:bg-[#2ecc71] selection:text-slate-900">
      <Navbar />

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-6 pt-32 pb-8 min-h-[45vh] flex flex-col justify-center">
          <VideoBackground type="contact" opacity={0.8} />
          <div className="container mx-auto px-6 max-w-7xl relative z-10 py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Get In Touch</span>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                Let's <span className="text-gradient">Connect</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Have a project in mind or want to discuss collaboration opportunities? I'm here to help turn your ideas into reality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="pt-8 pb-20 bg-slate-900/20 container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Contact Information</h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-6 p-6 bg-slate-900/60 border border-white/5 rounded-3xl hover:border-[#2ecc71]/30 transition-all"
                  >
                    <div className="p-4 bg-[#2ecc71]/10 rounded-2xl text-[#2ecc71]">
                      {info.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">{info.label}</span>
                      {info.href ? (
                        <a href={info.href} className="text-lg font-bold hover:text-[#2ecc71] transition-colors">{info.value}</a>
                      ) : (
                        <span className="text-lg font-bold">{info.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Follow Me</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl hover:border-[#2ecc71]/30 hover:bg-[#2ecc71]/10 text-slate-400 hover:text-[#2ecc71] transition-all"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map or Additional Info */}
              <div className="mt-12 p-8 bg-gradient-to-br from-[#2ecc71]/10 to-transparent border border-[#2ecc71]/20 rounded-[3rem]">
                <MessageSquare className="w-10 h-10 text-[#2ecc71] mb-4" />
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3">Quick Response Guaranteed</h3>
                <p className="text-slate-400">
                  I understand the importance of timely communication. Every inquiry receives a response within 12 hours, ensuring your project moves forward without delays.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-[#0e1526] p-10 lg:p-14 rounded-[4rem] border border-white/10"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Send a Message</h2>

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
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, goals, and how I can help..."
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
            </motion.div>
          </div>
        </section>
        {/* Calendly Section - Lazy Loaded with Intersection Observer */}
        <section
          ref={calendlySectionRef}
          className="py-12 container mx-auto px-6 max-w-7xl relative rounded-[3rem] overflow-hidden"
          style={{ minHeight: '700px' }}
        >
          {/* Video Background - Always visible */}
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://videos.pexels.com/video-files/6774133/6774133-uhd_2732_1440_25fps.mp4" type="video/mp4" />
            </video>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#0b0f1a]/85" />
            {/* Gradient Overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-[#0b0f1a]/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a]/40 via-transparent to-[#0b0f1a]" />
          </div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2ecc71]/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#39ff14]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#27ae60]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Decorative Border with Glow */}
          <div className="absolute inset-0 rounded-[3rem] border border-[#2ecc71]/30 shadow-[0_0_50px_rgba(46,204,113,0.1),inset_0_0_50px_rgba(46,204,113,0.05)]" />

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-[#2ecc71]/50 rounded-tl-2xl" />
          <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-[#2ecc71]/50 rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-[#2ecc71]/50 rounded-bl-2xl" />
          <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-[#2ecc71]/50 rounded-br-2xl" />

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 relative z-20"
          >
            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">Schedule a Call</span>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">
              Book a <span className="text-gradient">Meeting</span>
            </h2>
          </motion.div>

          {/* Loading Placeholder */}
          {!isCalendlyLoaded && (
            <div className="flex flex-col items-center justify-center relative z-10 py-20">
              {/* Loading Animation */}
              <div className="relative flex flex-col items-center">
                {/* Calendar Icon Animation */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative mb-8"
                >
                  {/* Outer glow rings */}
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#2ecc71]/20 animate-ping" />
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#2ecc71]/10 animate-pulse" style={{ animationDelay: '0.5s' }} />

                  {/* Calendar Icon Container */}
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2ecc71] to-[#27ae60] shadow-[0_0_40px_rgba(46,204,113,0.5)] flex items-center justify-center">
                    <div className="text-slate-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Loading Text */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-[#2ecc71] text-lg font-black uppercase tracking-widest mb-4"
                >
                  Loading Calendar
                </motion.p>

                {/* Animated Progress Bar */}
                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#2ecc71] via-[#39ff14] to-[#2ecc71] rounded-full shadow-[0_0_10px_rgba(46,204,113,0.5)]"
                  />
                </div>

                {/* Bouncing dots */}
                <div className="mt-6 flex gap-2">
                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-3 h-3 bg-[#2ecc71] rounded-full shadow-[0_0_10px_rgba(46,204,113,0.5)]"
                  />
                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    className="w-3 h-3 bg-[#2ecc71] rounded-full shadow-[0_0_10px_rgba(46,204,113,0.5)]"
                  />
                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    className="w-3 h-3 bg-[#2ecc71] rounded-full shadow-[0_0_10px_rgba(46,204,113,0.5)]"
                  />
                </div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-6 text-slate-400 text-sm font-medium"
                >
                  Preparing your scheduling experience...
                </motion.p>
              </div>
            </div>
          )}

          {/* Calendly Widget - Slides down from top when loaded */}
          {isCalendlyVisible && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: isCalendlyLoaded ? 1 : 0,
                y: isCalendlyLoaded ? 0 : -100
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full relative z-20"
              style={{ height: '650px' }}
            >
              <div
                className="calendly-inline-widget w-full h-full rounded-2xl overflow-hidden"
                data-url="https://calendly.com/neazmd-tamim/new-meeting?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0b0f1a&text_color=ffffff&primary_color=2ecc71"
                style={{ minWidth: '320px', height: '100%' }}
              />
            </motion.div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
            <a href="/blog" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Blog</a>
            <a href="https://linktr.ee/neazmorshed" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Linktree</a>
            <a href="https://www.linkedin.com/in/neazmorshed222/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neazmorshed001" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-bold tracking-widest">Facebook</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Designed and Developed by <span className="text-[#2ecc71] font-semibold">Neaz Morshed</span> • <span className="text-slate-600">Copyright © 2026</span>
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-gradient-neon {
          background: linear-gradient(135deg, #39ff14 0%, #2ecc71 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        html {
          scroll-behavior: smooth;
        }
        /* Calendly widget transparent background */
        .calendly-inline-widget {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
}
