# NestJS + Angular Starter

A production-ready starter template for building full-stack web applications with NestJS backend and Angular frontend. Includes authentication, user management, and common infrastructure patterns.

## Features

- **Backend (NestJS)**

  - JWT-based authentication with refresh tokens
  - Role-based access control (Admin, Manager, Regular)
  - MongoDB integration with Mongoose
  - RESTful API with validation and error handling
  - Task scheduling system
  - Notifications and alerts
  - Circuit breakers and utility services
  - Rate limiting and security guards
  - Shared contracts library (DTOs, Commands, Queries, Enums)

- **Frontend (Angular 20)**
  - Admin UI with Angular Material components
  - User UI (public-facing application)
  - Signals-based state management with local storage
  - Tailwind CSS configured
  - Shared common UI library
  - JWT authentication interceptors

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Configure MongoDB:**
   Update `backend/config/development.ts` with your MongoDB connection string:

   ```typescript
   mongoUri: "mongodb://localhost/nest-angular-starter";
   ```

3. **Initialize database:**

   ```bash
   cd backend
   npm run init-db:dev
   ```

   This creates the database and seeds users for each role (Admin, Manager, Regular).

4. **Start development servers:**

   ```bash
   # From project root
   npm run dev
   ```

   Or run individually:

   - Backend: `cd backend && npm run start:debug` (port 8200)
   - Admin UI: `cd frontend && npm run start:admin` (port 5100)
   - User UI: `cd frontend && npm run start:user` (port 5200)

## Project Structure

```
├── backend/          # NestJS backend (monorepo)
│   ├── src/          # Application modules
│   ├── libs/         # Shared libraries (contracts)
│   └── config/       # Environment configurations
├── frontend/         # Angular workspace
│   ├── projects/
│   │   ├── admin-ui/    # Admin dashboard (Material UI)
│   │   ├── user-ui/     # Public-facing app
│   │   └── common-ui/   # Shared components & services
└── package.json      # Root scripts
```

## Configuration

- **Backend config:** `backend/config/development.ts` (or `production.ts`, `stage.ts`)
- **Frontend config:** Environment files in `frontend/projects/*/src/environments/`
- **Shared contracts:** `backend/libs/contracts/src/` (automatically available in frontend via TypeScript path alias)

## Available Scripts

**Root:**

- `npm run dev` - Start all services in development mode
- `npm run dev:admin` - Start backend + admin UI
- `npm run dev:user` - Start backend + user UI
- `npm run build-prod` - Build all for production
- `npm run build-stage` - Build all for staging

**Backend:**

- `npm run start:dev` - Development with watch mode
- `npm run start:debug` - Development with debugger
- `npm run init-db:dev` - Initialize and seed database

**Frontend:**

- `npm run start:admin` - Serve admin UI
- `npm run start:user` - Serve user UI
- `npm run build-prod:admin` - Build admin UI for production
- `npm run build-prod:user` - Build user UI for production

## License

MIT
