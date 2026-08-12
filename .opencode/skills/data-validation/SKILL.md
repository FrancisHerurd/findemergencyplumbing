# Skill: Data Validation with Zod

## Purpose

Validate all external data (API responses, form inputs, environment variables) using Zod schemas.

## When to Use

- Validating API responses
- Validating form submissions
- Validating environment variables
- Type-safe data parsing
- Runtime type checking

## Technical Rules

### Always Validate
- API responses from external sources
- Form input data
- Environment variables
- Database query results (if not type-safe)
- User-generated content

### Never Trust
- Query parameters
- Request bodies
- Cookies
- Headers
- Third-party APIs

## Schema Patterns

### Basic Schema

```typescript
import { z } from 'zod'

const PlumberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/),
  isAvailable247: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
  distance: z.number().positive(),
})

type Plumber = z.infer<typeof PlumberSchema>
```

### Array Validation

```typescript
const PlumbersResponseSchema = z.object({
  plumbers: z.array(PlumberSchema),
  total: z.number(),
})
```

### Environment Variables

```typescript
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

const env = EnvSchema.parse(process.env)
```

## Error Handling

```typescript
import { ZodError } from 'zod'

try {
  const data = PlumberSchema.parse(apiResponse)
} catch (error) {
  if (error instanceof ZodError) {
    console.error('Validation failed:', error.errors)
    // Handle validation error
  }
}
```

## Related Skills

- `frontend-nextjs`
- `database-drizzle`
- `security-review`