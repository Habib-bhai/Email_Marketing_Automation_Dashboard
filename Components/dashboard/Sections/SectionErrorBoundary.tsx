// Components/dashboard/Sections/SectionErrorBoundary.tsx
'use client'

import React, { Component, ReactNode } from 'react'
import { ErrorState } from '@/Components/dashboard/StateHandlers/ErrorState'
import { Card, CardContent } from '@/Components/ui/card'

/**
 * T113 - Error boundary for dashboard sections
 * Prevents section errors from crashing entire dashboard
 */

interface Props {
  children: ReactNode
  sectionName?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Section error:', {
      section: this.props.sectionName || 'Unknown',
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card>
          <CardContent className="pt-6">
            <ErrorState
              error={this.state.error}
              title={`Failed to load ${this.props.sectionName || 'section'}`}
              message="An unexpected error occurred in this section"
              onRetry={this.handleReset}
            />
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withSectionErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  sectionName: string
) {
  return function WrappedComponent(props: P) {
    return (
      <SectionErrorBoundary sectionName={sectionName}>
        <Component {...props} />
      </SectionErrorBoundary>
    )
  }
}
