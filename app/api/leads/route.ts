import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Send email notification for new lead
async function sendLeadNotification(lead: any) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'hello@neaz.pro';

  if (!resendApiKey) {
    console.log('Resend API key not configured, skipping email notification');
    return;
  }

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
        subject: `New Lead: ${lead.name} - ${lead.service_interest || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Lead Captured!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                    <a href="mailto:${lead.email}" style="color: #2ecc71;">${lead.email}</a>
                  </td>
                </tr>
                ${lead.phone ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Phone:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${lead.phone}</td>
                </tr>
                ` : ''}
                ${lead.company ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Company:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${lead.company}</td>
                </tr>
                ` : ''}
                ${lead.service_interest ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Service Interest:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${lead.service_interest}</td>
                </tr>
                ` : ''}
                ${lead.budget ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Budget:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${lead.budget}</td>
                </tr>
                ` : ''}
                ${lead.country ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Location:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${lead.city ? lead.city + ', ' : ''}${lead.country}</td>
                </tr>
                ` : ''}
              </table>

              ${lead.message ? `
              <h3 style="color: #333; margin-top: 20px;">Message</h3>
              <p style="background: white; padding: 15px; border-radius: 5px; color: #555; line-height: 1.6;">${lead.message}</p>
              ` : ''}

              <div style="margin-top: 30px; text-align: center;">
                <a href="https://neaz-morshed.vercel.app/admin/leads"
                   style="display: inline-block; background: #2ecc71; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View in Dashboard
                </a>
              </div>

              <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                This lead was captured via the AI Chatbot on ${new Date().toLocaleDateString()}
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

    // Send email notification asynchronously
    sendLeadNotification({ ...data, ...geoData });

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
