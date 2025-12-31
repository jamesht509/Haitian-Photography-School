import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to check if ADMIN_PASSWORD is configured correctly
 * This helps diagnose authentication issues
 * 
 * Usage: GET /api/debug-auth
 */
export async function GET(request: NextRequest) {
  // Only allow in development or with a secret key
  const debugKey = request.nextUrl.searchParams.get('key');
  const allowedKey = process.env.DEBUG_SECRET_KEY || 'debug123';
  
  if (process.env.NODE_ENV === 'production' && debugKey !== allowedKey) {
    return NextResponse.json(
      { error: 'Unauthorized - Debug endpoint disabled in production' },
      { status: 401 }
    );
  }
  
  const adminPassword = process.env.ADMIN_PASSWORD;
  const hasPassword = !!adminPassword;
  const passwordLength = adminPassword?.length || 0;
  const passwordValue = adminPassword || 'NOT SET (using default: admin123)';
  
  // Check for common issues
  const issues: string[] = [];
  
  if (!hasPassword) {
    issues.push('ADMIN_PASSWORD environment variable is not set');
  }
  
  if (adminPassword && adminPassword.trim() !== adminPassword) {
    issues.push('ADMIN_PASSWORD has leading/trailing whitespace');
  }
  
  if (adminPassword && passwordLength === 0) {
    issues.push('ADMIN_PASSWORD is set but empty');
  }
  
  return NextResponse.json({
    debug: {
      adminPasswordConfigured: hasPassword,
      passwordLength: passwordLength,
      passwordValue: hasPassword ? '***HIDDEN***' : passwordValue,
      passwordFirstChar: hasPassword ? adminPassword[0] : null,
      passwordLastChar: hasPassword ? adminPassword[passwordLength - 1] : null,
      issues: issues,
      nodeEnv: process.env.NODE_ENV,
      expectedHeader: `Bearer ${adminPassword?.trim() || 'admin123'}`,
      recommendation: issues.length > 0 
        ? 'Fix the issues above and redeploy'
        : 'Password is configured correctly. If login still fails, ensure you redeployed after setting the variable.'
    }
  });
}

