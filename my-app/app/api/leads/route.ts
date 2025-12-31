import { createPool } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// Get database connection string with validation and SSL enforcement
const getConnectionString = (): string => {
  // Check DATABASE_URL first (priority)
  let dbUrl = process.env.DATABASE_URL;
  
  // Fallback to POSTGRES_URL if DATABASE_URL is not set
  if (!dbUrl) {
    dbUrl = process.env.POSTGRES_URL;
  }
  
  // Throw clear error if neither is set
  if (!dbUrl) {
    const error = new Error('DATABASE_URL is not defined. Please set DATABASE_URL or POSTGRES_URL environment variable in Vercel.');
    console.error('[DB ERROR] No database URL found!');
    console.error('[DB ERROR] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
    console.error('[DB ERROR] POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');
    throw error;
  }
  
  // Ensure SSL is required for Neon (add if not present)
  const url = new URL(dbUrl);
  if (!url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
    dbUrl = url.toString();
    console.log('[DB] Added sslmode=require to connection string');
  }
  
  return dbUrl;
};

// Initialize database connection pool
let pool: ReturnType<typeof createPool>;
let sql: ReturnType<typeof createPool>['sql'];

try {
  const connectionString = getConnectionString();
  
  // Validate connection string is not undefined before creating pool
  if (!connectionString || typeof connectionString !== 'string') {
    throw new Error('Connection string is invalid. Expected a string but got: ' + typeof connectionString);
  }
  
  pool = createPool({
    connectionString: connectionString,
  });
  
  sql = pool.sql;
  
  console.log('[DB] Connection pool created successfully');
  console.log('[DB] Using:', process.env.DATABASE_URL ? 'DATABASE_URL' : 'POSTGRES_URL');
} catch (error) {
  console.error('[DB ERROR] Failed to initialize database connection:', error);
  throw error;
}

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
    // Trim whitespace from password to avoid issues
    const adminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();
    
    // Normalize comparison - trim both sides
    const expectedHeader = `Bearer ${adminPassword}`;
    const receivedHeader = authHeader?.trim() || '';
    
    // Always log for debugging (safe - doesn't expose full password)
    console.log('[AUTH DEBUG] ========================================');
    console.log('[AUTH DEBUG] Admin password configured:', !!process.env.ADMIN_PASSWORD);
    console.log('[AUTH DEBUG] Password length:', adminPassword.length);
    console.log('[AUTH DEBUG] Password first char:', adminPassword[0] || 'N/A');
    console.log('[AUTH DEBUG] Password last char:', adminPassword[adminPassword.length - 1] || 'N/A');
    console.log('[AUTH DEBUG] Expected header length:', expectedHeader.length);
    console.log('[AUTH DEBUG] Received header:', authHeader ? 'YES' : 'NO');
    if (authHeader) {
      console.log('[AUTH DEBUG] Received header length:', receivedHeader.length);
      console.log('[AUTH DEBUG] Headers match:', receivedHeader === expectedHeader);
      // Compare character by character for debugging
      if (receivedHeader.length === expectedHeader.length) {
        for (let i = 0; i < Math.min(receivedHeader.length, 20); i++) {
          if (receivedHeader[i] !== expectedHeader[i]) {
            console.log(`[AUTH DEBUG] Mismatch at position ${i}: expected '${expectedHeader[i]}' (${expectedHeader.charCodeAt(i)}), got '${receivedHeader[i]}' (${receivedHeader.charCodeAt(i)})`);
            break;
          }
        }
      } else {
        console.log('[AUTH DEBUG] Length mismatch:', {
          expected: expectedHeader.length,
          received: receivedHeader.length,
          difference: Math.abs(expectedHeader.length - receivedHeader.length)
        });
      }
    }
    console.log('[AUTH DEBUG] ========================================');
    
    if (receivedHeader !== expectedHeader) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          debug: process.env.NODE_ENV === 'development' ? {
            expectedLength: expectedHeader.length,
            receivedLength: receivedHeader.length,
            passwordConfigured: !!process.env.ADMIN_PASSWORD,
            passwordLength: adminPassword.length
          } : undefined
        },
        { status: 401 }
      );
    }
    
    // Fetch all leads
    try {
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
    } catch (dbError) {
      console.error('[DB ERROR] Failed to fetch leads:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
          hint: 'Please check DATABASE_URL or POSTGRES_URL environment variable'
        },
        { status: 500 }
      );
    }
    
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

