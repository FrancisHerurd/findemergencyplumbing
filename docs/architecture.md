# Architecture

## System Overview

┌─────────────┐
│ User │
│ (Browser) │
└─────────────┘
│
▼
┌─────────────────────────────────┐
│ Cloudflare Pages │
│ (Next.js App, Static + SSR) │
└─────────────────────────────────┘
│
▼
┌─────────────────────────────────┐
│ PostgreSQL Database │
│ (Plumbers, Cities, Reviews) │
└─────────────────────────────────┘

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Validation | Zod |
| Testing | Vitest + Playwright |
| Deployment | Cloudflare Pages |
| Version Control | GitHub |
| CI/CD | GitHub Actions |

## Folder Structure
findemergencyplumbing/
├── app/ # Next.js App Router
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Homepage
│ ├── search/ # Search page
│ ├── city/[city]/ # City pages (SEO)
│ └── api/ # API routes
├── components/ # React components
│ ├── PlumberCard.tsx
│ ├── SearchBar.tsx
│ ├── Filters.tsx
│ └── ui/ # Base UI components
├── lib/ # Utilities
│ ├── validation.ts # Zod schemas
│ ├── utils.ts # Helper functions
│ └── types.ts # TypeScript types
├── db/ # Database
│ ├── schema.ts # Drizzle schema
│ ├── index.ts # Database client
│ └── migrations/ # Generated migrations
├── data/ # Seed data
│ └── seed.ts # Test data
├── tests/ # Unit tests
├── e2e/ # E2E tests
└── docs/ # Documentation


## Database Schema

```sql
-- Plumbers table
CREATE TABLE plumbers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  is_available_247 BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cities table (for SEO pages)
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plumber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_plumbers_city ON plumbers(city);
CREATE INDEX idx_plumbers_zip ON plumbers(zip_code);
CREATE INDEX idx_plumbers_available ON plumbers(is_available_247);
```

## API Design

### Search Endpoint
GET /api/search?city=New+York&lat=40.7128&lng=-74.0060&radius=10


**Response:**
```json
{
  "plumbers": [
    {
      "id": "123",
      "name": "Test Plumber Co",
      "phone": "555-0100",
      "distance": 2.5,
      "isAvailable247": true,
      "rating": 4.5
    }
  ],
  "total": 1
}
```

## Security

- All external data validated with Zod
- SQL injection prevention (Drizzle ORM)
- XSS prevention (React escaping)
- Environment variables not exposed to client
- HTTPS enforced in production

## Performance

- Static generation for SEO pages
- Server-side rendering for search
- Database query optimization (indexes)
- Image optimization (Next.js Image)
- CDN caching (Cloudflare)

## Scalability

- Stateless application (Cloudflare Pages)
- Database connection pooling
- Query result caching
- Horizontal scaling (Cloudflare)

## Related Documents

- [Product Specification](./product-spec.md)
- [SEO Specification](./seo-spec.md)
- [Architecture Decision Records](./adr/)