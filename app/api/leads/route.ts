import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Analyze lead intent from chat history
function analyzeLeadIntent(chatHistory: any[], serviceInterest: string, budget: string) {
  const intentSignals: string[] = [];
  let urgencyLevel = 'medium';
  let buyingIntent = 'medium';

  // Analyze budget for buying intent
  if (budget) {
    if (budget.includes('5000') || budget.includes('10000') || budget.includes('+')) {
      buyingIntent = 'high';
      intentSignals.push('High budget indicates serious buyer');
    } else if (budget.includes('Under') || budget.includes('500')) {
      buyingIntent = 'low';
      intentSignals.push('Lower budget - may need nurturing');
    }
  }

  // Analyze service interest
  const highValueServices = ['Web Development', 'Lead Generation', 'Data & CRM Management'];
  if (highValueServices.some(s => serviceInterest?.includes(s))) {
    intentSignals.push(`Interested in high-value service: ${serviceInterest}`);
  }

  // Check chat history for urgency keywords
  if (chatHistory && Array.isArray(chatHistory)) {
    const userMessages = chatHistory
      .filter((m: any) => m.role === 'user')
      .map((m: any) => m.content.toLowerCase())
      .join(' ');

    if (userMessages.includes('urgent') || userMessages.includes('asap') || userMessages.includes('immediately')) {
      urgencyLevel = 'high';
      intentSignals.push('Expressed urgency in conversation');
    }
    if (userMessages.includes('project') || userMessages.includes('need help')) {
      intentSignals.push('Has an active project need');
    }
  }

  return {
    buyingIntent,
    urgencyLevel,
    intentSignals,
    priorityScore: buyingIntent === 'high' ? 'HOT' : urgencyLevel === 'high' ? 'WARM' : 'NORMAL',
  };
}

// Send email notification for new lead
async function sendLeadNotification(lead: any, chatHistory: any[]) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'contact@neazmdmorshed.com';

  if (!resendApiKey) {
    console.log('Resend API key not configured, skipping email notification');
    return;
  }

  // Analyze lead intent
  const intentAnalysis = analyzeLeadIntent(chatHistory, lead.service_interest, lead.budget);
  const isHighPriority = intentAnalysis.priorityScore === 'HOT';

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
        subject: isHighPriority
          ? `🔥 HOT LEAD: ${lead.name} - ${lead.service_interest || 'General Inquiry'}`
          : `New Lead: ${lead.name} - ${lead.service_interest || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, ${isHighPriority ? '#e74c3c' : '#2ecc71'} 0%, ${isHighPriority ? '#c0392b' : '#27ae60'} 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">
                ${isHighPriority ? '🔥 Hot Lead Alert!' : '✨ New Lead Captured!'}
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">
                ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}
              </p>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <!-- Priority Badge -->
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; background: ${isHighPriority ? '#e74c3c' : intentAnalysis.priorityScore === 'WARM' ? '#f39c12' : '#3498db'}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                  ${intentAnalysis.priorityScore} LEAD
                </span>
              </div>

              <!-- Contact Details -->
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👤 Contact Details</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${lead.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${lead.email}" style="color: #2ecc71; font-weight: bold;">${lead.email}</a>
                    </td>
                  </tr>
                  ${lead.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Phone:</td>
                    <td style="padding: 8px 0; color: #333;">${lead.phone}</td>
                  </tr>
                  ` : ''}
                  ${lead.company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Company:</td>
                    <td style="padding: 8px 0; color: #333;">${lead.company}</td>
                  </tr>
                  ` : ''}
                  ${lead.country ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Location:</td>
                    <td style="padding: 8px 0; color: #333;">${lead.city ? lead.city + ', ' : ''}${lead.country}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Interest & Budget -->
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #2ecc71;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🎯 Interest Details</h2>
                <table style="width: 100%;">
                  ${lead.service_interest ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Service:</td>
                    <td style="padding: 8px 0;">
                      <span style="background: #2ecc71; color: white; padding: 4px 12px; border-radius: 15px; font-size: 13px; font-weight: bold;">
                        ${lead.service_interest}
                      </span>
                    </td>
                  </tr>
                  ` : ''}
                  ${lead.budget ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Budget:</td>
                    <td style="padding: 8px 0;">
                      <span style="background: ${lead.budget.includes('5000') || lead.budget.includes('10000') ? '#e74c3c' : '#f39c12'}; color: white; padding: 4px 12px; border-radius: 15px; font-size: 13px; font-weight: bold;">
                        ${lead.budget}
                      </span>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Buying Intent:</td>
                    <td style="padding: 8px 0; color: #333; text-transform: capitalize; font-weight: bold;">${intentAnalysis.buyingIntent}</td>
                  </tr>
                </table>
              </div>

              <!-- Intent Analysis -->
              ${intentAnalysis.intentSignals.length > 0 ? `
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #9b59b6;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📊 AI Intent Analysis</h2>
                <ul style="margin: 0; padding-left: 20px;">
                  ${intentAnalysis.intentSignals.map(signal => `
                    <li style="padding: 5px 0; color: #555;">${signal}</li>
                  `).join('')}
                </ul>
              </div>
              ` : ''}

              <!-- Message -->
              ${lead.message ? `
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 Their Message</h2>
                <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; color: #555; line-height: 1.6; margin: 0; font-style: italic;">
                  "${lead.message}"
                </p>
              </div>
              ` : ''}

              <!-- Chat History Summary -->
              ${chatHistory && chatHistory.length > 0 ? `
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🤖 Chatbot Conversation</h2>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
                  ${chatHistory.slice(-6).map((msg: any) => `
                    <div style="margin-bottom: 10px; ${msg.role === 'user' ? 'text-align: right;' : ''}">
                      <span style="display: inline-block; padding: 8px 12px; border-radius: 12px; font-size: 13px; max-width: 80%; ${
                        msg.role === 'user'
                          ? 'background: #2ecc71; color: white;'
                          : 'background: white; color: #333; border: 1px solid #ddd;'
                      }">
                        ${msg.content}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}

              <!-- Quick Actions -->
              <div style="text-align: center; margin-top: 20px;">
                <a href="mailto:${lead.email}?subject=Re: Your inquiry about ${lead.service_interest || 'our services'}&body=Hi ${lead.name},%0D%0A%0D%0AThank you for your interest in my services.%0D%0A%0D%0A"
                   style="display: inline-block; background: #2ecc71; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
                  📧 Reply Now
                </a>
                <a href="https://neaz-morshed.vercel.app/admin/leads"
                   style="display: inline-block; background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
                  📋 View Dashboard
                </a>
              </div>

              <p style="color: #999; font-size: 11px; margin-top: 30px; text-align: center;">
                Lead captured via AI Chatbot • ${lead.page_url || 'https://neaz-morshed.vercel.app'}
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send email notification:', error);
    } else {
      console.log('Lead notification email sent successfully');
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// POST - Create a new lead
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, phone, company, serviceInterest, budget, message, chatHistory, pageUrl } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Get IP and location
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    let geoData = { country: null, city: null };

    if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
        const geoJson = await geoResponse.json();
        if (geoJson.status === 'success') {
          geoData = { country: geoJson.country, city: geoJson.city };
        }
      } catch (error) {
        console.error('Geolocation fetch error:', error);
      }
    }

    // Determine priority based on service interest and budget
    let priority = 'medium';
    if (budget && (budget.includes('5000') || budget.includes('10000') || budget.toLowerCase().includes('high'))) {
      priority = 'high';
    }

    // Insert lead
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone,
        company,
        service_interest: serviceInterest,
        budget,
        message,
        source: 'chatbot',
        status: 'new',
        priority,
        ip_address: ip,
        country: geoData.country,
        city: geoData.city,
        user_agent: userAgent,
        page_url: pageUrl,
        chat_history: chatHistory,
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notification asynchronously with chat history
    sendLeadNotification({ ...data, ...geoData }, chatHistory || []);

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// GET - Get leads (for admin)
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'stats') {
      const { data: stats, error } = await supabase
        .from('lead_stats')
        .select('*')
        .single();

      if (error) throw error;
      return NextResponse.json(stats);
    }

    // Get leads with optional status filter
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// PATCH - Update lead status
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { id, status, notes, priority } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (priority) updateData.priority = priority;

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
