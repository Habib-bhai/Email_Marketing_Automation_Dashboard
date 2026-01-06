// Script to check database state - campaigns and engagements
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found')
  process.exit(1)
}

async function checkDatabase() {
  const sql = neon(DATABASE_URL!)
  
  console.log('📊 Checking database state...\n')
  
  try {
    // Check campaigns
    console.log('1️⃣ Campaigns:')
    const campaigns = await sql`SELECT id, name, emails_sent, replies_received, opens_detected, status, created_at FROM campaigns ORDER BY created_at DESC LIMIT 10`
    
    if (campaigns.length === 0) {
      console.log('   ⚠️  No campaigns found in database')
    } else {
      console.log(`   ✅ Found ${campaigns.length} campaign(s):\n`)
      campaigns.forEach((c: any) => {
        console.log(`   - ID: ${c.id}`)
        console.log(`     Name: ${c.name}`)
        console.log(`     Emails Sent: ${c.emails_sent}`)
        console.log(`     Opens: ${c.opens_detected}`)
        console.log(`     Replies: ${c.replies_received}`)
        console.log(`     Status: ${c.status}`)
        console.log(`     Created: ${c.created_at}`)
        console.log('')
      })
    }
    
    // Check engagement metrics
    console.log('\n2️⃣ Engagement Metrics:')
    const engagements = await sql`SELECT id, campaign_id, lead_id, event_type, occurred_at FROM engagement_metrics ORDER BY occurred_at DESC LIMIT 10`
    
    if (engagements.length === 0) {
      console.log('   ⚠️  No engagement events found')
    } else {
      console.log(`   ✅ Found ${engagements.length} engagement event(s):\n`)
      engagements.forEach((e: any) => {
        console.log(`   - Campaign ID: ${e.campaign_id}`)
        console.log(`     Event Type: ${e.event_type}`)
        console.log(`     Lead ID: ${e.lead_id || 'N/A'}`)
        console.log(`     Occurred At: ${e.occurred_at}`)
        console.log('')
      })
    }
    
    // Check engagement count by campaign
    console.log('\n3️⃣ Engagement Summary by Campaign:')
    const summary = await sql`
      SELECT 
        campaign_id, 
        event_type,
        COUNT(*) as event_count
      FROM engagement_metrics 
      GROUP BY campaign_id, event_type
      ORDER BY campaign_id, event_type
    `
    
    if (summary.length === 0) {
      console.log('   ⚠️  No engagement summary available')
    } else {
      console.log(`   ✅ Event summary:\n`)
      summary.forEach((s: any) => {
        console.log(`   - Campaign: ${s.campaign_id}`)
        console.log(`     Event: ${s.event_type}`)
        console.log(`     Count: ${s.event_count}`)
        console.log('')
      })
    }
    
    console.log('\n✅ Database check complete!')
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
    process.exit(1)
  }
}

checkDatabase()
