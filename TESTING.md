# Enterprise Testing & Code Quality Strategy

## Overview

Yojana Mithra AI employs a 4-tier testing hierarchy to guarantee 99.9% reliability across citizen workflows.

```
      /\
     /  \     End-to-End Tests (Playwright)
    /----\    Integration Tests (Server Express API)
   /------\   Component Tests (React Testing Library)
  /--------\  Unit Tests (Eligibility Engine / Logic)
```

## Testing Commands

- **Unit & Integration Suite**: `npm test`
- **Watch Mode**: `npm run test:watch`
- **Code Coverage**: `npm run coverage`
- **End-to-End Playwright**: `npm run test:e2e`

## Minimum Coverage Standards
- Line Coverage: **85%**
- Function Coverage: **85%**
- Branch Coverage: **80%**
