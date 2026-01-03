import pool from './db'
import * as dotenv from 'dotenv'

// Load env vars so the script can find DATABASE_URL
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

export async function initDatabase() {
  try {
    // 👇 FIX: Check if pool exists first
    if (!pool) {
      throw new Error('Database connection failed. Check your .env file.')
    }

    const fs = await import('fs/promises')
    const path = await import('path')
    const schemaPath = path.join(process.cwd(), 'lib', 'db-schema.sql')
    const schema = await fs.readFile(schemaPath, 'utf-8')
    
    // Now TypeScript knows pool is not null
    await pool.query(schema)
    console.log('✅ Database schema initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1) // Exit with error code
  } finally {
    // Close the connection so the script doesn't hang
    await pool?.end()
  }
}

// Execute the function
initDatabase()