# ComfyUI Image Manager - Application Image
# Fast build: Depends on pre-built base image
# Use arg BASE_IMAGE to switch between cpu/gpu: --build-arg BASE_IMAGE=comfyui-manager-base:gpu

ARG BASE_IMAGE=comfyui-manager-base:cpu
FROM ${BASE_IMAGE}

WORKDIR /app

# Copy application files (These change frequently)
COPY --chown=appuser:appuser bundle.js ./
COPY --chown=appuser:appuser migrations ./migrations
COPY --chown=appuser:appuser frontend ./frontend
COPY --chown=appuser:appuser python ./python

USER appuser

# Environment variables
ENV NODE_ENV=production \
    PORT=1666 \
    HOST=0.0.0.0 \
    DOCKER=true \
    RUNTIME_BASE_PATH=/app/data \
    PYTHON_PATH=python3 \
    PYTHONUNBUFFERED=1

EXPOSE 1666

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:1666/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "bundle.js"]
