# Convenience commands for the sample todo app.
PY := python3
VENV := backend/.venv/bin

.PHONY: setup run test test-integration db-up db-down generate-clients

setup: ## Create venv and install backend deps
	bash scripts/setup.sh

db-up: ## Start the Postgres container
	docker compose up -d db

db-down: ## Stop the Postgres container
	docker compose down

run: ## Run the API locally (needs venv active + db running)
	$(VENV)/uvicorn app.main:app --reload --app-dir backend

test: ## Run unit tests (offline, mocked Firebase)
	$(VENV)/pytest backend/tests -v

test-integration: ## Run integration tests (needs db + real Firebase token)
	$(VENV)/pytest backend/tests-integration -v

generate-clients: ## Regenerate openapi-clients (TS axios + Python)
	bash scripts/generate-clients.sh
