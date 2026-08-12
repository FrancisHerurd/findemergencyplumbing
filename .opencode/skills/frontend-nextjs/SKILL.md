# Skill: Frontend Development with Next.js

## Purpose

Build React components and pages using Next.js App Router, TypeScript, and Tailwind CSS.

## When to Use

- Creating new pages or routes
- Building React components
- Implementing UI features
- Styling with Tailwind CSS
- Adding interactivity

## Technical Rules

### TypeScript
- Use strict types, no `any`
- Define interfaces for props and data
- Use Zod for runtime validation

### Next.js App Router
- Use `app/` directory structure
- Server Components by default
- Client Components only when needed (`use client`)
- Proper loading and error states

### Tailwind CSS
- Use utility classes
- Follow mobile-first approach
- Use `@apply` sparingly

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## Component Structure

```tsx
// components/Example.tsx
interface ExampleProps {
  title: string
  count: number
}

export function Example({ title, count }: ExampleProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>Count: {count}</p>
    </div>
  )
}
```

## Page Structure

```tsx
// app/example/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Example Page',
  description: 'Page description for SEO',
}

export default function ExamplePage() {
  return (
    <main>
      <h1>Example</h1>
    </main>
  )
}
```

## Related Skills

- `project-planning`
- `data-validation`
- `testing-quality`
- `seo-local`