#!/usr/bin/env bash
# Regenerate the OpenAPI spec and the generated API clients.
# Prerequisites: a Python venv at backend/.venv, java, and npx available.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"
PY="$BACKEND/.venv/bin/python"

echo ">> Exporting OpenAPI spec"
(cd "$BACKEND" && FIREBASE_SERVICE_ACCOUNT_JSON="" "$PY" -c \
  "from app.main import app; import json; json.dump(app.openapi(), open('contracts/openapi.json','w'), indent=2)")

echo ">> Generating typescript-axios client -> clients/typescript"
npx --yes @openapitools/openapi-generator-cli@latest generate \
  -i "$BACKEND/contracts/openapi.json" \
  -g typescript-axios \
  -o "$ROOT/clients/typescript" \
  --additional-properties=npmName=todo-api-client,supportsES6=true

echo ">> Generating python client -> backend/tests-integration"
npx --yes @openapitools/openapi-generator-cli@latest generate \
  -i "$BACKEND/contracts/openapi.json" \
  -g python \
  -o "$BACKEND/tests-integration" \
  --additional-properties=packageName=todo_api_client

echo "Done."
