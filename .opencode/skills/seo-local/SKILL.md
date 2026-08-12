# Skill: Local SEO Optimization

## Purpose

Optimize the application for local search, create SEO pages for cities, and implement structured data for better visibility.

## When to Use

- Creating city/ZIP code pages
- Implementing meta tags
- Adding structured data
- Optimizing for local search
- Building sitemap

## Technical Rules

### SEO Pages (CRITICAL)
- **Do NOT auto-generate thousands of pages**
- Only create pages with **useful content and valid data**
- Start with test cities only
- Each page must have unique, valuable content

### Meta Tags
- Unique title and description per page
- Canonical URLs
- Open Graph tags
- Twitter Card tags

### Structured Data
- Use Schema.org vocabulary
- Only for real, verifiable businesses
- LocalBusiness schema for plumbers
- Validate with Google Rich Results Test

### Performance
- Fast page load (< 3s)
- Mobile-friendly design
- Core Web Vitals optimization
- Image optimization

## Meta Tags Example

```tsx
// app/city/[city]/page.tsx
import { Metadata } from 'next'

type Props = {
  params: { city: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = decodeURIComponent(params.city)
  
  return {
    title: `Emergency Plumber in ${city} | 24/7 Service`,
    description: `Find 24/7 emergency plumbers in ${city}. Call now for fast, reliable plumbing services.`,
    alternates: {
      canonical: `https://findemergencyplumbing.com/city/${params.city}`,
    },
    openGraph: {
      title: `Emergency Plumber in ${city}`,
      description: `24/7 emergency plumbing services in ${city}`,
      type: 'website',
    },
  }
}
```

## Structured Data Example

```tsx
// components/PlumberCard.tsx
interface Plumber {
  id: string
  name: string
  phone: string
  address: string
  isAvailable247: boolean
}

export function PlumberCard({ plumber }: { plumber: Plumber }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    name: plumber.name,
    telephone: plumber.phone,
    address: plumber.address,
    openingHours: plumber.isAvailable247 ? 'Mo-Su 00:00-23:59' : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div data-testid="plumber-card">
        {/* Card content */}
      </div>
    </>
  )
}
```

## Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next/dist/compiled/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://findemergencyplumbing.com',
      lastModified: new Date(),
    },
    // Add city pages with valid data only
  ]
}
```

## Related Skills

- `frontend-nextjs`
- `project-planning`
- `security-review`