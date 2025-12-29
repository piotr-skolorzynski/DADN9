# SQLite-Only Configuration Notes

## Changes Made

The project has been updated to use **SQLite only** instead of PostgreSQL. This simplifies the setup and deployment.

### Benefits of SQLite

- **Simplicity**: No separate database container needed
- **Zero Configuration**: Database file is automatically created
- **Portability**: Single file contains entire database
- **Perfect for**: Development, small to medium applications, embedded scenarios
- **Performance**: Excellent for read-heavy workloads and moderate write operations

## Updated Files

### Code Changes

1. **`API/Program.cs`**
   - Removed PostgreSQL detection logic
   - Simplified to use SQLite only
   - Default connection string: `Data source=dating.db`

2. **`API/API.csproj`**
   - Removed `Npgsql.EntityFrameworkCore.PostgreSQL` package
   - Kept `Microsoft.EntityFrameworkCore.Sqlite`

### Docker Configuration

3. **`docker-compose.yml`**
   - Removed `database` service (PostgreSQL container)
   - Removed `backend-network` (no longer needed)
   - Simplified to single `app-network`
   - Added `sqlite_data` volume for database file persistence
   - Updated API service with volume mount for `/app/data`

4. **`env.example`**
   - Removed PostgreSQL-related variables
   - Simplified `DATABASE_CONNECTION_STRING` to SQLite format
   - Default: `Data source=/app/data/dating.db`

### Documentation

5. **`DOCKER.md`**
   - Updated service architecture section
   - Removed PostgreSQL references
   - Updated database management section for SQLite
   - Added SQLite-specific backup/restore commands

6. **`DOCKER_SETUP_SUMMARY.md`**
   - Updated services list (removed database)
   - Updated architecture description
   - Updated environment variables section

7. **`API/README.md`**
   - Updated prerequisites (removed PostgreSQL)
   - Updated Docker quickstart
   - Updated troubleshooting section

## Database Location

### In Docker

- **Path**: `/app/data/dating.db` (inside container)
- **Volume**: `sqlite_data` (persisted across container restarts)
- **Backup**: Use `docker compose cp api:/app/data/dating.db ./backup.db`

### Local Development

- **Path**: `./API/dating.db` (in API directory)
- **Backup**: Simply copy the `dating.db` file

## Migration from PostgreSQL

If you were using PostgreSQL before, you'll need to:

1. **Export data from PostgreSQL** (if you have existing data):
   ```bash
   # This would require custom migration scripts
   # SQLite and PostgreSQL have different data types
   ```

2. **Remove old volumes**:
   ```bash
   docker compose down -v
   ```

3. **Start fresh with SQLite**:
   ```bash
   docker compose up -d --build
   ```

## Network Architecture

### Before (with PostgreSQL)

```
Client ←→ Frontend Network ←→ API ←→ Backend Network ←→ Database
```

### After (with SQLite)

```
Client ←→ App Network ←→ API (with SQLite file)
```

## Performance Considerations

### SQLite is Great For:

- Development environments
- Single-server deployments
- Applications with < 100,000 requests/day
- Read-heavy workloads
- Embedded applications

### Consider PostgreSQL/MySQL When:

- Multiple servers need simultaneous write access
- Very high concurrent write operations
- Complex query requirements
- Large scale (> 1M records with heavy writes)

## Restoring the PostgreSQL Option

If you need PostgreSQL back, the old configuration can be restored by:

1. Reverting changes to `API/Program.cs`
2. Adding back `Npgsql.EntityFrameworkCore.PostgreSQL` to `API.csproj`
3. Adding back the `database` service to `docker-compose.yml`
4. Creating appropriate migrations for PostgreSQL

The SQLite migrations should work with PostgreSQL with minimal changes, as Entity Framework Core handles most database-specific differences.

## Additional Notes

- SQLite database file is created automatically on first run
- Migrations are applied automatically on startup
- The volume `sqlite_data` ensures data persists across container restarts
- For production, consider using managed database services if needed

