"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ExternalLink, X,
  Briefcase, Database, Target, Layout, Video, Search,
  Loader2, Calendar, User
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string | null;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  client_name: string | null;
  completion_date: string | null;
  tags: string[];
  is_featured: boolean;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Briefcase: <Briefcase className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Target: <Target className="w-8 h-8" />,
  Layout: <Layout className="w-8 h-8" />,
  Video: <Video className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
};

export default function PortfolioCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<Service | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase || !slug) {
        setLoading(false);
        return;
      }

      // Fetch service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (serviceError || !serviceData) {
        setLoading(false);
        return;
      }

      setService(serviceData);

      // Fetch portfolio items for this service
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('service_id', serviceData.id)
        .order('order_index', { ascending: true });

      if (!portfolioError && portfolioData) {
        setPortfolioItems(portfolioData);
      }

      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2ecc71] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-[#0b0f1a] text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Service Not Found</h1>
        <Link href="/services" className="text-[#2ecc71] hover:underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0f1a] text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0b0f1a]/90 backdrop-blur-2xl border-b border-white/5 py-4">
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
            <Link href="/services" className="text-[11px] font-bold tracking-[0.3em] text-[#2ecc71] transition-all uppercase">Services</Link>
            <Link href="/#contact" className="text-[11px] font-bold tracking-[0.3em] text-slate-400 hover:text-[#2ecc71] transition-all uppercase">Contact</Link>
            <a href="https://www.fiverr.com/neaz222" target="_blank" className="bg-[#2ecc71] text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/20 uppercase">HIRE ME</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#2ecc71]/5 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#2ecc71] transition-all group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Services</span>
            </Link>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="text-[#2ecc71] text-sm font-bold uppercase tracking-wider">{service.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-[#2ecc71] p-4 bg-white/5 rounded-2xl border border-white/10">
                  {iconMap[service.icon] || <Briefcase className="w-8 h-8" />}
                </div>
                <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em]">Portfolio Collection</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                {service.title}
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
                <div className="text-4xl font-black text-[#2ecc71]">{portfolioItems.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Projects</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {portfolioItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-900 rounded-full flex items-center justify-center">
                {iconMap[service.icon] || <Briefcase className="w-12 h-12 text-slate-600" />}
              </div>
              <h3 className="text-2xl font-black text-slate-400 mb-4">No Projects Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Portfolio items for this service will be added soon. Check back later or contact me for custom work.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform"
              >
                Get in Touch <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/5 hover:border-[#2ecc71]/40 transition-all duration-500 bg-slate-900/60">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          {iconMap[service.icon] || <Briefcase className="w-16 h-16 text-slate-600" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60"></div>

                      {/* Featured Badge */}
                      {item.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#2ecc71] text-slate-900 text-[9px] font-black rounded-full uppercase">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-black mb-2 group-hover:text-[#2ecc71] transition-colors uppercase tracking-tight">
                        {item.title}
                      </h3>

                      {item.client_name && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                          <User size={14} />
                          <span>{item.client_name}</span>
                        </div>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Portfolio Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0e1526] rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 rounded-full hover:bg-[#2ecc71] hover:text-slate-900 transition-all"
              >
                <X size={24} />
              </button>

              {/* Image */}
              {selectedItem.image_url && (
                <div className="aspect-video relative overflow-hidden rounded-t-[3rem]">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-10">
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4">
                  {selectedItem.title}
                </h2>

                <div className="flex flex-wrap gap-4 mb-6">
                  {selectedItem.client_name && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <User size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.client_name}</span>
                    </div>
                  )}
                  {selectedItem.completion_date && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={16} className="text-[#2ecc71]" />
                      <span className="text-sm font-semibold">{selectedItem.completion_date}</span>
                    </div>
                  )}
                </div>

                {selectedItem.description && (
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                )}

                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.project_url && (
                  <a
                    href={selectedItem.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#2ecc71] text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-wider"
                  >
                    View Project <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Neaz Md. Morshed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
