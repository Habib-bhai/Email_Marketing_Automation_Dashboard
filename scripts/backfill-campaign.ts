// Script to backfill campaign from existing engagement data
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found')
  process.exit(1)
}

async function backfillCampaign() {
  const sql = neon(DATABASE_URL!)
  
  console.log('🔄 Backfilling campaign from existing engagements...\n')
  
  try {
    // Get unique campaign IDs from engagement_metrics
    const campaignIds = await sql`
      SELECT DISTINCT campaign_id 
      FROM engagement_metrics 
      WHERE campaign_id IS NOT NULL
    `
    
    console.log(`Found ${campaignIds.length} unique campaign(s) in engagement data\n`)
    
    for (const row of campaignIds) {
      const campaignId = row.campaign_id
      console.log(`Processing campaign: ${campaignId}`)
      
      // Check if campaign already exists
      const existing = await sql`
        SELECT id FROM campaigns WHERE id = ${campaignId}
      `
      
      if (existing.length > 0) {
        console.log(`  ✅ Campaign already exists, skipping...\n`)
        continue
      }
      
      // Count engagement events by type
      const stats = await sql`
        SELECT 
          event_type,
          COUNT(*) as count,
          MIN(occurred_at) as first_event,
          MAX(occurred_at) as last_event
        FROM engagement_metrics 
        WHERE campaign_id = ${campaignId}
        GROUP BY event_type
      `
      
      let emailsSent = 0
      let opensDetected = 0
      let repliesReceived = 0
      let startedAt = new Date()
      
      stats.forEach((stat: any) => {
        const count = parseInt(stat.count)
        if (stat.event_type === 'sent') emailsSent = count
        if (stat.event_type === 'opened') opensDetected = count
        if (stat.event_type === 'replied') repliesReceived = count
        if (stat.first_event < startedAt) startedAt = new Date(stat.first_event)
      })
      
      console.log(`  📊 Stats:`)
      console.log(`     - Emails Sent: ${emailsSent}`)
      console.log(`     - Opens: ${opensDetected}`)
      console.log(`     - Replies: ${repliesReceived}`)
      console.log(`     - Started: ${startedAt}`)
      
      // Create campaign
      await sql`
        INSERT INTO campaigns (
          id, 
          name, 
          emails_sent, 
          replies_received, 
          opens_detected, 
          started_at,
          status,
          created_at,
          updated_at
        ) VALUES (
          ${campaignId},
          ${campaignId},
          ${emailsSent},
          ${repliesReceived},
          ${opensDetected},
          ${startedAt},
          'Active',
          NOW(),
          NOW()
        )
      `
      
      console.log(`  ✅ Campaign created successfully!\n`)
    }
    
    console.log('✅ Backfill complete!')
    
    // Show final state
    const campaigns = await sql`
      SELECT id, name, emails_sent, opens_detected, replies_received 
      FROM campaigns
    `
    
    console.log('\n📊 Final campaign state:')
    campaigns.forEach((c: any) => {
      console.log(`  - ${c.name}: ${c.emails_sent} sent, ${c.opens_detected} opened, ${c.replies_received} replied`)
    })
    
  } catch (error) {
    console.error('❌ Error during backfill:', error)
    process.exit(1)
  }
}

backfillCampaign()
