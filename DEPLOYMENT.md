# Production Deployment & Rollback Strategy

## 1. Cloud Run Container Deployment

The application compiles into a single CommonJS server bundle (`dist/server.cjs`) and static assets (`dist/`).

### Deployment Steps:

```bash
# 1. Validate environment configuration
./scripts/validate-env.sh

# 2. Build production Docker image
docker build -t gcr.io/yojana-mithra-ai/app:1.4.0 .

# 3. Push to Google Container Registry
docker push gcr.io/yojana-mithra-ai/app:1.4.0

# 4. Deploy to Cloud Run
gcloud run deploy yojanamithra-prod \
  --image gcr.io/yojana-mithra-ai/app:1.4.0 \
  --platform managed \
  --region asia-south1 \
  --port 3000 \
  --allow-unauthenticated
```

## 2. Zero-Downtime Rollback Procedure

In the event of an operational anomaly:

```bash
# Execute automated rollback script
./scripts/rollback.sh
```

The script will instantly revert container tags to `.last_stable_release` without service disruption.

## 3. Environment Variable Matrix

| Variable | Scope | Description | Required | Default |
|----------|-------|-------------|----------|---------|
| `PORT` | Server | HTTP listen port | Yes | `3000` |
| `NODE_ENV` | Server | Environment mode | Yes | `production` |
| `GEMINI_API_KEY` | Server-only | Google AI Studio Key | Yes | N/A |
