import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the service role key to bypass RLS
const supabase = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export async function PUT(request: NextRequest) {
    try {
        if (!supabase) {
            console.error('Supabase not configured with Service Role Key');
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

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

        // Perform the update with service role (bypassing RLS)
        const { data, error } = await supabase
            .from('homepage_content')
            .update({
                hero_subtitle,
                hero_title_prefix,
                hero_name,
                hero_description,
                hero_typewriter_texts,
                hero_stats
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

        return NextResponse.json({ success: true, data: data[0] });

    } catch (error: any) {
        console.error('Error updating homepage content:', error);
        return NextResponse.json({
            error: 'Failed to update homepage content',
            details: error.message
        }, { status: 500 });
    }
}
