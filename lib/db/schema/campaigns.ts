import { pgTable, varchar, integer, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'

export const campaignStatusEnum = pgEnum('campaign_status', ['Draft', 'Active', 'Paused', 'Completed'])

export const campaigns = pgTable('campaigns', {
  // Primary Key - changed from UUID to varchar to support custom IDs from n8n
  id: varchar('id', { length: 255 }).primaryKey(),

  // Core Attributes
  name: varchar('name', { length: 255 }).notNull(),
  emailsSent: integer('emails_sent').notNull().default(0),
  repliesReceived: integer('replies_received').notNull().default(0),
  opensDetected: integer('opens_detected').notNull().default(0),
  followUpsSent: integer('follow_ups_sent').notNull().default(0),
  lastFollowUpsSent: integer('last_follow_ups_sent').notNull().default(0),

  // Campaign Timeline
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  status: campaignStatusEnum('status').notNull().default('Active'),

  // Flexible Metadata
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
    .$onUpdate(() => new Date())
}, (table) => ({
  nameIdx: index('campaigns_name_idx').on(table.name),
  statusIdx: index('campaigns_status_idx').on(table.status),
  startedAtIdx: index('campaigns_started_at_idx').on(table.startedAt.desc()),
  createdAtIdx: index('campaigns_created_at_idx').on(table.createdAt.desc())
}))

// Type inference
export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
