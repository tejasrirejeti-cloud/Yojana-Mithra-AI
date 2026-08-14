# Production Security Policy & Audit Controls

## Security Controls Implemented

1. **Helmet HTTP Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and CSP rules.
2. **API Rate Limiting**: `express-rate-limit` caps API requests at 100 requests per 15-minute window per IP.
3. **CORS Restrictions**: Configured for strict origin validation.
4. **Input Sanitization & Injection Defense**: No SQL or shell command execution; all inputs validated via Zod schemas.
5. **Prompt Injection Prevention**: System prompts explicitly delineate instruction boundaries and reject jailbreak attempts.
6. **Zero Client Secrets**: `GEMINI_API_KEY` is maintained exclusively on server side (`server.ts`).

## Vulnerability Reporting

If you discover a security vulnerability, please report it to `security@yojanamithra.gov.in`.
