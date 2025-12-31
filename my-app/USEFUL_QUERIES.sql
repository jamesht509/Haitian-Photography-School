-- ============================================
-- USEFUL SQL QUERIES FOR ADMIN
-- ============================================
-- Run these queries in the Neon SQL Editor or your PostgreSQL client

-- ============================================
-- BASIC QUERIES
-- ============================================

-- Get all leads (most recent first)
SELECT * FROM leads ORDER BY created_at DESC;

-- Count total leads
SELECT COUNT(*) as total_leads FROM leads;

-- Get leads from today
SELECT * FROM leads 
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Get leads from last 7 days
SELECT * FROM leads 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC;

-- ============================================
-- DEVICE ANALYTICS
-- ============================================

-- Device type breakdown
SELECT 
    device_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentage
FROM leads
GROUP BY device_type
ORDER BY count DESC;

-- Mobile vs Desktop comparison
SELECT 
    CASE 
        WHEN device_type = 'mobile' THEN 'Mobile'
        WHEN device_type = 'desktop' THEN 'Desktop'
        ELSE 'Other'
    END as device_category,
    COUNT(*) as count
FROM leads
GROUP BY device_category
ORDER BY count DESC;

-- ============================================
-- LOCATION ANALYTICS
-- ============================================

-- Top cities
SELECT 
    city_from_form,
    COUNT(*) as lead_count
FROM leads
GROUP BY city_from_form
ORDER BY lead_count DESC
LIMIT 10;

-- Cities with at least 3 leads
SELECT 
    city_from_form,
    COUNT(*) as lead_count
FROM leads
GROUP BY city_from_form
HAVING COUNT(*) >= 3
ORDER BY lead_count DESC;

-- ============================================
-- TRAFFIC SOURCE ANALYTICS
-- ============================================

-- Referrer breakdown
SELECT 
    referrer,
    COUNT(*) as count
FROM leads
GROUP BY referrer
ORDER BY count DESC
LIMIT 10;

-- Direct traffic vs referral traffic
SELECT 
    CASE 
        WHEN referrer = 'direct' THEN 'Direct'
        ELSE 'Referral'
    END as traffic_type,
    COUNT(*) as count
FROM leads
GROUP BY traffic_type;

-- ============================================
-- TIME-BASED ANALYTICS
-- ============================================

-- Leads per day (last 30 days)
SELECT 
    DATE(created_at) as date,
    COUNT(*) as leads
FROM leads
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Leads per hour (today)
SELECT 
    EXTRACT(HOUR FROM created_at) as hour,
    COUNT(*) as leads
FROM leads
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour;

-- Leads per day of week
SELECT 
    TO_CHAR(created_at, 'Day') as day_of_week,
    COUNT(*) as leads
FROM leads
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY EXTRACT(DOW FROM created_at);

-- ============================================
-- EXPORT QUERIES
-- ============================================

-- Export all leads with contact info (CSV format)
SELECT 
    name,
    whatsapp,
    email,
    city_from_form,
    device_type,
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as registration_date
FROM leads
ORDER BY created_at DESC;

-- Export leads for WhatsApp broadcast
SELECT 
    name,
    whatsapp,
    city_from_form
FROM leads
WHERE whatsapp IS NOT NULL AND whatsapp != ''
ORDER BY created_at DESC;

-- ============================================
-- DUPLICATE DETECTION
-- ============================================

-- Find duplicate emails
SELECT 
    email,
    COUNT(*) as count
FROM leads
GROUP BY email
HAVING COUNT(*) > 1;

-- Find duplicate WhatsApp numbers
SELECT 
    whatsapp,
    COUNT(*) as count
FROM leads
GROUP BY whatsapp
HAVING COUNT(*) > 1;

-- ============================================
-- CONVERSION ANALYTICS
-- ============================================

-- Average leads per day
SELECT 
    ROUND(COUNT(*)::numeric / 
        NULLIF(DATE_PART('day', MAX(created_at) - MIN(created_at)) + 1, 0), 2) as avg_leads_per_day
FROM leads;

-- Busiest day
SELECT 
    DATE(created_at) as date,
    COUNT(*) as leads
FROM leads
GROUP BY DATE(created_at)
ORDER BY leads DESC
LIMIT 1;

-- ============================================
-- DATA QUALITY CHECKS
-- ============================================

-- Leads with missing data
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_name,
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as missing_email,
    COUNT(CASE WHEN whatsapp IS NULL OR whatsapp = '' THEN 1 END) as missing_whatsapp,
    COUNT(CASE WHEN city_from_form IS NULL OR city_from_form = '' THEN 1 END) as missing_city
FROM leads;

-- Leads with suspicious data
SELECT * FROM leads
WHERE 
    email NOT LIKE '%@%'
    OR length(name) < 3
    OR length(whatsapp) < 10;

-- ============================================
-- IP ANALYTICS (Privacy: Use with caution)
-- ============================================

-- Unique IPs
SELECT COUNT(DISTINCT ip_address) as unique_ips FROM leads;

-- Multiple leads from same IP (potential duplicates)
SELECT 
    ip_address,
    COUNT(*) as lead_count,
    STRING_AGG(name, ', ') as names
FROM leads
WHERE ip_address != 'unknown'
GROUP BY ip_address
HAVING COUNT(*) > 1
ORDER BY lead_count DESC;

-- ============================================
-- CLEANUP QUERIES
-- ============================================

-- Delete test leads (CAUTION!)
-- DELETE FROM leads WHERE email LIKE '%test%' OR name LIKE '%test%';

-- Delete leads older than 1 year (CAUTION!)
-- DELETE FROM leads WHERE created_at < CURRENT_DATE - INTERVAL '1 year';

-- ============================================
-- MAINTENANCE
-- ============================================

-- Check table size
SELECT 
    pg_size_pretty(pg_total_relation_size('leads')) as table_size;

-- Vacuum and analyze (optimize performance)
-- VACUUM ANALYZE leads;

-- ============================================
-- ADVANCED ANALYTICS
-- ============================================

-- Cohort analysis by day
SELECT 
    DATE(created_at) as cohort_date,
    COUNT(*) as leads,
    COUNT(*) FILTER (WHERE device_type = 'mobile') as mobile_leads,
    COUNT(*) FILTER (WHERE device_type = 'desktop') as desktop_leads
FROM leads
GROUP BY DATE(created_at)
ORDER BY cohort_date DESC;

-- Growth rate (week over week)
WITH weekly_leads AS (
    SELECT 
        DATE_TRUNC('week', created_at) as week,
        COUNT(*) as leads
    FROM leads
    GROUP BY DATE_TRUNC('week', created_at)
)
SELECT 
    week,
    leads,
    LAG(leads) OVER (ORDER BY week) as previous_week,
    ROUND(
        (leads - LAG(leads) OVER (ORDER BY week))::numeric / 
        NULLIF(LAG(leads) OVER (ORDER BY week), 0) * 100, 2
    ) as growth_percentage
FROM weekly_leads
ORDER BY week DESC;

-- ============================================
-- NOTES
-- ============================================

-- Remember to:
-- 1. Always backup before running DELETE queries
-- 2. Test queries on a small dataset first
-- 3. Use LIMIT when testing SELECT queries
-- 4. Consider privacy when analyzing IP data
-- 5. Export data regularly for backup

-- For Neon-specific features:
-- - Use the Neon console for easier query execution
-- - Set up read-only credentials for analytics queries
-- - Enable query caching for frequently used reports

