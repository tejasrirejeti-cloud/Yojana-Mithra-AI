#!/usr/bin/env bash
set -eo pipefail

echo "[Env Check] Validating runtime environment variables..."

REQUIRED_VARS=("PORT")
MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    MISSING_VARS+=("$VAR")
  fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo "[Env Check] WARNING: Missing optional environment variables: ${MISSING_VARS[*]}"
else
  echo "[Env Check] All critical environment variables present."
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "[Env Check] GEMINI_API_KEY is not set; Gemini AI will operate in fallback mode."
fi
