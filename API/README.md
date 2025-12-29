# Dating App API - Backend Application

A .NET 9.0 Web API backend for a dating application, featuring JWT authentication, member management, and photo uploads via Cloudinary.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Using Docker](#using-docker)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### For Local Development

- **.NET 9.0 SDK** or later ([Download](https://dotnet.microsoft.com/download))
- **SQLite** (included with .NET SDK)
- **Cloudinary Account** (for photo storage) - [Sign up](https://cloudinary.com/)
- **IDE** (optional): Visual Studio, Visual Studio Code, or Rider

Verify your .NET installation:
```bash
dotnet --version
```

### For Docker (Recommended)

- **Docker** (version 20.10 or later) - [Download](https://www.docker.com/get-started)
- **Docker Compose** (version 2.0 or later)
- **Cloudinary Account** (for photo storage) - [Sign up](https://cloudinary.com/)

Verify your Docker installation:
```bash
docker --version
docker compose version
```

**Note**: Using Docker is recommended as it handles all dependencies and provides a consistent environment. The application uses SQLite database (file-based), so no separate database container is needed.

## 📦 Installation

1. **Clone or navigate to the API directory:**
   ```bash
   cd API
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Build the project:**
   ```bash
   dotnet build
   ```

## ⚙️ Configuration

### 1. Configure `appsettings.Development.json`

Create or update `appsettings.Development.json` with the following structure:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data source=dating.db"
  },
  "TokenKey": "your-super-secret-key-minimum-32-characters-long-for-security",
  "CloudinarySettings": {
    "CloudName": "your-cloudinary-cloud-name",
    "ApiKey": "your-cloudinary-api-key",
    "ApiSecret": "your-cloudinary-api-secret"
  }
}
```

### 2. Configuration Details

#### Database Connection
- **DefaultConnection**: Path to SQLite database file
- Database will be created automatically on first run
- Migrations are applied automatically on startup

#### JWT Token Key
- **TokenKey**: A secret key for signing JWT tokens
- **Minimum 32 characters recommended** for security
- Keep this key secure and never commit it to version control
- Example: `"TokenKey": "super-secret-key-with-at-least-32-characters-for-jwt-signing"`

#### Cloudinary Settings
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the Dashboard:
   - **CloudName**: Found in your dashboard URL
   - **ApiKey**: Available in Account Details
   - **ApiSecret**: Available in Account Details (keep secret!)

### 3. Production Configuration

For production, update `appsettings.json` with production values:
- Use environment variables for sensitive data
- Use a production database (PostgreSQL, SQL Server, etc.)
- Update CORS origins in `Program.cs` to your production frontend URL

## 🚀 Running the Application

### Using Docker

The easiest way to run the API is using Docker Compose from the project root directory.

#### Prerequisites for Docker

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)

#### Quick Start with Docker

1. **Navigate to the project root directory:**
   ```bash
   cd ..  # If you're in the API directory
   ```

2. **Copy the environment example file:**
   ```bash
   cp env.example .env
   ```

3. **Edit `.env` file** with your configuration:
   - Set `TOKEN_KEY` to a secure JWT key (minimum 32 characters)
   - Configure Cloudinary credentials
   - Optionally set `DATABASE_CONNECTION_STRING` (default: `Data source=/app/data/dating.db`)

4. **Start all services (API, Client):**
   ```bash
   # Production mode
   docker compose up -d --build
   
   # Development mode (with hot-reload)
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

5. **Access the API:**
   - **Production**: http://localhost:5000
   - **API Base URL**: http://localhost:5000/api
   - **Health Check**: http://localhost:5000/api/health
   - **Database**: SQLite file (automatically created in Docker volume)

#### Docker Commands

```bash
# View logs
docker compose logs -f api

# Stop services
docker compose down

# Restart API service
docker compose restart api

# Execute commands in API container
docker compose exec api sh
```

#### Development Mode with Docker

For development with hot-reload (automatic rebuild on code changes):

```bash
# Start in development mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# View development logs
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f api
```

In development mode:
- Source code is mounted as a volume
- Changes to `.cs` files automatically trigger rebuild and restart
- Uses `dotnet watch` for hot-reload

For more Docker details, see the main [DOCKER.md](../DOCKER.md) file.

### Local Development

If you prefer to run the API locally without Docker:

#### Prerequisites

- **.NET 9.0 SDK** or later
- **SQLite** (included with .NET SDK) or **PostgreSQL** for production-like setup

#### Run Locally

1. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

2. **Run the application:**
   ```bash
   dotnet run
   ```

   Or use watch mode for automatic reloading:
   ```bash
   dotnet watch run
   ```

3. **The API will be available at:**
   - **HTTPS**: `https://localhost:5001`
   - **HTTP**: `http://localhost:5000`
   - **API Base URL**: `https://localhost:5001/api` or `http://localhost:5000/api`

### Database Migrations

Migrations are automatically applied on application startup. If you need to manually manage migrations:

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Remove last migration (if not applied)
dotnet ef migrations remove
```

### Database Seeding

Sample user data is automatically seeded on first run if the database is empty. Seed data is loaded from `Data/UserSeedData.json`.

## 📁 Project Structure

```
API/
├── Controllers/              # API Controllers
│   ├── AccountController.cs   # Authentication (register, login)
│   ├── MembersController.cs  # Member management endpoints
│   ├── BaseApiController.cs  # Base controller class
│   └── BuggyController.cs    # Error testing endpoints
│
├── Data/                     # Data Access Layer
│   ├── AppDbContext.cs       # Entity Framework DbContext
│   ├── MemberRepository.cs   # Repository implementation
│   ├── Seed.cs               # Database seeding logic
│   ├── UserSeedData.json     # Seed user data
│   └── Migrations/           # EF Core database migrations
│
├── DTOs/                     # Data Transfer Objects
│   ├── LoginDto.cs
│   ├── RegisterDto.cs
│   ├── UserDto.cs
│   ├── MemberUpdateDto.cs
│   └── SeedUserDto.cs
│
├── Entities/                 # Domain Models
│   ├── AppUser.cs            # User entity (authentication)
│   ├── Member.cs             # Member profile entity
│   └── Photo.cs              # Photo entity
│
├── Extensions/               # Extension Methods
│   ├── AppUserExtensions.cs  # User mapping extensions
│   └── ClaimsPrincipalExtensions.cs
│
├── Helpers/                  # Helper Classes
│   ├── CloudinarySettings.cs
│   ├── PaginatedResult.cs
│   └── PagingParams.cs
│
├── Interfaces/               # Service Interfaces
│   ├── IMemberRepository.cs
│   ├── ITokenService.cs
│   └── IPhotoService.cs
│
├── Middleware/               # Custom Middleware
│   └── ExceptionMiddleware.cs
│
├── Services/                 # Business Logic Services
│   ├── TokenService.cs       # JWT token generation
│   └── PhotoService.cs       # Cloudinary photo operations
│
├── Errors/                   # Error Handling
│   └── ApiException.cs
│
├── Program.cs                # Application entry point
├── appsettings.json         # Production configuration
└── appsettings.Development.json  # Development configuration
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/account/register
Content-Type: application/json

{
  "displayName": "John Doe",
  "email": "john@example.com",
  "password": "Pa$$w0rd",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "city": "New York",
  "country": "USA"
}
```

**Response:** `200 OK` with UserDto containing token

#### Login
```http
POST /api/account/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Pa$$w0rd"
}
```

**Response:** `200 OK` with UserDto containing token

### Member Endpoints (Protected - Requires JWT Token)

#### Get Members (Paginated)
```http
GET /api/members?pageNumber=1&pageSize=10
Authorization: Bearer {token}
```

#### Get Member by ID
```http
GET /api/members/{id}
Authorization: Bearer {token}
```

#### Update Member Profile
```http
PUT /api/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "John Updated",
  "description": "Updated description",
  "city": "Los Angeles",
  "country": "USA"
}
```

#### Get Member Photos
```http
GET /api/members/{id}/photos
Authorization: Bearer {token}
```

#### Upload Photo
```http
POST /api/members/add-photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]
```

#### Set Main Photo
```http
PUT /api/members/set-main-photo/{photoId}
Authorization: Bearer {token}
```

#### Delete Photo
```http
DELETE /api/members/delete-photo/{photoId}
Authorization: Bearer {token}
```

## 🗄️ Database

### Entity Relationships

- **AppUser** (1) ←→ (1) **Member**: One-to-one relationship
- **Member** (1) ←→ (N) **Photo**: One-to-many relationship

### Database Schema

**AppUser**
- `Id` (string, GUID, Primary Key)
- `DisplayName` (required string)
- `Email` (required string, unique)
- `Password` (byte array - HMACSHA512 hash)
- `PasswordSalt` (byte array)
- `ImageUrl` (optional string)

**Member**
- `Id` (string, Foreign Key to AppUser, Primary Key)
- `DisplayName` (required string)
- `DateOfBirth` (DateOnly)
- `Gender` (required string)
- `City` (required string)
- `Country` (required string)
- `Description` (optional string)
- `ImageUrl` (optional string)
- `Created` (DateTime, UTC)
- `LastActive` (DateTime, UTC)

**Photo**
- `Id` (int, auto-increment, Primary Key)
- `Url` (required string)
- `PublicId` (optional string - Cloudinary ID)
- `MemberId` (string, Foreign Key to Member)

## 🏗️ Architecture

### Design Patterns

- **Repository Pattern**: Data access abstraction via `IMemberRepository`
- **Service Layer**: Business logic in services (TokenService, PhotoService)
- **DTO Pattern**: Data transfer objects for API contracts
- **Dependency Injection**: Services registered in `Program.cs`

### Security

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: HMACSHA512 with unique salt per user
- **CORS**: Configured for Angular development server
- **Authorization**: `[Authorize]` attribute on protected endpoints

### Middleware

- **ExceptionMiddleware**: Global error handling
- **Authentication Middleware**: JWT token validation
- **CORS Middleware**: Cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Migration Errors
```bash
# Delete existing database and migrations folder
# Then recreate:
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 2. Cloudinary Upload Fails
- Verify Cloudinary credentials in `appsettings.Development.json` or `.env` file
- Check API key permissions in Cloudinary dashboard
- Ensure file size is within Cloudinary limits

#### 3. JWT Token Issues
- Verify `TokenKey` is set in configuration or `.env` file
- Ensure token key is at least 32 characters
- Check token expiration (default: not set, tokens don't expire)

#### 4. CORS Errors
- Update CORS origins in `Program.cs` or `CORS__AllowedOrigins` in `.env` file
- Ensure frontend URL matches configured origins

#### 5. Port Already in Use
```bash
# Change port in launchSettings.json or use:
dotnet run --urls "https://localhost:5002"

# Or in Docker, change API_PORT in .env file
```

### Docker-Specific Issues

#### Container Won't Start

1. **Check Docker logs:**
   ```bash
   docker compose logs api
   ```

2. **Verify environment variables:**
   ```bash
   docker compose config
   ```

3. **Check if database is healthy:**
   ```bash
   docker compose ps database
   ```

#### Database Issues in Docker

1. **Verify SQLite database file:**
   ```bash
   docker compose exec api ls -la /app/data/
   ```

2. **Check database file permissions:**
   ```bash
   docker compose exec api sh -c "test -w /app/data && echo 'Writable' || echo 'Not writable'"
   ```

3. **View database contents:**
   ```bash
   docker compose exec api sh -c "apt-get update && apt-get install -y sqlite3 && sqlite3 /app/data/dating.db '.tables'"
   ```

#### Hot-Reload Not Working in Development Mode

1. **Verify you're using development compose file:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
   ```

2. **Check volume mounts:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec api ls -la /src
   ```

3. **Restart development services:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml restart api
   ```

### Logs

**Local Development:**
Check application logs in the console output. Logging levels are configured in `appsettings.Development.json`.

**Docker:**
```bash
# View logs
docker compose logs -f api

# View last 100 lines
docker compose logs --tail=100 api
```

## 📚 Additional Resources

- [.NET 9 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [JWT Authentication](https://jwt.io/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🔐 Security Notes

- **Never commit** `appsettings.Development.json` with real credentials
- Use environment variables or Azure Key Vault for production secrets
- Change default `TokenKey` in production
- Implement token expiration for production use
- Use HTTPS in production
- Validate and sanitize all user inputs

## 📝 Development Notes

- Database is automatically created and migrated on startup
- Seed data is loaded only if database is empty
- Exception middleware catches and formats all API errors
- Repository pattern allows easy testing and database switching
- Photo uploads require valid Cloudinary configuration

