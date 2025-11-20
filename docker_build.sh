#!/bin/bash

set -e

# Load .env file
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# Verify required variables exist
: "${NEXT_PUBLIC_URL:?Missing NEXT_PUBLIC_URL}"
: "${NEXT_PUBLIC_BACKEND_URL:?Missing NEXT_PUBLIC_BACKEND_URL}"
: "${NODE_ENV:?Missing NODE_ENV}"
: "${JWT_SECRET:?Missing JWT_SECRET}"
DOCKER_BUILD_NAME="ai-search-client"

echo "Building Docker image with build args..."
echo "NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL"
echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL"
echo "NODE_ENV=$NODE_ENV"

docker build \
  --build-arg NEXT_PUBLIC_URL="$NEXT_PUBLIC_URL" \
  --build-arg NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
  --build-arg NODE_ENV="$NODE_ENV" \
  --build-arg JWT_SECRET="$JWT_SECRET" \
  -t $DOCKER_BUILD_NAME .
