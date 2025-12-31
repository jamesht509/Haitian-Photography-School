import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to detect device type from User-Agent
function detectDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' | 'unknown' {
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
    const deviceType = detectDeviceType(userAgent);
    const ipAddress = getClientIP(request);
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || 'direct';
    
    // Insert lead into database
    const result = await sql`
      INSERT INTO leads (
        name, 
        whatsapp, 
        email, 
        city_from_form, 
        ip_address, 
        device_type, 
        user_agent, 
        referrer
      )
      VALUES (
        ${name}, 
        ${whatsapp}, 
        ${email}, 
        ${city}, 
        ${ipAddress}, 
        ${deviceType}, 
        ${userAgent}, 
        ${referrer}
      )
      RETURNING id, created_at
    `;
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      data: {
        id: result.rows[0].id,
        created_at: result.rows[0].created_at,
        device_type: deviceType,
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
    // Check admin password from query params or header
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch all leads
    const result = await sql`
      SELECT 
        id,
        name,
        whatsapp,
        email,
        city_from_form,
        ip_address,
        device_type,
        referrer,
        created_at
      FROM leads
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({
      success: true,
      leads: result.rows,
      count: result.rowCount
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

