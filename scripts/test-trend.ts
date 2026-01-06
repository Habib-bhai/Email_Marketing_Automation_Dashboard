// Test trend repository function
import { getEmailEngagementTrend } from '../lib/repositories/analytics'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testTrend() {
  console.log('🧪 Testing getEmailEngagementTrend repository function...\n')
  
  try {
    const trendData = await getEmailEngagementTrend(7)
    
    console.log('✅ Repository Response:')
    console.log(JSON.stringify(trendData, null, 2))
    
    console.log(`\n📊 Found ${trendData.length} days of data`)
    
    trendData.forEach(day => {
      console.log(`  ${day.date}: ${day.sent} sent, ${day.opened} opened, ${day.replied} replied`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testTrend()
