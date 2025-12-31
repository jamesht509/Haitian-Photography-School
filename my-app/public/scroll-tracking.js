// Scroll Depth Tracking Script
// Lightweight script that tracks scroll milestones (25%, 50%, 75%, 100%)

(function() {
    'use strict';
    
    // Tracked milestones to prevent duplicate tracking
    const trackedMilestones = new Set();
    
    // Section detection based on scroll position
    function getCurrentSection(scrollPercentage, pageHeight) {
        // Define section thresholds based on typical landing page structure
        // Adjust these percentages based on your actual page layout
        if (scrollPercentage < 20) {
            return 'Intro';
        } else if (scrollPercentage < 40) {
            return '3D Book';
        } else if (scrollPercentage < 70) {
            return 'Price/Offer';
        } else if (scrollPercentage < 95) {
            return 'Content';
        } else {
            return 'Footer';
        }
    }
    
    // Calculate scroll percentage
    function getScrollPercentage() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = scrollableHeight > 0 
            ? Math.round((scrollTop / scrollableHeight) * 100)
            : 0;
        
        return {
            percentage: scrollPercentage,
            pageHeight: documentHeight,
            viewportHeight: windowHeight
        };
    }
    
    // Check if milestone should be tracked
    function shouldTrackMilestone(percentage) {
        const milestones = [25, 50, 75, 100];
        
        for (const milestone of milestones) {
            if (percentage >= milestone && !trackedMilestones.has(milestone)) {
                return milestone;
            }
        }
        
        return null;
    }
    
    // Track scroll milestone
    function trackScrollMilestone(milestone, scrollData) {
        // Mark as tracked to prevent duplicates
        trackedMilestones.add(milestone);
        
        // Get visit ID from session storage
        const visitId = sessionStorage.getItem('current_visit_id');
        
        // Get current section
        const sectionName = getCurrentSection(scrollData.percentage, scrollData.pageHeight);
        
        // Prepare tracking data
        const trackingData = {
            milestone: milestone,
            scroll_percentage: scrollData.percentage,
            section_name: sectionName,
            page_height: scrollData.pageHeight,
            viewport_height: scrollData.viewportHeight,
        };
        
        // Add visit_id if available
        if (visitId) {
            trackingData.visit_id = parseInt(visitId);
        }
        
        // Send tracking request (use sendBeacon for reliability)
        const blob = new Blob([JSON.stringify(trackingData)], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/track-scroll', blob);
        
        if (!sent) {
            // Fallback to fetch if sendBeacon fails
            fetch('/api/track-scroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trackingData),
                keepalive: true // Keep request alive even if page unloads
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`✅ Scroll milestone tracked: ${milestone}% (${sectionName})`);
                }
            })
            .catch(error => {
                console.error('Error tracking scroll:', error);
            });
        } else {
            console.log(`✅ Scroll milestone tracked: ${milestone}% (${sectionName})`);
        }
    }
    
    // Throttle function to limit scroll event frequency
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle scroll event
    const handleScroll = throttle(() => {
        const scrollData = getScrollPercentage();
        const milestone = shouldTrackMilestone(scrollData.percentage);
        
        if (milestone) {
            trackScrollMilestone(milestone, scrollData);
        }
    }, 100); // Check every 100ms
    
    // Initialize tracking when DOM is ready
    function initializeScrollTracking() {
        // Check initial scroll position (in case page loads scrolled)
        const scrollData = getScrollPercentage();
        const initialMilestone = shouldTrackMilestone(scrollData.percentage);
        if (initialMilestone) {
            trackScrollMilestone(initialMilestone, scrollData);
        }
        
        // Listen for scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Track 100% when page fully loads (if user scrolled fast)
        window.addEventListener('load', () => {
            setTimeout(() => {
                const finalScrollData = getScrollPercentage();
                if (finalScrollData.percentage >= 100 && !trackedMilestones.has(100)) {
                    trackScrollMilestone(100, finalScrollData);
                }
            }, 500);
        });
    }
    
    // Start tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScrollTracking);
    } else {
        initializeScrollTracking();
    }
    
})();

