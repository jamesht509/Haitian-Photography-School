import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check admin password
    const authHeader = request.headers.get('authorization');
    
    const rawPassword = process.env.ADMIN_PASSWORD || '';
    const adminPassword = rawPassword.trim();
    
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
    
    // Get total unique visits that have scroll tracking
    const { count: totalVisitsWithScroll, error: visitsError } = await supabase
      .from('scroll_tracking')
      .select('visit_id', { count: 'exact', head: true });
    
    if (visitsError) {
      throw visitsError;
    }
    
    // Get total unique visits (for percentage calculation)
    const { count: totalVisits, error: totalVisitsError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });
    
    if (totalVisitsError) {
      throw totalVisitsError;
    }
    
    // Get milestone counts
    const milestones = [25, 50, 75, 100];
    const milestoneStats: Record<number, number> = {};
    
    for (const milestone of milestones) {
      const { count, error: milestoneError } = await supabase
        .from('scroll_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('milestone', milestone);
      
      if (!milestoneError) {
        milestoneStats[milestone] = count || 0;
      }
    }
    
    // Get section-based stats
    const sections = ['Intro', '3D Book', 'Price/Offer', 'Content', 'Footer'];
    const sectionStats: Record<string, number> = {};
    
    for (const section of sections) {
      const { count, error: sectionError } = await supabase
        .from('scroll_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('section_name', section);
      
      if (!sectionError) {
        sectionStats[section] = count || 0;
      }
    }
    
    // Calculate percentages
    const totalForPercentage = totalVisits || 1; // Avoid division by zero
    
    const milestonePercentages = {
      25: Math.round((milestoneStats[25] || 0) / totalForPercentage * 10000) / 100,
      50: Math.round((milestoneStats[50] || 0) / totalForPercentage * 10000) / 100,
      75: Math.round((milestoneStats[75] || 0) / totalForPercentage * 10000) / 100,
      100: Math.round((milestoneStats[100] || 0) / totalForPercentage * 10000) / 100,
    };
    
    const sectionPercentages: Record<string, number> = {};
    sections.forEach(section => {
      sectionPercentages[section] = Math.round((sectionStats[section] || 0) / totalForPercentage * 10000) / 100;
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        total_visits: totalVisits || 0,
        total_visits_with_scroll: totalVisitsWithScroll || 0,
        milestone_counts: milestoneStats,
        milestone_percentages: milestonePercentages,
        section_counts: sectionStats,
        section_percentages: sectionPercentages,
      }
    });
    
  } catch (error) {
    console.error('Error fetching scroll stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch scroll stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

