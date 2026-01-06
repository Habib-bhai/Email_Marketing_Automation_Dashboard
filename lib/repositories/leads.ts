// lib/repositories/leads.ts
import { getDb } from '../db/connection'
import { leads, type Lead, type NewLead } from '../db/schema/leads'
import { eq, and, desc, count, gte, lte } from 'drizzle-orm'
import { withRetry } from '../utils/retry'

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface LeadFilters {
  status?: 'Processed' | 'Unprocessed'
  type?: 'Brand' | 'Apollo' | 'Cold' | 'Warm'
  temperature?: 'Hot' | 'Warm' | 'Cold'
  source?: string
  dateFrom?: Date
  dateTo?: Date
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
 * Upsert a lead (idempotent operation)
 * If lead with same ID exists, updates it; otherwise inserts new lead
 */
export async function upsertLead(leadData: Partial<NewLead> & { id?: string }): Promise<Lead> {
  return withRetry(async () => {
    const db = getDb()
    const timestamp = new Date()

    // If no ID provided, insert new lead
    if (!leadData.id) {
      const [insertedLead] = await db.insert(leads)
        .values({
          ...leadData,
          createdAt: timestamp,
          updatedAt: timestamp
        } as NewLead)
        .returning()

      return insertedLead
    }

    // If ID provided, upsert (insert or update on conflict)
    const [upsertedLead] = await db.insert(leads)
      .values({
        ...leadData,
        id: leadData.id,
        createdAt: timestamp,
        updatedAt: timestamp
      } as NewLead)
      .onConflictDoUpdate({
        target: leads.id,
        set: {
          ...leadData,
          updatedAt: timestamp
        }
      })
      .returning()

    return upsertedLead
  })
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string): Promise<Lead | undefined> {
  return withRetry(async () => {
    const db = getDb()
    const [lead] = await db.select()
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1)

    return lead
  })
}

/**
 * Get lead by email
 */
export async function getLeadByEmail(email: string): Promise<Lead | undefined> {
  return withRetry(async () => {
    const db = getDb()
    const [lead] = await db.select()
      .from(leads)
      .where(eq(leads.email, email))
      .limit(1)

    return lead
  })
}

/**
 * Get leads with pagination and filtering (T068)
 */
export async function getLeads(
  pagination: PaginationParams = {},
  filters: LeadFilters = {}
): Promise<PaginatedResult<Lead>> {
  return withRetry(async () => {
    const db = getDb()
    const page = pagination.page || 1
    const limit = pagination.limit || 10
    const offset = (page - 1) * limit

    // Build WHERE conditions
    const conditions = []
    if (filters.status) {
      conditions.push(eq(leads.status, filters.status))
    }
    if (filters.type) {
      conditions.push(eq(leads.type, filters.type))
    }
    if (filters.temperature) {
      conditions.push(eq(leads.temperature, filters.temperature))
    }
    if (filters.source) {
      conditions.push(eq(leads.source, filters.source))
    }
    if (filters.dateFrom) {
      conditions.push(gte(leads.createdAt, filters.dateFrom))
    }
    if (filters.dateTo) {
      conditions.push(lte(leads.createdAt, filters.dateTo))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(whereClause)

    // Get paginated data
    const data = await db
      .select()
      .from(leads)
      .where(whereClause)
      .orderBy(desc(leads.createdAt))
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
