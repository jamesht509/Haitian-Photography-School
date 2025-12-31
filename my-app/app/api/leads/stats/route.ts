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

export async function GET(request: NextRequest) {
  try {
    // Check admin password
    const authHeader = request.headers.get('authorization');
    // Trim whitespace from password to avoid issues
    const adminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();
    
    // Normalize comparison - trim both sides
    const expectedHeader = `Bearer ${adminPassword}`;
    const receivedHeader = authHeader?.trim() || '';
    
    if (receivedHeader !== expectedHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get total leads count
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM leads
    `;
    const totalLeads = parseInt(totalResult.rows[0].total);
    
    // Get device type breakdown
    const deviceResult = await sql`
      SELECT 
        device_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / ${totalLeads}, 1) as percentage
      FROM leads
      GROUP BY device_type
      ORDER BY count DESC
    `;
    
    // Get top cities
    const citiesResult = await sql`
      SELECT 
        city_from_form,
        COUNT(*) as count
      FROM leads
      GROUP BY city_from_form
      ORDER BY count DESC
      LIMIT 10
    `;
    
    // Get leads over time (last 30 days)
    const timelineResult = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM leads
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    
    // Get referrer breakdown
    const referrerResult = await sql`
      SELECT 
        referrer,
        COUNT(*) as count
      FROM leads
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `;
    
    return NextResponse.json({
      success: true,
      stats: {
        total_leads: totalLeads,
        device_breakdown: deviceResult.rows,
        top_cities: citiesResult.rows,
        timeline: timelineResult.rows,
        referrers: referrerResult.rows,
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

