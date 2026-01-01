import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// Helper function to detect device type from User-Agent
function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  // Check for mobile devices
  if (/(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
    // Distinguish tablet from mobile
    if (/(ipad|tablet|playbook|silk)/i.test(ua)) {
      return 'tablet';
    }
    return 'mobile';
  }
  
  // Check for desktop
  if (/(windows|macintosh|linux)/i.test(ua)) {
    return 'desktop';
  }
  
  return 'unknown';
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Try Vercel-specific header first
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  // Try other common headers
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback
  return request.headers.get('x-client-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, whatsapp, email, city } = body;
    
    // Validate required fields
    if (!name || !whatsapp || !email || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get metadata
    const userAgent = request.headers.get('user-agent') || '';
    const device = detectDeviceType(userAgent);
    const ip = getClientIP(request);
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Insert lead into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        whatsapp,
        email,
        city,
        device,
        ip,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving lead to Supabase:', error);
      return NextResponse.json(
        { 
          error: 'Failed to save lead',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    // Try to link this lead to a visit (if visit_id is provided in request)
    const visitId = request.headers.get('x-visit-id');
    if (visitId) {
      try {
        const { error: visitError } = await supabase
          .from('visits')
          .update({
            converted: true,
            converted_at: new Date().toISOString(),
            lead_id: data.id
          })
          .eq('id', parseInt(visitId));
        
        if (visitError) {
          console.warn('Failed to link visit to lead:', visitError);
        }
      } catch (linkError) {
        console.warn('Error linking visit to lead:', linkError);
      }
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      data: {
        id: data.id,
        created_at: data.created_at,
        device_type: device,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error saving lead:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save lead',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve leads (protected by admin)
export async function GET(request: NextRequest) {
  try {
    // Check admin password from header
    const authHeader = request.headers.get('authorization');
    
    // Get password from env and trim it
    const rawPassword = process.env.ADMIN_PASSWORD || '';
    const adminPassword = rawPassword.trim();
    
    // Debug logging (only in development or if DEBUG_AUTH is set)
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_AUTH === 'true') {
      console.log('[AUTH DEBUG] ========================================');
      console.log('[AUTH DEBUG] Admin password configured:', !!process.env.ADMIN_PASSWORD);
      console.log('[AUTH DEBUG] Password length:', adminPassword.length);
      console.log('[AUTH DEBUG] Expected header length:', `Bearer ${adminPassword}`.length);
      console.log('[AUTH DEBUG] Received header:', authHeader ? 'YES' : 'NO');
      console.log('[AUTH DEBUG] Received header length:', authHeader?.length || 0);
    }
    
    // Normalize comparison - trim both sides (input and env var)
    const expectedHeader = `Bearer ${adminPassword}`;
    const receivedHeader = authHeader?.trim() || '';
    
    if (receivedHeader !== expectedHeader) {
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_AUTH === 'true') {
        console.log('[AUTH DEBUG] Headers match: false');
        console.log('[AUTH DEBUG] Expected:', expectedHeader);
        console.log('[AUTH DEBUG] Received:', receivedHeader);
      }
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_AUTH === 'true') {
      console.log('[AUTH DEBUG] Headers match: true');
      console.log('[AUTH DEBUG] ========================================');
    }
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Fetch all leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[DB ERROR] Failed to fetch leads:', error);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      leads: leads || [],
      count: leads?.length || 0
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
