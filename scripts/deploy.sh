#!/usr/bin/env bash
set -eo pipefail

echo "========================================="
echo " Yojana Mithra AI - Production Deployer "
echo "========================================="

# 1. Environment Variable Check
./scripts/validate-env.sh

# 2. Execute Test Suites
echo "Running Vitest Unit & Integration Suites..."
npm test

echo "Building Application Bundles..."
npm run build

echo "Executing Typecheck & Linter..."
npm run lint

# 3. Save backup tag for zero-downtime rollback capability
CURRENT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "v1.4.0")
echo "$CURRENT_COMMIT" > .last_stable_release

echo "Deployment checks passed cleanly! App is ready for Cloud Run / Container deployment."
