# Frontend System Design Document (SDD) - DSent Client ("Discord-Style" App)

## 1. Overview
A single-page web application (SPA) delivering a real-time, multi-workspace ("servers/guilds") collaborative messaging UI similar in interaction patterns to Discord: left workspace navigation, channel list, message panel, member/presence panel, global command palette, theming, notifications, and extensibility hooks. The frontend will consume existing and forthcoming backend APIs and WebSocket/event streams. Initial implementation will stub or simulate unimplemented backend features to enable progressive enhancement.

## 2. Goals & Scope (Initial Phases)
- Rich messaging interface: channels, threads (later), message composer (markdown-lite), reactions (later phase)
- Workspace ("Server") + Channels navigation model
- Presence indicators (stub -> real-time later)
- User auth session handling (Phase 1: token stub; Phase 2: full auth)
- Theme system (light/dark + semantic tokens)
- Accessibility-first: keyboard navigation & ARIA landmarks
- Performance budgets for fast interaction (<100ms local UI actions; TTI < 3s on 1st load w/ cold cache)

### Out of Scope (Initial)
- Full voice/video stack
- Advanced moderation tooling
- Bot marketplace/plugin system
- Full permissions matrix (simplified role gating initially)

## 3. Non-Functional Requirements
| Category | Target |
|----------|--------|
| Performance | Core route TTI < 3s; subsequent nav < 800ms |
| Bundle Size | Initial JS < 250KB gzip (Phase 0), < 400KB with rich features |
| Accessibility | WCAG 2.1 AA baseline |
| Browser Support | Evergreen (Chromium, Firefox, Safari >= last 2 versions) |
| Security | Sanitized user content; CSP baseline; no inline scripts |

## 4. Architectural Style
SPA with component-driven architecture (React-style) + client-side routing. Real-time updates via WebSocket (future) abstracted behind an event bus service. Clean separation of:
- UI Components (presentational)
- Feature Modules (state + side effects + domain logic)
- Services (API, Realtime, Storage)
- Core (design tokens, theming, utilities)

Adopt a layered modular file structure to enable scaling without monolithic state.

## 5. Technology Stack (Proposed Defaults - Requires Confirmation)
| Concern | Option A (Default Proposal) | Alternatives |
|---------|-----------------------------|-------------|
| Framework | React + Vite (ESM) | Next.js (if SSR/SEO needed later) |
| Language | TypeScript (safer) | Plain ES6 JS (if mandated) |
| State | Zustand (simple + scalable) | Redux Toolkit / Recoil / Context + Hooks |
| Styling | Tailwind CSS + semantic layer | CSS Modules / Vanilla Extract / Styled Components |
| Theming | CSS variables (design tokens) | Chakra/MUI theming engine |
| Realtime | socket.io client (future) | native WebSocket abstraction |
| Routing | React Router v6 | TanStack Router |
| Testing | Vitest + Testing Library + Playwright (E2E) | Jest + Cypress |
| Building | Vite | Webpack |

## 6. High-Level Module Breakdown
| Module | Responsibility |
|--------|---------------|
| core/ | App shell, providers, error boundaries, theme loader |
| design/ | Tokens (spacing, color, typography), mode switching |
| features/auth | Session state, login, token refresh |
| features/workspaces | Workspace list, switching, metadata |
| features/channels | Channel list, creation, selection |
| features/messages | Message list, virtualization, composer, reactions (later) |
| features/presence | Online user indicators (stub -> real) |
| features/search | Global command palette & search (later) |
| services/api | REST client, interceptors, caching helpers |
| services/realtime | Connection manager, event dispatch |
| services/storage | Local/session storage abstraction |
| hooks/ | Cross-cutting reusable hooks |
| components/ui | Primitive building blocks (Button, Input, Panel) |
| components/layout | Structural components (Sidebar, SplitPane) |
| pages/ | Route-level aggregations |
| utils/ | Pure functions (formatting, markdown, time) |

## 7. Data Model (Client View Models)
(Note: Align with backend canonical schema later.)
- User: { id, displayName, avatarUrl?, presence: 'online'|'idle'|'dnd'|'offline' }
- Workspace: { id, name, icon?, roles[], channels[] }
- Channel: { id, workspaceId, name, type: 'text'|'system', unreadCount, lastMessageAt }
- Message: { id, channelId, authorId, content, createdAt, editedAt?, reactions?[] }
- Session: { userId, token, expiresAt }

## 8. UI Layout Regions
1. Workspace Rail (icons)
2. Channel Sidebar (workspace header + channel tree)
3. Main Message Panel (virtualized list + composer)
4. Member/Context Panel (toggle / responsive overlay)
5. Global Overlay Layers (modals, command palette)
6. Toast/Notification stack

## 9. Navigation & Routing
- `/` -> Redirect to last active workspace+channel
- `/w/:workspaceId/c/:channelId`
- `/settings/*` (lazy chunk)
- Fallback 404 + recovery link

## 10. State Management Strategy
- Thin global stores per feature (Zustand slices) avoiding monolith
- Derived selectors for performant memoization
- Local component state for ephemeral UI (inputs, toggles)
- Optimistic updates for sending messages
- React Query (optional addition later) for server cache coherence (phase decision)

## 11. Real-Time Strategy (Phased)
Phase 0: Polling mock / static fixtures
Phase 1: WebSocket connection (auto reconnect + exponential backoff)
Phase 2: Presence diff & partial updates
Phase 3: Compression & batching optimizations

## 12. Theming & Design Tokens
- Base tokens: color roles (bg-primary, bg-surface, text-primary, accent, border, danger, warning, success)
- Mode tokens: light/dark override
- Scale tokens: spacing (4px grid), typography ramp, radius (2,4,8)
- Implement with `:root` + `.theme-dark` variable scopes

## 13. Accessibility Considerations
- Skip-to-content link
- Keyboard focus visibility & roving tabindex for channel list
- ARIA roles for lists, messages (list / listitem)
- Live region for new message announcements (optional toggle)

## 14. Error Handling & Resilience
- Global Error Boundary (UI fallback + reload action)
- API layer normalizes error shape -> unified toast & inline error pattern
- Realtime layer emits connection status events consumed by status indicator

## 15. Performance Practices
- Virtualized message list (react-virtual or custom)
- Code-splitting: settings, search palette, heavy markdown parser
- Prefetch last active channel data post-auth
- Debounce presence updates
- Avoid unnecessary re-renders via store selectors

## 16. Security (Client-Side)
- Sanitize potentially unsafe markdown/HTML (DOMPurify-like) (Phase 1)
- Content Security Policy (no inline script) (deployment config)
- Avoid storing sensitive tokens beyond memory + secure cookie (decision required)

## 17. Testing Strategy
| Layer | Tool | Focus |
|-------|------|-------|
| Unit | Vitest | Pure utils, hooks |
| Component | Testing Library | Interaction semantics, a11y roles |
| Integration | Testing Library | Feature flows (send message) |
| E2E | Playwright | Critical journeys (login -> send -> switch channel) |
| Performance | Lighthouse (script) | Bundle & TTI budget |

## 18. Build & Deployment
- Dev server: Vite with fast HMR
- Production build: hashed assets in `dist/`
- Express static serve: mount `dist` at `/'` with fallback to `index.html`
- Cache: long-term caching (immutable) for assets; HTML no-cache

## 19. Progressive Enhancement / Offline (Later)
- Service worker for basic offline view of cached channels
- Background sync for queued messages (Phase 4+)

## 20. Phased Roadmap
| Phase | Objectives |
|-------|------------|
| 0 | Skeleton app shell, routing, theming baseline, static mock data |
| 1 | Auth stub + real API integration for workspaces/channels/messages (CRUD basic) |
| 2 | WebSocket real-time (messages + presence), optimistic sends |
| 3 | Permissions, roles light, reactions, message edit/delete |
| 4 | Command palette, global search indexing |
| 5 | Performance hardening, accessibility audits, offline caching |

## 21. Open Questions (Require User Decision)
1. Language: TypeScript or Plain ES6? (Recommendation: TS for long-term safety)
2. Styling: Tailwind + tokens vs alternative?
3. State: Proceed with Zustand + (optional) React Query integration?
4. Markdown support scope (basic vs extended features)?
5. Auth persistence: token in memory + refresh endpoint or localStorage fallback initially?
6. Do we need multi-tab sync (BroadcastChannel) early?
7. Priority features after Phase 0: Presence or Reactions?

## 22. Initial File Structure (Phase 0 Proposal)
```
client/
  index.html
  src/
    main.jsx
    app.jsx
    core/
      providers/
      routing/
    design/
      theme.css
      tokens.css
    components/ui/
    components/layout/
    features/
      auth/
      workspaces/
      channels/
      messages/
    services/
      api/
      realtime/
      storage/
    hooks/
    utils/
  public/
    favicon.svg
```

## 23. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Scope explosion emulating full Discord | Strict phased roadmap & acceptance gates |
| Performance regressions | Budgets + CI checks (later) |
| Unimplemented backend endpoints | Mock service layer + toggle flag |
| Tight coupling features -> global state | Modular feature slices |

## 24. Acceptance for Phase 0 Completion
- Build loads at `/` with shell + mock workspace/channel/message view
- Theme switch works
- Navigation between 2–3 mock channels updates message panel
- No console errors; Lighthouse basic performance > 80 mobile

---
End of Frontend SDD Draft (v0). Awaiting decisions to instantiate project.
