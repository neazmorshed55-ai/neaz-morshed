"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import { supabase } from '../lib/supabase';
import { alpha2ToAlpha3 } from '../lib/country-codes';

// GeoJSON URL for world map (TopoJSON format)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// My location (Bangladesh)
const MY_LOCATION = {
  coordinates: [90.4125, 23.8103] as [number, number], // Dhaka, Bangladesh
  name: "Bangladesh"
};

// Interface for aggregated country data
interface CountryStats {
  country_code: string;
  country_name: string;
  count: number;
}

// Interface for tooltip state
interface TooltipState {
  x: number;
  y: number;
  countryName: string;
  salesCount: number;
  visible: boolean;
}

export default function WorldMap() {
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0, y: 0, countryName: '', salesCount: 0, visible: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and aggregate review data by country
  useEffect(() => {
    const fetchCountryStats = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('country_code, country_name')
          .not('country_code', 'is', null);

        if (error) throw error;

        // Aggregate by country
        const aggregated = data?.reduce((acc, review) => {
          const code = review.country_code;
          if (code) {
            if (!acc[code]) {
              acc[code] = {
                country_code: code,
                country_name: review.country_name || code,
                count: 0
              };
            }
            acc[code].count++;
          }
          return acc;
        }, {} as Record<string, CountryStats>);

        setCountryStats(Object.values(aggregated || {}));
      } catch (err) {
        console.error('Error fetching country stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryStats();
  }, []);

  // Create a map of Alpha-3 codes to stats for O(1) lookup
  const statsMap = useMemo(() => {
    const map: Record<string, CountryStats> = {};
    countryStats.forEach(stat => {
      const alpha3 = alpha2ToAlpha3[stat.country_code.toUpperCase()];
      if (alpha3) {
        map[alpha3] = stat;
      }
    });
    return map;
  }, [countryStats]);

  // Calculate international presence percentage
  const presencePercentage = useMemo(() => {
    const uniqueCountries = countryStats.length;
    const totalCountries = 195; // Approximate number of countries
    return Math.round((uniqueCountries / totalCountries) * 100);
  }, [countryStats]);

  // Total sales count
  const totalSales = useMemo(() => {
    return countryStats.reduce((sum, s) => sum + s.count, 0);
  }, [countryStats]);

  // Get stats for a specific country by Alpha-3 code
  const getCountryStats = (alpha3Code: string): CountryStats | undefined => {
    return statsMap[alpha3Code];
  };

  // Check if country is highlighted
  const isCountryHighlighted = (alpha3Code: string): boolean => {
    return !!statsMap[alpha3Code];
  };

  const handleMouseEnter = (
    geo: any,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    const alpha3 = geo.properties?.ISO_A3 || geo.id;
    const stats = getCountryStats(alpha3);
    if (stats) {
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        countryName: stats.country_name,
        salesCount: stats.count,
        visible: true
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
    if (tooltip.visible) {
      setTooltip(prev => ({
        ...prev,
        x: event.clientX,
        y: event.clientY
      }));
    }
  };

  return (
    <section className="container mx-auto px-6 max-w-7xl py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="text-[#2ecc71] text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">
          International Presence
        </span>
        <div className="text-6xl lg:text-8xl font-black text-gradient mb-4">
          {presencePercentage}%
        </div>
        <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">
          My Clients <span className="text-slate-500">Around the Globe</span>
        </h2>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative bg-slate-900/40 border border-white/5 rounded-[2rem] lg:rounded-[3rem] p-4 lg:p-8 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px] lg:h-[450px]">
            <div className="w-12 h-12 border-4 border-[#2ecc71]/20 border-t-[#2ecc71] rounded-full animate-spin" />
          </div>
        ) : (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 130,
              center: [0, 30]
            }}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "500px"
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const alpha3 = geo.properties?.ISO_A3 || geo.id;
                  const isHighlighted = isCountryHighlighted(alpha3);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => handleMouseEnter(geo, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      style={{
                        default: {
                          fill: isHighlighted ? "#2ecc71" : "#1e293b",
                          stroke: "#0f172a",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 0.3s ease"
                        },
                        hover: {
                          fill: isHighlighted ? "#27ae60" : "#334155",
                          stroke: isHighlighted ? "#2ecc71" : "#475569",
                          strokeWidth: isHighlighted ? 1.5 : 0.5,
                          outline: "none",
                          cursor: isHighlighted ? "pointer" : "default"
                        },
                        pressed: {
                          fill: isHighlighted ? "#27ae60" : "#334155",
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* My Location Marker */}
            <Marker coordinates={MY_LOCATION.coordinates}>
              <g transform="translate(-12, -24)">
                {/* Location Pin SVG */}
                <path
                  d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9z"
                  fill="#2ecc71"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="9" r="3.5" fill="#fff" />
              </g>
            </Marker>
          </ComposableMap>
        )}

        {/* Tooltip - Fiverr Style */}
        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[100] pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y - 55,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="relative">
                {/* Tooltip Box */}
                <div className="bg-slate-800 rounded-lg px-4 py-2 shadow-xl">
                  <span className="text-white font-medium text-sm whitespace-nowrap">
                    {tooltip.countryName} - {tooltip.salesCount} {tooltip.salesCount === 1 ? 'Sale' : 'Sales'}
                  </span>
                </div>
                {/* Arrow Pointer */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                  style={{
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #1e293b'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center gap-12 mt-8"
      >
        <div className="text-center">
          <div className="text-3xl font-black text-white">{countryStats.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
            Countries
          </div>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <div className="text-3xl font-black text-[#2ecc71]">{totalSales}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
            Total Sales
          </div>
        </div>
      </motion.div>
    </section>
  );
}
