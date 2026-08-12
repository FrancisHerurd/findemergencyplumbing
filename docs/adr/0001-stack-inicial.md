# ADR 0001: Stack Inicial

## Status

Accepted

## Context

We need to choose a tech stack for building an emergency plumbing directory SaaS.

Requirements:
- Fast, SEO-optimized frontend
- TypeScript for type safety
- PostgreSQL for relational data
- Easy deployment
- Good developer experience

## Decision

We will use:

- **Next.js 14+** with App Router for frontend
- **TypeScript** in strict mode
- **Tailwind CSS** for styling
- **PostgreSQL** for database
- **Drizzle ORM** for database access
- **Zod** for validation
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Cloudflare Pages** for deployment

## Consequences

### Positive

- Excellent developer experience
- Type-safe end-to-end
- Fast performance
- SEO-friendly (SSR/SSG)
- Easy deployment
- Good testing tools

### Negative

- Learning curve for Drizzle ORM
- Cloudflare Pages has some limitations vs Vercel
- Need to manage PostgreSQL separately

### Neutral

- TypeScript strict mode requires more code
- Tailwind CSS has a learning curve

## Alternatives Considered

- **Vercel**: More expensive, but easier PostgreSQL integration
- **Prisma**: Heavier than Drizzle
- **Supabase**: Good but adds vendor lock-in
- **Express + React**: More setup, less SEO-friendly

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare Pages](https://pages.cloudflare.com/)