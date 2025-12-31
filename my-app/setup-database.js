const { sql } = require('@vercel/postgres');
const fs = require('fs');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');
    
    // Read the schema file
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    
    // Split into individual statements (separated by semicolons)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments
      if (statement.startsWith('--')) continue;
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        await sql.query(statement + ';');
        console.log(`✅ Success!\n`);
      } catch (error) {
        // Some errors are expected (like "already exists")
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Already exists, skipping...\n`);
        } else {
          console.error(`❌ Error:`, error.message, '\n');
        }
      }
    }
    
    // Verify the table was created
    console.log('🔍 Verifying table creation...');
    const result = await sql`SELECT COUNT(*) FROM leads`;
    console.log(`✅ Table 'leads' is ready! Current count: ${result.rows[0].count} leads\n`);
    
    console.log('🎉 Database setup complete!');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Set the database URL from command line or environment
process.env.POSTGRES_URL = process.env.POSTGRES_URL || 
  'postgresql://neondb_owner:npg_jrsJu2S1aDmg@ep-proud-night-ad2ucb2w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

setupDatabase();

