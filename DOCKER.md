# Docker Setup Guide

This guide explains how to run the Dating App using Docker and Docker Compose.

## Prerequisites

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)

Verify your installation:

```bash
docker --version
docker compose version
```

## Quick Start

### Production Mode

1. **Copy the environment example file:**

   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file with your configuration:**

   - Set `POSTGRES_PASSWORD` to a secure password
   - Set `TOKEN_KEY` to a secure JWT key (minimum 32 characters)
   - Configure Cloudinary credentials
   - Adjust ports if needed

3. **Build and start all services:**

   ```bash
   docker compose up -d --build
   ```

4. **View logs:**

   ```bash
   docker compose logs -f
   ```

5. **Access the application:**
   - **Frontend**: http://localhost:4200
   - **API**: http://localhost:5000
   - **Database**: SQLite file (automatically managed)

### Development Mode (with Hot-Reload)

For development with automatic code reloading:

1. **Copy the environment example file** (if not already done):

   ```bash
   cp env.example .env
   ```

2. **Start services in development mode:**

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

   Or use the shorter alias:

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

3. **Access the application:**

   - **Frontend**: http://localhost:4200 (with hot-reload)
   - **API**: http://localhost:5000 (with hot-reload)
   - **Database**: SQLite file (automatically managed)

4. **Make changes to your code:**
   - **API**: Changes to `.cs` files will automatically trigger rebuild and restart
   - **Client**: Changes to `.ts`, `.html`, `.css` files will automatically reload in browser

**Note**: In development mode, source code is mounted as volumes, so changes are reflected immediately without rebuilding containers.

## Services

### API (.NET 9.0)

- **Base Image**: `mcr.microsoft.com/dotnet/aspnet:9.0.0`
- **Build Image**: `mcr.microsoft.com/dotnet/sdk:9.0.100`
- **Port**: 5000 (configurable via `API_PORT`)
- **User**: Runs as non-root user `appuser`
- **Health Check**: `/api/health` endpoint
- **Database**: SQLite (file-based, stored in Docker volume)
- **Networks**: `backend-network`, `frontend-network` (bridges both)

### Client (Angular + Nginx)

- **Base Image**: `nginx:1.25.4-alpine`
- **Build Image**: `node:22.12.0-alpine`
- **Port**: 4200 (configurable via `CLIENT_PORT`)
- **User**: Runs as non-root user `nginxuser`
- **Network**: `frontend-network`

### Database (SQLite)

- **Type**: File-based SQLite database
- **Location**: `/app/data/dating.db` (inside API container)
- **Storage**: Persisted in Docker volume `sqlite_data`
- **Benefits**:
  - No separate database container needed
  - Simpler setup and deployment
  - Perfect for development and small to medium applications
  - Zero configuration

## Network Architecture

The application uses a segmented network architecture for enhanced security and isolation:

### Backend Network (`backend-network`)

- **Purpose**: Isolated network for backend services and database layer
- **Services**: API (with SQLite database file)
- **Access**: Backend services and database operations isolated from frontend
- **Security**: Database file access is restricted to backend network
- **Future**: Additional backend services (caching, message queues, etc.) can be added here

### Frontend Network (`frontend-network`)

- **Purpose**: Network for frontend and API communication
- **Services**: Client, API
- **Access**: Client can communicate with API endpoints only
- **Security**: Frontend cannot access database files or backend services directly
- **Isolation**: Frontend is logically separated from data storage layer

### API as Network Bridge

The API container bridges both networks:

- **Backend Network**: Access to SQLite database file in `/app/data`
- **Frontend Network**: Serves HTTP endpoints to the client

### Network Topology

```
┌─────────────────┐
│   Client        │  Frontend Network
│  (Port 4200)    │ ─────────────────┐
└─────────────────┘                   │
                                      │
                              ┌───────▼────────┐
                              │      API       │
                              │  (Port 5000)   │  Backend Network
                              │   Bridge       │ ─────────────────
                              └───────┬────────┘
                                      │
                              ┌───────▼────────┐
                              │  SQLite File   │
                              │  (/app/data)   │
                              │    (Volume)    │
                              └────────────────┘
```

### Network Benefits

- **Security**: Multi-layer isolation - frontend cannot access database directly
- **Scalability**: Easy to add services to appropriate network tier
- **Flexibility**: Can add caching, background workers to backend network
- **Best Practice**: Follows microservices networking principles
- **Database Isolation**: Even though SQLite is file-based, it's isolated in the backend layer

## Environment Variables

All configuration is done through environment variables in the `.env` file. See `env.example` for all available options.

### Required Variables

- `TOKEN_KEY` - JWT signing key (minimum 32 characters)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Optional Variables

- `DATABASE_CONNECTION_STRING` - SQLite connection string (default: `Data source=/app/data/dating.db`)
- `API_PORT` - API port (default: `5000`)
- `CLIENT_PORT` - Client port (default: `4200`)
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- `ASPNETCORE_ENVIRONMENT` - Environment (default: `Production`)

## Docker Commands

### Production Mode

#### Start Services

```bash
docker compose up -d
```

#### Stop Services

```bash
docker compose down
```

#### Stop and Remove Volumes

```bash
docker compose down -v
```

#### Rebuild Services

```bash
docker compose up -d --build
```

### Development Mode

#### Start Services with Hot-Reload

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

#### Start Services in Background

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

#### Stop Development Services

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

#### Rebuild Development Services

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### View Development Logs

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f client
docker compose logs -f database
```

### Execute Commands in Containers

```bash
# API container
docker compose exec api sh

# Database container
docker compose exec database psql -U datingapp -d datingapp
```

### Check Service Status

```bash
docker compose ps
```

### View Resource Usage

```bash
docker stats
```

## Database Management

### Access Database File

The SQLite database file is stored in a Docker volume. To access it:

```bash
# Copy database file from container to host
docker compose cp api:/app/data/dating.db ./dating.db

# Or access it directly in the container
docker compose exec api ls -la /app/data/
```

### Backup Database

```bash
# Copy the SQLite database file to your host
docker compose cp api:/app/data/dating.db ./backup-$(date +%Y%m%d).db
```

### Restore Database

```bash
# Copy a backup file into the container
docker compose cp ./backup.db api:/app/data/dating.db

# Restart the API to use the restored database
docker compose restart api
```

### Reset Database

```bash
# Remove the volume and restart (will create a fresh database)
docker compose down -v
docker compose up -d
```

### View Database Contents

```bash
# Install sqlite3 in the container and explore
docker compose exec api sh -c "apt-get update && apt-get install -y sqlite3 && sqlite3 /app/data/dating.db"

# Then you can run SQL commands like:
# .tables
# SELECT * FROM Users;
# .quit
```

## Development Mode Features

### Hot-Reload Support

Development mode includes automatic code reloading:

- **API (.NET)**: Uses `dotnet watch` to automatically rebuild and restart on code changes
- **Client (Angular)**: Uses `ng serve` with polling to detect file changes and hot-reload in browser

### Volume Mounts

In development mode, source code is mounted as volumes:

- `./API` → `/src` (API source code)
- `./client` → `/app` (Client source code)

This allows:

- Immediate code changes without container rebuild
- Faster development cycle
- Access to live logs and debugging

### Development vs Production

| Feature       | Production       | Development       |
| ------------- | ---------------- | ----------------- |
| Build         | Optimized build  | Development build |
| Hot-Reload    | No               | Yes               |
| Source Mounts | No               | Yes               |
| Logging       | Production level | Verbose           |
| Performance   | Optimized        | Faster iteration  |

### Switching Between Modes

To switch from production to development:

```bash
# Stop production
docker compose down

# Start development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

To switch from development to production:

```bash
# Stop development
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Start production
docker compose up -d
```

## Troubleshooting

### Services Won't Start

1. **Check logs:**

   ```bash
   docker compose logs
   ```

2. **Verify environment variables:**

   ```bash
   docker compose config
   ```

3. **Check port conflicts:**

   ```bash
   # Windows
   netstat -ano | findstr :5000

   # Linux/Mac
   lsof -i :5000
   ```

### Database Connection Issues

1. **Verify database file exists:**

   ```bash
   docker compose exec api ls -la /app/data/
   ```

2. **Check connection string in `.env`:**
   - Default: `Data source=/app/data/dating.db`
   - Make sure the `/app/data` directory is writable
   - The database file will be created automatically on first run

### API Health Check Fails

1. **Check API logs:**

   ```bash
   docker compose logs api
   ```

2. **Verify environment variables are set:**

   ```bash
   docker compose exec api env | grep -E "TOKEN_KEY|DATABASE"
   ```

3. **Test health endpoint manually:**
   ```bash
   curl http://localhost:5000/api/health
   ```

### Client Not Loading

1. **Check client logs:**

   ```bash
   # Production
   docker compose logs client

   # Development
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs client
   ```

2. **Verify API URL in build:**

   - Check `CLIENT_API_URL` in `.env`
   - Rebuild client: `docker compose up -d --build client`

3. **Check browser console for CORS errors:**
   - Verify `CORS_ALLOWED_ORIGINS` includes client URL

### Development Mode Issues

#### Hot-Reload Not Working

1. **Check file permissions:**

   ```bash
   # Ensure files are readable
   ls -la API/
   ls -la client/
   ```

2. **Verify volume mounts:**

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml config
   ```

3. **Check container logs for errors:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs api
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs client
   ```

#### Changes Not Reflecting

1. **Ensure you're in development mode:**

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
   ```

2. **Check if volumes are mounted:**

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec api ls -la /src
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec client ls -la /app
   ```

3. **Restart development services:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml restart
   ```

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong passwords** - Generate secure passwords for database and JWT
3. **Rotate secrets regularly** - Change passwords and keys periodically
4. **Limit CORS origins** - Only allow trusted domains
5. **Use HTTPS in production** - Configure reverse proxy with SSL/TLS
6. **Regular updates** - Keep Docker images updated

## Production Deployment

For production deployment:

1. **Use Docker secrets or external secret management:**

   - Docker Swarm secrets
   - Kubernetes secrets
   - AWS Secrets Manager
   - Azure Key Vault

2. **Configure reverse proxy:**

   - Nginx or Traefik for SSL termination
   - Load balancing for multiple API instances

3. **Set up monitoring:**

   - Health checks are already configured
   - Add logging aggregation (ELK, Loki, etc.)
   - Set up alerting

4. **Database backups:**

   - Automated backup strategy
   - Point-in-time recovery

5. **Resource limits:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: "1"
         memory: 512M
   ```

## Image Versions

All images use specific versions (not `latest`):

- **.NET**: `9.0.0` (runtime), `9.0.100` (SDK)
- **Node.js**: `22.12.0-alpine`
- **Nginx**: `1.25.4-alpine`

This ensures reproducible builds and avoids unexpected breaking changes.

## Non-Root Users

All containers run as non-root users:

- **API**: `appuser` (UID 1000, GID 1000) with home directory `/home/appuser`
- **Client**: `nginxuser` (UID 1001, GID 1001)

Each user has:

- Proper home directory with correct permissions
- Ownership of application files and data directories
- Limited privileges following the principle of least privilege

This improves security while ensuring proper application functionality.
