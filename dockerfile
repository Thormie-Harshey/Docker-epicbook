# Stage 1: Build Stage
FROM node:14-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for potential builds/linting)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Stage 2: Production Stage
FROM node:14-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy ONLY the production-ready node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the application source code and assets
COPY . .

# Expose the internal port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]