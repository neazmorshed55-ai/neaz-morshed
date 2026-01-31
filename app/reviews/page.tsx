"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Menu, X, Star, Quote, Linkedin, Facebook,
  ExternalLink, ThumbsUp, MessageCircle, Users
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: number;
  name: string;
  position: string;
  company: string;
  review: string;
  rating: number;
  source: 'facebook' | 'linkedin' | 'fiverr' | 'direct';
  image?: string;
  date: string;
}

export default function ReviewsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'facebook' | 'linkedin' | 'fiverr'>('all');
  const [reviews, setReviews] = useState<Review[]>([]);

  // Default reviews data (will be replaced with Supabase data if available)
  const defaultReviews: Review[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Marketing Director",
      company: "TechStart Inc.",
      review: "Neaz is an exceptional virtual assistant. His attention to detail and proactive approach made our collaboration seamless. He managed our CRM data flawlessly and always delivered ahead of schedule.",
      rating: 5,
      source: 'linkedin',
      date: "January 2024"
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Founder & CEO",
      company: "GrowthLabs",
      review: "Outstanding lead generation work! Neaz provided highly accurate B2B data that significantly improved our outreach campaigns. His research skills are top-notch.",
      rating: 5,
      source: 'fiverr',
      date: "December 2023"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Operations Manager",
      company: "Digital Solutions Co.",
      review: "Working with Neaz has been a game-changer for our business operations. His expertise in data management and administrative support is unmatched. Highly recommended!",
      rating: 5,
      source: 'facebook',
      date: "November 2023"
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Sales Director",
      company: "Enterprise Global",
      review: "Neaz's CRM management skills helped us streamline our entire sales process. He understands business needs and delivers quality work consistently.",
      rating: 5,
      source: 'linkedin',
      date: "October 2023"
    },
    {
      id: 5,
      name: "Amanda Foster",
      position: "Project Manager",
      company: "Creative Agency",
      review: "Excellent communication and work ethic. Neaz handled our video editing and content management with professionalism. Will definitely work with him again!",
      rating: 5,
      source: 'fiverr',
      date: "September 2023"
    },
    {
      id: 6,
      name: "Robert Kim",
      position: "Business Owner",
      company: "Kim Consulting",
      review: "Very professional and reliable. Neaz helped us with web development and data entry tasks. His quick turnaround time and accuracy are impressive.",
      rating: 5,
      source: 'facebook',
      date: "August 2023"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch reviews from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (data && data.length > 0) {
            setReviews(data);
          } else {
            setReviews(defaultReviews);
          }
        } catch (err) {
          console.log('Using default reviews');
          setReviews(defaultReviews);
        }
      } else {
        setReviews(defaultReviews);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(review => review.source === activeFilter);

  const stats = [
    { label: 'Happy Clients', value: '180+', icon: <Users className="w-6 h-6" /> },
    { label: 'Five Star Reviews', value: '150+', icon: <Star className="w-6 h-6" /> },
    { label: 'Repeat Clients', value: '85%', icon: <ThumbsUp className="w-6 h-6" /> },
  ];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'facebook':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'linkedin':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'fiverr':
        return 'bg-[#2ecc71]/20 text-[#2ecc71] border-[#2ecc71]/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen selection:bg-[#2ecc71] selection:text-slate-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
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
            <Link href="/skills" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Skills</Link>
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/experience" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Experience</Link>
            <Link href="/reviews" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Reviews</Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
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
            className="lg:hidden fixed inset-0 bg-[#0b0f1a] z-[110] flex flex-col items-center justify-center gap-8 p-6"
          >
            <button className="absolute top-8 right-8 text-[#2ecc71]" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={40} />
            </button>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">Home</Link>
            <Link href="/skills" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">Skills</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">Services</Link>
            <Link href="/experience" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">Experience</Link>
            <Link href="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-[#2ecc71] transition-colors uppercase tracking-tighter">Reviews</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-white hover:text-[#2ecc71] transition-colors uppercase tracking-tighter">Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 max-w-7xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-6 block">Testimonials</span>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              Client <span className="text-gradient">Reviews</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Don't just take my word for it. Here's what my clients from around the world have to say about working with me.
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 max-w-7xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-slate-900/60 border border-white/5 rounded-3xl text-center hover:border-[#2ecc71]/30 transition-all"
              >
                <div className="inline-flex p-4 bg-[#2ecc71]/10 rounded-2xl text-[#2ecc71] mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="container mx-auto px-6 max-w-7xl mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {['all', 'linkedin', 'facebook', 'fiverr'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as typeof activeFilter)}
                className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                  activeFilter === filter
                    ? 'bg-[#2ecc71] text-slate-900'
                    : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:border-[#2ecc71]/30 hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All Reviews' : filter}
              </button>
            ))}
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-slate-900/60 border border-white/5 rounded-[2rem] hover:border-[#2ecc71]/30 transition-all group"
                >
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-[#2ecc71]/30 mb-6" />

                  {/* Review Text */}
                  <p className="text-slate-300 leading-relaxed mb-8 text-sm">
                    "{review.review}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-[#2ecc71] fill-[#2ecc71]' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white mb-1">{review.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {review.position} • {review.company}
                      </p>
                    </div>
                    <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${getSourceColor(review.source)}`}>
                      {getSourceIcon(review.source)}
                      <span className="text-[9px] font-black uppercase tracking-wider">{review.source}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="container mx-auto px-6 max-w-7xl mt-20">
          <div className="bg-gradient-to-br from-[#2ecc71]/10 to-transparent border border-[#2ecc71]/20 rounded-[4rem] p-12 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-6">
              See More Reviews
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10">
              Check out my profiles on these platforms to see more reviews and recommendations from satisfied clients.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://www.linkedin.com/in/neazmorshed/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-sky-500/20 border border-sky-500/30 rounded-2xl text-sky-400 hover:bg-sky-500/30 transition-all font-bold"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn Recommendations
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/neaz222/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-blue-400 hover:bg-blue-500/30 transition-all font-bold"
              >
                <Facebook className="w-5 h-5" />
                Facebook Reviews
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.fiverr.com/neaz222"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-[#2ecc71]/20 border border-[#2ecc71]/30 rounded-2xl text-[#2ecc71] hover:bg-[#2ecc71]/30 transition-all font-bold"
              >
                <Star className="w-5 h-5" />
                Fiverr Reviews
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 max-w-7xl mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-6">
              Ready to Experience the <span className="text-gradient">Difference</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10">
              Join hundreds of satisfied clients who have transformed their business operations with my help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-12 py-6 bg-[#2ecc71] text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2ecc71]/20"
            >
              Start Your Project
              <ExternalLink className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-[#2ecc71] border border-white/10 text-xl shadow-2xl">NM</div>
            <span className="text-[12px] font-black tracking-[0.6em] uppercase text-slate-500">NEAZ MD. MORSHED</span>
          </div>
          <div className="flex gap-10">
            <a href="https://www.linkedin.com/in/neazmorshed/" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-black tracking-widest">LinkedIn</a>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-black tracking-widest">Fiverr</a>
            <a href="https://www.facebook.com/neaz222" target="_blank" className="text-slate-500 hover:text-[#2ecc71] transition-all uppercase text-[10px] font-black tracking-widest">Facebook</a>
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
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
