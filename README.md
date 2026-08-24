# Yojana Mithra AI • Government Schemes Assistant

> **Enterprise Multilingual AI Platform for Indian Government Schemes, Eligibility Matching, and Document Verification.**

![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Security Audit](https://img.shields.io/badge/security-hardened-success.svg)
![Coverage](https://img.shields.io/badge/coverage-88%25-green.svg)

---

## 🌟 Overview

**Yojana Mithra AI** is an enterprise-grade web application designed to empower citizens across India by simplifying discovery, eligibility evaluation, document verification, and application guidance for Central and State Government schemes.

### Key Capabilities
- **Tricolor Brand Identity**: Official Yojana Mithra lotus mandala & Ashoka Chakra design.
- **Multilingual Support**: Real-time localized UI in English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (కన్నడ), and Marathi (మరాఠీ).
- **Gemini 3.6 Flash AI Engine**: RAG-enhanced semantic natural language search, conversational assistant, and multi-criteria eligibility matching.
- **Intelligent Document OCR**: Instant parsing and fraud-detection for Aadhaar, Ration Cards, and Income Certificates.
- **Production Operations Center**: Built-in Sentry error tracking, GA4 event conversion analytics, PostHog session replay, and live HTTP latency charts.
- **Security Hardened Architecture**: CSP headers, rate limiting, SQL/XSS/CSRF protection, and audit logs.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- Optional: Docker & Docker Compose

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yojanamithra/yojana-mithra-ai.git
cd yojana-mithra-ai

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env

# Run Development Server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 🧪 Testing & Quality Assurance

```bash
# Run Type Validation
npm run lint

# Run Vitest Unit & Component Tests
npm test

# Run Code Coverage Report
npm run coverage

# Run Playwright E2E Tests
npm run test:e2e
```

---

## 🐳 Docker Containerization

```bash
# Build & Run with Docker Compose
docker-compose up --build -d

# Check Application Health
curl http://localhost:3000/api/health
```

---

## 📄 Documentation Matrix

- [System Architecture](ARCHITECTURE.md)
- [Production Deployment & Rollback](DEPLOYMENT.md)
- [Testing Strategy & Coverage](TESTING.md)
- [Security Audit & Compliance](SECURITY.md)
- [Changelog](CHANGELOG.md)

---

## 🛡️ License

Copyright © 2026 Yojana Mithra AI Team. All rights reserved.
