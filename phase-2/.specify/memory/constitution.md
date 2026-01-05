# Project Constitution: Hackathon II: The Evolution of Todo - Phase II

<!-- Sync Impact Report:
Version change: N/A → 2.0.0
List of modified principles: N/A (initial creation for Phase II)
Added sections: All sections (initial constitution for Phase II)
Removed sections: N/A
Templates requiring updates: N/A (initial creation)
Follow-up TODOs: None
-->

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All implementation must be generated through Claude Code based on specifications; Specifications must be precise, testable, and complete before implementation generation; All development follows SpecKit Plus workflow (constitution → spec → plan → tasks → implement).
<!-- Rationale: Ensures deterministic, specification-based development with full traceability -->

### II. Full-Stack Web Application Architecture
Frontend and backend are separate services communicating via REST API with JWT authentication; Frontend uses Next.js 16+ App Router with TypeScript; Backend uses FastAPI with SQLModel; Database uses Neon Serverless PostgreSQL.
<!-- Rationale: Modern, scalable architecture with clear separation of concerns -->

### III. User Authentication and Security
All API endpoints require JWT authentication; User data is isolated per authenticated user; Input validation and sanitization on both frontend and backend; Modern password hashing (Argon2, bcrypt, scrypt) with unique salts.
<!-- Rationale: Ensures secure, multi-user application with proper data isolation -->

### IV. Component-Based Frontend Architecture
Frontend uses Next.js App Router with Server and Client Components; All components use TypeScript with explicit prop interfaces; Data rendering uses maps with proper keys; Minimalist techy design aesthetic with Tailwind CSS.
<!-- Rationale: Maintainable, type-safe frontend with consistent design patterns -->

### V. API-First Backend Design
Backend provides RESTful API with clear endpoint structure; All endpoints follow OpenAPI standards; Request/response validation using Pydantic; Comprehensive error handling with proper HTTP status codes.
<!-- Rationale: Clean API design enables frontend flexibility and future integrations -->

### VI. Database Schema and Migrations
Database schema designed with proper relationships, constraints, and indexes; All schema changes use versioned migrations; Data integrity enforced at database level; Performance optimized with appropriate indexes.
<!-- Rationale: Reliable data storage with proper integrity and performance -->

### VII. Form Validation and Security
Client-side validation prevents invalid API calls; Input sanitization prevents XSS and injection attacks; Security checks before data reaches backend; Validation reduces API costs and improves UX.
<!-- Rationale: Security-first approach with cost optimization -->

## Additional Constraints

**Technology Stack**: 
- Frontend: Next.js 16+, React 18+, TypeScript 5+, Tailwind CSS 3+
- Backend: Python 3.13+, FastAPI, SQLModel, asyncpg
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- Package Management: npm/uv, Spec-Kit Plus, Claude Code

**Development Standards**:
- Follow Next.js App Router best practices
- Use TypeScript throughout with proper type definitions
- Implement client-side form validation
- Follow FastAPI best practices for API design
- Use SQLModel for database operations
- Maintain specification history in `/specs-history`
- Create PHR (Prompt History Records) for all work

## Development Workflow

**SpecKit Plus Workflow**: 
1. Constitution → Establish/update principles
2. Specification → Create feature specs with user stories
3. Planning → Create technical plans with Context7 research
4. Tasks → Break into testable, dependency-ordered tasks
5. Implementation → Execute tasks following skill patterns
6. Analysis → Validate against spec and requirements

All specifications must be stored with `@specs/...` path references. Each specification iteration must be dated/timestamped for traceability. PHR records must be created for all work phases.

## Governance

This constitution supersedes all other development practices for Phase II; All implementation must comply with constitutional principles; Amendments require explicit documentation and approval before implementation; All development must follow the spec-driven workflow outlined in this constitution.

**Version**: 2.0.0 | **Ratified**: 2025-01-05 | **Last Amended**: 2025-01-05

