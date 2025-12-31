import { createPool } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Temporary test endpoint to verify database connection
 * Tests specifically DATABASE_URL and runs SELECT NOW()
 */
export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {}
  };

  // Test 1: Check if DATABASE_URL exists
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasPostgresUrl = !!process.env.POSTGRES_URL;
  
  results.tests.push({
    name: 'Environment Variables Check',
    passed: hasDatabaseUrl || hasPostgresUrl,
    details: {
      DATABASE_URL: hasDatabaseUrl ? 'SET' : 'NOT SET',
      POSTGRES_URL: hasPostgresUrl ? 'SET' : 'NOT SET',
      DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
      POSTGRES_URL_length: process.env.POSTGRES_URL?.length || 0,
    }
  });

  if (!hasDatabaseUrl && !hasPostgresUrl) {
    return NextResponse.json({
      success: false,
      error: 'No database URL found. Neither DATABASE_URL nor POSTGRES_URL is set.',
      results
    }, { status: 500 });
  }

  // Test 2: Try to connect using DATABASE_URL specifically
  let connectionString = process.env.DATABASE_URL;
  let connectionSource = 'DATABASE_URL';
  
  if (!connectionString) {
    connectionString = process.env.POSTGRES_URL;
    connectionSource = 'POSTGRES_URL';
  }

  // Validate connection string exists
  if (!connectionString || typeof connectionString !== 'string') {
    return NextResponse.json({
      success: false,
      error: 'Connection string is invalid. Expected a string but got: ' + typeof connectionString,
      results
    }, { status: 500 });
  }

  // Ensure SSL is required for Neon (add if not present)
  let finalConnectionString = connectionString;
  try {
    const url = new URL(connectionString);
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
      finalConnectionString = url.toString();
      results.tests.push({
        name: 'SSL Mode Check',
        passed: true,
        details: {
          message: 'Added sslmode=require to connection string',
          original_has_ssl: false
        }
      });
    } else {
      results.tests.push({
        name: 'SSL Mode Check',
        passed: true,
        details: {
          message: 'Connection string already has sslmode',
          sslmode: url.searchParams.get('sslmode')
        }
      });
    }
  } catch (urlError) {
    results.tests.push({
      name: 'SSL Mode Check',
      passed: false,
      details: {
        error: 'Failed to parse connection string URL',
        errorMessage: urlError instanceof Error ? urlError.message : String(urlError)
      }
    });
  }

  results.tests.push({
    name: 'Connection String Source',
    passed: true,
    details: {
      using: connectionSource,
      connectionString_preview: finalConnectionString ? 
        `${finalConnectionString.substring(0, 20)}...` : 'NOT SET',
      connectionString_length: finalConnectionString?.length || 0
    }
  });

  // Test 3: Try to create pool
  let pool;
  try {
    // Validate connection string is not undefined before creating pool
    if (!finalConnectionString || typeof finalConnectionString !== 'string') {
      throw new Error('Connection string is invalid. Expected a string but got: ' + typeof finalConnectionString);
    }
    
    pool = createPool({
      connectionString: finalConnectionString,
    });
    results.tests.push({
      name: 'Create Connection Pool',
      passed: true,
      details: {
        message: 'Pool created successfully'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create connection pool',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      results
    }, { status: 500 });
  }

  // Test 4: Try to execute SELECT NOW()
  try {
    const sql = pool.sql;
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    results.tests.push({
      name: 'Execute SELECT NOW()',
      passed: true,
      details: {
        current_time: result.rows[0]?.current_time,
        pg_version: result.rows[0]?.pg_version?.substring(0, 50) + '...',
        rows_returned: result.rowCount
      }
    });

    // Test 5: Try to query a table (if leads table exists)
    try {
      const tableCheck = await sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = 'leads'
      `;
      
      const leadsTableExists = parseInt(tableCheck.rows[0]?.count || '0') > 0;
      
      results.tests.push({
        name: 'Check leads table exists',
        passed: leadsTableExists,
        details: {
          table_exists: leadsTableExists,
          message: leadsTableExists ? 'leads table found' : 'leads table not found'
        }
      });

      if (leadsTableExists) {
        const leadsCount = await sql`SELECT COUNT(*) as count FROM leads`;
        results.tests.push({
          name: 'Count leads in table',
          passed: true,
          details: {
            total_leads: parseInt(leadsCount.rows[0]?.count || '0')
          }
        });
      }
    } catch (tableError) {
      results.tests.push({
        name: 'Check leads table exists',
        passed: false,
        details: {
          error: tableError instanceof Error ? tableError.message : String(tableError)
        }
      });
    }

    // Summary
    const passedTests = results.tests.filter((t: any) => t.passed).length;
    const totalTests = results.tests.length;
    
    results.summary = {
      total_tests: totalTests,
      passed_tests: passedTests,
      failed_tests: totalTests - passedTests,
      all_passed: passedTests === totalTests,
      connection_status: 'Connected',
      database_url_source: connectionSource
    };

    return NextResponse.json({
      success: true,
      message: 'Connected',
      connection_status: 'Connected',
      results
    });

  } catch (error) {
    results.tests.push({
      name: 'Execute SELECT NOW()',
      passed: false,
      details: {
        error: error instanceof Error ? error.message : String(error),
        error_type: error instanceof Error ? error.constructor.name : typeof error,
        error_stack: error instanceof Error ? error.stack : undefined
      }
    });

    results.summary = {
      connection_status: 'Failed',
      error: error instanceof Error ? error.message : String(error),
      error_type: error instanceof Error ? error.constructor.name : typeof error
    };

    return NextResponse.json({
      success: false,
      message: 'Connection failed',
      error: error instanceof Error ? error.message : String(error),
      errorDetails: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      results
    }, { status: 500 });
  }
}

