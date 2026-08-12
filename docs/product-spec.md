# Product Specification

## Overview

FindEmergencyPlumbing is a SaaS directory that helps users find 24/7 emergency plumbers in their area.

## Target Market

- **Geography**: United States
- **Users**: Homeowners and renters needing emergency plumbing services
- **Language**: English (UI), Spanish (development)

## User Stories

### Primary User (Homeowner in Emergency)

> As a homeowner with a plumbing emergency, I want to find a nearby plumber who is available 24/7 so I can call them immediately.

**Acceptance Criteria:**
- Can search by city or ZIP code
- Sees plumbers sorted by distance
- Can filter by 24/7 availability
- Can see phone number clearly
- Can call with one click

### Secondary User (Comparison Shopper)

> As a cost-conscious user, I want to compare multiple plumbers by rating and distance so I can choose the best option.

**Acceptance Criteria:**
- Can see ratings (if available)
- Can sort by rating or distance
- Can see key details at a glance

## Features

### MVP (Phase 1)

- [x] Mobile-first homepage
- [ ] Search by city or ZIP code
- [ ] List of nearby plumbers
- [ ] Plumber cards with:
  - Name
  - Location
  - Phone number
  - Rating (if valid)
  - Distance
  - 24/7 availability badge
- [ ] "Call now" button
- [ ] Loading states
- [ ] Error states
- [ ] Empty state (no results)
- [ ] Responsive design
- [ ] Basic accessibility (WCAG 2.1 AA)
- [ ] Technical SEO (metadata, canonical URLs)

### Future Phases

- [ ] User reviews and ratings
- [ ] Booking system
- [ ] Business dashboard for plumbers
- [ ] Payment integration
- [ ] Map integration
- [ ] Real-time availability
- [ ] Multi-language support

## Data Rules

**CRITICAL**: Do NOT invent:
- Real company names
- Real addresses
- Real phone numbers
- Real reviews or ratings
- Real business hours

**Test data must be clearly fictional** (e.g., "Test Plumber Co", "123 Test Street", "555-0100").

## Success Metrics

- Time to first call (< 30 seconds)
- Search success rate (> 80%)
- Mobile performance score (> 90)
- Core Web Vitals (all green)

## Out of Scope (Phase 1)

- Authentication
- Payments
- User accounts
- Business claims
- Review system
- Map integration
- Real data integrations