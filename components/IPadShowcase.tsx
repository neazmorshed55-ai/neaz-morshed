"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  image_url?: string;
  video_url?: string;
  service_id: string;
}

export default function IPadShowcase() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    async function fetchPortfolioItems() {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('order_index', { ascending: true })
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          setPortfolioItems(data);
        }
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    if (portfolioItems.length === 0) return;

    const sequence = async () => {
      // Wait 2 seconds in grid view
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Zoom in
      setIsZoomed(true);

      // Show first item for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Cycle through items
      for (let i = 1; i < portfolioItems.length; i++) {
        setCurrentIndex(i);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Zoom out
      setIsZoomed(false);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset and repeat
      setCurrentIndex(0);
    };

    const interval = setInterval(() => {
      sequence();
    }, (portfolioItems.length * 3000) + 6000);

    // Start first sequence
    sequence();

    return () => clearInterval(interval);
  }, [portfolioItems]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
  };

  if (loading || portfolioItems.length === 0) {
    return null;
  }

  return (
    <section
      className="py-24 sm:py-32 bg-gradient-to-b from-[#0b0f1a] via-[#0f1419] to-[#0b0f1a] overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#2ecc71]">Our</span> Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our diverse portfolio of successful projects
          </p>
        </motion.div>

        {/* iPad Showcase */}
        <div className="relative min-h-[400px] sm:min-h-[500px] flex items-center justify-center perspective-[2000px]">
          <AnimatePresence mode="wait">
            {!isZoomed ? (
              // Grid View - Multiple iPads
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {portfolioItems.slice(0, 12).map((item, index) => {
                  const row = Math.floor(index / 4);
                  const col = index % 4;
                  const offsetX = (col - 1.5) * 10;
                  const offsetY = (row - 1.5) * 10;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20, rotateY: -10 }}
                      animate={{
                        opacity: index === currentIndex ? 1 : 0.5,
                        y: 0,
                        rotateY: 0,
                        scale: index === currentIndex ? 1.1 : 1,
                        x: index === currentIndex ? mouseX.get() * offsetX * 0.05 : 0,
                        rotateX: index === currentIndex ? -mouseY.get() : 0,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        z: 50,
                        transition: { duration: 0.3 }
                      }}
                      className="relative aspect-[4/3] rounded-md overflow-hidden shadow-xl bg-slate-900 border-2 border-slate-800"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                    {/* iPad Screen */}
                    <div className="absolute inset-1 bg-black rounded-md overflow-hidden">
                      {item.video_url ? (
                        <video
                          src={item.video_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2ecc71]/20 to-[#27ae60]/20 flex items-center justify-center">
                          <p className="text-white/50 text-xs text-center px-2">{item.title}</p>
                        </div>
                      )}
                    </div>

                    {/* Glow effect for current item */}
                    {index === currentIndex && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#2ecc71]/30 to-[#27ae60]/30 blur-xl -z-10"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Zoomed View - Single iPad
              <motion.div
                key="zoomed"
                initial={{ opacity: 0, scale: 0.5, rotateY: -20, z: -500 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  z: 0,
                  rotateX: -mouseY.get() * 0.5,
                  rotateZ: mouseX.get() * 0.2,
                }}
                exit={{ opacity: 0, scale: 0.5, rotateY: 20, z: -500 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-2xl aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-slate-800"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 50px 100px -20px rgba(46, 204, 113, 0.3), 0 0 60px -15px rgba(39, 174, 96, 0.2)',
                }}
              >
                {/* iPad Screen Bezel */}
                <div className="absolute inset-1 bg-black rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={portfolioItems[currentIndex].id}
                      initial={{ opacity: 0, x: 100, scale: 1.1, rotateY: 10 }}
                      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, x: -100, scale: 0.9, rotateY: -10 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full relative"
                    >
                      {/* Content */}
                      {portfolioItems[currentIndex].video_url ? (
                        <video
                          key={portfolioItems[currentIndex].video_url}
                          src={portfolioItems[currentIndex].video_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : portfolioItems[currentIndex].image_url ? (
                        <img
                          src={portfolioItems[currentIndex].image_url}
                          alt={portfolioItems[currentIndex].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2ecc71]/30 to-[#27ae60]/30 flex items-center justify-center">
                          <p className="text-white/70 text-xl text-center px-8">
                            {portfolioItems[currentIndex].title}
                          </p>
                        </div>
                      )}

                      {/* Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl sm:text-2xl font-bold text-white mb-2"
                        >
                          {portfolioItems[currentIndex].title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-slate-300 text-sm sm:text-base line-clamp-2"
                        >
                          {portfolioItems[currentIndex].description}
                        </motion.p>
                      </div>

                      {/* Progress Indicator */}
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-white text-sm font-semibold">
                          {currentIndex + 1} / {portfolioItems.length}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* iPad Home Button */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-700 shadow-inner" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Decorative Elements */}
        <motion.div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-[#2ecc71]/5 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#27ae60]/5 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#2ecc71]/3 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </section>
  );
}
