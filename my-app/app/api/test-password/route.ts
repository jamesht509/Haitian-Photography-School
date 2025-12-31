import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to verify ADMIN_PASSWORD is being read correctly
 * This will show the actual value (for debugging only)
 */
export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const fallbackPassword = 'admin123';
  const actualPassword = adminPassword || fallbackPassword;
  
  // Get what was sent in the request
  const authHeader = request.headers.get('authorization');
  const testPassword = request.nextUrl.searchParams.get('password') || '';
  
  // Detailed analysis
  const analysis = {
    envVarExists: !!process.env.ADMIN_PASSWORD,
    envVarValue: process.env.ADMIN_PASSWORD || 'NOT SET',
    envVarLength: process.env.ADMIN_PASSWORD?.length || 0,
    envVarFirstChar: process.env.ADMIN_PASSWORD?.[0] || null,
    envVarLastChar: process.env.ADMIN_PASSWORD?.[process.env.ADMIN_PASSWORD?.length - 1] || null,
    envVarTrimmed: process.env.ADMIN_PASSWORD?.trim() || null,
    envVarTrimmedLength: process.env.ADMIN_PASSWORD?.trim().length || 0,
    
    actualPasswordUsed: actualPassword,
    actualPasswordLength: actualPassword.length,
    fallbackUsed: !adminPassword,
    
    authHeaderReceived: authHeader || 'NOT PROVIDED',
    authHeaderLength: authHeader?.length || 0,
    
    expectedHeader: `Bearer ${actualPassword}`,
    expectedHeaderLength: `Bearer ${actualPassword}`.length,
    
    testPasswordProvided: testPassword || 'NOT PROVIDED',
    testPasswordMatches: testPassword === actualPassword,
    
    comparison: {
      exactMatch: authHeader === `Bearer ${actualPassword}`,
      trimmedMatch: authHeader?.trim() === `Bearer ${actualPassword.trim()}`,
      passwordOnlyMatch: authHeader?.replace('Bearer ', '').trim() === actualPassword.trim(),
    },
    
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('ADMIN') || key.includes('PASSWORD')),
  };
  
  // Check for common issues
  const issues: string[] = [];
  
  if (!process.env.ADMIN_PASSWORD) {
    issues.push('❌ ADMIN_PASSWORD environment variable is NOT SET - using fallback "admin123"');
  }
  
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim() !== process.env.ADMIN_PASSWORD) {
    issues.push('⚠️ ADMIN_PASSWORD has leading/trailing whitespace');
  }
  
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length === 0) {
    issues.push('❌ ADMIN_PASSWORD is set but empty');
  }
  
  if (authHeader && !analysis.comparison.exactMatch && !analysis.comparison.trimmedMatch) {
    issues.push('⚠️ Authorization header does not match expected format');
  }
  
  return NextResponse.json({
    success: true,
    message: 'Password test endpoint - use this to debug authentication',
    analysis,
    issues: issues.length > 0 ? issues : ['✅ No obvious issues detected'],
    recommendations: [
      issues.length === 0 
        ? '✅ Configuration looks correct. If login still fails, check browser cache and try incognito mode.'
        : '⚠️ Fix the issues above and redeploy',
      'Expected password format: "Bearer {password}"',
      `Current expected: "Bearer ${actualPassword}"`,
      authHeader ? `Received: "${authHeader}"` : 'No Authorization header received',
    ],
  }, {
    headers: {
      'Cache-Control': 'no-store',
    }
  });
}

