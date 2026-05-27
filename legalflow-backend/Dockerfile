FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
# Ensure prisma and its adapters are installed
RUN npm ci --omit=dev

# Copy built application and generated prisma client from builder
COPY --from=builder /app/dist ./dist
# We need to copy the generated prisma client because it's usually stored in node_modules/.prisma
# but `npm ci --omit=dev` will overwrite node_modules. Better way is to copy the specific modules or just build production deps and then generate prisma.
# Let's run prisma generate again in the production stage to ensure it matches the runtime OS/arch, 
# although we're using node:20-alpine in both stages so copying is fine. However, npm ci will wipe node_modules.
# We will run prisma generate in the production stage after npm ci.
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

# Start the application using npm run start:prod
CMD ["npm", "run", "start:prod"]
