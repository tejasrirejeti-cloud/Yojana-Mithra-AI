# Changelog - Yojana Mithra AI

All notable changes to the Yojana Mithra AI platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-08-05

### Added
- **Official Brand Logo Integration**: Added the high-resolution tricolor lotus mandala with Ashoka Chakra and AI • GOVERNMENT SCHEMES subtext matching official branding.
- **Production Telemetry & Operations Center**: Real-time monitoring dashboard supporting Sentry crash reporting, Google Analytics (GA4) event tracking, PostHog session replay, and P95/P50 API latency graphs.
- **Enterprise Test Infrastructure**: Vitest unit & integration test suites, React Testing Library component tests, and Playwright cross-browser End-to-End tests.
- **CI/CD Pipeline**: Automated GitHub Actions workflow covering type checking, linting, unit testing, E2E testing, and multi-stage Docker image packaging.
- **Production Containerization**: Multi-stage `Dockerfile` with non-root runtime security, `docker-compose.yml`, and zero-downtime deployment/rollback scripts.
- **Documentation Suite**: Added `README.md`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `TESTING.md`, and `SECURITY.md`.

### Security
- **Hardened Middleware**: Production rate limiting, CSP security headers, helmet protection, and strict input sanitization.
