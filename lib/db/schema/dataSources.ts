import { pgTable, uuid, varchar, boolean, jsonb, timestamp, pgEnum, index } from 'drizzle-orm/pg-core'

export const dataSourceTypeEnum = pgEnum('data_source_type', ['n8n_workflow', 'api_integration', 'manual_upload'])

export const dataSources = pgTable('data_sources', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Core Attributes
  name: varchar('name', { length: 255 }).notNull(),
  type: dataSourceTypeEnum('type').notNull(),
  n8nWorkflowId: varchar('n8n_workflow_id', { length: 255 }),

  // Configuration (API keys, webhook URLs, etc.)
  config: jsonb('config').$type<Record<string, unknown>>(),

  // Status
  isActive: boolean('is_active').notNull().default(true),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
    .$onUpdate(() => new Date())
}, (table) => ({
  nameIdx: index('data_source_name_idx').on(table.name),
  typeIdx: index('data_source_type_idx').on(table.type),
  isActiveIdx: index('data_source_is_active_idx').on(table.isActive),
  n8nWorkflowIdIdx: index('data_source_n8n_workflow_id_idx').on(table.n8nWorkflowId)
}))

// Type inference
export type DataSource = typeof dataSources.$inferSelect
export type NewDataSource = typeof dataSources.$inferInsert
