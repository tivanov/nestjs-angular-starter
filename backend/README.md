# Backend (NestJS)

Main API application for the monorepo, built with NestJS and MongoDB (Mongoose).

## Structure

```text
backend/
├── src/                 # Main application modules/controllers/services
├── libs/contracts/src/  # Shared contracts for frontend and backend
├── config/              # development/stage/production config
└── test/                # E2E tests
```

## Key Points

- Uses NestJS 11, JWT auth, guards, schedulers, and validation.
- Persists data via Mongoose.
- Exposes shared DTOs/enums/commands/queries from `libs/contracts`.
- Frontend consumes contracts through `@app/contracts`.

## Setup

1. Install dependencies:

```bash
npm install
```

1. Configure MongoDB in `config/development.ts` (or stage/production files).
1. Generate OAuth state keys (required):

```bash
cd config
mkdir -p keys
cd keys
openssl genpkey -algorithm RSA -out statePrivateKey.pem
openssl rsa -pubout -in statePrivateKey.pem -out statePublicKey.pem
```

1. Seed development database:

```bash
npm run init-db:dev
```

## Scripts

- `npm run start` - start app
- `npm run start:dev` - watch mode
- `npm run start:debug` - watch mode with debugger
- `npm run start:prod` - run compiled app
- `npm run build` - build NestJS app
- `npm run build-stage` - stage build
- `npm run build-prod` - production build
- `npm run lint` - ESLint fix
- `npm run test` - unit tests
- `npm run test:e2e` - e2e tests
- `npm run test:cov` - test coverage

## Contracts Rule

Put only cross-layer/public API shapes in `libs/contracts`:

- DTOs
- Commands / Queries
- Enums / constants

Do not place backend-only internals there (private services, persistence models, implementation details).
