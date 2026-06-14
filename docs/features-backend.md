# Backend Features

Catalog of NestJS modules and API surface. Before adding a new module, check [shared-infrastructure.md](./shared-infrastructure.md) for existing utilities you can reuse.

## Active Modules (registered in `AppModule`)

| Module            | Path                         | Description                                                                          | Status |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------ | ------ |
| **Auth**          | `backend/src/auth/`          | JWT + refresh-token auth, Passport strategies, login/refresh, identity records       | Active |
| **Users**         | `backend/src/users/`         | User CRUD, passwords, avatars, login records, IP geolocation                         | Active |
| **Tasks**         | `backend/src/tasks/`         | Admin-managed scheduled/one-shot background tasks + execution logs                   | Active |
| **Notifications** | `backend/src/notifications/` | Admin alerts (errors/rate limits) and contact-request inbox                          | Active |
| **System**        | `backend/src/system/`        | Singleton runtime system config document in MongoDB                                  | Active |
| **Utils**         | `backend/src/utils/`         | Mutex locks, circuit breakers, crypto/string/date helpers, DB transactions           | Active |
| **Dashboard**     | `backend/src/dashboard/`     | Admin dashboard aggregate stats (users, login analytics)                             | Active |
| **Shared**        | `backend/src/shared/`        | Empty placeholder module; base classes imported directly                             | Active |
| **Me**            | `backend/src/me/`            | Stub — operations for the currently authenticated users; not imported in `AppModule` | Stub   |

## Standalone / Unregistered Modules

| Module          | Path                       | Description                                                 | Status               |
| --------------- | -------------------------- | ----------------------------------------------------------- | -------------------- |
| **Maintenance** | `backend/src/maintenance/` | DB seed script (`npm run init-db:dev`); seeds users + tasks | Standalone bootstrap |

## API Routes

All routes prefixed `/v1/`. Auth column: **Public**, **Admin**, **Manager**, or mixed.

### Auth (`/v1/auth`, `/v1/identities`)

| Method | Route           | Auth   | Description             |
| ------ | --------------- | ------ | ----------------------- |
| POST   | `/auth/login`   | Public | Username/password login |
| POST   | `/auth/refresh` | Public | Refresh access token    |
| GET    | `/identities`   | Admin  | List identity records   |

### Users (`/v1/users`, `/v1/login-records`)

| Method | Route                 | Auth  | Description            |
| ------ | --------------------- | ----- | ---------------------- |
| POST   | `/users`              | Admin | Create user            |
| GET    | `/users`              | Mixed | List users (paginated) |
| GET    | `/users/:id`          | Mixed | Get user by ID         |
| PUT    | `/users/:id`          | Mixed | Update user data       |
| PATCH  | `/users/:id/password` | Mixed | Change password        |
| PUT    | `/users/:id/avatar`   | Mixed | Upload avatar          |
| DELETE | `/users/:id`          | Admin | Delete user            |
| GET    | `/login-records`      | Admin | List login records     |

### Tasks (`/v1/tasks`, `/v1/task-logs`)

| Method | Route               | Auth  | Description              |
| ------ | ------------------- | ----- | ------------------------ |
| POST   | `/tasks`            | Admin | Create task              |
| GET    | `/tasks`            | Admin | List tasks               |
| GET    | `/tasks/:id`        | Admin | Get task                 |
| PATCH  | `/tasks/:id`        | Admin | Update task              |
| DELETE | `/tasks/:id`        | Admin | Delete task              |
| POST   | `/tasks/:id/start`  | Admin | Start task               |
| POST   | `/tasks/:id/stop`   | Admin | Stop task                |
| GET    | `/tasks/:id/status` | Admin | Get task status          |
| GET    | `/task-logs`        | Admin | List task execution logs |
| GET    | `/task-logs/:id`    | Admin | Get task log detail      |

### Notifications (`/v1/alerts`, `/v1/contact-request`)

| Method | Route                               | Auth  | Description           |
| ------ | ----------------------------------- | ----- | --------------------- |
| GET    | `/alerts`                           | Admin | List alerts           |
| PATCH  | `/alerts/:id/dismiss`               | Admin | Dismiss alert         |
| PATCH  | `/alerts/dismiss-all`               | Admin | Dismiss all alerts    |
| GET    | `/contact-request`                  | Admin | List contact requests |
| GET    | `/contact-request/:id`              | Admin | Get contact request   |
| PATCH  | `/contact-request/:id/mark-as-read` | Admin | Mark as read          |

> **Note:** `ContactRequestService.create()` exists but has no HTTP endpoint yet.

### System & Utils (`/v1/system-config`, `/v1/circuit-breakers`)

| Method | Route                         | Auth  | Description              |
| ------ | ----------------------------- | ----- | ------------------------ |
| GET    | `/system-config`              | Admin | Get system configuration |
| GET    | `/circuit-breakers`           | Admin | List circuit breakers    |
| GET    | `/circuit-breakers/:id`       | Admin | Get circuit breaker      |
| POST   | `/circuit-breakers/:id/reset` | Admin | Reset circuit breaker    |

### Dashboard (`/v1/dashboard`)

| Method | Route                                 | Auth           | Description            |
| ------ | ------------------------------------- | -------------- | ---------------------- |
| GET    | `/dashboard/users-tiles`              | Admin, Manager | User count tiles       |
| GET    | `/dashboard/login-records-by-device`  | Admin, Manager | Login stats by device  |
| GET    | `/dashboard/login-records-by-country` | Admin, Manager | Login stats by country |

## Contracts per Module

Shared types live in `backend/libs/contracts/src/`. Key exports:

| Module        | DTOs                                           | Queries                                    | Commands                                                                                               | Enums                                                          |
| ------------- | ---------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Auth          | `IdentityDto`                                  | `GetIdentitiesQuery`                       | `CreateIdentityCommand`, `CreateRefreshTokenCommand`                                                   | `IdentityProviderEnum`                                         |
| Users         | `UserDto`, `UserSettingsDto`, `LoginRecordDto` | `GetUsersQuery`, `GetLoginRecordsQuery`    | `CreateUserCommand`, `UpdateUserDataCommand`, `UpdateUserPasswordCommand`, `CreateUserSettingsCommand` | `UserRoleEnum`                                                 |
| Tasks         | `TaskDto`, `TaskLogDto`                        | `GetTasksQuery`, `GetTaskLogsQuery`        | `CreateTaskCommand`, `UpdateTaskCommand`                                                               | `TaskTypeEnum`, `TaskLogTypeEnum`                              |
| Notifications | `AlertDto`, `ContactRequestDto`                | `GetAlertsQuery`, `GetContactRequestQuery` | `ContactRequestCommand`                                                                                | `AlertTypeEnum`, `ContactRequestStatusEnum`, `ContactTypeEnum` |
| Utils         | `CircuitBreakerDto`                            | `GetCircuitBreakersQuery`                  | —                                                                                                      | `CircuitBreakerOperation`                                      |
| System        | `SystemConfigDto`                              | —                                          | —                                                                                                      | —                                                              |

## Reference Implementations

| Pattern            | Example                      |
| ------------------ | ---------------------------- |
| Full CRUD entity   | `backend/src/users/`         |
| Background task    | `backend/src/tasks/`         |
| Admin alerts       | `backend/src/notifications/` |
| Resilience tooling | `backend/src/utils/`         |

## Adding a New Entry

When you add a backend module or endpoint, append a row to the tables above:

```markdown
| **MyFeature** | `backend/src/my-feature/` | One-line description | Active |
```

Include API routes in the routes section and contracts in the contracts table. If the module exports reusable services, also update [shared-infrastructure.md](./shared-infrastructure.md).

## Last updated

2026-06-14
