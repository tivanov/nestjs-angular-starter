# Frontend Features

Catalog of Angular apps, admin feature areas, and common-ui API services. Before adding UI or HTTP clients, check [shared-infrastructure.md](./shared-infrastructure.md).

## Applications

| App | Path | Port | Description | Status |
|-----|------|------|-------------|--------|
| **admin-ui** | `frontend/projects/admin-ui/` | 5100 | Role-gated admin dashboard (Material UI) | Active |
| **user-ui** | `frontend/projects/user-ui/` | 5200 | Public-facing app shell | Minimal starter |
| **common-ui** | `frontend/projects/common-ui/` | — | Shared services, base classes, auth, pipes | Shared layer |

## admin-ui Feature Areas

Top-level routes defined in `frontend/projects/admin-ui/src/app/app.routes.ts`. All authenticated routes use `LayoutComponent` with `isLoggedIn` + `hasRole` guards.

| Feature | Route prefix | Roles | Routes file | API service(s) | Description |
|---------|-------------|-------|-------------|----------------|-------------|
| **Auth** | `/auth` | Public | `features/auth/auth.routes.ts` | `AuthService` | Login page; redirects by role after login |
| **Dashboard** | `/dashboard` | Admin, Manager | `features/dashboard/dashboard.routes.ts` | `DashboardService`, `AlertsService` | Widgets: user tiles, login charts, alerts |
| **Users** | `/users` | Admin | `features/users/users.routes.ts` | `UsersService`, `LoginRecordsService` | User list, create/edit, password, avatar, embedded login records |
| **Tasks** | `/tasks` | Admin | `features/tasks/tasks.routes.ts` | `TasksService`, `TaskLogsService` | Task list, create/edit, start/stop, global and embedded task logs |
| **Contact Requests** | `/contact-requests` | Admin | `features/contact-requests/contact-requests.routes.ts` | `ContactRequestsService` | Inbound contact form list and detail |
| **System Settings** | `/system-settings` | Admin | `features/system-settings/system-settings.routes.ts` | `SystemConfigService` | Read-only system config view |
| **System Health** | `/system-health` | Admin | `features/system-health/system-health.routes.ts` | `HealthService` | Application health check status |
| **Circuit Breakers** | `/circuit-breakers` | Admin | `features/circuit-breaker/circuit-breaker.routes.ts` | `CircuitBreakersService` | List and detail with reset action |

### Route Details

#### Auth
| Route | Component | Description |
|-------|-----------|-------------|
| `/auth/login` | `LoginComponent` | Username/password login |

#### Dashboard
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `DashboardComponent` | Dashboard landing with widgets |

Widgets: `UserTilesWidgetComponent`, `LoginRecordsByDeviceWidgetComponent`, `LoginRecordsByCountryWidgetComponent`, `AlertsWidgetComponent`.

#### Users
| Route | Component | Description |
|-------|-----------|-------------|
| `/users/list` | `UsersListComponent` | Filterable paginated user table |
| `/users/create` | `UserComponent` | Create user form |
| `/users/:id` | `UserComponent` | Edit user, change password, login records |

#### Tasks
| Route | Component | Description |
|-------|-----------|-------------|
| `/tasks/list` | `TasksListComponent` | Task list with start/stop toggles |
| `/tasks/create` | `TaskComponent` | Create task |
| `/tasks/:id` | `TaskComponent` | Edit task, embedded task logs |
| `/tasks/logs` | `TaskLogsListComponent` | Global task log list |
| `/tasks/logs/:id` | `TaskLogComponent` | Task log detail |

#### Contact Requests
| Route | Component | Description |
|-------|-----------|-------------|
| `/contact-requests/list` | `ContactRequestsListComponent` | Filterable contact request list |
| `/contact-requests/:id` | `ContactRequestComponent` | View and mark as read |

#### System Settings
| Route | Component | Description |
|-------|-----------|-------------|
| `/system-settings` | `SystemSettingsComponent` | Read-only system config |

#### System Health
| Route | Component | Description |
|-------|-----------|-------------|
| `/system-health` | `SystemHealthComponent` | MongoDB and overall app health via Terminus |

#### Circuit Breakers
| Route | Component | Description |
|-------|-----------|-------------|
| `/circuit-breakers/list` | `CircuitBreakersListComponent` | Filterable circuit breaker list |
| `/circuit-breakers/:id` | `CircuitBreakerComponent` | View and reset breaker |

### admin-ui Core Components (not feature routes)

| Component | Path | Description |
|-----------|------|-------------|
| `CardComponent` | `core/components/card/` | Content card wrapper |
| `SpinnerComponent` | `core/components/spinner/` | Loading overlay |
| `AppTextComponent` | `core/components/text/` | Read-only labeled text |
| `ValidationErrorComponent` | `core/components/validation-error/` | Form validation messages |
| `SectionDividerComponent` | `core/components/section-divider/` | Section separator |

### Side Menu

Menu items registered in `layout/side-menu/side-menu.service.ts`. Icons must be registered in `AppComponent` FaIconLibrary.

## user-ui Features

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/` | `HomeComponent` | Placeholder home page | Active |
| — | `MainLayoutComponent` | Shell wrapper with router outlet | Active |

No feature folders, no lazy routes, no backend API calls yet. Uses `BaseComponent` and `EnvironmentService` from common-ui only.

## common-ui API Services

All extend `BaseApiService` and call `${env.apiUrl}/...`. Located in `frontend/projects/common-ui/services/`.

| Service | Backend endpoints | Used by |
|---------|-------------------|---------|
| `AuthService` | `POST /auth/login`, `POST /auth/refresh` | admin-ui auth |
| `UsersService` | CRUD `/users`, password, avatar | admin-ui users |
| `TasksService` | CRUD `/tasks`, start/stop/status | admin-ui tasks |
| `TaskLogsService` | `GET /task-logs`, `GET /task-logs/:id` | admin-ui tasks |
| `LoginRecordsService` | `GET /login-records` | admin-ui users |
| `AlertsService` | `GET /alerts`, dismiss actions | admin-ui dashboard |
| `ContactRequestsService` | `GET /contact-request`, mark-as-read | admin-ui contact-requests |
| `CircuitBreakersService` | `GET /circuit-breakers`, reset | admin-ui circuit-breakers |
| `DashboardService` | `GET /dashboard/*` | admin-ui dashboard |
| `SystemConfigService` | `GET /system-config` | admin-ui system-settings |
| `HealthService` | `GET /health` | admin-ui system-health |
| `EnvironmentService` | — (reads `window.__env`) | Both apps |
| `MeService` | `GET /me` | **Stub** — backend endpoint active; service not wired |
| `GlobalWipService` | — (localStorage drafts) | **Unused** |

## Stubs and Unused Pieces

| Piece | Path | Notes |
|-------|------|-------|
| `MeService` | `common-ui/services/me.service.ts` | Empty stub; backend `GET /v1/me` is active |
| `DialogService` | `common-ui/dialog/` | Built but not integrated in either app |
| `BasePickerComponent` | `common-ui/base/base-picker.component.ts` | No concrete subclasses |
| `BaseInputComponent` | `common-ui/base/base-input.component.ts` | No concrete subclasses |
| `BaseButtonComponent` | `common-ui/base/base-button.component.ts` | No concrete subclasses |
| `GlobalWipService` | `common-ui/services/global-wip.service.ts` | `WipSection` enum empty |

## Reference Implementations

| Pattern | Example path |
|---------|--------------|
| Full CRUD entity | `admin-ui/src/app/features/users/` |
| List + detail (read-only actions) | `admin-ui/src/app/features/contact-requests/` |
| List + admin actions | `admin-ui/src/app/features/circuit-breaker/` |
| System read-only config | `admin-ui/src/app/features/system-settings/` |
| Nested sub-lists | `admin-ui/src/app/features/tasks/` (logs), `features/users/` (login records) |
| Dashboard widgets | `admin-ui/src/app/features/dashboard/` |

## Adding a New admin-ui Entity (Checklist)

1. Contracts → `backend/libs/contracts/src/{dto,queries,commands,enums}/`
2. Backend module → `backend/src/<entity>/`
3. API service → `common-ui/services/<entity>.service.ts`
4. List page → `admin-ui/features/<entity>/<entity>-list/` (extends `BaseListComponent`)
5. Edit/create → `admin-ui/features/<entity>/<entity>/` (extends `BaseEditComponent`)
6. Routes → `admin-ui/features/<entity>/<entity>.routes.ts`
7. Register → `admin-ui/app.routes.ts` + `side-menu.service.ts` + FaIcon in `app.component.ts`
8. Update this doc and [features-backend.md](./features-backend.md)

See `.cursor/rules/frontend/admin-ui-entity-features.mdc` for detailed patterns.

## Adding a New Entry

```markdown
| **MyFeature** | `/my-feature` | Admin | `features/my-feature/my-feature.routes.ts` | `MyFeatureService` | One-line description |
```

## Last updated

2026-06-15
