#!/usr/bin/env bash
# Set up a Python virtual environment for the backend and install dependencies.
# Usage: ./scripts/setup.sh   (run from the repo root or backend/)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"

python3 -m venv "$BACKEND/.venv"
# shellcheck disable=SC1091
source "$BACKEND/.venv/bin/activate"
pip install --upgrade pip
pip install -r "$BACKEND/requirements.txt"

echo
echo "Done. Activate the environment with:"
echo "  source $BACKEND/.venv/bin/activate"
