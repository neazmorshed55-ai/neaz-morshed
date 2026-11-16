"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import NextImage from './SiteImage';
import { supabase } from '@/lib/supabase';
import { canOptimizeImage } from '@/lib/image-src';
import { Reveal, SplitText } from '@/components/motion/Reveal';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  service_id?: string;
}

/** Smaller thumbnail when one exists, otherwise the full image. */
const coverOf = (item: PortfolioItem) => item.thumbnail_url || item.image_url || null;

/**
 * Items can be passed in from the server (homepage); without them the
 * component fetches on its own as before.
 */
export default function IPadShowcase({ items }: { items?: PortfolioItem[] } = {}) {
  const [allPortfolioItems, setAllPortfolioItems] = useState<PortfolioItem[]>(items || []);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(!items);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(allPortfolioItems.length / itemsPerPage);
  const portfolioItems = allPortfolioItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (items) return;
    async function fetchPortfolioItems() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id, title, description, thumbnail_url, image_url, video_url, service_id, order_index')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setAllPortfolioItems(data);
        }
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioItems();
  }, [items]);

  useEffect(() => {
    if (allPortfolioItems.length === 0) return;

    let isCancelled = false;

    const sequence = async () => {
      if (isCancelled) return;

      // Get current page items
      const currentItems = allPortfolioItems.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );

      if (currentItems.length === 0) return;

      // Wait 2 seconds in grid view
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (isCancelled) return;

      // Zoom in
      setIsZoomed(true);

      // Show first item for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (isCancelled) return;

      // Cycle through items in current page
      for (let i = 1; i < currentItems.length; i++) {
        if (isCancelled) return;
        setCurrentIndex(i);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      if (isCancelled) return;

      // Zoom out
      setIsZoomed(false);
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (isCancelled) return;

      // Reset index first
      setCurrentIndex(0);

      // Wait a moment before page transition for smooth effect
      await new Promise(resolve => setTimeout(resolve, 500));
      if (isCancelled) return;

      // Move to next page (loop back to first page after last)
      setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    // Start first sequence
    sequence();

    return () => {
      isCancelled = true;
    };
  }, [allPortfolioItems, currentPage, totalPages, itemsPerPage]);

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
      className="pt-16 pb-16 sm:pt-24 sm:pb-24 bg-surface overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <Reveal y={16}>
            <span className="flex items-center justify-center gap-3 text-primary text-[11px] font-extrabold uppercase tracking-[0.4em] mb-5">
              <span className="h-px w-8 bg-primary/60" />
              Portfolio
              <span className="h-px w-8 bg-primary/60" />
            </span>
          </Reveal>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-5 text-ink">
            <SplitText text="Our" wordClassName="text-gradient" /> <SplitText text="Projects" delay={0.08} />
          </h2>
          <Reveal y={20} delay={0.1}>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Explore our diverse portfolio of successful projects
            </p>
          </Reveal>
        </div>

        {/* iPad Showcase */}
        <div className="relative min-h-[320px] sm:min-h-[400px] flex items-center justify-center perspective-[2000px]">
          <AnimatePresence mode="wait">
            {!isZoomed ? (
              // Grid View - Multiple iPads
              <motion.div
                key={`grid-page-${currentPage}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
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
                        opacity: index === currentIndex ? 1 : 0.78,
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
                      className="relative aspect-[4/3] rounded-md overflow-hidden shadow-[0_18px_40px_-18px_rgba(16,24,64,0.45)] bg-ink border-2 border-ink-soft"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                    {/* iPad Screen */}
                    <div className="absolute inset-1 bg-black rounded-md overflow-hidden">
                      {coverOf(item) ? (
                        <NextImage
                          src={coverOf(item)!}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 33vw, 220px"
                          quality={65}
                          unoptimized={!canOptimizeImage(coverOf(item))}
                          className="object-cover"
                        />
                      ) : item.video_url ? (
                        <video
                          src={item.video_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <p className="text-white/80 text-xs text-center px-2">{item.title}</p>
                        </div>
                      )}
                    </div>

                    {/* Glow effect for current item */}
                    {index === currentIndex && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/40 to-accent/40 blur-xl -z-10"
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
                key={`zoomed-page-${currentPage}`}
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
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[540px] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-ink border-4 border-ink-soft"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 50px 100px -20px rgba(61, 91, 239, 0.35), 0 0 60px -15px rgba(98, 93, 245, 0.25)',
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
                      ) : coverOf(portfolioItems[currentIndex]) ? (
                        <NextImage
                          src={portfolioItems[currentIndex].image_url || coverOf(portfolioItems[currentIndex])!}
                          alt={portfolioItems[currentIndex].title}
                          fill
                          sizes="(max-width: 640px) 90vw, 540px"
                          quality={70}
                          unoptimized={!canOptimizeImage(portfolioItems[currentIndex].image_url || coverOf(portfolioItems[currentIndex]))}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
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
                          className="text-white/80 text-sm sm:text-base line-clamp-2"
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
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-ink-soft shadow-inner" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Decorative Elements */}
        <motion.div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
          className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
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
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"
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
