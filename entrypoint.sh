#!/bin/sh

if [ -z "$SST_RESOURCE_MyDatabase" ]; then
  echo "SST_RESOURCE_MyDatabase environment variable is not set."
  exit 1
fi

DB_HOST=$(echo "$SST_RESOURCE_MyDatabase" | jq -r '.host')
DB_PORT=$(echo "$SST_RESOURCE_MyDatabase" | jq -r '.port')
DB_USER=$(echo "$SST_RESOURCE_MyDatabase" | jq -r '.username')
DB_PASS=$(echo "$SST_RESOURCE_MyDatabase" | jq -r '.password')
DB_NAME=$(echo "$SST_RESOURCE_MyDatabase" | jq -r '.database')

export MYDATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

pnpm run start