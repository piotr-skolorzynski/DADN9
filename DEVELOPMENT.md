# Development Mode Guide

This guide explains how to use Docker in development mode with hot-reload functionality.

## Overview

Development mode provides:
- **Hot-reload** for both API and Client
- **Volume mounts** for immediate code changes
- **Faster iteration** without container rebuilds
- **Development logging** and debugging

## Quick Start

1. **Ensure you have a `.env` file** (copy from `env.example` if needed)

2. **Start services in development mode:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:4200
   - API: http://localhost:5000
   - Database: localhost:5432

4. **Make code changes** - they will automatically reload!

## How It Works

### API Hot-Reload

The API uses `dotnet watch` which:
- Monitors `.cs` files for changes
- Automatically rebuilds when files change
- Restarts the application automatically
- Shows build errors in console

**What triggers reload:**
- Changes to `.cs` files
- Changes to `.csproj` files
- Changes to `appsettings.json` files

### Client Hot-Reload

The client uses `ng serve` with polling which:
- Monitors source files for changes
- Automatically recompiles on changes
- Hot-reloads in browser (no full page refresh)
- Shows compilation errors in console and browser

**What triggers reload:**
- Changes to `.ts` files
- Changes to `.html` files
- Changes to `.css` files
- Changes to component files

## Volume Mounts

In development mode, source code is mounted as volumes:

```
./API          → /src          (API source)
./client       → /app          (Client source)
```

This means:
- ✅ Changes on your host machine are immediately visible in container
- ✅ No need to rebuild containers for code changes
- ✅ Fast development cycle

**Excluded volumes** (for performance):
- `/src/bin` and `/src/obj` (API build outputs)
- `/app/node_modules` (Client dependencies)
- `/app/.angular` (Angular cache)

## Commands

### Start Development Mode

```bash
# Foreground (see logs)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Background
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# With rebuild
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Stop Development Mode

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### View Logs

```bash
# All services
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f api
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f client
```

### Restart a Service

```bash
# Restart API
docker compose -f docker-compose.yml -f docker-compose.dev.yml restart api

# Restart Client
docker compose -f docker-compose.yml -f docker-compose.dev.yml restart client
```

## Troubleshooting

### Hot-Reload Not Working

1. **Check if you're in development mode:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
   ```

2. **Verify volume mounts:**
   ```bash
   # Check API
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec api ls -la /src
   
   # Check Client
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec client ls -la /app
   ```

3. **Check file permissions:**
   ```bash
   # On Linux/Mac
   ls -la API/
   ls -la client/
   ```

4. **Restart services:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml restart
   ```

### API Not Reloading

1. **Check dotnet watch is running:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs api | grep -i watch
   ```

2. **Verify file changes are detected:**
   - Make a small change to a `.cs` file
   - Watch the API logs for rebuild messages

3. **Check for build errors:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs api
   ```

### Client Not Reloading

1. **Check ng serve is running:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs client | grep -i "compiled"
   ```

2. **Verify polling is enabled:**
   - Check logs for "polling" messages
   - Ensure `CHOKIDAR_USEPOLLING=true` is set

3. **Check browser console:**
   - Open browser DevTools
   - Look for WebSocket connection (hot-reload uses WebSocket)
   - Check for compilation errors

4. **Try manual refresh:**
   - Sometimes a manual browser refresh helps
   - Clear browser cache if needed

### Performance Issues

If development mode is slow:

1. **Exclude unnecessary files from volumes:**
   - Already configured in `docker-compose.dev.yml`
   - `node_modules` and build outputs are excluded

2. **Use .dockerignore:**
   - Large files and dependencies are excluded
   - Only source code is mounted

3. **Check disk I/O:**
   - Development mode uses more disk I/O
   - Consider using SSD for better performance

## Switching Between Modes

### From Production to Development

```bash
# Stop production
docker compose down

# Start development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### From Development to Production

```bash
# Stop development
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Start production
docker compose up -d
```

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| **Build** | Development build | Optimized build |
| **Hot-Reload** | ✅ Yes | ❌ No |
| **Source Mounts** | ✅ Yes | ❌ No |
| **Logging** | Verbose | Production level |
| **Performance** | Faster iteration | Optimized runtime |
| **Image Size** | Larger (SDK included) | Smaller (runtime only) |
| **Startup Time** | Slower (watch mode) | Faster (pre-built) |

## Best Practices

1. **Use development mode for active coding**
2. **Switch to production mode for testing production builds**
3. **Keep `.env` file secure** (never commit it)
4. **Monitor logs** during development for errors
5. **Restart services** if hot-reload stops working
6. **Use production mode** for final testing before deployment

## Tips

- **Watch logs in separate terminals** for better visibility
- **Use IDE integration** with Docker for debugging
- **Keep containers running** during development session
- **Use `--build` flag** only when dependencies change
- **Check health endpoints** if services seem unresponsive

