# Skill: Testing and Quality Assurance

## Purpose

Write unit tests with Vitest and E2E tests with Playwright to ensure code quality and prevent regressions.

## When to Use

- After implementing new features
- Before deploying to production
- When fixing bugs
- During refactoring
- For critical components

## Technical Rules

### Unit Tests (Vitest)
- Test pure functions and utilities
- Test component rendering
- Test validation schemas
- Mock external dependencies
- Aim for high coverage on critical paths

### E2E Tests (Playwright)
- Test user workflows
- Test critical paths (search, view, call)
- Test error states
- Test mobile responsiveness
- Test accessibility

### Test Structure
- One test file per source file
- Descriptive test names
- Isolated test cases
- Clean setup and teardown

## Vitest Example

```typescript
// tests/unit/plumber.test.ts
import { describe, it, expect } from 'vitest'
import { PlumberSchema } from '@/lib/validation'

describe('Plumber validation', () => {
  it('validates correct plumber data', () => {
    const plumber = {
      id: '123',
      name: 'Test Plumber',
      phone: '555-0100',
      isAvailable247: true,
    }

    const result = PlumberSchema.safeParse(plumber)
    expect(result.success).toBe(true)
  })

  it('rejects invalid phone number', () => {
    const plumber = {
      id: '123',
      name: 'Test Plumber',
      phone: 'invalid',
      isAvailable247: true,
    }

    const result = PlumberSchema.safeParse(plumber)
    expect(result.success).toBe(false)
  })
})
```

## Playwright Example

```typescript
// e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test('search shows plumbers', async ({ page }) => {
  await page.goto('/')
  
  await page.fill('input[name="search"]', 'New York')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('[data-testid="plumber-card"]')).toHaveCount(
    expect.any(Number)
  )
})

test('empty state shows when no results', async ({ page }) => {
  await page.goto('/search?city=NowhereCity12345')
  
  await expect(page.getByText('No plumbers found')).toBeVisible()
})
```

## Commands

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Related Skills

- `frontend-nextjs`
- `data-validation`
- `security-review`