# Skill: Security Review

## Purpose

Review code for security vulnerabilities, ensure proper data validation, and protect against common attacks.

## When to Use

- Before deploying to production
- After implementing authentication
- When handling sensitive data
- Before exposing APIs
- During code review

## Security Checklist

### Data Validation
- ✅ All external data validated with Zod
- ✅ SQL injection prevention (Drizzle handles this)
- ✅ XSS prevention (React escapes by default)
- ✅ CSRF protection for forms

### Environment Variables
- ✅ No secrets in client code
- ✅ `.env` files in `.gitignore`
- ✅ Use `.env.example` for documentation
- ✅ Validate env vars with Zod

### Authentication (future)
- ✅ Secure session management
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ OAuth providers (if needed)

### API Security
- ✅ Input validation
- ✅ Output encoding
- ✅ Rate limiting
- ✅ Error handling (no stack traces)

### Headers
- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Strict-Transport-Security

## Next.js Security Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ],
}

export default config
```

## Environment Validation

```typescript
// lib/env.ts
import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  GOOGLE_AI_API_KEY: z.string().optional(),
})

export const env = EnvSchema.parse(process.env)
```

## Common Vulnerabilities

### SQL Injection
- ✅ Use Drizzle ORM (parameterized queries)
- ❌ Never concatenate SQL strings

### XSS
- ✅ React escapes by default
- ❌ Avoid `dangerouslySetInnerHTML`
- ✅ Validate and sanitize user input

### CSRF
- ✅ Use SameSite cookies
- ✅ Implement CSRF tokens for forms
- ✅ Validate origin headers

### Sensitive Data Exposure
- ✅ Never log passwords or tokens
- ✅ Use HTTPS in production
- ✅ Encrypt sensitive data at rest

## Related Skills

- `data-validation`
- `database-drizzle`
- `testing-quality`