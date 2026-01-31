"use client";

import React, { useState, useEffect } from 'react';
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

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-20">
          <VideoBackground type="contact" opacity={0.5} />
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
        <section className="py-20 bg-slate-900/20 container mx-auto px-6 max-w-7xl">
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
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex gap-8">
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
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
