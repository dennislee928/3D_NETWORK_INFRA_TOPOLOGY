# 3D Network Infra Topology — Enhancement Roadmap

> A comprehensive plan to strengthen this project across **Functions**, **Efficiency**, **Security**, and **Commercial Value**.

---

## 1. Functions (Feature Improvements)

| Priority | Task | Status | Notes |
|----------|------|--------|-------|
| P0 | Strip leftover agent debug code from all files | ✅ Done | Removed from `useTopologyData.ts`, `api.ts`, `main.rs`, `start-mininet.sh` |
| P0 | Real-time WebSocket push for topology updates | 🚧 In Progress | WebSocket endpoint in Rust backend, WS client hook in frontend |
| P1 | Node search/filter in 3D scene | 🚧 In Progress | Search bar + filter logic in ServiceGraph |
| P1 | Click-to-detail drill-down with telemetry | 🚧 In Progress | Enriched ServiceDetailsPanel |
| P2 | Time-travel / historical topology playback | ⏳ Planned | Replay state diffs on a timeline |
| P2 | Multi-user collaboration (shared views) | ⏳ Planned | WebSocket broadcast of view state |
| P2 | Alert correlation overlay on topology | 🚧 In Progress | Highlight affected nodes on incident |
| P3 | Export topology as image/PDF | 🚧 In Progress | Canvas screenshot + jsPDF |

---

## 2. Efficiency (Performance & Code Quality)

| Priority | Task | Status | Notes |
|----------|------|--------|-------|
| P0 | Add ESLint + Prettier + Husky pre-commit hooks | ✅ Done | `.eslintrc.cjs`, `.prettierrc`, `.husky/pre-commit` |
| P0 | Write Rust backend tests (unit + integration) | 🚧 In Progress | `tests/` module in backend |
| P0 | Modularize `main.rs` into separate modules | 🚧 In Progress | `routes/`, `sdn/`, `models/`, `mock/` modules |
| P1 | Add CI pipeline (GitHub Actions) | ✅ Done | `.github/workflows/ci.yml` |
| P1 | Three.js performance optimization | 🚧 In Progress | Instanced meshes, LOD, frustum culling |
| P1 | Auto-layout algorithm improvements | 🚧 In Progress | Force-directed layout as fallback |
| P2 | Virtual scrolling / canvas LOD for 1000+ nodes | ⏳ Planned | Level-of-detail rendering |
| P2 | Backend response caching (in-memory) | 🚧 In Progress | TTL-based cache in Rust |
| P2 | Code splitting / lazy loading | ✅ Done | React.lazy for dashboard sections |
| P3 | CSS modules or Tailwind migration | ⏳ Planned | Consider for future |

---

## 3. Security (Hardening)

| Priority | Task | Status | Notes |
|----------|------|--------|-------|
| P0 | Remove hardcoded credentials → env vars | ✅ Done | ODL creds moved to `ODL_USERNAME`/`ODL_PASSWORD` env vars |
| P0 | Replace wide-open CORS with origin whitelist | ✅ Done | Reads `ALLOWED_ORIGINS` env var |
| P0 | Move hardcoded API URL to env var | ✅ Done | `VITE_SDN_ADAPTER_URL` in `.env.example` |
| P1 | Add JWT authentication middleware | 🚧 In Progress | Auth layer on `/api/*` routes |
| P1 | Rate limiting (tower middleware) | 🚧 In Progress | Token-bucket per IP |
| P1 | Input validation on all API endpoints | 🚧 In Progress | Serde validation + custom guards |
| P1 | HTTPS enforcement in nginx | ✅ Done | HTTP→HTTPS redirect in nginx.conf |
| P2 | Add Dependabot config | ✅ Done | `.github/dependabot.yml` |
| P2 | Add `.env.example` | ✅ Done | At project root |
| P2 | Create SECURITY.md | ✅ Done | In root + doc/ |
| P3 | Content-Security-Policy headers | 🚧 In Progress | CSP in nginx + Rust response headers |
| P3 | Sanitize node labels (XSS prevention) | 🚧 In Progress | DOMPurify on frontend |

---

## 4. Commercial Value (Market Readiness)

| Priority | Task | Status | Notes |
|----------|------|--------|-------|
| P0 | English README + product description | ✅ Done | Bilingual README |
| P0 | OpenAPI/Swagger documentation | ✅ Done | `doc/api-spec.yaml` + Swagger UI route |
| P1 | SSO / RBAC integration | 🚧 In Progress | OAuth2 with configurable provider |
| P1 | Multi-tenant architecture (orgs) | ⏳ Planned | Tenant isolation in data model |
| P1 | Audit logging | 🚧 In Progress | Structured audit events |
| P1 | Helm chart for Kubernetes deployment | 🚧 In Progress | `deploy/helm/` directory |
| P2 | Usage analytics (opt-in) | ⏳ Planned | Telemetry with user consent |
| P2 | Demo mode with realistic pre-loaded data | 🚧 In Progress | Seeded demo topology |
| P2 | Integration marketplace scaffolding | ⏳ Planned | Webhook/plugin system |
| P2 | Prometheus `/metrics` endpoint | 🚧 In Progress | Rust + frontend metrics |
| P3 | Billing integration (Stripe/LemonSqueezy) | ⏳ Planned | Monetization |
| P3 | White-label / custom branding | ⏳ Planned | Theme customization API |

---

## Progress Summary

```
Functions:    ████████░░░░░░░░░░  40%
Efficiency:   ████████░░░░░░░░░░  42%
Security:     ██████████░░░░░░░░  48%
Commercial:   ██████░░░░░░░░░░░░  32%
Overall:      ████████░░░░░░░░░░  40%
```

---

*Last updated: May 2026*
