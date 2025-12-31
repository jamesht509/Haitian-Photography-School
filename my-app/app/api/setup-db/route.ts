import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Get database connection string with validation and SSL enforcement
const getConnectionString = (): string => {
  // Check DATABASE_URL first (priority)
  let dbUrl = process.env.DATABASE_URL;
  
  // Fallback to POSTGRES_URL if DATABASE_URL is not set
  if (!dbUrl) {
    dbUrl = process.env.POSTGRES_URL;
  }
  
  // Throw clear error if neither is set
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined. Please set DATABASE_URL or POSTGRES_URL environment variable in Vercel.');
  }
  
  // Ensure SSL is required for Neon (add if not present)
  const url = new URL(dbUrl);
  if (!url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
    dbUrl = url.toString();
  }
  
  return dbUrl;
};

export async function GET() {
  try {
    const connectionString = getConnectionString();
    
    // Validate connection string is not undefined
    if (!connectionString || typeof connectionString !== 'string') {
      throw new Error('Connection string is invalid. Expected a string but got: ' + typeof connectionString);
    }
    
    const pool = createPool({
      connectionString: connectionString,
    });

    await pool.sql`
      CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          whatsapp VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL,
          city_from_form VARCHAR(255) NOT NULL,
          ip_address VARCHAR(45),
          device_type VARCHAR(20) CHECK (device_type IN ('mobile', 'desktop', 'tablet', 'unknown')),
          user_agent TEXT,
          referrer TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.sql`CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_leads_device_type ON leads(device_type);`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city_from_form);`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);`;

    return NextResponse.json({ success: true, message: "Tabelas criadas com sucesso!" });
  } catch (error) {
    console.error('Erro ao configurar banco:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}

