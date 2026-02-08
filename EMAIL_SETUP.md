# Email Setup Documentation

## Overview
Your contact form is now configured to send emails directly to **neazmd.tamim@gmail.com** when someone submits a message through the contact page at https://neaz-morshed.vercel.app/contact

## How It Works

1. **User fills out the contact form** with their name, email, and message
2. **Form submission** sends data to `/api/contact` endpoint
3. **API saves** the message to Supabase database
4. **Email notification** is sent to your email via Resend API
5. **User receives** confirmation that their message was sent

## Email Service: Resend

Your site uses [Resend](https://resend.com) to send emails. The configuration is:
- **From Address**: `notifications@neaz.pro`
- **To Address**: `neazmd.tamim@gmail.com` (configured via `NOTIFICATION_EMAIL` environment variable)

## Environment Variables

The following environment variables are configured in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://oemxzmnvvjiukejxktby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-key]
RESEND_API_KEY=[your-resend-api-key]
NOTIFICATION_EMAIL=neazmd.tamim@gmail.com
```

## Vercel Deployment Setup

To ensure emails work on your production site (neaz-morshed.vercel.app), you need to add these environment variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your `neaz-morshed` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update the following:
   - `NOTIFICATION_EMAIL` = `neazmd.tamim@gmail.com`
   - `RESEND_API_KEY` = `re_9ewAQB2G_PGaBM6mLcwUrPZs4sgUQY7pX`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://oemxzmnvvjiukejxktby.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [your-supabase-key]
5. **Redeploy** your application

## Email Template Features

When someone submits the contact form, you'll receive an email with:
- ✉️ **Contact Details**: Name, email, location (if detected)
- 💬 **Their Message**: Full message content
- 📧 **Quick Reply Button**: One-click reply to the sender
- 📊 **Metadata**: Timestamp (Bangladesh timezone), IP location

## Testing

To test the email functionality:

1. Visit https://neaz-morshed.vercel.app/contact
2. Fill out the form with test data
3. Click "Send Message"
4. Check your inbox at **neazmd.tamim@gmail.com**
5. You should receive an email within a few seconds

## Troubleshooting

If emails are not being received:

1. **Check Resend Dashboard**: Visit https://resend.com/emails to see email logs
2. **Check Spam Folder**: Sometimes emails from new domains go to spam
3. **Verify Environment Variables**: Ensure `NOTIFICATION_EMAIL` is set correctly in Vercel
4. **Check API Logs**: In Vercel dashboard, check function logs for errors
5. **Test Resend API Key**: Make sure your Resend API key is active

## Database

All contact form submissions are also saved to your Supabase database in the `contacts` table, even if the email fails to send. You can view all messages in your Supabase dashboard.

## Files Modified

- `/app/contact/page.tsx` - Updated form submission handler
- `/app/api/contact/route.ts` - Created new API endpoint
- `/.env.local` - Updated NOTIFICATION_EMAIL

## Need Help?

If you encounter any issues with the email setup, check:
- Resend account limits (free tier has daily limits)
- Domain verification status for notifications@neaz.pro
- Environment variable configuration in Vercel
