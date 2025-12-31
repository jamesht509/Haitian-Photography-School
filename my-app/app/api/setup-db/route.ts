import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.'
      }, { status: 500 });
    }

    // Test connection by querying the leads table
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .limit(1);

    if (error) {
      // Table might not exist - provide instructions
      return NextResponse.json({ 
        success: false, 
        error: 'Table "leads" does not exist. Please create it in Supabase with the following columns: name, whatsapp, email, city, device, ip, created_at',
        instructions: 'Go to Supabase Dashboard → Table Editor → Create Table "leads" with columns: name (text), whatsapp (text), email (text), city (text), device (text), ip (text), created_at (timestamp)'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection successful! Table 'leads' exists.",
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'
    });
  } catch (error) {
    console.error('Error checking Supabase:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
