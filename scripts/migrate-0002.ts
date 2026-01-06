// Script to run migration 0002 - Convert campaign IDs to varchar
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  process.exit(1)
}

async function runMigration() {
  console.log('🚀 Running migration 0002: Convert campaign IDs to varchar...')
  
  const sql = neon(DATABASE_URL!)
  
  try {
    console.log('📝 Executing migration statements...\n')
    
    // Step 1: Drop foreign key constraint
    console.log('Step 1: Dropping foreign key constraint...')
    await sql`ALTER TABLE "campaign_lead_associations" DROP CONSTRAINT IF EXISTS "campaign_lead_associations_campaign_id_campaigns_id_fk"`
    console.log('✅ Done\n')
    
    // Step 2: Convert campaigns.id to varchar
    console.log('Step 2: Converting campaigns.id to varchar(255)...')
    await sql`ALTER TABLE "campaigns" ALTER COLUMN "id" SET DATA TYPE varchar(255)`
    console.log('✅ Done\n')
    
    console.log('Step 3: Dropping default from campaigns.id...')
    await sql`ALTER TABLE "campaigns" ALTER COLUMN "id" DROP DEFAULT`
    console.log('✅ Done\n')
    
    // Step 3: Convert campaign_lead_associations.campaign_id to varchar
    console.log('Step 4: Converting campaign_lead_associations.campaign_id to varchar(255)...')
    await sql`ALTER TABLE "campaign_lead_associations" ALTER COLUMN "campaign_id" SET DATA TYPE varchar(255)`
    console.log('✅ Done\n')
    
    // Step 4: Re-add foreign key constraint
    console.log('Step 5: Re-adding foreign key constraint...')
    await sql`
      ALTER TABLE "campaign_lead_associations" 
      ADD CONSTRAINT "campaign_lead_associations_campaign_id_campaigns_id_fk" 
      FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE
    `
    console.log('✅ Done\n')
    
    console.log('✅ Migration 0002 completed successfully!')
    console.log('📊 Changes made:')
    console.log('  - campaigns.id: uuid → varchar(255)')
    console.log('  - campaign_lead_associations.campaign_id: uuid → varchar(255)')
    console.log('  - Foreign key constraint recreated with varchar type')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
