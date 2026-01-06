import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/Components/layouts/Header'
import { Footer } from '@/Components/layouts/Footer'
import { SkipLink } from '@/Components/ui/SkipLink'
import { ErrorBoundary } from '@/Components/errors/ErrorBoundary'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import '@/styles/design-tokens.css'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'KPI Dashboard - Email Marketing Automation',
  description: 'Real-time KPI metrics for email marketing automation',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLink />
        <QueryProvider>
          <ErrorBoundary>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  )
}
