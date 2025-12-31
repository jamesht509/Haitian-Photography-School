import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check admin password
    const authHeader = request.headers.get('authorization');
    
    // Get password from env and trim it
    const rawPassword = process.env.ADMIN_PASSWORD || '';
    const adminPassword = rawPassword.trim();
    
    // Normalize comparison - trim both sides (input and env var)
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
    
    // Get total leads count
    const { count: totalLeads, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // Get device type breakdown
    const { data: deviceData, error: deviceError } = await supabase
      .from('leads')
      .select('device');
    
    if (deviceError) {
      throw deviceError;
    }
    
    // Calculate device breakdown
    const deviceCounts: Record<string, number> = {};
    deviceData?.forEach((lead: { device?: string }) => {
      const deviceType = lead.device || 'unknown';
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });
    
    const deviceBreakdown = Object.entries(deviceCounts).map(([device_type, count]) => ({
      device_type,
      count,
      percentage: totalLeads ? Math.round((count / totalLeads) * 1000) / 10 : 0
    })).sort((a, b) => b.count - a.count);
    
    // Get top cities
    const { data: cityData, error: cityError } = await supabase
      .from('leads')
      .select('city');
    
    if (cityError) {
      throw cityError;
    }
    
    // Calculate city breakdown
    const cityCounts: Record<string, number> = {};
    cityData?.forEach((lead: { city?: string }) => {
      const cityName = lead.city || 'unknown';
      cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
    });
    
    const topCities = Object.entries(cityCounts)
      .map(([city_from_form, count]) => ({ city_from_form, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Get leads over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: timelineData, error: timelineError } = await supabase
      .from('leads')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (timelineError) {
      throw timelineError;
    }
    
    // Group by date
    const timelineCounts: Record<string, number> = {};
    timelineData?.forEach((lead: { created_at: string }) => {
      const date = new Date(lead.created_at).toISOString().split('T')[0];
      timelineCounts[date] = (timelineCounts[date] || 0) + 1;
    });
    
    const timeline = Object.entries(timelineCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date));
    
    return NextResponse.json({
      success: true,
      stats: {
        total_leads: totalLeads || 0,
        device_breakdown: deviceBreakdown,
        top_cities: topCities,
        timeline: timeline,
        referrers: [], // Not tracking referrers in new schema
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
