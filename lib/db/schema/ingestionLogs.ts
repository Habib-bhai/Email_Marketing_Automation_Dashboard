import { pgTable, uuid, varchar, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core'

export const ingestionLogs = pgTable('ingestion_logs', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Entity Reference
  entityType: varchar('entity_type', { length: 50 }).notNull(), // 'lead', 'campaign', 'engagement'
  entityId: uuid('entity_id'), // May be null if validation failed

  // Request Details
  payload: jsonb('payload').notNull(), // Original request payload
  validationResult: jsonb('validation_result').$type<Record<string, unknown>>(),
  success: boolean('success').notNull(),
  errorDetails: text('error_details'),
  sourceIp: varchar('source_ip', { length: 45 }), // IPv4 or IPv6

  // Timestamp
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => ({
  entityTypeIdx: index('log_entity_type_idx').on(table.entityType),
  successIdx: index('log_success_idx').on(table.success),
  createdAtIdx: index('log_created_at_idx').on(table.createdAt.desc()),
  sourceIpIdx: index('log_source_ip_idx').on(table.sourceIp)
}))

// Type inference
export type IngestionLog = typeof ingestionLogs.$inferSelect
export type NewIngestionLog = typeof ingestionLogs.$inferInsert
