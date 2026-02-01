"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Star, Quote, Linkedin, Facebook,
  ExternalLink, ThumbsUp, MessageCircle, Users, User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import VideoBackground from '../../components/VideoBackground';

interface Review {
  id: string | number;
  client_name: string;
  client_title: string;
  client_company: string;
  review_text: string;
  rating: number;
  platform: string;
  client_image?: string;
  date: string;
  is_featured?: boolean;
  order_index?: number;
  country_code?: string;
  country_name?: string;
  city?: string;
}

// Convert country code to flag emoji
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [reviews, setReviews] = useState<Review[]>([]);

  // Default reviews data (will be replaced with Supabase data if available)
  const defaultReviews: Review[] = [
    {
      id: 1,
      client_name: "Sarah Johnson",
      client_title: "Marketing Director",
      client_company: "TechStart Inc.",
      review_text: "Neaz is an exceptional virtual assistant. His attention to detail and proactive approach made our collaboration seamless. He managed our CRM data flawlessly and always delivered ahead of schedule.",
      rating: 5,
      platform: 'LinkedIn',
      date: "January 2024"
    },
    {
      id: 2,
      client_name: "Michael Chen",
      client_title: "Founder & CEO",
      client_company: "GrowthLabs",
      review_text: "Outstanding lead generation work! Neaz provided highly accurate B2B data that significantly improved our outreach campaigns. His research skills are top-notch.",
      rating: 5,
      platform: 'Fiverr',
      date: "December 2023"
    },
    {
      id: 3,
      client_name: "Emily Rodriguez",
      client_title: "Operations Manager",
      client_company: "Digital Solutions Co.",
      review_text: "Working with Neaz has been a game-changer for our business operations. His expertise in data management and administrative support is unmatched. Highly recommended!",
      rating: 5,
      platform: 'Direct',
      date: "November 2023"
    },
    {
      id: 4,
      client_name: "David Thompson",
      client_title: "Sales Director",
      client_company: "Enterprise Global",
      review_text: "Neaz's CRM management skills helped us streamline our entire sales process. He understands business needs and delivers quality work consistently.",
      rating: 5,
      platform: 'LinkedIn',
      date: "October 2023"
    },
    {
      id: 5,
      client_name: "Amanda Foster",
      client_title: "Project Manager",
      client_company: "Creative Agency",
      review_text: "Excellent communication and work ethic. Neaz handled our video editing and content management with professionalism. Will definitely work with him again!",
      rating: 5,
      platform: 'Fiverr',
      date: "September 2023"
    },
    {
      id: 6,
      client_name: "Robert Kim",
      client_title: "Business Owner",
      client_company: "Kim Consulting",
      review_text: "Very professional and reliable. Neaz helped us with web development and data entry tasks. His quick turnaround time and accuracy are impressive.",
      rating: 5,
      platform: 'Upwork',
      date: "August 2023"
    }
  ];

  // Fetch reviews from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('order_index', { ascending: true });

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
    : reviews.filter(review => review.platform.toLowerCase() === activeFilter);

  const stats = [
    { label: 'Happy Clients', value: '180+', icon: <Users className="w-6 h-6" /> },
    { label: 'Five Star Reviews', value: '150+', icon: <Star className="w-6 h-6" /> },
    { label: 'Repeat Clients', value: '85%', icon: <ThumbsUp className="w-6 h-6" /> },
  ];

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    switch (p) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    const p = platform.toLowerCase();
    switch (p) {
      case 'facebook':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'linkedin':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'fiverr':
        return 'bg-[#2ecc71]/20 text-[#2ecc71] border-[#2ecc71]/30';
      case 'upwork':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen selection:bg-[#2ecc71] selection:text-slate-900">
      <Navbar />

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-16 pt-40 pb-20">
          <VideoBackground type="reviews" opacity={0.5} />
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
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
              <p className="text-slate-200 text-lg max-w-2xl mx-auto">
                Don't just take my word for it. Here's what my clients from around the world have to say about working with me.
              </p>
            </motion.div>
          </div>
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
            {['all', 'fiverr', 'upwork', 'linkedin', 'direct'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as typeof activeFilter)}
                className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeFilter === filter
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
                  className="p-8 pt-12 bg-slate-900/60 border border-white/5 rounded-[2rem] hover:border-[#2ecc71]/30 transition-all group relative overflow-visible mt-8"
                >
                  {/* Client Image - Top Right - Breaking out of card */}
                  <div className="absolute -top-6 right-6">
                    {review.client_image ? (
                      <img
                        src={review.client_image}
                        alt={review.client_name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-[#0b0f1a] ring-2 ring-[#2ecc71]/50 shadow-2xl shadow-[#2ecc71]/30 group-hover:ring-[#2ecc71] group-hover:scale-110 transition-all"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-[#0b0f1a] ring-2 ring-white/10 flex items-center justify-center group-hover:ring-[#2ecc71]/30 transition-all shadow-xl">
                        <User className="w-10 h-10 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-[#2ecc71]/30 mb-6" />

                  {/* Review Text */}
                  <p className="text-slate-200 leading-relaxed mb-8 text-sm">
                    "{review.review_text}"
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
                      <h4 className="font-black text-white">{review.client_name}</h4>
                      {review.country_code && (
                        <div className="flex items-center gap-1.5 mt-1 mb-2">
                          <span className="text-base">{getFlagEmoji(review.country_code)}</span>
                          <span className="text-[11px] text-slate-400">
                            {review.city ? `${review.city}, ` : ''}{review.country_name}
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {review.client_title} • {review.client_company}
                      </p>
                    </div>
                    <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${getPlatformColor(review.platform)}`}>
                      {getPlatformIcon(review.platform)}
                      <span className="text-[9px] font-black uppercase tracking-wider">{review.platform}</span>
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
                href="https://www.linkedin.com/in/neazmorshed222/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-sky-500/20 border border-sky-500/30 rounded-2xl text-sky-400 hover:bg-sky-500/30 transition-all font-bold"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn Recommendations
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/neazmorshed001/reviews"
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
            <p className="text-slate-300 max-w-2xl mx-auto mb-10">
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
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
