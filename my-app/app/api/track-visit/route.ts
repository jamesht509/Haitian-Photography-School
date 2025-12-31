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

// Generate or get session ID from cookie
function getSessionId(request: NextRequest): string {
  const sessionId = request.cookies.get('session_id')?.value;
  if (sessionId) {
    return sessionId;
  }
  
  // Generate new session ID
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      page_url, 
      referrer: clientReferrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      visit_duration
    } = body;
    
    // Get metadata from headers
    const userAgent = request.headers.get('user-agent') || '';
    const device = detectDeviceType(userAgent);
    const ip = getClientIP(request);
    const sessionId = getSessionId(request);
    
    // Get referrer from header if not provided in body
    const referrer = clientReferrer || request.headers.get('referer') || request.headers.get('referrer') || 'direct';
    
    // Get current page URL if not provided
    const currentPageUrl = page_url || request.headers.get('referer') || 'unknown';
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Insert visit into Supabase
    const { data, error } = await supabase
      .from('visits')
      .insert({
        ip,
        device,
        referrer,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        user_agent: userAgent,
        page_url: currentPageUrl,
        session_id: sessionId,
        converted: false,
        visit_duration: visit_duration || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving visit to Supabase:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to save visit',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    // Set session cookie for tracking
    const response = NextResponse.json({
      success: true,
      visit_id: data.id,
      session_id: sessionId
    }, { status: 201 });
    
    // Set session cookie (expires in 30 minutes)
    response.cookies.set('session_id', sessionId, {
      maxAge: 30 * 60, // 30 minutes
      httpOnly: false, // Allow JavaScript access
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
    
  } catch (error) {
    console.error('Error tracking visit:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to track visit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update visit (for conversion tracking)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { visit_id, converted, lead_id, visit_duration } = body;
    
    if (!visit_id) {
      return NextResponse.json(
        { error: 'visit_id is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // Prepare update data
    const updateData: any = {};
    if (converted !== undefined) {
      updateData.converted = converted;
      if (converted) {
        updateData.converted_at = new Date().toISOString();
      }
    }
    if (lead_id !== undefined) {
      updateData.lead_id = lead_id;
    }
    if (visit_duration !== undefined) {
      updateData.visit_duration = visit_duration;
    }
    
    // Update visit record
    const { data, error } = await supabase
      .from('visits')
      .update(updateData)
      .eq('id', visit_id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating visit:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update visit',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      visit: data
    });
    
  } catch (error) {
    console.error('Error updating visit:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update visit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Visit tracking endpoint - use POST to track visits, PATCH to update',
    methods: {
      POST: 'Track new visit',
      PATCH: 'Update visit (conversion, duration, etc)'
    },
    required_fields: ['page_url'],
    optional_fields: ['referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'visit_duration']
  });
}

