# Build stage
FROM node:22.12.0-alpine AS build
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001

# Upgrade npm to latest version for Angular 21 compatibility
RUN npm install -g npm@latest

# Verify versions
RUN node --version && npm --version

# Copy package files
# Handle package-lock.json separately in case it's missing or incompatible
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
# Check if package-lock.json exists and is valid, otherwise use npm install
RUN if [ -f "package-lock.json" ]; then \
    npm ci --only=production=false || npm install --only=production=false; \
    else \
    npm install --only=production=false; \
    fi

# Copy source code
COPY . .

# Change ownership
RUN chown -R angular:nodejs /app

# Switch to non-root user
USER angular

# Build argument for API URL
ARG API_URL=http://localhost:5000/api/
ENV API_URL=${API_URL}

# Update environment file with API URL
# Escape the URL properly for sed
RUN if [ -f "src/environments/environment.ts" ]; then \
    sed -i.bak "s|apiUrl:.*|apiUrl: '${API_URL}',|g" src/environments/environment.ts 2>/dev/null || \
    sed -i.bak "s|apiUrl:.*|apiUrl: \"${API_URL}\",|g" src/environments/environment.ts 2>/dev/null || true; \
    rm -f src/environments/environment.ts.bak 2>/dev/null || true; \
    fi

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25.4-alpine AS final

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginxuser && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginxuser -g nginx nginxuser

# Create nginx html directory first
RUN mkdir -p /usr/share/nginx/html

# Copy built app from build stage using a script to handle different output paths
RUN --from=build sh -c ' \
    OUTPUT_DIR=""; \
    if [ -d "/app/dist/client/browser" ]; then \
    OUTPUT_DIR="/app/dist/client/browser"; \
    elif [ -d "/app/dist/browser" ]; then \
    OUTPUT_DIR="/app/dist/browser"; \
    elif [ -d "/app/dist" ]; then \
    OUTPUT_DIR="/app/dist"; \
    else \
    echo "Error: Build output not found. Contents of /app:"; \
    ls -la /app/; \
    echo "Contents of /app/dist:"; \
    ls -la /app/dist/ 2>/dev/null || echo "dist directory does not exist"; \
    exit 1; \
    fi; \
    echo "Copying from: $OUTPUT_DIR"; \
    cp -r $OUTPUT_DIR/* /usr/share/nginx/html/ || exit 1'

# Set proper ownership
RUN chown -R nginxuser:nginxuser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx cache directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginxuser

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
