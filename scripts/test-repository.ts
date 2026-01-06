// Test repository function directly
import { getEmailEngagementMetrics } from '../lib/repositories/analytics'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testRepository() {
  console.log('🧪 Testing getEmailEngagementMetrics repository function...\n')
  
  try {
    const metrics = await getEmailEngagementMetrics()
    
    console.log('✅ Repository Response:')
    console.log(JSON.stringify(metrics, null, 2))
    
    console.log('\n📊 Values:')
    console.log(`  Total Emails Sent: ${metrics.totalEmailsSent}`)
    console.log(`  Total Opens: ${metrics.totalOpensDetected}`)
    console.log(`  Total Replies: ${metrics.totalRepliesReceived}`)
    console.log(`  Open Rate: ${metrics.openRate}%`)
    console.log(`  Reply Rate: ${metrics.replyRate}%`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testRepository()
