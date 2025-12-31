import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check admin password
    const authHeader = request.headers.get('authorization');
    
    const rawPassword = process.env.ADMIN_PASSWORD || '';
    const adminPassword = rawPassword.trim();
    
    const expectedHeader = `Bearer ${adminPassword}`;
    const receivedHeader = authHeader?.trim() || '';
    
    if (receivedHeader !== expectedHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Fetch all visits
    const { data: visits, error } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      visits: visits || []
    });
    
  } catch (error) {
    console.error('Error exporting visits:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to export visits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

