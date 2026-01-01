import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check admin password
    const authHeader = request.headers.get('authorization');
    
    // Get password from env and trim it
    const rawPassword = process.env.ADMIN_PASSWORD || '';
    const adminPassword = rawPassword.trim();
    
    // Normalize comparison
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
    
    // Get total visits count
    const { count: totalVisits, error: visitsCountError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });
    
    if (visitsCountError) {
      console.error('Visits count error:', visitsCountError);
      throw visitsCountError;
    }
    
    // Get total leads count directly from leads table for accuracy
    const { count: totalLeads, error: leadsCountError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    if (leadsCountError) {
      console.error('Leads count error:', leadsCountError);
      throw leadsCountError;
    }
    
    // Get converted visits count (people who actually reached the thank you state)
    const { count: convertedVisits, error: convertedError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('converted', true);
    
    // Use the higher of the two for conversion count to be safe
    // Sometimes lead is captured but visit not updated, or vice-versa
    const effectiveConvertedCount = Math.max(totalLeads || 0, convertedVisits || 0);
    
    // Calculate metrics
    const conversionRate = totalVisits && totalVisits > 0 
      ? Math.round((effectiveConvertedCount) / totalVisits * 10000) / 100 
      : 0;
    
    const bounceRate = totalVisits && totalVisits > 0
      ? Math.round((bouncedVisits || 0) / totalVisits * 10000) / 100
      : 0;
    
    // Get device breakdown
    const { data: deviceData, error: deviceError } = await supabase
      .from('visits')
      .select('device');
    
    const deviceCounts: Record<string, number> = {};
    deviceData?.forEach((visit: { device?: string }) => {
      const deviceType = visit.device || 'unknown';
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });
    
    const deviceBreakdown = Object.entries(deviceCounts).map(([device_type, count]) => ({
      device_type,
      count,
      percentage: totalVisits ? Math.round((count / totalVisits) * 1000) / 10 : 0
    })).sort((a, b) => b.count - a.count);
    
    // Get top referrers
    const { data: referrerData, error: referrerError } = await supabase
      .from('visits')
      .select('referrer');
    
    const referrerCounts: Record<string, number> = {};
    referrerData?.forEach((visit: { referrer?: string }) => {
      const ref = visit.referrer || 'direct';
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });
    
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Get UTM campaign breakdown
    const { data: utmData, error: utmError } = await supabase
      .from('visits')
      .select('utm_campaign, utm_source, utm_medium')
      .not('utm_campaign', 'is', null);
    
    const utmCampaigns: Record<string, number> = {};
    utmData?.forEach((visit: { utm_campaign?: string }) => {
      const campaign = visit.utm_campaign || 'unknown';
      utmCampaigns[campaign] = (utmCampaigns[campaign] || 0) + 1;
    });
    
    const topCampaigns = Object.entries(utmCampaigns)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return NextResponse.json({
      success: true,
      stats: {
        total_visits: totalVisits || 0,
        total_leads: totalLeads || 0,
        converted_visits: convertedVisits || 0,
        bounced_visits: bouncedVisits || 0,
        conversion_rate: conversionRate,
        bounce_rate: bounceRate,
        device_breakdown: deviceBreakdown,
        top_referrers: topReferrers,
        top_campaigns: topCampaigns,
      }
    });
    
  } catch (error) {
    console.error('Error fetching visit stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch visit stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

