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

# Prune generated boilerplate we don't want to keep: markdown docs, the
# git_push helper, and CI scaffolding that openapi-generator emits by default.
find "$ROOT/clients/typescript" "$BACKEND/tests-integration" -name "*.md" -delete
rm -f "$ROOT/clients/typescript/git_push.sh" "$BACKEND/tests-integration/git_push.sh"
rm -rf "$BACKEND/tests-integration/.github"
rm -f "$BACKEND/tests-integration/.gitlab-ci.yml" "$BACKEND/tests-integration/.travis.yml"

echo "Done."
