# Use Python 3.8 as base image (same as GitHub Actions)
FROM python:3.8-slim

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app


# Install Python dependencies
RUN pip install --no-cache-dir setuptools wheel

# Copy package files
COPY . .
# Build frontend
WORKDIR /app/streamlit_drawable_canvas/frontend
RUN npm ci
RUN npm run build

# Build wheel package
WORKDIR /app
RUN python setup.py sdist bdist_wheel

# The built wheel will be in /app/dist/ 