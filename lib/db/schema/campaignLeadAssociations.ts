import { pgTable, uuid, varchar, timestamp, jsonb, index, unique } from 'drizzle-orm/pg-core'
import { leads } from './leads'
import { campaigns } from './campaigns'

export const campaignLeadAssociations = pgTable('campaign_lead_associations', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Foreign Keys
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  // Changed campaignId from UUID to varchar to match campaigns.id
  campaignId: varchar('campaign_id', { length: 255 }).notNull().references(() => campaigns.id, { onDelete: 'cascade' }),

  // Association Metadata
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
    .$onUpdate(() => new Date())
}, (table) => ({
  // Unique constraint: A lead can only be associated with a campaign once
  uniqueLeadCampaign: unique('campaign_lead_unique').on(table.leadId, table.campaignId),
  leadIdIdx: index('assoc_lead_id_idx').on(table.leadId),
  campaignIdIdx: index('assoc_campaign_id_idx').on(table.campaignId),
  joinedAtIdx: index('assoc_joined_at_idx').on(table.joinedAt.desc())
}))

// Type inference
export type CampaignLeadAssociation = typeof campaignLeadAssociations.$inferSelect
export type NewCampaignLeadAssociation = typeof campaignLeadAssociations.$inferInsert
