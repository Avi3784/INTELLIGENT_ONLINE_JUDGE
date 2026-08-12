FROM node:18-alpine

WORKDIR /app

RUN mkdir -p logs

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Healthcheck to detect stuck/crashed containers
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api || exit 1

# Start server
CMD ["npm", "start"]

# --- Production Deployment Notes ---
# When running this container, apply resource limits:
#   docker run \
#     --memory=512m \
#     --cpus=1 \
#     --pids-limit=256 \
#     -p 5000:5000 \
#     intellijudge-backend
#
# --pids-limit prevents fork bomb attacks from degrading the execution queue.
# Code execution sandboxing is handled by the Paiza.IO external API.

