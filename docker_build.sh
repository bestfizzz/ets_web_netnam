#!/bin/bash

set -e

NEXT_PUBLIC_URL='http://localhost:3000'
NEXT_PUBLIC_BACKEND_URL='http://10.30.12.151:3000/api/v1'
DOCKER_BUILD_NAME="ai-search-client"

echo "Building Docker image with build args..."
echo "NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL"
echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL"
echo "NODE_ENV=$NODE_ENV"

docker build \
  --build-arg NEXT_PUBLIC_URL="$NEXT_PUBLIC_URL" \
  --build-arg NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
  --build-arg NODE_ENV="$NODE_ENV" \
  -t $DOCKER_BUILD_NAME .
