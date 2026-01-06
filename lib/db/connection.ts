// lib/db/connection.ts
import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'

// Enable connection cache for better performance
neonConfig.fetchConnectionCache = true

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return url
}

export function getPool() {
  return new Pool({ connectionString: getDatabaseUrl() })
}

export function getDb() {
  return drizzle(getPool())
}

export function getSql() {
  return neon(getDatabaseUrl())
}
