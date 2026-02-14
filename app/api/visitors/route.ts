import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Page to service interest mapping
const pageInterestMap: Record<string, string> = {
  '/': 'General Interest',
  '/services': 'Services Overview',
  '/services/virtual-assistant': 'Virtual Assistant Services',
  '/services/lead-generation': 'Lead Generation Services',
  '/services/data-crm': 'Data & CRM Management',
  '/services/web-tech-support': 'Web & Tech Support',
  '/experience': 'Professional Background',
  '/skills': 'Skills & Expertise',
  '/reviews': 'Client Reviews',
  '/contact': 'Ready to Connect',
  '/resume': 'Resume/CV',
  '/blog': 'Blog Content',
};

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

// Analyze visitor interests based on pages visited
async function analyzeVisitorInterests(sessionId: string) {
  if (!supabase) return null;

  const { data: visits } = await supabase
    .from('visitors')
    .select('page_visited')
    .eq('session_id', sessionId);

  if (!visits || visits.length === 0) return null;

  const interests: Record<string, number> = {};
  const serviceInterests: string[] = [];

  visits.forEach(visit => {
    const page = visit.page_visited;
    const interest = pageInterestMap[page] || 'General Browsing';
    interests[interest] = (interests[interest] || 0) + 1;

    // Track specific service interests
    if (page.includes('/services/')) {
      const service = pageInterestMap[page];
      if (service && !serviceInterests.includes(service)) {
        serviceInterests.push(service);
      }
    }
  });

  // Sort by visit count
  const sortedInterests = Object.entries(interests)
    .sort((a, b) => b[1] - a[1])
    .map(([interest, count]) => ({ interest, visits: count }));

  return {
    totalPageViews: visits.length,
    topInterests: sortedInterests.slice(0, 5),
    serviceInterests,
    isHighIntent: visits.some(v =>
      v.page_visited === '/contact' ||
      v.page_visited.includes('/services/')
    ),
  };
}

// Send visitor notification email
async function sendVisitorNotification(visitor: any, geoData: any, interestAnalysis: any) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'contact@neazmdmorshed.com';

  if (!resendApiKey) {
    console.log('Resend API key not configured, skipping email notification');
    return;
  }

  // Only notify for high-intent visitors (visited contact or services pages)
  const isHighIntent = interestAnalysis?.isHighIntent ||
    visitor.page_visited === '/contact' ||
    visitor.page_visited.includes('/services/');

  // Also notify for new unique visitors from interesting locations
  const isNewSession = interestAnalysis?.totalPageViews === 1;

  if (!isHighIntent && !isNewSession) return;

  const currentInterest = pageInterestMap[visitor.page_visited] || 'General Browsing';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neaz Portfolio <notifications@neaz.pro>',
        to: [notificationEmail],
        subject: isHighIntent
          ? `High Intent Visitor: Viewing ${currentInterest}`
          : `New Visitor from ${geoData.country || 'Unknown Location'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, ${isHighIntent ? '#e74c3c' : '#3498db'} 0%, ${isHighIntent ? '#c0392b' : '#2980b9'} 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">
                ${isHighIntent ? '🔥 High Intent Visitor!' : '👋 New Website Visitor'}
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">
                ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}
              </p>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <!-- Current Activity -->
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid ${isHighIntent ? '#e74c3c' : '#3498db'};">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📍 Current Activity</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Page Viewed:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${visitor.page_visited}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Interest:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${currentInterest}</td>
                  </tr>
                </table>
              </div>

              <!-- Location Info -->
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🌍 Visitor Location</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Country:</td>
                    <td style="padding: 8px 0; color: #333;">${geoData.country || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">City:</td>
                    <td style="padding: 8px 0; color: #333;">${geoData.city || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Timezone:</td>
                    <td style="padding: 8px 0; color: #333;">${geoData.timezone || 'Unknown'}</td>
                  </tr>
                </table>
              </div>

              <!-- Device Info -->
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💻 Device Info</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Device:</td>
                    <td style="padding: 8px 0; color: #333; text-transform: capitalize;">${visitor.device_type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Browser:</td>
                    <td style="padding: 8px 0; color: #333;">${visitor.browser}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">OS:</td>
                    <td style="padding: 8px 0; color: #333;">${visitor.os}</td>
                  </tr>
                  ${visitor.referrer ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Referrer:</td>
                    <td style="padding: 8px 0; color: #333;">${visitor.referrer}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              ${interestAnalysis && interestAnalysis.totalPageViews > 1 ? `
              <!-- Interest Analysis -->
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #2ecc71;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📊 Interest Analysis</h2>
                <p style="color: #666; margin-bottom: 15px;">Total page views this session: <strong>${interestAnalysis.totalPageViews}</strong></p>

                <h3 style="color: #555; font-size: 14px; margin: 0 0 10px 0;">Top Interests:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${interestAnalysis.topInterests.map((i: any) => `
                    <li style="padding: 5px 0; color: #333;">${i.interest} <span style="color: #999;">(${i.visits} views)</span></li>
                  `).join('')}
                </ul>

                ${interestAnalysis.serviceInterests.length > 0 ? `
                <h3 style="color: #555; font-size: 14px; margin: 20px 0 10px 0;">🎯 Service Interests:</h3>
                <div>
                  ${interestAnalysis.serviceInterests.map((s: string) => `
                    <span style="display: inline-block; background: #2ecc71; color: white; padding: 5px 12px; border-radius: 20px; margin: 3px; font-size: 12px;">${s}</span>
                  `).join('')}
                </div>
                ` : ''}
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 20px;">
                <a href="https://neaz-morshed.vercel.app/admin/analytics"
                   style="display: inline-block; background: #2ecc71; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Full Analytics
                </a>
              </div>

              <p style="color: #999; font-size: 11px; margin-top: 30px; text-align: center;">
                This notification was triggered by visitor activity on your portfolio website.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send visitor notification:', error);
    } else {
      console.log('Visitor notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending visitor notification:', error);
  }
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

    // Analyze visitor interests
    const interestAnalysis = await analyzeVisitorInterests(sessionId);

    // Send notification for high-intent visitors
    sendVisitorNotification(
      { ...data, device_type: deviceType, browser, os },
      geoData,
      interestAnalysis
    );

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
      const { data: stats, error: statsError } = await supabase
        .from('visitor_stats')
        .select('*')
        .single();

      if (statsError) throw statsError;
      return NextResponse.json(stats);
    }

    if (type === 'countries') {
      const { data: countries, error: countriesError } = await supabase
        .from('visitor_countries')
        .select('*')
        .limit(50); // Increased limit to show more countries

      if (countriesError) throw countriesError;
      return NextResponse.json(countries);
    }

    if (type === 'unique') {
      // Get recent distinct sessions
      // Since Supabase JS client doesn't support DISTICT ON directly on query builder easily,
      // we'll fetch recent records and deduplicate in JS.
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(500); // Fetch recent 500 visitors to analyze journey

      if (visitorsError) throw visitorsError;

      // Deduplicate by session_id and aggregate pages
      const uniqueSessions = new Map();

      visitors.forEach(visitor => {
        if (!uniqueSessions.has(visitor.session_id)) {
          // New session found
          uniqueSessions.set(visitor.session_id, {
            ...visitor,
            visit_count: 1,
            pages_visited: [visitor.page_visited]
          });
        } else {
          // Existing session, add page if not already in list (for this session view)
          // or just track path. Let's list unique pages visited in this session.
          const session = uniqueSessions.get(visitor.session_id);
          if (!session.pages_visited.includes(visitor.page_visited)) {
            session.pages_visited.push(visitor.page_visited);
          }
          session.visit_count += 1;
        }
      });

      // Convert map values to array and take top 50
      const unique = Array.from(uniqueSessions.values()).slice(0, 50);

      return NextResponse.json(unique);
    }

    if (type === 'top_pages') {
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('page_visited')
        .order('visited_at', { ascending: false })
        .limit(1000);

      if (visitorsError) throw visitorsError;

      const pageCounts: Record<string, number> = {};
      visitors.forEach(v => {
        const page = v.page_visited || '/';
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });

      const sortedPages = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, visits: count }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);

      return NextResponse.json(sortedPages);
    }

    if (type === 'daily') {
      const { data: daily, error: dailyError } = await supabase
        .from('daily_visitors')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (dailyError) throw dailyError;
      return NextResponse.json(daily);
    }

    if (type === 'recent') {
      const { data: recent, error: recentError } = await supabase
        .from('visitors')
        .select('*')
        .gt('visited_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('visited_at', { ascending: false })
        .limit(50);

      if (recentError) throw recentError;
      return NextResponse.json(recent);
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
