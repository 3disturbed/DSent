# DSent Server

Node.js (ESM) backend skeleton.

## Quick Start
1. Copy `.env.example` to `.env` and adjust if needed.
2. Install dependencies:
```bash
npm install
```
3. Run in dev mode (Node 18+):
```bash
npm run dev
```
4. Health check:
```
GET http://localhost:3995/api/v1/health
```

## Scripts
- `npm run start` - Run production mode
- `npm run dev` - Development with native watch
- `npm test` - Placeholder (Node test runner)

## Structure
```
server/
  src/
    config/        # Environment & runtime config
    loaders/       # App + subsystem initialization
    middleware/    # Cross-cutting request handlers
    routes/        # Express routers (versioned)
    controllers/   # HTTP -> service coordination (future)
    services/      # Business logic (future)
    models/        # Data layer (future)
    utils/         # Helpers (future)
  test/            # Tests
  docs/            # SDD & API docs
```

## Next Steps
- Implement User + Dataset routes
- Add validation middleware
- Add persistence layer choice (SQLite/Postgres)
- Add auth/token strategy

Refer to `docs/SDD.md` for architectural details.
