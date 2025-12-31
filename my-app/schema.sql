-- Lead Capture System Schema for Neon PostgreSQL

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    
    -- User Information (from form)
    name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city_from_form VARCHAR(255) NOT NULL,
    
    -- Metadata (automatically captured)
    ip_address VARCHAR(45),
    device_type VARCHAR(20) CHECK (device_type IN ('mobile', 'desktop', 'tablet', 'unknown')),
    user_agent TEXT,
    referrer TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_device_type ON leads(device_type);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city_from_form);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample query to view summary stats (for admin dashboard)
-- SELECT 
--     COUNT(*) as total_leads,
--     COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) * 100.0 / COUNT(*) as mobile_percentage,
--     COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) * 100.0 / COUNT(*) as desktop_percentage,
--     city_from_form,
--     COUNT(*) as city_count
-- FROM leads
-- GROUP BY city_from_form
-- ORDER BY city_count DESC;

