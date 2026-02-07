import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET method to fetch homepage content (public access)
export async function GET() {
    try {
        // Use anon key for public read access
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from('homepage_content')
            .select('*')
            .single();

        if (error) {
            console.error('Supabase fetch error:', error);
            throw error;
        }

        // Set cache control headers to prevent caching
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error: any) {
        console.error('Error fetching homepage content:', error);
        return NextResponse.json({
            error: 'Failed to fetch homepage content',
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Get the authorization header (user's session token)
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized - No auth token provided' }, { status: 401 });
        }

        // Create Supabase client with the user's token
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: authHeader
                }
            }
        });

        const body = await request.json();
        const {
            id,
            hero_subtitle,
            hero_title_prefix,
            hero_name,
            hero_description,
            hero_typewriter_texts,
            hero_stats
        } = body;

        if (!id) {
            return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
        }

        // Perform the update with user's auth token (RLS will check permissions)
        const { data, error } = await supabase
            .from('homepage_content')
            .update({
                hero_subtitle,
                hero_title_prefix,
                hero_name,
                hero_description,
                hero_typewriter_texts,
                hero_stats,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'No records updated. ID might be incorrect.' }, { status: 404 });
        }

        // Return with no-cache headers to ensure fresh data on next fetch
        return NextResponse.json({ success: true, data: data[0] }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error: any) {
        console.error('Error updating homepage content:', error);
        return NextResponse.json({
            error: 'Failed to update homepage content',
            details: error.message
        }, { status: 500 });
    }
}
