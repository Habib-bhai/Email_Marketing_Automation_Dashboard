/**
 * Retry utility with exponential backoff
 * Implements FR-007 retry strategy for database failures
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  onRetry?: (attempt: number, error: Error) => void
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  onRetry: () => {}
}

/**
 * Executes a function with exponential backoff retry logic
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options }
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === opts.maxRetries) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
        opts.maxDelay
      )

      opts.onRetry(attempt, lastError)

      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error(
    `Operation failed after ${opts.maxRetries} retries. Last error: ${lastError?.message || 'Unknown error'}`
  )
}

// Alias for backward compatibility
export const withRetry = retry

/**
 * Checks if an error is retryable (network/database errors)
 */
export function isRetryableError(error: Error): boolean {
  const retryableErrors = [
    'ECONNRESET',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'database unavailable',
    'connection refused',
    'network error'
  ]

  return retryableErrors.some(
    keyword => error.message.toLowerCase().includes(keyword.toLowerCase())
  )
}
