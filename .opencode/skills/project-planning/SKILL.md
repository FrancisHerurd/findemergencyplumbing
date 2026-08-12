# Skill: Project Planning

## Purpose

Analyze project requirements, design architecture, propose implementation plans, and identify risks before coding.

## When to Use

- Starting a new feature or task
- Analyzing complex requirements
- Designing system architecture
- Planning database schema changes
- Before major refactoring

## Workflow

1. **Read context**: AGENTS.md, relevant docs, existing code
2. **Understand requirements**: What problem are we solving?
3. **Analyze constraints**: Technical rules, data rules, MVP scope
4. **Propose plan**: Step-by-step implementation approach
5. **List files**: Which files will be created or modified
6. **List dependencies**: New packages needed and why
7. **Identify risks**: Potential issues, edge cases, technical debt
8. **Wait for approval**: Before implementing changes

## Output Format

```markdown
## Plan

### Overview
[Brief description of what we're building]

### Files to Create/Modify
- `path/to/file.ts` - [purpose]

### Dependencies
- `package-name` - [reason]

### Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Risks
- [Risk 1]
- [Risk 2]

### Pending Decisions
- [Decision 1]
```

## Examples

- Planning a new Next.js page
- Designing database schema
- Planning SEO page generation strategy
- Architecting multi-agent system

## Related Skills

- `frontend-nextjs`
- `database-drizzle`
- `seo-local`