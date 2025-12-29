# Dating App - Full Stack Application

A modern dating application built with .NET 9 and Angular 21, featuring user authentication, member profiles, photo management, and messaging capabilities.

## 🚀 Technology Stack

### Backend

- **.NET 9.0** - Web API framework
- **Entity Framework Core 9.0** - ORM for database operations
- **SQLite** - Database
- **JWT Bearer Authentication** - Token-based authentication
- **Cloudinary** - Cloud-based photo storage and management

### Frontend

- **Angular 21** - Frontend framework
- **TypeScript** - Programming language
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **RxJS** - Reactive programming

## 📁 Project Structure

```
DateAppDotnet9/
│
├── API/                          # .NET 9 Web API Backend
│   ├── Controllers/              # API Controllers
│   │   ├── AccountController.cs  # Authentication endpoints (register, login)
│   │   ├── MembersController.cs  # Member management endpoints
│   │   ├── BaseApiController.cs  # Base controller class
│   │   └── BuggyController.cs    # Error testing endpoints
│   │
│   ├── Data/                     # Data Access Layer
│   │   ├── AppDbContext.cs       # Entity Framework DbContext
│   │   ├── MemberRepository.cs   # Repository implementation
│   │   ├── Seed.cs               # Database seeding logic
│   │   ├── UserSeedData.json     # Seed user data
│   │   └── Migrations/           # EF Core database migrations
│   │
│   ├── DTOs/                     # Data Transfer Objects
│   │   ├── LoginDto.cs
│   │   ├── RegisterDto.cs
│   │   ├── UserDto.cs
│   │   ├── MemberUpdateDto.cs
│   │   └── SeedUserDto.cs
│   │
│   ├── Entities/                 # Domain Models
│   │   ├── AppUser.cs            # User entity (authentication)
│   │   ├── Member.cs             # Member profile entity
│   │   └── Photo.cs              # Photo entity
│   │
│   ├── Extensions/               # Extension Methods
│   │   ├── AppUserExtensions.cs  # User mapping extensions
│   │   └── ClaimsPrincipalExtensions.cs
│   │
│   ├── Helpers/                  # Helper Classes
│   │   ├── CloudinarySettings.cs
│   │   ├── PaginatedResult.cs
│   │   └── PagingParams.cs
│   │
│   ├── Interfaces/               # Service Interfaces
│   │   ├── IMemberRepository.cs
│   │   ├── ITokenService.cs
│   │   └── IPhotoService.cs
│   │
│   ├── Middleware/               # Custom Middleware
│   │   └── ExceptionMiddleware.cs
│   │
│   ├── Services/                 # Business Logic Services
│   │   ├── TokenService.cs       # JWT token generation
│   │   └── PhotoService.cs       # Cloudinary photo operations
│   │
│   ├── Errors/                   # Error Handling
│   │   └── ApiException.cs
│   │
│   ├── Program.cs                # Application entry point
│   ├── appsettings.json         # Configuration
│   └── dating.db                # SQLite database file
│
└── client/                       # Angular Frontend Application
    ├── src/
    │   ├── app/
    │   │   ├── core/             # Core Module
    │   │   │   ├── guards/       # Route guards
    │   │   │   │   ├── auth-guard.ts
    │   │   │   │   └── prevent-unsaved-changes-guard.ts
    │   │   │   ├── interceptors/ # HTTP Interceptors
    │   │   │   │   ├── jwt-interceptor.ts
    │   │   │   │   ├── error-interceptor.ts
    │   │   │   │   └── loading-interceptor.ts
    │   │   │   ├── services/     # Core Services
    │   │   │   │   ├── account-service.ts
    │   │   │   │   ├── member-service.ts
    │   │   │   │   ├── toast-service.ts
    │   │   │   │   └── busy-service.ts
    │   │   │   ├── resolvers/    # Route Resolvers
    │   │   │   │   └── member-resolver.ts
    │   │   │   ├── pipes/        # Custom Pipes
    │   │   │   │   └── age-pipe.ts
    │   │   │   └── helpers/      # Helper Functions
    │   │   │
    │   │   ├── features/         # Feature Modules
    │   │   │   ├── account/      # Authentication
    │   │   │   │   └── register/
    │   │   │   ├── home/         # Home Page
    │   │   │   ├── members/      # Member Management
    │   │   │   │   ├── member-list/
    │   │   │   │   ├── member-detailed/
    │   │   │   │   ├── member-profile/
    │   │   │   │   ├── member-photos/
    │   │   │   │   ├── member-messages/
    │   │   │   │   └── member-card/
    │   │   │   ├── messages/     # Messaging Feature
    │   │   │   ├── lists/        # User Lists
    │   │   │   └── test-errors/  # Error Testing
    │   │   │
    │   │   ├── shared/           # Shared Components
    │   │   │   ├── text-input/
    │   │   │   ├── image-upload/
    │   │   │   ├── delete-button/
    │   │   │   ├── star-button/
    │   │   │   └── errors/
    │   │   │
    │   │   ├── layout/           # Layout Components
    │   │   │   └── nav/          # Navigation Component
    │   │   │
    │   │   ├── models/           # TypeScript Interfaces
    │   │   │   └── interfaces/
    │   │   │
    │   │   ├── app.routes.ts     # Route Configuration
    │   │   └── app.ts            # Root Component
    │   │
    │   ├── environments/         # Environment Configuration
    │   └── styles.css            # Global Styles
    │
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## ✨ Features

### Authentication & Authorization

- User registration with email validation
- Secure login with JWT token authentication
- Password hashing using HMACSHA512 with salt
- Protected routes with authentication guards
- Token-based API authorization

### Member Management

- Member profile creation and updates
- Display member information (name, age, location, description)
- Paginated member listing
- Member detail view with nested routes
- Profile editing with unsaved changes guard

### Photo Management

- Upload photos to Cloudinary
- Set main profile photo
- Delete photos
- Photo gallery display
- Automatic main photo assignment

### User Interface

- Modern, responsive design with Tailwind CSS
- DaisyUI component library
- Loading indicators
- Error handling and display
- Toast notifications
- Form validation

### Additional Features

- Messaging system (routes configured)
- User lists functionality
- Age calculation pipe
- Error testing endpoints
- Database seeding with sample data

## 🗄️ Database Schema

### Entities

**AppUser**

- `Id` (string, GUID)
- `DisplayName` (required string)
- `Email` (required string)
- `Password` (byte array - hashed)
- `PasswordSalt` (byte array)
- `ImageUrl` (optional string)
- Navigation: `Member`

**Member**

- `Id` (string, foreign key to AppUser)
- `DisplayName` (required string)
- `DateOfBirth` (DateOnly)
- `Gender` (required string)
- `City` (required string)
- `Country` (required string)
- `Description` (optional string)
- `ImageUrl` (optional string)
- `Created` (DateTime)
- `LastActive` (DateTime)
- Navigation: `Photos`, `User`

**Photo**

- `Id` (int, auto-increment)
- `Url` (required string)
- `PublicId` (optional string - Cloudinary ID)
- `MemberId` (string, foreign key)
- Navigation: `Member`

## 🔧 Configuration

### Backend Configuration (`appsettings.json`)

- Database connection string
- JWT Token key
- Cloudinary settings (API key, secret, cloud name)
- CORS origins (configured for Angular dev server)

### Frontend Configuration

- API base URL in environment files
- Route guards for protected pages
- HTTP interceptors for JWT and error handling

## 🚦 Getting Started

### Prerequisites

- .NET 9.0 SDK
- Node.js and npm
- Angular CLI
- SQLite (included with .NET)

### Backend Setup

1. Navigate to the `API` directory
2. Restore dependencies: `dotnet restore`
3. Run migrations: `dotnet ef database update` (or migrations run automatically on startup)
4. Configure `appsettings.json` with your Cloudinary credentials and JWT token key
5. Run the API: `dotnet run`

### Frontend Setup

1. Navigate to the `client` directory
2. Install dependencies: `npm install`
3. Configure API URL in `src/environments/environment.ts`
4. Run the development server: `npm start`
5. Open `http://localhost:4200` in your browser

## 📝 API Endpoints

### Authentication

- `POST /api/account/register` - Register new user
- `POST /api/account/login` - User login

### Members (Protected)

- `GET /api/members` - Get paginated member list
- `GET /api/members/{id}` - Get member by ID
- `PUT /api/members` - Update member profile
- `GET /api/members/{id}/photos` - Get member photos
- `POST /api/members/add-photo` - Upload photo
- `PUT /api/members/set-main-photo/{photoId}` - Set main photo
- `DELETE /api/members/delete-photo/{photoId}` - Delete photo

## 🔒 Security Features

- JWT Bearer token authentication
- Password hashing with HMACSHA512 and salt
- CORS configuration
- Authorization attributes on protected endpoints
- Route guards in Angular
- HTTP interceptors for token injection

## 🛠️ Development Notes

- Database migrations are automatically applied on application startup
- Sample user data is seeded on first run
- Exception middleware handles API errors globally
- Repository pattern used for data access
- Service layer for business logic separation

## 📄 License

This project is for educational/demonstration purposes.
