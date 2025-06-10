#!/bin/bash

# Build the Docker image
docker build -t streamlit-drawable-canvas-builder .

# Create a dist directory if it doesn't exist
mkdir -p dist

# Create a temporary container and copy files from it
container_id=$(docker create streamlit-drawable-canvas-builder)
docker cp $container_id:/app/dist/. ./dist/
docker rm $container_id

echo "Build complete! Check the dist/ directory for the wheel package." 