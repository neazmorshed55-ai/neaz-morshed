import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Send email notification for contact form submission using Nodemailer
async function sendContactEmail(contact: any) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'neazmd.tamim@gmail.com';
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.log('Gmail credentials not configured, skipping email notification');
    return;
  }

  try {
    // Using Gmail SMTP
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const mailOptions = {
      from: `"Neaz Portfolio" <${gmailUser}>`,
      to: notificationEmail,
      subject: `New Contact Form Message from ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              📬 New Contact Form Message
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">
              ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}
            </p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <!-- Contact Details -->
            <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👤 Contact Details</h2>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${contact.email}" style="color: #2ecc71; font-weight: bold;">${contact.email}</a>
                  </td>
                </tr>
                ${contact.country ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Location:</td>
                  <td style="padding: 8px 0; color: #333;">${contact.city ? contact.city + ', ' : ''}${contact.country}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Message -->
            <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #2ecc71;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h2>
              <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; color: #555; line-height: 1.6; margin: 0;">
                ${contact.message}
              </p>
            </div>

            <!-- Quick Actions -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${contact.email}?subject=Re: Your message from portfolio contact form&body=Hi ${contact.name},%0D%0A%0D%0AThank you for reaching out to me.%0D%0A%0D%0A"
                 style="display: inline-block; background: #2ecc71; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
                📧 Reply to ${contact.name}
              </a>
            </div>

            <p style="color: #999; font-size: 11px; margin-top: 30px; text-align: center;">
              Message sent via Contact Form • https://neaz-morshed.vercel.app/contact
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully!');
    console.log('Email info:', info.messageId);
    console.log(`Email sent to: ${notificationEmail}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    console.log('=== Contact Form Submission Started ===');

    // Check Supabase connection
    if (!supabase) {
      console.error('Supabase client is null');
      return NextResponse.json({
        error: 'Database not configured. Please check Supabase environment variables.'
      }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, message } = body;
    console.log('Received data:', { name, email, messageLength: message?.length });

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Validation failed: Missing required fields');
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Get IP and location (optional, won't block submission)
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
        console.error('Geolocation fetch error (non-critical):', error);
      }
    }

    console.log('Attempting database insert...');

    // Insert contact into database
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        message,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Database insert successful:', data?.id);

    // Send email notification asynchronously (don't block response)
    try {
      sendContactEmail({ ...data, ...geoData });
      console.log('Email notification triggered');
    } catch (emailError) {
      console.error('Email notification error (non-critical):', emailError);
      // Don't fail the request if email fails
    }

    console.log('=== Contact Form Submission Completed ===');
    return NextResponse.json({ success: true, contact: data });

  } catch (error: any) {
    console.error('=== Contact Form Submission Failed ===');
    console.error('Error details:', error);
    return NextResponse.json({
      error: error.message || 'Failed to submit contact form',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}
