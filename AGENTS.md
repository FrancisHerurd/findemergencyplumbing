# AGENTS.md - Emergency Plumbing Directory

## Project Overview

This is an emergency plumbing directory SaaS for the US market. Users can find 24/7 plumbers near them by city or ZIP code.

**Domain**: findemergencyplumbing.com  
**Target Market**: United States  
**Language**: English (UI), Spanish (dev communication)  
**Stack**: Next.js 14+, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, Zod, Vitest, Playwright, Cloudflare Pages

---

## Development Workflow

### OpenCode Configuration

This project uses OpenCode as the development agent from VS Code integrated terminal.

#### Plan Mode

Use Plan mode for:
- Analyzing the project
- Reading files
- Understanding context
- Designing architecture
- Proposing plans
- Listing files to modify
- Detecting risks
- **Do not execute major changes without approval**

#### Build Mode

Use Build mode for:
- Creating files
- Modifying code
- Installing approved dependencies
- Running commands
- Running lint, tests, and build
- Fixing errors
- Implementing approved plans

**Do not make destructive changes without explicit human approval.**

---

## Mandatory Flow for Each Task

For any important task:

1. **Analyze context first** - Read relevant files
2. **Read AGENTS.md** - Understand project constraints
3. **Read relevant skills** - Check `.opencode/skills/`
4. **Propose a plan** - Before modifying files
5. **List files to modify** - Be explicit
6. **List new dependencies** - Explain why needed
7. **Wait for approval** - For major or destructive changes
8. **Implement in small steps** - Incremental changes
9. **Run quality checks** - `npm run lint`, `npm run test`, `npm run build`
10. **Review** - Security, accessibility, SEO, maintainability
11. **Summarize changes** - What was done
12. **Indicate risks** - Pending tasks and risks

---

## Technical Rules

### TypeScript
- Use strict TypeScript
- **Do not use `any`** unless explicitly justified
- Use proper types for all functions and components

### Dependencies
- **Do not install dependencies** without explaining the reason first
- Prefer lightweight, well-maintained packages
- Check for security vulnerabilities before installing

### Code Quality
- Keep functions small and testable
- Validate all external data with Zod
- **Do not expose environment variables to client**
- **Never commit secrets to Git**
- Maintain clear project structure
- Respect existing files and decisions

### Database
- Every schema change must have a migration
- Use `snake_case` for PostgreSQL table and column names
- Limit queries to prevent N+1 problems
- Avoid duplicate data
- Validate forms on server

### Testing
- Write unit tests with Vitest
- Write E2E tests with Playwright
- Run tests before committing

### CI/CD
- No direct push to `main`
- Important features must enter via Pull Request
- Each PR must run lint, tests, and build
- Investigate errors before merging
- Keep `main` branch stable

---

## Project Structure
indemergencyplumbing/
├── AGENTS.md # This file
├── README.md # Project overview
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


---

## Data Rules (CRITICAL)

**Do NOT invent:**
- Real company names
- Real addresses
- Real phone numbers
- Real reviews or ratings
- Real business hours
- Structured data for real businesses without valid data

**Test data must be:**
- Clearly identified as test/sample data
- Use fictional names like "Test Plumber Co"
- Use placeholder addresses like "123 Test Street"
- Use fake phone numbers like "555-0100"

**SEO Pages:**
- Do NOT generate thousands of SEO pages automatically
- Only create SEO pages when there is useful content and valid data
- Start with test cities only

---

## MVP Features (Phase 1)

### Must Have
- Mobile-first homepage
- English interface
- Search by city or ZIP code
- List of nearby plumbers
- Plumber cards with: name, location, phone, rating (if valid), distance, 24/7 availability
- Clear "Call now" button
- Loading states
- Error states
- Empty state (no results)
- Responsive design
- Basic accessibility
- Technical SEO (metadata, canonical URLs)
- Structured data only for real, verifiable businesses
- Clearly identified test data

### NOT in Phase 1
- Authentication
- Payments
- Booking system
- Advanced business dashboard
- Paid map APIs
- External real data integrations
- Complete review system
- Thousands of auto-generated SEO pages

---

## AI Architecture (Future)

### Gentle-AI Integration (Progressive)

Later phases will implement:

Gentle-AI
├── Skills Registry
├── Skills Router
├── On-demand Skills
├── Engram / Persistent Memory
├── Multi-agent Orchestration
├── Contracts between Agents
└── Human in the Loop


**Requirements:**
- Reusable skills
- On-demand skill loading
- Specialized agents
- Task orchestration
- Structured contracts between agents
- Persistent memory when needed
- Human approval before delicate changes
- Automatic code review, bugs, and security

**Do not add all complexity at once.** Implement progressively.

---

## Models and OpenCode

### Current Setup

- **Ollama** with local models
- **Recommended model**: `qwen3:1.7b` (works correctly with OpenCode tools)
- **Avoid**: `qwen2.5-coder:3b` (returns tool calls in JSON format, doesn't work properly)

**Priority**: OpenCode must be able to use tools correctly, even if the model is slow.

### Future: Google One Plus

May be integrated later for:
- Complex architecture
- Deep code review
- Test generation
- Security analysis
- Large refactorings
- Specialized sub-agents
- Tasks too slow for Ollama

**Important**: Do not assume Google One Plus provides an OpenCode-compatible API automatically. Must check integration, available access, privacy, and limits/costs first.

**Final architecture may be hybrid:**

Simple, private, repetitive tasks
└── Ollama + local model

Complex or high-reasoning tasks
└── Cloud provider (possibly Google)


**Always require human approval before sending code or project information to external providers.**

---

## Connectors

Available connectors:
- **GitHub**: Relevant for this project
- **Google Drive**: Optional, can be used as documentation source
- **Finance**: Not needed initially

---

## Documentation References

Loaded documentation (can be consulted for ideas):
- Apuntes del curso de desarrollo con IA, clase 1
- Apuntes del curso de desarrollo con IA, clase 2
- Apuntes del curso de desarrollo con IA, clase 3
- Guía de prompts para programar más rápido

These documents cover:
- Plan mode
- AGENTS.md
- MCP
- Skills
- Engram
- Multi-agent orchestration
- Human in the Loop
- Testing
- CI/CD
- Code review
- Security
- Release management

---

## Quick Commands

```bash
# Development
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

---

## Contact

For questions or clarifications, refer to this file first, then check relevant skills in `.opencode/skills/`