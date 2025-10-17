#!/usr/bin/env bash
# Helper: build and publish to Cloudflare Pages (local)
set -euo pipefail

if [ -z "${1-}" ]; then
  echo "Usage: $0 <CF_PAGES_PROJECT> [DATABASE_ID]"
  echo "Example: $0 gcbf-church-portal <DATABASE_ID>"
  exit 2
fi

PROJECT="$1"
DATABASE_ID="${2-}"

echo "Building..."
npm run build

echo "Publishing to Pages project: $PROJECT"
wrangler pages publish dist --project-name "$PROJECT"

if [ -n "$DATABASE_ID" ]; then
  echo "Importing schema to D1 database: $DATABASE_ID"
  wrangler d1 execute "$DATABASE_ID" --file=./schema.sql
fi

echo "Done."
