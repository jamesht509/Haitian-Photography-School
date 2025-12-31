import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

/**
 * Test endpoint to verify Supabase connection
 */
export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {}
  };

  // Test 1: Check if Supabase environment variables exist
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  results.tests.push({
    name: 'Environment Variables Check',
    passed: hasSupabaseUrl && hasServiceRoleKey,
    details: {
      NEXT_PUBLIC_SUPABASE_URL: hasSupabaseUrl ? 'SET' : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: hasServiceRoleKey ? 'SET' : 'NOT SET',
      SUPABASE_URL_length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      SERVICE_ROLE_KEY_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    }
  });

  if (!hasSupabaseUrl || !hasServiceRoleKey) {
    return NextResponse.json({
      success: false,
      error: 'Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.',
      results
    }, { status: 500 });
  }

  // Test 2: Try to create Supabase client
  let supabase;
  try {
    supabase = getSupabaseClient();
    results.tests.push({
      name: 'Create Supabase Client',
      passed: true,
      details: {
        message: 'Supabase client created successfully'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create Supabase client',
      errorMessage: error instanceof Error ? error.message : String(error),
      results
    }, { status: 500 });
  }

  // Test 3: Try to query the leads table
  try {
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      results.tests.push({
        name: 'Query leads table',
        passed: false,
        details: {
          error: error.message,
          code: error.code,
          hint: error.message.includes('does not exist') 
            ? 'Create the "leads" table in Supabase with columns: name, whatsapp, email, city, device, ip, created_at'
            : 'Check your Supabase configuration'
        }
      });
    } else {
      results.tests.push({
        name: 'Query leads table',
        passed: true,
        details: {
          message: 'Successfully queried leads table',
          total_leads: count || 0,
          table_exists: true
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
      connection_status: passedTests === totalTests ? 'Connected' : 'Partial',
      database_type: 'Supabase'
    };

    return NextResponse.json({
      success: passedTests === totalTests,
      message: passedTests === totalTests ? 'Supabase connection successful' : 'Some tests failed',
      connection_status: passedTests === totalTests ? 'Connected' : 'Failed',
      results
    });

  } catch (error) {
    results.tests.push({
      name: 'Query leads table',
      passed: false,
      details: {
        error: error instanceof Error ? error.message : String(error),
        error_type: error instanceof Error ? error.constructor.name : typeof error
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
      results
    }, { status: 500 });
  }
}
