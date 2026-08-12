# Skill: Database with Drizzle ORM

## Purpose

Design database schemas, write queries, and manage migrations using Drizzle ORM with PostgreSQL.

## When to Use

- Designing database tables
- Writing database queries
- Creating migrations
- Seeding test data
- Optimizing database performance

## Technical Rules

### Naming Conventions
- Tables: `snake_case` (e.g., `plumbers`, `emergency_contacts`)
- Columns: `snake_case` (e.g., `created_at`, `is_available`)
- Primary keys: `id` (UUID or serial)
- Timestamps: `created_at`, `updated_at`

### Schema Design
- Use `snake_case` for all PostgreSQL identifiers
- Add indexes for frequently queried columns
- Use foreign keys for relationships
- Add `created_at` and `updated_at` timestamps
- Validate data with Zod before inserting

### Queries
- Limit results to prevent N+1 problems
- Use transactions for related operations
- Avoid SELECT * - specify columns
- Use prepared statements for repeated queries

## Schema Example

```typescript
// db/schema.ts
import { pgTable, text, boolean, decimal, timestamp } from 'drizzle-orm/pg-core'

export const plumbers = pgTable('plumbers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  isAvailable247: boolean('is_available_247').notNull().default(false),
  rating: decimal('rating', { precision: 2, scale: 1 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
```

## Migration Commands

```bash
# Generate migration
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

## Query Examples

```typescript
// db/index.ts
import { db } from 'drizzle-orm'
import { plumbers } from './schema'

// Get all plumbers
const allPlumbers = await db.select().from(plumbers)

// Get plumbers with filters
const availablePlumbers = await db
  .select()
  .from(plumbers)
  .where(eq(plumbers.isAvailable247, true))
  .limit(10)
```

## Related Skills

- `project-planning`
- `data-validation`
- `security-review`