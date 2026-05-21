# Stage 1 — Dependencies
FROM node:26-alpine3.22 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2 — Production Image
FROM node:26-alpine3.22 AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY src/ ./src/

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]