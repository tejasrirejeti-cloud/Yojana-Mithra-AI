# System Architecture & Technical Specifications

## 1. High-Level Architecture Diagram

```
[ Citizen Browser / Mobile UI ]
              │
              ▼
    ┌───────────────────┐
    │ Express Nginx API │ (Port 3000 / Rate Limited / CSP / CORS)
    └─────────┬─────────┘
              │
   ┌──────────┴────────────────────────┬─────────────────────────┐
   ▼                                   ▼                         ▼
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│  Gemini 3.6 Flash    │   │ Firebase Firestore   │   │ Sentry & Telemetry   │
│  AI RAG & Matching   │   │ Schemes & User DB    │   │ Operational Engine   │
└──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

## 2. Core Subsystems

### A. Frontend Layer (React 19 + Vite + Tailwind CSS)
- **State Management**: Reactive React state coupled with localized context stores.
- **Routing**: Single Page Application dynamic rendering with smooth route transitions powered by Motion.
- **UI Architecture**: Modular visual components, zero AI Slop design language, responsive mobile & desktop viewports.

### B. Backend API Layer (Express.js + TypeScript Node 20)
- **Port Binding**: Binds strictly to `0.0.0.0:3000`.
- **API Routes**:
  - `GET /api/schemes`: Catalog search with state and category filters.
  - `POST /api/eligibility/check`: Real-time score calculation and requirement verification.
  - `POST /api/chat`: Server-side proxied Gemini 3.6 Flash AI assistant.
  - `POST /api/ocr/scan`: Intelligent document extraction pipeline.
  - `GET /api/monitoring/status`: Real-time telemetry, memory usage, and health checks.

### C. Data Persistence Layer
- **Primary DB**: Firebase Firestore (`ai-studio-yojanamitraai-*`).
- **Security Rules**: Schema-enforced collection rules preventing cross-tenant data leakage.

### D. Operations & Monitoring Layer
- **Error Tracking**: Sentry SDK wrapper with breadcrumbs and unhandled exception logging.
- **Metrics**: Real-time response latency (P50/P95), active requests, memory RSS tracking, and user conversion funnel analytics.
