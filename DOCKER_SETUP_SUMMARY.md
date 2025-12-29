# Docker Setup Summary

This document summarizes the Docker configuration created for the Dating App project.

## Files Created

### Docker Configuration Files

1. **`docker-compose.yml`** - Main orchestration file (Production)

   - Defines 2 services: api, client
   - Uses SQLite for database (file-based, no separate container)
   - Uses environment variables for configuration
   - Includes health checks and dependencies

2. **`docker-compose.dev.yml`** - Development override file

   - Extends docker-compose.yml for development mode
   - Enables hot-reload with volume mounts
   - Uses development Dockerfiles

3. **`API/Dockerfile`** - Backend container definition (Production)

   - Multi-stage build (SDK → Runtime)
   - Uses .NET 9.0.0 (runtime) and 9.0.100 (SDK)
   - Runs as non-root user `appuser`
   - Includes health check endpoint

4. **`API/Dockerfile.dev`** - Backend container definition (Development)

   - Single-stage build with SDK
   - Uses `dotnet watch` for hot-reload
   - Source code mounted as volume
   - Runs as non-root user `appuser`

5. **`client/Dockerfile`** - Frontend container definition (Production)

   - Multi-stage build (Node → Nginx)
   - Uses Node.js 22.12.0-alpine for build
   - Uses Nginx 1.25.4-alpine for serving
   - Runs as non-root user `nginxuser`
   - Configurable API URL via build args

6. **`client/Dockerfile.dev`** - Frontend container definition (Development)

   - Single-stage build with Node.js
   - Uses `ng serve` for hot-reload
   - Source code mounted as volume
   - Polling enabled for file change detection
   - Runs as non-root user `angular`

7. **`client/nginx.conf`** - Nginx configuration

   - Angular SPA routing support
   - Security headers
   - Static asset caching
   - Health check endpoint

8. **`API/.dockerignore`** - API build exclusions
9. **`client/.dockerignore`** - Client build exclusions
10. **`.dockerignore`** - Root-level exclusions

### Configuration Files

8. **`env.example`** - Environment variables template

   - All required and optional variables documented
   - No hardcoded secrets
   - Copy to `.env` and fill in values

9. **`DOCKER.md`** - Comprehensive Docker guide
   - Setup instructions
   - Troubleshooting
   - Production deployment tips

### Code Changes

10. **`API/Program.cs`** - Updated for Docker support

    - SQLite database support
    - Environment variable configuration
    - CORS from environment variables
    - Health check endpoint added

11. **`API/API.csproj`** - Database packages
    - SQLite support via `Microsoft.EntityFrameworkCore.Sqlite`

## Key Features

### Security

- ✅ All containers run as non-root users
- ✅ No hardcoded secrets (all via environment variables)
- ✅ Specific image versions (no `latest` tags)
- ✅ Security headers in Nginx

### Best Practices

- ✅ Multi-stage builds for smaller images (production)
- ✅ Health checks for all services
- ✅ Service dependencies and startup order
- ✅ Volume persistence for SQLite database file
- ✅ Segmented network architecture (frontend/backend isolation)

### Configuration

- ✅ Minimum environment variables
- ✅ Sensible defaults
- ✅ Easy to override

### Development Mode

- ✅ Hot-reload for API (dotnet watch)
- ✅ Hot-reload for Client (ng serve with polling)
- ✅ Source code volume mounts
- ✅ Fast development iteration
- ✅ Separate development Dockerfiles

## Services

### API (.NET)

- **Image**: `mcr.microsoft.com/dotnet/aspnet:9.0.0`
- **Port**: 5000 → 8080 (configurable)
- **User**: `appuser` (non-root)
- **Health**: `/api/health` endpoint
- **Database**: SQLite (file-based, persisted in volume)

### Client (Angular + Nginx)

- **Image**: `nginx:1.25.4-alpine`
- **Port**: 4200 → 80 (configurable)
- **User**: `nginxuser` (non-root)
- **Health**: `/health` endpoint

## Quick Start

1. Copy `env.example` to `.env`
2. Fill in required values (especially secrets)
3. Run `docker compose up -d --build`
4. Access at http://localhost:4200

## Environment Variables Required

- `TOKEN_KEY` - JWT signing key (min 32 chars)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Environment Variables Optional

- `DATABASE_CONNECTION_STRING` - SQLite connection (default: `Data source=/app/data/dating.db`)
- `API_PORT` - API port (default: 5000)
- `CLIENT_PORT` - Client port (default: 4200)

See `env.example` for all options.

## Next Steps

1. **Restore packages** in API to resolve linter warning:

   ```bash
   cd API
   dotnet restore
   ```

2. **Create `.env` file** from `env.example`

3. **Build and run**:

   ```bash
   docker compose up -d --build
   ```

4. **Check logs**:
   ```bash
   docker compose logs -f
   ```

## Notes

- The API supports both SQLite (local dev) and PostgreSQL (Docker)
- Connection string format determines which database provider is used
- All secrets should be in `.env` file (not committed to git)
- Health checks ensure services are ready before dependencies start
