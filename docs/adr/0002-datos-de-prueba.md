# ADR 0002: Datos de Prueba

## Status

Accepted

## Context

We need test data for development and initial SEO pages.

Requirements:
- Must not invent real businesses
- Must be clearly fictional
- Must be useful for testing
- Must comply with Google's guidelines

## Decision

We will use **fictional test data** with clear identifiers:

### Naming Convention

- Company names: "Test Plumber Co", "Demo Plumbing Services"
- Addresses: "123 Test Street", "456 Demo Avenue"
- Phone numbers: "555-0100", "555-0101"
- Cities: Start with test cities only

### Data Structure

```typescript
const testPlumbers = [
  {
    id: 'test-1',
    name: 'Test Plumber Co',
    phone: '555-0100',
    address: '123 Test Street, Test City, TC 12345',
    isAvailable247: true,
    rating: 4.5, // Only if we have valid test data
  },
]
```

### SEO Pages

- Only create pages for cities with test data
- Clearly mark as "Test City" or use fictional city names
- Do NOT create thousands of auto-generated pages
- Wait for real data before scaling

## Consequences

### Positive

- Complies with Google's guidelines
- No legal issues
- Clear distinction between test and real data
- Easy to replace with real data later

### Negative

- Limited initial SEO value
- Can't launch with real coverage
- Need to find real data sources later

### Neutral

- Test data must be maintained
- Need clear documentation

## Alternatives Considered

- **Scrape real data**: Legal issues, violates ToS
- **Buy data**: Expensive, quality concerns
- **Partner with plumbers**: Takes time, requires sales
- **User-submitted**: Quality control issues

## Future Work

- Research legitimate data sources (Yelp API, Google Places, etc.)
- Partner with local plumbing associations
- Build relationships with plumbing companies
- Implement user-submitted listings with verification

## References

- [Google My Business Guidelines](https://support.google.com/business/answer/3038177)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)