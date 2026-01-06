// Test API endpoint
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testAPI() {
  console.log('🧪 Testing email engagement API...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/dashboard/metrics/email-engagement')
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`)
      const text = await response.text()
      console.error('Response:', text)
      return
    }
    
    const data = await response.json()
    console.log('✅ API Response:')
    console.log(JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('❌ Fetch error:', error)
  }
}

testAPI()
