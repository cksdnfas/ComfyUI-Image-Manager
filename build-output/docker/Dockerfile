# Multi-stage build for ComfyUI Image Manager
# Optimized for production deployment
# Note: Using Debian base for PyTorch compatibility (Alpine not supported)

# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:20-slim AS deps

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json
COPY package.json ./

# Install production dependencies and rebuild native modules
RUN npm install --production --no-package-lock && \
    npm rebuild sharp better-sqlite3 argon2 blake2

# ============================================================================
# Stage 2: Runtime
# ============================================================================
FROM node:20-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    python3-pip \
    python3-venv \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application files
COPY bundle.js ./
COPY migrations ./migrations
COPY frontend ./frontend
COPY python ./python

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Install Python dependencies (CPU-only PyTorch for smaller image size)
RUN pip3 install --no-cache-dir --break-system-packages \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r python/requirements.txt && \
    find /usr/local/lib/python3* -name '*.pyc' -delete && \
    find /usr/local/lib/python3* -name '__pycache__' -delete && \
    rm -rf /root/.cache/pip

# Create data directories
RUN mkdir -p /app/data/uploads /app/data/database /app/data/logs /app/data/temp /app/data/models /app/data/config /app/data/RecycleBin

# Create non-root user
RUN groupadd -g 1001 appuser && \
    useradd -u 1001 -g appuser -s /bin/bash -m appuser && \
    chown -R appuser:appuser /app

USER appuser

# Environment variables
ENV NODE_ENV=production \
    PORT=1566 \
    HOST=0.0.0.0 \
    DOCKER=true \
    RUNTIME_BASE_PATH=/app/data \
    PYTHON_PATH=python3

# Expose port
EXPOSE 1566

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:1566/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "bundle.js"]
