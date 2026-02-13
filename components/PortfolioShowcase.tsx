"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  thumbnail_url?: string;
  order_index: number;
}

export default function PortfolioShowcase() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(12);

      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-[#0b0f1a] via-[#0f1419] to-[#0b0f1a]">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2ecc71] border-r-transparent"></div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0b0f1a] via-[#0f1419] to-[#0b0f1a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#2ecc71]">Our</span> Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our diverse portfolio of successful projects
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-800 hover:border-[#2ecc71]/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#2ecc71]/20"
            >
              {/* Image/Video */}
              <div className="relative w-full h-full">
                {item.video_url ? (
                  <video
                    src={item.video_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                    loop
                    playsInline
                  />
                ) : item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2ecc71]/20 to-[#27ae60]/20 flex items-center justify-center">
                    <p className="text-white/50 text-sm text-center px-4">{item.title}</p>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Index Badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-semibold">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2ecc71]/0 to-[#27ae60]/0 group-hover:from-[#2ecc71]/20 group-hover:to-[#27ae60]/20 blur-xl -z-10 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <button className="group px-8 py-4 bg-[#2ecc71] text-slate-950 font-bold rounded-xl hover:bg-[#27ae60] transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#2ecc71]/30 flex items-center gap-2">
            View All Projects
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
