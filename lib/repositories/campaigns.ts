// lib/repositories/campaigns.ts
import { getDb } from '../db/connection'
import { campaigns, type Campaign, type NewCampaign } from '../db/schema/campaigns'
import { eq, and, desc, count } from 'drizzle-orm'
import { withRetry } from '../utils/retry'

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface CampaignFilters {
  status?: 'Draft' | 'Active' | 'Paused' | 'Completed'
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Upsert a campaign (idempotent operation)
 * If campaign with same ID exists, updates it; otherwise inserts new campaign
 */
export async function upsertCampaign(campaignData: Partial<NewCampaign> & { id?: string }): Promise<Campaign> {
  return withRetry(async () => {
    const db = getDb()
    const timestamp = new Date()

    // If no ID provided, insert new campaign
    if (!campaignData.id) {
      const [insertedCampaign] = await db.insert(campaigns)
        .values({
          ...campaignData,
          createdAt: timestamp,
          updatedAt: timestamp
        } as NewCampaign)
        .returning()

      return insertedCampaign
    }

    // If ID provided, upsert (insert or update on conflict)
    const [upsertedCampaign] = await db.insert(campaigns)
      .values({
        ...campaignData,
        id: campaignData.id,
        createdAt: timestamp,
        updatedAt: timestamp
      } as NewCampaign)
      .onConflictDoUpdate({
        target: campaigns.id,
        set: {
          ...campaignData,
          updatedAt: timestamp
        }
      })
      .returning()

    return upsertedCampaign
  })
}

/**
 * Get campaign by ID
 */
export async function getCampaignById(id: string): Promise<Campaign | undefined> {
  return withRetry(async () => {
    const db = getDb()
    const [campaign] = await db.select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1)

    return campaign
  })
}

/**
 * Get campaign by name
 */
export async function getCampaignByName(name: string): Promise<Campaign | undefined> {
  return withRetry(async () => {
    const db = getDb()
    const [campaign] = await db.select()
      .from(campaigns)
      .where(eq(campaigns.name, name))
      .limit(1)

    return campaign
  })
}

/**
 * Get campaigns with pagination and filtering (T067)
 */
export async function getCampaigns(
  pagination: PaginationParams = {},
  filters: CampaignFilters = {}
): Promise<PaginatedResult<Campaign>> {
  return withRetry(async () => {
    const db = getDb()
    const page = pagination.page || 1
    const limit = pagination.limit || 10
    const offset = (page - 1) * limit

    // Build WHERE conditions
    const conditions = []
    if (filters.status) {
      conditions.push(eq(campaigns.status, filters.status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(campaigns)
      .where(whereClause)

    // Get paginated data
    const data = await db
      .select()
      .from(campaigns)
      .where(whereClause)
      .orderBy(desc(campaigns.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / limit)
      }
    }
  })
}
