/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { DashboardOverview } from '../DashboardOverview'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('DashboardOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the tab navigation', async () => {
    render(<DashboardOverview />, { wrapper: createWrapper() })
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument()
    })
    expect(screen.getByText('Lead Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Email Analytics')).toBeInTheDocument()
    expect(screen.getByText('Automation Health')).toBeInTheDocument()
  })

  it('renders summary cards in overview tab', async () => {
    render(<DashboardOverview />, { wrapper: createWrapper() })
    await waitFor(() => {
      expect(screen.getByText('Total Leads')).toBeInTheDocument()
    })
    expect(screen.getByText('Reply Rate')).toBeInTheDocument()
    expect(screen.getByText('Enrichment Success')).toBeInTheDocument()
    expect(screen.getByText('Active Workflows')).toBeInTheDocument()
  })

  it('renders loading state initially', () => {
    render(<DashboardOverview />, { wrapper: createWrapper() })
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders without crashing', () => {
    expect(() => render(<DashboardOverview />, { wrapper: createWrapper() })).not.toThrow()
  })
})
