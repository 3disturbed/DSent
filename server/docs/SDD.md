# System Design Document (SDD) - DSent Server

## 1. Overview
The DSent server is a modular, extensible Node.js (ES6) backend providing APIs and real‑time capabilities (future) for sentiment-driven data processing (assumed scope). This SDD defines architecture, modules, data flow, technology stack, and non-functional requirements to guide implementation and onboarding.

## 2. Goals & Scope
- Provide RESTful JSON APIs for core domain entities (e.g., Users, Datasets, Analyses, Jobs) – placeholder initial scope.
- Support asynchronous processing pipeline for sentiment analysis (future phase).
- Maintain clean separation of concerns (routing, controllers, services, data, cross-cutting concerns).
- Enable easy evolution toward microservices or serverless components if scaling requires.
- Instrumentation, observability, and security baked in from early stage.

### Out of Scope (Initial Phase)
- Full auth provider integration (OAuth, SSO) – placeholder basic token or API key stub.
- Real-time WebSocket events (planned for Phase 2).
- Multi-tenant data isolation (single-tenant assumed initially).

## 3. Architecture Style
Layered / Hexagonal hybrid:
- Entry: Express HTTP layer (routing + validation)
- Application: Controllers delegate to Services (business logic)
- Domain/Data: Models abstract persistence (initially in-memory or SQLite/PostgreSQL depending on ENV)
- Infrastructure: Loaders (db init, config, logger), external adapters
- Cross-cutting: Middleware (auth, validation, error handling), Utilities

Rationale: Provides clarity + testability + future isolation for domain logic.

## 4. Module Breakdown
| Module | Responsibility | Key Files |
|--------|----------------|----------|
| Config | Centralized environment & runtime configuration | `src/config/index.js` |
| Loaders | Bootstraps subsystems (db, logger, express app) | `src/loaders/*.js` |
| Routes | Define versioned API endpoints and attach middleware | `src/routes/*.js` |
| Controllers | Translate HTTP to service calls & shape responses | `src/controllers/*.js` |
| Services | Orchestrate domain operations, enforce invariants | `src/services/*.js` |
| Models | Data schemas & persistence abstraction | `src/models/*.js` |
| Middleware | Request lifecycle cross-cutting logic | `src/middleware/*.js` |
| Utils | Pure helpers (formatting, id gen, etc.) | `src/utils/*.js` |
| Tests | Unit & integration tests | `test/**/*.test.js` |
| Docs | Architecture & API specs | `docs/*.md` |

## 5. Data Model (Initial Draft)
(Placeholder – refine when real entities defined.)
- User: { id, email, name, createdAt }
- Dataset: { id, ownerId, name, status, createdAt }
- AnalysisJob: { id, datasetId, status(pending|running|complete|failed), createdAt, updatedAt }
- SentimentResult: { id, jobId, score, magnitude, meta }

## 6. API Surface (v1 Draft)
Base path: `/api/v1`
- GET `/health` – liveness + build/meta
- Users: GET `/users/:id`, POST `/users` (stub)
- Datasets: CRUD skeleton (future scaffold)
- Jobs: trigger analysis (future)

### Response Conventions
- JSON envelope: { success: boolean, data?: any, error?: { code, message, details? } }
- Use appropriate HTTP codes (200/201/400/401/404/422/500)

### Error Handling
Central error middleware normalizes errors to consistent shape.

## 7. Configuration & Environments
Environment variables (via `.env` + process.env):
- `PORT` (default 3000)
- `NODE_ENV` (development|test|production)
- `LOG_LEVEL` (info|debug|warn|error)
- `DB_URL` (future)

Config resolution: load defaults -> overlay env -> freeze object.

## 8. Logging & Observability
- Logger: pino (fast structured logging) or console wrapper initially.
- Correlation ID middleware (`x-request-id`) for trace continuity.
- Health endpoint includes timestamp + uptime.

## 9. Security Considerations
- Input validation (celebrate/Joi or custom lightweight) – placeholder simple validation.
- Rate limiting (future: express-rate-limit) if exposed publicly.
- Basic token middleware stub for future auth integration.
- Avoid leaking internal error stacks in production.

## 10. Scalability & Performance
- Stateless horizontal scaling readiness.
- Service layer isolation simplifies extraction to workers (for async jobs) later.
- Pagination for list endpoints (future default limit + cursor/offset).

## 11. Error & Failure Modes
| Scenario | Handling |
|----------|----------|
| DB Unavailable | Startup fails fast; health returns degraded state |
| Invalid Input | 400 with validation details |
| Not Found | 404 with resource context |
| Unhandled Exception | 500 generic message; logged internally |

## 12. Testing Strategy
- Unit: services, utils (pure logic)
- Integration: API endpoints via supertest
- Future: contract tests for external adapters
- Coverage thresholds set later (placeholder: 80% target)

## 13. Build & Run
- Runtime: Node >= 18 (ESM native)
- Entry: `src/index.js`
- Scripts: `dev` (nodemon), `start` (node), `test` (jest or mocha – TBD; placeholder uses node assert)

## 14. Dependencies (Initial Minimal)
- express – HTTP server
- pino – logging (or console fallback)
- dotenv – env loading
- nanoid – id generation
- (dev) nodemon, jest (or mocha + chai), supertest

## 15. Open Questions / TBD
- Final choice of persistence (Postgres vs SQLite for dev simplicity)
- Auth strategy (JWT vs API keys)
- Real-time channel requirements
- Detailed sentiment analysis pipeline components

## 16. Evolution Roadmap (High-Level)
Phase 0: Skeleton (health, config, logging) – CURRENT
Phase 1: User + Dataset CRUD + validation
Phase 2: Async analysis job queue (BullMQ / Redis)
Phase 3: WebSocket or SSE for job status
Phase 4: Observability enhancements (metrics, tracing)

## 17. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Scope creep | Maintain phased roadmap |
| Premature optimization | Defer scaling features until metrics demand |
| Security gaps early | Add baseline validation + token stub now |
| Poor test coverage later | Establish structure & CI gate early |

## 18. Glossary
- SDD: System Design Document
- API: Application Programming Interface
- CRUD: Create Read Update Delete
- SLA: Service Level Agreement

---
Initial SDD draft complete; iterate as domain clarifies.
