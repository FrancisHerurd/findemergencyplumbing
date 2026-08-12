# SEO Specification

## Strategy

**CRITICAL RULE**: Do NOT auto-generate thousands of SEO pages. Only create pages with useful content and valid data.

## Phases

### Phase 1: Foundation

- Homepage optimization
- Technical SEO setup
- Meta tags
- Sitemap
- Robots.txt

### Phase 2: Test Cities

- 5-10 test cities with fictional data
- Unique content per city
- Proper internal linking
- Structured data (test only)

### Phase 3: Real Data

- Cities with real plumber data
- Verified business information
- Complete structured data
- Local SEO optimization

## Technical SEO

### Meta Tags

Every page must have:
- Unique `<title>` (50-60 characters)
- Unique `<meta description>` (150-160 characters)
- Canonical URL
- Open Graph tags
- Twitter Card tags

### Sitemap

```typescript
// app/sitemap.ts
- Homepage
- Search page
- City pages (only with valid data)
- Last modified dates
```

### Robots.txt

```txt
User-agent: *
Allow: /

# Block test pages
Disallow: /test/
Disallow: /draft/

Sitemap: https://findemergencyplumbing.com/sitemap.xml
```

## URL Structure

/ # Homepage
/search # Search page
/search?city=New+York # Search with params
/city/new-york-ny # City page (SEO)
/zip/10001 # ZIP code page (SEO)


## City Page Template

```tsx
// app/city/[city]/page.tsx

// Title: "Emergency Plumber in {City}, {State} | 24/7 Service"
// Description: "Find 24/7 emergency plumbers in {City}, {State}. Call now for fast, reliable plumbing services near you."

// Content:
// - H1: "Emergency Plumber in {City}"
// - Intro paragraph
// - List of plumbers (if available)
// - FAQ section
// - Related cities
```

## Structured Data

### LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Business Name",
  "telephone": "555-0100",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Test Street",
    "addressLocality": "Test City",
    "addressRegion": "TC",
    "postalCode": "12345"
  },
  "openingHours": "Mo-Su 00:00-23:59"
}
```

**Only for real, verifiable businesses.**

## Performance Targets

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Mobile-friendly (Google test)
- Core Web Vitals: All green

## Content Guidelines

### DO
- Write unique content for each city page
- Include local references
- Add FAQs
- Use natural language
- Optimize for user intent

### DON'T
- Duplicate content across pages
- Keyword stuff
- Create thin content pages
- Auto-generate without review
- Use AI content without editing

## Link Building

- Internal linking between related cities
- Clear navigation structure
- Breadcrumbs
- Sitemap with priority levels

## Monitoring

- Google Search Console
- Google Analytics
- Rank tracking
- Core Web Vitals monitoring

## Related Documents

- [Product Specification](./product-spec.md)
- [Architecture](./architecture.md)