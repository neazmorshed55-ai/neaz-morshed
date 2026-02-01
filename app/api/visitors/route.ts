import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Parse user agent for device info
function parseUserAgent(ua: string) {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';

  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone')) os = 'iOS';

  return { deviceType, browser, os };
}

// POST - Track a new visitor
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { sessionId, page, referrer } = body;

    // Get IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Fetch geolocation data from IP
    let geoData = {
      country: null,
      country_code: null,
      city: null,
      region: null,
      latitude: null,
      longitude: null,
      timezone: null,
    };

    if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone`);
        const geoJson = await geoResponse.json();
        if (geoJson.status === 'success') {
          geoData = {
            country: geoJson.country,
            country_code: geoJson.countryCode,
            city: geoJson.city,
            region: geoJson.region,
            latitude: geoJson.lat,
            longitude: geoJson.lon,
            timezone: geoJson.timezone,
          };
        }
      } catch (error) {
        console.error('Geolocation fetch error:', error);
      }
    }

    // Insert visitor record
    const { data, error } = await supabase
      .from('visitors')
      .insert({
        session_id: sessionId,
        ip_address: ip,
        country: geoData.country,
        country_code: geoData.country_code,
        city: geoData.city,
        region: geoData.region,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timezone: geoData.timezone,
        user_agent: userAgent,
        referrer: referrer,
        page_visited: page,
        device_type: deviceType,
        browser: browser,
        os: os,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, visitor: data });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
  }
}

// GET - Get visitor statistics
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';

    if (type === 'stats') {
      // Get overall stats
      const { data: stats, error: statsError } = await supabase
        .from('visitor_stats')
        .select('*')
        .single();

      if (statsError) throw statsError;

      return NextResponse.json(stats);
    }

    if (type === 'countries') {
      // Get visitors by country
      const { data: countries, error: countriesError } = await supabase
        .from('visitor_countries')
        .select('*')
        .limit(10);

      if (countriesError) throw countriesError;

      return NextResponse.json(countries);
    }

    if (type === 'daily') {
      // Get daily visitors
      const { data: daily, error: dailyError } = await supabase
        .from('daily_visitors')
        .select('*')
        .limit(30);

      if (dailyError) throw dailyError;

      return NextResponse.json(daily);
    }

    if (type === 'recent') {
      // Get recent visitors
      const { data: recent, error: recentError } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(20);

      if (recentError) throw recentError;

      return NextResponse.json(recent);
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
