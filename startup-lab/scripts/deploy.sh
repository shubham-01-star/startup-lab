#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

FORCE_SEED=false
SEED_MARKER=".deploy-state/seeded-at.txt"

if [[ "${1:-}" == "--force-seed" ]]; then
  FORCE_SEED=true
elif [[ $# -gt 0 ]]; then
  echo "Usage: bash scripts/deploy.sh [--force-seed]"
  exit 1
fi

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require_command docker

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  echo "Docker Compose is required but was not found."
  exit 1
fi

ENV_FILE=""

if [[ -f .env ]]; then
  ENV_FILE=".env"
elif [[ -f .env.local ]]; then
  ENV_FILE=".env.local"
else
  echo "Missing .env file. Copy .env.vps.example to .env and fill in production values first."
  exit 1
fi

db_host="$(grep -E '^DB_HOST=' "$ENV_FILE" | tail -n 1 | cut -d '=' -f 2- | tr -d '"' | tr -d "'" | xargs || true)"

if [[ "$db_host" == "localhost" || "$db_host" == "127.0.0.1" ]]; then
  echo "Inside Docker, localhost points to the app container itself."
  echo "Use DB_HOST=db for the bundled MySQL container, or DB_HOST=host.docker.internal for an existing MySQL on the VPS host."
  exit 1
fi

compose() {
  "${COMPOSE_CMD[@]}" --env-file "$ENV_FILE" "$@"
}

on_error() {
  local exit_code=$?
  echo
  echo "Deployment failed. Recent logs:"
  compose logs --tail=80 app db || true
  exit "$exit_code"
}

trap on_error ERR

wait_for_app() {
  local attempts=20

  for ((attempt=1; attempt<=attempts; attempt++)); do
    if compose exec -T app true >/dev/null 2>&1; then
      return 0
    fi

    echo "Waiting for app container to become ready (${attempt}/${attempts})..."
    sleep 2
  done

  echo "App container did not become ready in time."
  return 1
}

echo "Using environment file: $ENV_FILE"
if [[ "$db_host" == "db" ]]; then
  echo "Bundled MySQL mode detected."
  echo "Building and starting app + db containers..."
  compose up -d --build
else
  echo "External MySQL mode detected (DB_HOST=$db_host)."
  echo "Building and starting only the app container..."
  compose up -d --build --no-deps app
fi

wait_for_app

echo "Syncing database schema..."
compose exec -T app npm run sync:schema

if [[ "$FORCE_SEED" == "true" || ! -f "$SEED_MARKER" ]]; then
  echo "Running seed data..."
  compose exec -T app npm run seed
  mkdir -p "$(dirname "$SEED_MARKER")"
  date -u +"%Y-%m-%dT%H:%M:%SZ" > "$SEED_MARKER"
else
  echo "Seed already ran once. Skipping. Use --force-seed to run it again."
fi

echo
echo "Deployment completed successfully."
compose ps
