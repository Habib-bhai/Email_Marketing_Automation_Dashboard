import { LandingPage } from '@/features/Landing'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

export default function Homepage() {
  return <LandingPage />
}
