import { pgTable, uuid, varchar, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'

export const eventTypeEnum = pgEnum('event_type', ['sent', 'opened', 'replied', 'bounced', 'clicked', 'unsubscribed', 'follow_up_sent', 'last_follow_up_sent'])

export const engagementMetrics = pgTable('engagement_metrics', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Campaign and Lead IDs (stored as strings, no foreign key constraints)
  // This allows flexibility for external IDs from n8n workflows
  campaignId: varchar('campaign_id', { length: 255 }).notNull(),
  leadId: varchar('lead_id', { length: 255 }),

  // Event Details
  eventType: eventTypeEnum('event_type').notNull(),
  occurredAt: timestamp('occurred_at').notNull(),

  // Flexible Metadata
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),

  // Timestamp
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => ({
  campaignIdIdx: index('engagement_campaign_id_idx').on(table.campaignId),
  leadIdIdx: index('engagement_lead_id_idx').on(table.leadId),
  eventTypeIdx: index('engagement_event_type_idx').on(table.eventType),
  occurredAtIdx: index('engagement_occurred_at_idx').on(table.occurredAt.desc())
}))

// Type inference
export type EngagementMetric = typeof engagementMetrics.$inferSelect
export type NewEngagementMetric = typeof engagementMetrics.$inferInsert
