import { Pool } from 'pg'
import * as dotenv from 'dotenv'

// 1. Force load environment variables (Fixes 'pool is null' in scripts)
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' })
  dotenv.config({ path: '.env' })
}

let pool: Pool | null = null

if (process.env.DATABASE_URL) {
  // 2. Smart SSL: False for Localhost, True for Cloud (Neon/Supabase)
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // 👇 FIX: Only use SSL for remote connections (Cloud DBs like Neon/Supabase)
    ssl: isLocal ? false : { rejectUnauthorized: false }, 
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

  // Handle connection errors gracefully
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
  })
} else {
  console.warn('DATABASE_URL is not set. Database features will not work.')
}

export default pool

// Helper to safely check connection
export function isDatabaseAvailable(): boolean {
  return pool !== null && !!process.env.DATABASE_URL
}