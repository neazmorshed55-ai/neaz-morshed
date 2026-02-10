"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { getFlagEmoji } from '../lib/flag-emoji';

// Custom hook for count-up animation
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress >= 1) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
}
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import { supabase } from '../lib/supabase';

// GeoJSON URL for world map (TopoJSON format)
const geoUrl = "/assets/data/countries-110m.json";

// My location (Bangladesh)
const MY_LOCATION = {
  coordinates: [90.4125, 23.8103] as [number, number], // Dhaka, Bangladesh
  name: "Bangladesh"
};

// UN M49 numeric codes to ISO Alpha-2 mapping
const numericToAlpha2: Record<string, string> = {
  '840': 'US', '826': 'GB', '276': 'DE', '250': 'FR', '380': 'IT',
  '724': 'ES', '578': 'NO', '752': 'SE', '208': 'DK', '528': 'NL',
  '056': 'BE', '040': 'AT', '756': 'CH', '616': 'PL', '203': 'CZ',
  '620': 'PT', '300': 'GR', '372': 'IE', '246': 'FI', '348': 'HU',
  '642': 'RO', '100': 'BG', '191': 'HR', '703': 'SK', '705': 'SI',
  '440': 'LT', '428': 'LV', '233': 'EE', '804': 'UA', '112': 'BY',
  '643': 'RU', '792': 'TR', '036': 'AU', '554': 'NZ', '392': 'JP',
  '156': 'CN', '410': 'KR', '356': 'IN', '050': 'BD', '586': 'PK',
  '360': 'ID', '458': 'MY', '702': 'SG', '764': 'TH', '704': 'VN',
  '608': 'PH', '124': 'CA', '484': 'MX', '076': 'BR', '032': 'AR',
  '152': 'CL', '170': 'CO', '604': 'PE', '862': 'VE', '218': 'EC',
  '858': 'UY', '600': 'PY', '068': 'BO', '818': 'EG', '710': 'ZA',
  '566': 'NG', '404': 'KE', '504': 'MA', '012': 'DZ', '788': 'TN',
  '784': 'AE', '682': 'SA', '376': 'IL', '400': 'JO', '422': 'LB',
  '634': 'QA', '414': 'KW', '512': 'OM', '048': 'BH', '364': 'IR',
  '368': 'IQ', '760': 'SY', '196': 'CY', '470': 'MT', '442': 'LU',
  '352': 'IS', '499': 'ME', '008': 'AL', '807': 'MK',
  '688': 'RS', '070': 'BA', '498': 'MD', '268': 'GE', '051': 'AM',
  '031': 'AZ', '398': 'KZ', '860': 'UZ', '762': 'TJ', '417': 'KG',
  '795': 'TM', '496': 'MN', '144': 'LK', '524': 'NP', '104': 'MM',
  '116': 'KH', '418': 'LA', '388': 'JM', '780': 'TT', '044': 'BS',
  '188': 'CR', '591': 'PA', '320': 'GT', '340': 'HN', '558': 'NI',
  '222': 'SV', '084': 'BZ', '192': 'CU', '214': 'DO', '332': 'HT',
  '630': 'PR', '533': 'AW', '531': 'CW', '238': 'FK', '308': 'GD',
  '740': 'SR', '328': 'GY', '854': 'BF', '466': 'ML',
  '562': 'NE', '694': 'SL', '768': 'TG', '204': 'BJ', '384': 'CI',
  '288': 'GH', '686': 'SN', '324': 'GN', '430': 'LR', '624': 'GW',
  '132': 'CV', '478': 'MR', '270': 'GM', '266': 'GA', '178': 'CG',
  '180': 'CD', '024': 'AO', '508': 'MZ', '834': 'TZ', '800': 'UG',
  '646': 'RW', '108': 'BI', '454': 'MW', '716': 'ZW', '894': 'ZM',
  '072': 'BW', '426': 'LS', '748': 'SZ', '516': 'NA', '450': 'MG',
  '480': 'MU', '690': 'SC', '174': 'KM', '175': 'YT', '638': 'RE',
  '262': 'DJ', '232': 'ER', '728': 'SS', '729': 'SD', '434': 'LY',
  '148': 'TD', '140': 'CF', '120': 'CM', '226': 'GQ', '678': 'ST'
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

  // Create a map of Alpha-2 codes to stats for O(1) lookup
  const statsMap = useMemo(() => {
    const map: Record<string, CountryStats> = {};
    countryStats.forEach(stat => {
      map[stat.country_code.toUpperCase()] = stat;
    });
    return map;
  }, [countryStats]);

  // Get Alpha-2 code from geo object (uses numeric UN M49 code)
  const getAlpha2FromGeo = (geo: any): string | null => {
    const numericId = geo.id?.toString();
    return numericToAlpha2[numericId] || null;
  };

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

  // Top 3 countries by sales
  const top3Countries = useMemo(() => {
    return [...countryStats]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [countryStats]);

  // Count-up animations
  const { count: animatedPercentage, ref: percentageRef } = useCountUp(presencePercentage, 1500);
  const { count: animatedCountries, ref: countriesRef } = useCountUp(countryStats.length, 1500);
  const { count: animatedSales, ref: salesRef } = useCountUp(totalSales, 2000);

  // Get stats for a specific country by Alpha-2 code
  const getCountryStatsByAlpha2 = (alpha2Code: string | null): CountryStats | undefined => {
    if (!alpha2Code) return undefined;
    return statsMap[alpha2Code.toUpperCase()];
  };

  // Check if country is highlighted
  const isCountryHighlighted = (geo: any): boolean => {
    const alpha2 = getAlpha2FromGeo(geo);
    return alpha2 ? !!statsMap[alpha2] : false;
  };

  const handleMouseEnter = (
    geo: any,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    const alpha2 = getAlpha2FromGeo(geo);
    const stats = getCountryStatsByAlpha2(alpha2);
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
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative bg-slate-900/40 border border-white/5 rounded-[2rem] lg:rounded-[3rem] p-4 lg:p-8 overflow-hidden"
      >
        {/* Top Left - International Presence */}
        <div ref={percentageRef} className="absolute top-4 left-4 lg:top-8 lg:left-8 z-10">
          <div className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            International Presence
          </div>
          <div className="text-2xl lg:text-3xl font-black text-[#2ecc71]">
            {animatedPercentage}%
          </div>
        </div>

        {/* Top Right - Top 3 Countries */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8 z-10">
          <div className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Top Countries
          </div>
          <div className="space-y-1.5">
            {top3Countries.map((country, index) => (
              <div key={country.country_code} className="flex items-center gap-2">
                <span className="text-2xl">{getFlagEmoji(country.country_code)}</span>
                <span className="text-white text-xs lg:text-sm font-medium">
                  {country.country_name}
                </span>
                <span className="text-[#2ecc71] text-xs lg:text-sm font-bold ml-auto">
                  {country.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Left - Countries */}
        <div ref={countriesRef} className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-10">
          <div className="text-2xl lg:text-3xl font-black text-white">{animatedCountries}</div>
          <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Countries
          </div>
        </div>

        {/* Bottom Right - Total Sales */}
        <div ref={salesRef} className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 z-10 text-right">
          <div className="text-2xl lg:text-3xl font-black text-[#2ecc71]">{animatedSales}</div>
          <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Total Sales
          </div>
        </div>
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
                  const highlighted = isCountryHighlighted(geo);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => handleMouseEnter(geo, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      style={{
                        default: {
                          fill: highlighted ? "#2ecc71" : "#1e293b",
                          stroke: "#0f172a",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 0.3s ease"
                        },
                        hover: {
                          fill: highlighted ? "#27ae60" : "#334155",
                          stroke: highlighted ? "#2ecc71" : "#475569",
                          strokeWidth: highlighted ? 1.5 : 0.5,
                          outline: "none",
                          cursor: highlighted ? "pointer" : "default"
                        },
                        pressed: {
                          fill: highlighted ? "#27ae60" : "#334155",
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
    </section>
  );
}
