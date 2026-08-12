# FindEmergencyPlumbing

Emergency plumbing directory SaaS for the US market. Help users find 24/7 plumbers near them by city or ZIP code.

## 🚧 Status

**Phase 0**: Documentation and agent configuration

## 🎯 Product Goal

Build an SEO-optimized directory focused on lead generation. Users can:

- Search plumbers by city or ZIP code
- View nearby plumbers
- Filter by distance, rating, and availability
- See key plumber details (name, location, phone, rating, distance, 24/7 availability)
- Check 24/7 availability
- Contact via phone call or equivalent action

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: Cloudflare Pages
- **AI**: Ollama (local) + Google One Plus (cloud)

## 📁 Project Structure

findemergencyplumbing/
├── AGENTS.md # Agent configuration and workflow
├── README.md # This file
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── package.json # Dependencies
├── tsconfig.json # TypeScript config
├── next.config.ts # Next.js config
├── drizzle.config.ts # Drizzle ORM config
├── app/ # Next.js App Router
├── components/ # React components
├── lib/ # Utilities and helpers
├── db/ # Database schema and client
├── data/ # Seed data (test only)
├── tests/ # Unit tests (Vitest)
├── e2e/ # E2E tests (Playwright)
├── docs/ # Documentation
│ ├── product-spec.md
│ ├── architecture.md
│ ├── seo-spec.md
│ └── adr/ # Architecture Decision Records
├── .github/ # GitHub workflows
│ ├── workflows/
│ └── dependabot.yml
└── .opencode/ # OpenCode configuration
├── agents/ # Agent definitions
└── skills/ # Reusable skills

## 🤖 AI Architecture

### Hybrid Model Setup

┌─────────────────────────────────────────────────┐
│ Project Tasks │
└─────────────────────────────────────────────────┘
│
┌────────────┴────────────┐
│ │
▼ ▼
┌─────────────────┐ ┌──────────────────┐
│ Ollama Local │ │ Google One Plus │
│ qwen3:1.7b │ │ (Gemini/Ultra) │
└─────────────────┘ └──────────────────┘
│ │
▼ ▼

Simple tasks - Complex architecture

Repetitive code - Deep code review

Small refactorings - Test generation

File searches - Security analysis

File creation - Large refactorings

Basic documentation - Specialized agents

Advanced SEO strategy

text


## 📋 Development Workflow

See [`AGENTS.md`](./AGENTS.md) for complete workflow instructions.

### Quick Commands

```bash
# Development (after setup)
npm run dev

# Quality checks
npm run lint
npm run test
npm run build

# Database
npm run db:generate
npm run db:migrate
npm run db:seed

# E2E tests
npm run test:e2e
```

## 📄 Documentation

- [Product Specification](./docs/product-spec.md)
- [Architecture](./docs/architecture.md)
- [SEO Specification](./docs/seo-spec.md)
- [Architecture Decision Records](./docs/adr/)

## 🎯 MVP Features (Phase 1)

### Must Have
- ✅ Mobile-first homepage
- ✅ English interface
- ✅ Search by city or ZIP code
- ✅ List of nearby plumbers
- ✅ Plumber cards (name, location, phone, rating, distance, 24/7)
- ✅ "Call now" button
- ✅ Loading, error, and empty states
- ✅ Responsive design
- ✅ Basic accessibility
- ✅ Technical SEO (metadata, canonical URLs)

### NOT in Phase 1
- ❌ Authentication
- ❌ Payments
- ❌ Booking system
- ❌ Advanced business dashboard
- ❌ Paid map APIs
- ❌ External real data integrations
- ❌ Complete review system
- ❌ Auto-generated SEO pages

## ⚠️ Data Rules (CRITICAL)

**Do NOT invent:**
- Real company names
- Real addresses
- Real phone numbers
- Real reviews or ratings
- Real business hours
- Structured data for real businesses without valid data

**Test data must be clearly identified as fictional.**

## 📅 Roadmap

- **Phase 0**: Documentation and agent configuration ✅ (in progress)
- **Phase 1**: Next.js initialization and configuration
- **Phase 2**: Database schema and seed data
- **Phase 3**: MVP frontend implementation
- **Phase 4**: Testing and quality assurance
- **Phase 5**: Deployment and SEO optimization

## 📝 License

MIT

---

Built with ❤️ by FrancisHerurd