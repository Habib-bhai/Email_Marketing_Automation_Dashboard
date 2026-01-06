import { pgTable, uuid, varchar, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'

export const leadStatusEnum = pgEnum('lead_status', ['Processed', 'Unprocessed'])
export const leadTypeEnum = pgEnum('lead_type', ['Brand', 'Apollo', 'Cold', 'Warm'])
export const leadTemperatureEnum = pgEnum('lead_temperature', ['Hot', 'Warm', 'Cold'])

export const leads = pgTable('leads', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Core Attributes
  status: leadStatusEnum('status').notNull().default('Unprocessed'),
  type: leadTypeEnum('type').notNull(),
  temperature: leadTemperatureEnum('temperature').notNull(),
  source: varchar('source', { length: 255 }).notNull(),

  // Optional Contact Information
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  company: varchar('company', { length: 255 }),

  // Flexible Metadata (JSON)
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
    .$onUpdate(() => new Date())
}, (table) => ({
  statusIdx: index('leads_status_idx').on(table.status),
  typeIdx: index('leads_type_idx').on(table.type),
  temperatureIdx: index('leads_temperature_idx').on(table.temperature),
  sourceIdx: index('leads_source_idx').on(table.source),
  emailIdx: index('leads_email_idx').on(table.email),
  createdAtIdx: index('leads_created_at_idx').on(table.createdAt.desc())
}))

// Type inference
export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
