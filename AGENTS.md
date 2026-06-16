# Agent Instructions

Before building new features, consult the project catalog. After building, update it.

## Documentation Map

| Doc | Purpose |
|-----|---------|
| [docs/architecture.md](docs/architecture.md) | System design, layers, data flow |
| [docs/features-backend.md](docs/features-backend.md) | Backend modules and API routes |
| [docs/features-frontend.md](docs/features-frontend.md) | Admin/user UI features and API services |
| [docs/shared-infrastructure.md](docs/shared-infrastructure.md) | **Check first** — reusable base classes, services, and "do not duplicate" list |
| [docs/testing.md](docs/testing.md) | Backend test pyramid, conventions, templates, and run instructions |

## Workflow

### 1. Before building

1. Read [docs/shared-infrastructure.md](docs/shared-infrastructure.md).
2. Read the relevant feature doc ([backend](docs/features-backend.md) or [frontend](docs/features-frontend.md)).
3. Search for an existing capability before creating modules, services, utils, or admin feature areas.
4. Extend existing systems (e.g. new `TaskTypeEnum`, new query on `ShapeableQuery`) rather than parallel implementations.

### 2. When implementing

Follow domain Cursor rules for *how* to build:

- [.cursor/rules/monorepo-tech-patterns.mdc](.cursor/rules/monorepo-tech-patterns.mdc)
- [.cursor/rules/project-catalog.mdc](.cursor/rules/project-catalog.mdc)
- Backend: [.cursor/rules/nestjs.mdc](.cursor/rules/nestjs.mdc), [.cursor/rules/backend/](.cursor/rules/backend/)
- Frontend: [.cursor/rules/angular-20.mdc](.cursor/rules/angular-20.mdc), [.cursor/rules/frontend/admin-ui-entity-features.mdc](.cursor/rules/frontend/admin-ui-entity-features.mdc)

### 3. After building (required)

Update documentation in the same session/PR:

| Change type | Update |
|-------------|--------|
| New backend module or endpoint | [docs/features-backend.md](docs/features-backend.md) |
| New admin-ui feature or API service | [docs/features-frontend.md](docs/features-frontend.md) |
| New reusable base class, util, or infra | [docs/shared-infrastructure.md](docs/shared-infrastructure.md) |
| Architectural change (new app, new integration) | [docs/architecture.md](docs/architecture.md) |

Bump the **Last updated** date in each file you edit.

## Checklists

### New backend entity

- [ ] Contracts in `backend/libs/contracts/src/`
- [ ] Module in `backend/src/<entity>/` (model, services, controllers, mappers)
- [ ] Register in `AppModule` if active
- [ ] Update [docs/features-backend.md](docs/features-backend.md)
- [ ] Update [docs/shared-infrastructure.md](docs/shared-infrastructure.md) if exporting reusable services

### New admin-ui CRUD feature

- [ ] Backend module + contracts (see above)
- [ ] API service in `common-ui/services/`
- [ ] List + edit components in `admin-ui/features/<entity>/`
- [ ] Routes in `app.routes.ts` + side menu + FaIcon
- [ ] Update [docs/features-frontend.md](docs/features-frontend.md) and [docs/features-backend.md](docs/features-backend.md)

### New shared utility

- [ ] Confirm no equivalent in [docs/shared-infrastructure.md](docs/shared-infrastructure.md)
- [ ] Add to `UtilsModule` (backend) or `common-ui/utils/` (frontend)
- [ ] Update [docs/shared-infrastructure.md](docs/shared-infrastructure.md)
