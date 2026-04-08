# Zavisi Monorepo

Monorepo with a NestJS backend and an Angular frontend.

## Tech Stack

- Backend: NestJS 11 + MongoDB/Mongoose
- Frontend: Angular 21 + Angular Material + Tailwind CSS
- Shared contracts: `backend/libs/contracts` (DTOs, commands, queries, enums, constants)

## Repository Structure

```text
.
├── backend/
│   ├── src/                 # Main NestJS application
│   ├── libs/contracts/src/  # Shared FE/BE contracts
│   └── config/              # Environment config + OAuth state keys
├── frontend/
│   ├── projects/admin-ui/   # Admin Angular app
│   ├── projects/user-ui/    # User Angular app
│   └── projects/common-ui/  # Shared frontend code
└── package.json             # Root orchestration scripts
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB

## Quick Start

1. Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

1. Configure MongoDB in `backend/config/development.ts`.
1. Generate OAuth state keys:

```bash
cd backend/config
mkdir -p keys
cd keys
openssl genpkey -algorithm RSA -out statePrivateKey.pem
openssl rsa -pubout -in statePrivateKey.pem -out statePublicKey.pem
```

1. Initialize database:

```bash
cd backend
npm run init-db:dev
```

1. Start services from repo root:

```bash
npm run dev
```

## Shared Contracts Workflow

- Define cross-layer types in `backend/libs/contracts/src`.
- Consume contracts from frontend via `@app/contracts` path alias.
- For API shape changes: update contracts first, then backend handlers, then frontend usage.

## Root Scripts

- `npm run dev` - backend + admin-ui + user-ui
- `npm run dev:admin` - backend + admin-ui
- `npm run dev:user` - backend + user-ui
- `npm run build-prod` - production build for backend and frontend
- `npm run build-stage` - stage build for backend and frontend

## More Docs

- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`
