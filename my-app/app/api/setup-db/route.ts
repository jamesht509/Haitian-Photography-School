import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = createPool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
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

