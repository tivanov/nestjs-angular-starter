# Shared Infrastructure

**Anti-duplication index.** Before creating a new module, service, util class, or base component, search this document and the feature catalogs ([features-backend.md](./features-backend.md), [features-frontend.md](./features-frontend.md)).

## Do Not Build (Already Exists)

| If you need… | Use this instead | Do NOT create… |
|--------------|------------------|----------------|
| Background / scheduled jobs | `TasksModule` + `TaskTypeEnum` + task implementation | Bull queue, Redis queue, separate cron module |
| Distributed locking | `MutexService.execWithMutex()` | Custom lock collection or in-memory mutex |
| Failure isolation for external calls | `CircuitBreakersService.executeWithCircuitBreaker()` | Ad-hoc retry/circuit logic |
| MongoDB transactions | `DbTransactionsService.exec()` | Manual session management |
| String/date/number/crypto helpers | `UtilsModule` services | Duplicate util classes |
| Pagination / list queries | `ShapeableQuery` + `BaseService.get()` | Custom paging helpers or raw `find()` |
| CRUD service base | `BaseService<T>` | New generic repository layer |
| Model base fields | `BaseEntity` | Duplicate timestamp/createdBy schemas |
| Model → DTO mapping | `BaseMapper` + entity mappers | Inline mapping in controllers |
| HTTP API client (frontend) | `BaseApiService` + `queryToParams()` | New HTTP wrapper |
| Admin list page | `BaseListComponent<T>` | Custom table/paging component |
| Admin create/edit page | `BaseEditComponent<T>` | Custom form loading boilerplate |
| Auth session (frontend) | `AuthSignal`, `authInterceptor`, guards | New token storage / interceptor |
| Shared DTOs/enums | `@app/contracts` | Duplicate types in frontend or backend |
| Operational alerts | `AlertsService` | Separate notification/logging module |
| Domain HTTP errors | Custom exceptions in `shared/exceptions/` | Raw `HttpException` or generic errors |
| External HTTP client base | `BaseApiService` (backend) | New Axios wrapper (note: currently unused; prefer extending it) |

## Backend — Base Classes

| Class | Path | Use for |
|-------|------|---------|
| `BaseEntity` | `backend/src/shared/base/base-entity.ts` | All Mongoose models (`_id`, timestamps, `createdBy`) |
| `BaseService<T>` | `backend/src/shared/base/base-service.ts` | CRUD helpers, pagination, existence checks, bulk ops |
| `BaseMapper` | `backend/src/shared/base/base-mapper.ts` | ObjectId/string conversion, paged mapping |
| `BaseApiService` | `backend/src/shared/base/base-api.service.ts` | External HTTP clients (Axios error logging, rate-limit alerts) |

## Backend — Contracts

| Piece | Path | Use for |
|-------|------|---------|
| `ShapeableQuery` | `backend/libs/contracts/src/queries/shapeable-query.ts` | Base for all list/filter queries (`page`, `limit`, `sortBy`, `include`, …) |
| `PagedListDto<T>` | `backend/libs/contracts/src/dto/paged-list.dto.ts` | Standard list response shape |
| `ErrorCode` | `backend/libs/contracts/src/codes/error-codes.ts` | Shared error constants (frontend + backend) |
| Enums | `backend/libs/contracts/src/enums/` | Never redefine roles/types locally |

## Backend — Resilience & Concurrency

| Service | Path | Key method |
|---------|------|------------|
| `MutexService` | `backend/src/utils/services/mutex.service.ts` | `execWithMutex()` |
| `CircuitBreakersService` | `backend/src/utils/services/circuit-breakers.service.ts` | `executeWithCircuitBreaker()`, `reset()` |
| `DbTransactionsService` | `backend/src/utils/services/db-transactions.service.ts` | `exec(fn)` |

## Backend — Utility Services (`UtilsModule`)

| Service | Path | Role |
|---------|------|------|
| `CryptographyHelpersService` | `backend/src/utils/services/cryptography-helpers.service.ts` | AES encrypt/decrypt, HMAC, RSA sign/verify |
| `RandomService` | `backend/src/utils/services/random.service.ts` | Crypto-safe random int/float/string |
| `StringUtilsService` | `backend/src/utils/services/string-utils.service.ts` | Emoji strip, URL encode, hex |
| `DateUtilsService` | `backend/src/utils/services/date-utils.service.ts` | Start/end of day, date overlap |
| `NumberUtilsService` | `backend/src/utils/services/number-utils.service.ts` | Round, clamp |
| `EnumUtilsService` | `backend/src/utils/services/enum-utils.service.ts` | Enum conversion helpers |

## Backend — Auth & Security

| Component | Path | Role |
|-----------|------|------|
| `AuthService` | `backend/src/auth/services/auth.service.ts` | Login, JWT, refresh tokens |
| `JwtGuard`, `RolesGuard` | `backend/src/auth/guards/` | Route protection |
| `@Roles()` | `backend/src/auth/decorators/roles.decorator.ts` | RBAC metadata |
| `@LoggedInUser()` | `backend/src/shared/decorators/logged-in-user.decorator.ts` | Inject `req.user` |
| Custom exceptions | `backend/src/shared/exceptions/app-*.ts` | Domain HTTP errors |

## Backend — Background Tasks

| Component | Path | Role |
|-----------|------|------|
| `TasksRuntimeService` | `backend/src/tasks/services/tasks-runtime.service.ts` | Polls MongoDB tasks, registers cron/timeout jobs |
| `TasksService` | `backend/src/tasks/services/tasks.service.ts` | Task CRUD + running flags |
| `TaskLogsService` | `backend/src/tasks/services/task-logs.service.ts` | Execution log persistence |
| `TaskImplementations` | `backend/src/tasks/implementations/task-implementations.ts` | Registry: `TaskTypeEnum` → runner |
| `TasksDefinition` | `backend/src/tasks/definitions.ts` | Seed definitions for default tasks |

**To add new background work:** add `TaskTypeEnum` value, create implementation, register in `TaskImplementations`, optionally seed in `definitions.ts`.

## Backend — Notifications

| Service | Path | Role |
|---------|------|------|
| `AlertsService` | `backend/src/notifications/services/alerts.service.ts` | Operational error/rate-limit notifications |
| `ContactRequestService` | `backend/src/notifications/services/contact-request.service.ts` | Contact form inbox |

## Frontend — Base Classes

| Class | Path | Use for |
|-------|------|---------|
| `BaseComponent` | `frontend/projects/common-ui/base/base.component.ts` | All components: auth signal, error extraction, mobile detection |
| `BaseService` | `frontend/projects/common-ui/base/base.service.ts` | Non-HTTP services: subscription cleanup |
| `BaseApiService` | `frontend/projects/common-ui/base/base-api.service.ts` | HTTP services: `HttpClient`, `queryToParams()` |
| `BaseListComponent<T>` | `frontend/projects/common-ui/base/base-list.component.ts` | Admin list pages: paging, filters, MatTable |
| `BaseEditComponent<T>` | `frontend/projects/common-ui/base/base-edit.component.ts` | Admin create/edit/detail pages |
| `BasePickerComponent<T>` | `frontend/projects/common-ui/base/base-picker.component.ts` | Entity picker controls (no concrete pickers yet) |
| `BaseInputComponent` | `frontend/projects/common-ui/base/base-input.component.ts` | Reusable form input (no concrete inputs yet) |
| `BaseButtonComponent` | `frontend/projects/common-ui/base/base-button.component.ts` | Reusable button (no concrete buttons yet) |

## Frontend — Auth

| Piece | Path | Role |
|-------|------|------|
| `AuthSignal` | `frontend/projects/common-ui/auth/auth.signal.ts` | Signal + localStorage session state |
| `authInterceptor` | `frontend/projects/common-ui/auth/http-auth.interceptor.ts` | Bearer token, auto-refresh on 401 |
| `isLoggedIn` guard | `frontend/projects/common-ui/auth/is-logged-in.guard.ts` | Redirect unauthenticated users |
| `hasRole` guard | `frontend/projects/common-ui/auth/has-role.guard.ts` | Check `route.data.roles` |

## Frontend — Pipes

| Pipe | Path | Purpose |
|------|------|---------|
| `StatusEnumPipe` | `common-ui/pipes/status-enum.pipe.ts` | Enum strings → title case |
| `TimeAgoPipe` | `common-ui/pipes/time-ago.pipe.ts` | Relative time |
| `ShortNumberPipe` | `common-ui/pipes/short-number.pipe.ts` | Abbreviated numbers (K, M) |
| `PrettyJsonPipe` | `common-ui/pipes/pretty-json.pipe.ts` | JSON formatting |
| `SafeUrlPipe` | `common-ui/pipes/safe-url.pipe.ts` | Sanitized URLs |
| `TxHashPipe` | `common-ui/pipes/tx-hash.pipe.ts` | Transaction hash display (`CryptoNetworkEnum`) |
| `CryptoNetworkPipe` | `common-ui/pipes/crypto-network.pipe.ts` | Crypto network labels (`CryptoNetworkEnum`) |

## Frontend — Utils

| Utility | Path | Purpose |
|---------|------|---------|
| `StringUtils` | `common-ui/utils/string-utils.ts` | randomString, hex, title case, kebab/camel |
| `DateUtils` | `common-ui/utils/date-utils.ts` | Date helpers |
| `NumberUtils` | `common-ui/utils/number-utils.ts` | Number helpers |

## Frontend — Dialog System (built, unused)

`DialogService`, `DialogComponent`, `DialogRef` in `common-ui/dialog/` — use this before building a new modal system.

## Adding a New Reusable Piece

When you introduce infrastructure others should reuse, append a row to the relevant table above and note which feature doc references it.

```markdown
| `MyHelperService` | `backend/src/utils/services/my-helper.service.ts` | One-line role |
```

## Last updated

2026-06-15
