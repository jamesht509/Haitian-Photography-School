import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      visit_id,
      milestone,
      scroll_percentage,
      section_name,
      page_height,
      viewport_height
    } = body;
    
    // Validate required fields
    if (milestone === undefined || scroll_percentage === undefined) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: milestone and scroll_percentage are required'
        },
        { status: 400 }
      );
    }
    
    // Validate milestone value
    if (![25, 50, 75, 100].includes(milestone)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid milestone. Must be 25, 50, 75, or 100'
        },
        { status: 400 }
      );
    }
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Check if this milestone was already tracked for this visit (prevent duplicates)
    if (visit_id) {
      const { data: existing } = await supabase
        .from('scroll_tracking')
        .select('id')
        .eq('visit_id', visit_id)
        .eq('milestone', milestone)
        .limit(1)
        .single();
      
      if (existing) {
        // Already tracked, return success without inserting
        return NextResponse.json({
          success: true,
          message: 'Milestone already tracked for this visit',
          duplicate: true
        });
      }
    }
    
    // Insert scroll tracking record
    const { data, error } = await supabase
      .from('scroll_tracking')
      .insert({
        visit_id: visit_id || null,
        milestone,
        scroll_percentage,
        section_name: section_name || null,
        page_height: page_height || null,
        viewport_height: viewport_height || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving scroll tracking to Supabase:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to save scroll tracking',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      scroll_tracking_id: data.id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error tracking scroll:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to track scroll',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Scroll tracking endpoint - use POST to track scroll milestones',
    method: 'POST',
    required_fields: ['milestone', 'scroll_percentage'],
    optional_fields: ['visit_id', 'section_name', 'page_height', 'viewport_height'],
    milestones: [25, 50, 75, 100]
  });
}

