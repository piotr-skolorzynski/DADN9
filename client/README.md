# Dating App Client - Angular Frontend Application

A modern Angular 21 frontend application for a dating platform, built with TypeScript, Tailwind CSS, and DaisyUI components.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Using Docker](#using-docker)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Features](#features)
- [Architecture](#architecture)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### For Local Development

- **Node.js** (v18 or later) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Angular CLI** (optional, can use npx)

Verify your installation:

```bash
node --version
npm --version
```

### For Docker (Recommended)

- **Docker** (version 20.10 or later) - [Download](https://www.docker.com/get-started)
- **Docker Compose** (version 2.0 or later)

Verify your Docker installation:

```bash
docker --version
docker compose version
```

**Note**: Using Docker is recommended as it handles all dependencies and provides a consistent environment. The client runs alongside the API and database in a single command.

## 📦 Installation

1. **Navigate to the client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install all required packages including:
   - Angular 21 framework
   - Tailwind CSS 4
   - DaisyUI components
   - RxJS for reactive programming
   - TypeScript

## ⚙️ Configuration

### Environment Configuration

Configure the API URL in environment files:

#### Development (`src/environments/environment.development.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api/',
};
```

#### Production (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'api/', // Relative URL for same domain deployment
};
```

**Important:** Update the `apiUrl` to match your backend API URL:

- **Development**: Usually `https://localhost:5001/api/` or `http://localhost:5000/api/`
- **Production**: Your production API URL

### API Configuration

Ensure the backend API is running and accessible at the configured URL. The frontend expects:

- CORS enabled for the frontend origin
- JWT token-based authentication
- RESTful API endpoints

## 🚀 Running the Application

### Using Docker

The easiest way to run the client is using Docker Compose from the project root directory.

#### Prerequisites for Docker

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)

#### Quick Start with Docker

1. **Navigate to the project root directory:**
   ```bash
   cd ..  # If you're in the client directory
   ```

2. **Copy the environment example file:**
   ```bash
   cp env.example .env
   ```

3. **Edit `.env` file** with your configuration:
   - Set `CLIENT_API_URL` to your API URL (e.g., `http://localhost:5000/api/`)
   - Configure other required variables (see main README or DOCKER.md)

4. **Start all services (Client, API, Database):**
   ```bash
   # Production mode
   docker compose up -d --build
   
   # Development mode (with hot-reload)
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

5. **Access the application:**
   - **URL**: http://localhost:4200
   - **Hot-reload**: Enabled in development mode

#### Docker Commands

```bash
# View logs
docker compose logs -f client

# Stop services
docker compose down

# Restart client service
docker compose restart client

# Execute commands in client container
docker compose exec client sh
```

#### Development Mode with Docker

For development with hot-reload (automatic browser refresh on code changes):

```bash
# Start in development mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# View development logs
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f client
```

In development mode:
- Source code is mounted as a volume
- Changes to `.ts`, `.html`, `.css` files automatically reload in browser
- Uses `ng serve` with file polling for hot-reload

For more Docker details, see the main [DOCKER.md](../DOCKER.md) file.

### Local Development

If you prefer to run the client locally without Docker:

#### Prerequisites

- **Node.js** (v18 or later)
- **npm** (comes with Node.js)

#### Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

   Or using Angular CLI directly:
   ```bash
   ng serve
   ```

3. **The application will be available at:**
   - **URL**: `http://localhost:4200`
   - **Auto-reload**: Enabled (changes trigger automatic browser refresh)

#### Development Server Options

```bash
# Run on different port
ng serve --port 4201

# Open browser automatically
ng serve --open

# Use different host
ng serve --host 0.0.0.0
```

#### Watch Mode

The development server automatically watches for file changes and reloads the browser.

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── core/                    # Core Module (singleton services, guards)
│   │   │   ├── guards/              # Route Guards
│   │   │   │   ├── auth-guard.ts           # Authentication guard
│   │   │   │   └── prevent-unsaved-changes-guard.ts
│   │   │   ├── interceptors/        # HTTP Interceptors
│   │   │   │   ├── jwt-interceptor.ts      # JWT token injection
│   │   │   │   ├── error-interceptor.ts    # Global error handling
│   │   │   │   └── loading-interceptor.ts  # Loading state management
│   │   │   ├── services/            # Core Services
│   │   │   │   ├── account-service.ts      # Authentication service
│   │   │   │   ├── member-service.ts       # Member data service
│   │   │   │   ├── toast-service.ts        # Toast notifications
│   │   │   │   └── busy-service.ts         # Loading state service
│   │   │   ├── resolvers/           # Route Resolvers
│   │   │   │   └── member-resolver.ts      # Pre-fetch member data
│   │   │   ├── pipes/               # Custom Pipes
│   │   │   │   └── age-pipe.ts             # Calculate age from date
│   │   │   └── helpers/             # Helper Functions
│   │   │
│   │   ├── features/                # Feature Modules
│   │   │   ├── account/             # Authentication Feature
│   │   │   │   └── register/               # Registration component
│   │   │   ├── home/                # Home Page
│   │   │   ├── members/             # Member Management
│   │   │   │   ├── member-list/            # Member listing page
│   │   │   │   ├── member-detailed/        # Member detail container
│   │   │   │   ├── member-profile/          # Profile editing
│   │   │   │   ├── member-photos/           # Photo management
│   │   │   │   ├── member-messages/         # Member messages
│   │   │   │   └── member-card/             # Member card component
│   │   │   ├── messages/            # Messaging Feature
│   │   │   ├── lists/               # User Lists
│   │   │   └── test-errors/         # Error Testing Page
│   │   │
│   │   ├── shared/                  # Shared Components
│   │   │   ├── text-input/          # Reusable text input
│   │   │   ├── image-upload/        # Image upload component
│   │   │   ├── delete-button/       # Delete action button
│   │   │   ├── star-button/         # Favorite/star button
│   │   │   └── errors/              # Error Components
│   │   │       ├── not-found/              # 404 page
│   │   │       └── server-error/           # 500 page
│   │   │
│   │   ├── layout/                  # Layout Components
│   │   │   ├── nav/                 # Navigation component
│   │   │   └── themes.ts            # Theme configuration
│   │   │
│   │   ├── models/                  # TypeScript Interfaces
│   │   │   └── interfaces/          # Data model interfaces
│   │   │       ├── user.interface.ts
│   │   │       ├── member.interface.ts
│   │   │       ├── photo.interface.ts
│   │   │       └── ...
│   │   │
│   │   ├── app.routes.ts            # Route Configuration
│   │   ├── app.ts                   # Root Component
│   │   └── app.config.ts            # Application Configuration
│   │
│   ├── environments/                # Environment Configuration
│   │   ├── environment.ts           # Production environment
│   │   └── environment.development.ts  # Development environment
│   │
│   ├── index.html                   # Main HTML file
│   ├── main.ts                      # Application Bootstrap
│   └── styles.css                   # Global Styles
│
├── angular.json                     # Angular CLI Configuration
├── package.json                     # Dependencies and Scripts
├── tsconfig.json                    # TypeScript Configuration
└── tailwind.config.js               # Tailwind CSS Configuration (if exists)
```

## ✨ Features

### Authentication

- User registration with form validation
- Login with email and password
- JWT token storage in browser
- Automatic token injection via HTTP interceptor
- Protected routes with authentication guard
- Session persistence

### Member Management

- **Member List**: Paginated list of all members
- **Member Details**: View detailed member profile
- **Profile Editing**: Update own profile with unsaved changes guard
- **Photo Gallery**: View and manage member photos
- **Member Cards**: Reusable card component for member display

### Photo Management

- Upload photos via drag-and-drop or file picker
- Set main profile photo
- Delete photos
- Photo gallery display
- Image preview

### User Interface

- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Modern UI**: DaisyUI component library
- **Loading States**: Loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error notifications
- **Form Validation**: Real-time form validation
- **Theme Support**: Theme configuration available

### Routing

- Protected routes requiring authentication
- Nested routes for member detail pages
- Route resolvers for data pre-fetching
- Unsaved changes guard for forms

## 🏗️ Architecture

### Component Architecture

- **Feature-based structure**: Components organized by feature
- **Shared components**: Reusable UI components
- **Layout components**: Navigation and layout structure

### Services

- **Account Service**: Authentication and user management
- **Member Service**: Member data operations
- **Toast Service**: Notification management
- **Busy Service**: Loading state management

### HTTP Interceptors

1. **JWT Interceptor**: Automatically adds JWT token to requests
2. **Error Interceptor**: Handles API errors globally
3. **Loading Interceptor**: Manages loading states

### Route Guards

- **Auth Guard**: Protects routes requiring authentication
- **Prevent Unsaved Changes Guard**: Warns before leaving unsaved forms

### State Management

- Services with RxJS observables for reactive state
- Local component state for UI-specific data
- Token stored in browser (consider secure storage for production)

## 🏭 Building for Production

### Build the Application

```bash
npm run build
```

Or using Angular CLI:

```bash
ng build
```

This creates an optimized production build in the `dist/` directory.

### Production Build Options

```bash
# Build with production configuration
ng build --configuration production

# Build with base href for deployment
ng build --base-href /dating-app/

# Output to specific directory
ng build --output-path dist/production
```

### Deployment

The `dist/` folder contains the production-ready application. Deploy this folder to:

- **Static hosting**: Netlify, Vercel, GitHub Pages
- **Web server**: Nginx, Apache, IIS
- **CDN**: CloudFront, Cloudflare

**Important for Production:**

1. Update `environment.ts` with production API URL
2. Ensure CORS is configured on backend for production domain
3. Use HTTPS in production
4. Consider implementing secure token storage
5. Enable production optimizations in `angular.json`

## 🧪 Testing

### Unit Tests

Run unit tests:

```bash
npm test
```

Or using Angular CLI:

```bash
ng test
```

### Code Scaffolding

Generate new components, services, etc.:

```bash
# Generate a component
ng generate component feature-name/component-name

# Generate a service
ng generate service core/services/service-name

# Generate a guard
ng generate guard core/guards/guard-name
```

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Errors

- Verify backend API is running
- Check `apiUrl` in environment files or `CLIENT_API_URL` in `.env` file
- Ensure CORS is enabled on backend
- Check browser console for detailed error messages

#### 2. Authentication Issues

- Clear browser localStorage: `localStorage.clear()`
- Verify JWT token is being stored
- Check token expiration (if implemented)
- Verify token format in browser DevTools

#### 3. Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
ng cache clean
```

#### 4. Port Already in Use

```bash
# Use different port locally
ng serve --port 4201

# Or in Docker, change CLIENT_PORT in .env file
```

#### 5. TypeScript Errors

- Ensure all dependencies are installed: `npm install`
- Check TypeScript version compatibility
- Verify `tsconfig.json` configuration

#### 6. Tailwind CSS Not Working

- Verify Tailwind is installed: `npm list tailwindcss`
- Check `styles.css` for Tailwind directives
- Ensure PostCSS is configured

### Docker-Specific Issues

#### Container Won't Start

1. **Check Docker logs:**
   ```bash
   docker compose logs client
   ```

2. **Verify environment variables:**
   ```bash
   docker compose config
   ```

3. **Check if API is running:**
   ```bash
   docker compose ps api
   ```

#### Client Not Loading in Browser

1. **Check client logs:**
   ```bash
   docker compose logs client
   ```

2. **Verify API URL in build:**
   - Check `CLIENT_API_URL` in `.env` file
   - Rebuild client: `docker compose up -d --build client`

3. **Check browser console for CORS errors:**
   - Verify `CORS_ALLOWED_ORIGINS` includes client URL

#### Hot-Reload Not Working in Development Mode

1. **Verify you're using development compose file:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
   ```

2. **Check volume mounts:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec client ls -la /app
   ```

3. **Check if ng serve is running:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs client | grep -i "compiled"
   ```

4. **Restart development services:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml restart client
   ```

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **IE11**: Not supported (Angular 21 requires modern browsers)

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 🔐 Security Notes

- **Token Storage**: Currently stored in browser (consider httpOnly cookies for production)
- **XSS Protection**: Angular provides built-in XSS protection
- **HTTPS**: Always use HTTPS in production
- **CORS**: Ensure proper CORS configuration on backend
- **Input Validation**: Validate all user inputs
- **Content Security Policy**: Consider implementing CSP headers

## 📝 Development Notes

- **Hot Reload**: Enabled by default in development
- **Source Maps**: Enabled for debugging
- **Lazy Loading**: Consider implementing for large applications
- **Code Splitting**: Automatic with Angular CLI
- **Tree Shaking**: Automatic in production builds
- **AOT Compilation**: Enabled by default

## 🎨 Styling

The application uses:

- **Tailwind CSS 4**: Utility-first CSS framework
- **DaisyUI**: Component library built on Tailwind
- **Custom Styles**: Global styles in `styles.css`

To customize:

1. Modify `tailwind.config.js` (if exists)
2. Update `styles.css` for global styles
3. Use Tailwind utility classes in components
4. Use DaisyUI components for UI elements
