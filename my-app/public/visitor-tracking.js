// Visitor Tracking Script
// Tracks all page visitors, even those who don't sign up

(function() {
    'use strict';
    
    // Get or create session ID
    function getSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }
    
    // Get UTM parameters from URL
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || null,
            utm_medium: params.get('utm_medium') || null,
            utm_campaign: params.get('utm_campaign') || null,
            utm_term: params.get('utm_term') || null,
            utm_content: params.get('utm_content') || null,
        };
    }
    
    // Track page view
    function trackPageView() {
        const sessionId = getSessionId();
        const utmParams = getUTMParams();
        const pageUrl = window.location.href;
        const referrer = document.referrer || 'direct';
        
        // Track visit start time
        const visitStartTime = Date.now();
        window.visitStartTime = visitStartTime;
        
        // Send tracking request
        fetch('/api/track-visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page_url: pageUrl,
                referrer: referrer,
                ...utmParams,
                session_id: sessionId,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store visit ID for later conversion linking
                if (data.visit_id) {
                    sessionStorage.setItem('current_visit_id', data.visit_id);
                }
                console.log('✅ Visit tracked:', data.visit_id);
            }
        })
        .catch(error => {
            console.error('Error tracking visit:', error);
        });
        
        // Track visit duration when user leaves
        window.addEventListener('beforeunload', function() {
            const visitDuration = Math.floor((Date.now() - visitStartTime) / 1000);
            
            // Send duration update (use sendBeacon for reliability)
            const visitId = sessionStorage.getItem('current_visit_id');
            if (visitId) {
                const blob = new Blob([JSON.stringify({
                    visit_id: parseInt(visitId),
                    visit_duration: visitDuration,
                })], { type: 'application/json' });
                navigator.sendBeacon('/api/track-visit', blob);
            }
        });
    }
    
    // Track conversion (when form is submitted successfully)
    function trackConversion(leadId) {
        const visitId = sessionStorage.getItem('current_visit_id');
        if (!visitId) {
            console.warn('No visit ID found for conversion tracking');
            return;
        }
        
        fetch('/api/track-visit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visit_id: parseInt(visitId),
                converted: true,
                lead_id: leadId,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('✅ Conversion tracked:', visitId);
            }
        })
        .catch(error => {
            console.error('Error tracking conversion:', error);
        });
    }
    
    // Initialize tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
    } else {
        trackPageView();
    }
    
    // Expose trackConversion function globally for form submission
    window.trackConversion = trackConversion;
    
})();

