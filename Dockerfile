FROM --platform=linux/arm64 node:22.11.0-alpine

# Set environment variables for writable directories
ENV VITE_CACHE_DIR=/tmp/.vite
ENV NODE_ENV=development

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && \
    mkdir -p /app/node_modules/.vite-temp && \
    chmod -R 777 /app/node_modules

# Copy application code
COPY . .

# Ensure tmp directory exists and is writable
RUN mkdir -p /tmp/.vite && chmod -R 777 /tmp

# Create volume for node_modules to ensure it's writable
VOLUME ["/app/node_modules"]

EXPOSE 5174
CMD ["npm", "run", "dev", "--", "--force"]