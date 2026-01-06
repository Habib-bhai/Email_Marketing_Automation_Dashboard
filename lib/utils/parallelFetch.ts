// lib/utils/parallelFetch.ts

/**
 * T112 - Optimize parallel data fetching
 * Utility for fetching multiple endpoints concurrently with error handling
 */

interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
  timeout?: number
}

interface FetchResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Fetch multiple endpoints in parallel with timeout and error handling
 */
export async function parallelFetch<T extends Record<string, any>>(
  requests: Record<string, { url: string; options?: FetchOptions }>,
  globalTimeout: number = 5000
): Promise<Record<string, FetchResult<any>>> {
  const results: Record<string, FetchResult<any>> = {}

  const fetchPromises = Object.entries(requests).map(async ([key, { url, options }]) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), options?.timeout || globalTimeout)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      results[key] = {
        success: true,
        data: data.data || data
      }
      // eslint-disable-next-line
    } catch (error:any) {
      results[key] = {
        success: false,
        error: error.message || 'Unknown error occurred'
      }
    }
  })

  await Promise.allSettled(fetchPromises)

  return results
}

/**
 * Batch query invalidation for React Query
 */
export function createBatchInvalidation(queryClient: any, queryKeys: string[][]): () => Promise<void> {
  return async () => {
    await Promise.all(
      queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key }))
    )
  }
}

/**
 * Prefetch multiple queries for faster navigation
 */
export async function prefetchQueries(
  queryClient: any,
  queries: Array<{ queryKey: string[]; queryFn: () => Promise<any> }>
): Promise<void> {
  await Promise.all(
    queries.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery({ queryKey, queryFn })
    )
  )
}

/**
 * Staggered data loading to reduce server load
 */
export async function staggeredFetch<T>(
  requests: Array<() => Promise<T>>,
  delayMs: number = 50
): Promise<T[]> {
  const results: T[] = []

  for (const request of requests) {
    results.push(await request())
    if (delayMs > 0 && requests.indexOf(request) < requests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  return results
}
