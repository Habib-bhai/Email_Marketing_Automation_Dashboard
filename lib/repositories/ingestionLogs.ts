// lib/repositories/ingestionLogs.ts
import { getDb } from '../db/connection'
import { ingestionLogs, type IngestionLog, type NewIngestionLog } from '../db/schema/ingestionLogs'
import { eq, desc } from 'drizzle-orm'
import { withRetry } from '../utils/retry'

export interface LogIngestionParams {
  entityType: 'lead' | 'campaign' | 'engagement'
  entityId?: string
  payload: Record<string, unknown>
  validationResult?: Record<string, unknown>
  success: boolean
  errorDetails?: string
  sourceIp?: string
}

/**
 * Log an ingestion attempt (success or failure)
 * Provides audit trail for debugging and monitoring
 */
export async function logIngestion(params: LogIngestionParams): Promise<IngestionLog> {
  return withRetry(async () => {
    const db = getDb()
    const timestamp = new Date()

    const [log] = await db.insert(ingestionLogs)
      .values({
        ...params,
        createdAt: timestamp
      })
      .returning()

    return log
  })
}

/**
 * Get recent ingestion logs
 */
export async function getRecentIngestionLogs(limit = 100): Promise<IngestionLog[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(ingestionLogs)
      .orderBy(desc(ingestionLogs.createdAt))
      .limit(limit)
  })
}

/**
 * Get ingestion logs by entity type
 */
export async function getIngestionLogsByEntityType(
  entityType: string,
  limit = 100
): Promise<IngestionLog[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(ingestionLogs)
      .where(eq(ingestionLogs.entityType, entityType))
      .orderBy(desc(ingestionLogs.createdAt))
      .limit(limit)
  })
}

/**
 * Get ingestion logs by success status
 */
export async function getIngestionLogsBySuccess(
  success: boolean,
  limit = 100
): Promise<IngestionLog[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(ingestionLogs)
      .where(eq(ingestionLogs.success, success))
      .orderBy(desc(ingestionLogs.createdAt))
      .limit(limit)
  })
}

/**
 * Get ingestion logs by source IP (for rate limit monitoring)
 */
export async function getIngestionLogsByIP(
  sourceIp: string,
  limit = 100
): Promise<IngestionLog[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(ingestionLogs)
      .where(eq(ingestionLogs.sourceIp, sourceIp))
      .orderBy(desc(ingestionLogs.createdAt))
      .limit(limit)
  })
}
