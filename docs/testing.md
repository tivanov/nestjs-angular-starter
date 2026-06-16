# Testing

**Last updated:** 2026-06-14

Backend-first testing guide for this monorepo. Frontend testing is planned for a later phase.

## Test pyramid

| Type | Pattern | Location | Speed | Purpose |
|------|---------|----------|-------|---------|
| **Unit** | `*.spec.ts` | Co-located in `backend/src/`, `backend/libs/` | Fast | Business logic, mappers, utils; mock DB and external deps |
| **E2E** | `*.e2e-spec.ts` | `backend/test/` | Slow | HTTP: routing, guards, validation, happy paths via real `AppModule` + MongoDB |

Target ratio as the suite grows: ~70% unit, ~20% integration, ~10% e2e. Add tests when you touch a module — do not try to cover all 21 services at once.

## Running tests

```bash
# From repo root (unit + e2e)
npm test

# Backend only
cd backend && npm test              # unit
cd backend && npm run test:watch    # unit, watch mode
cd backend && npm run test:cov      # unit + coverage report
cd backend && npm run test:e2e      # e2e (requires MongoDB)
```

E2E tests use the MongoDB URI from `backend/config/development.ts` (`mongodb://localhost/nest-angular-starter`). CI starts MongoDB 7 as a service.

## Conventions

- **Arrange → Act → Assert** in every test.
- Name variables clearly: `inputX`, `mockX`, `actualX`, `expectedX`.
- One behavior per `it()` block.
- Co-locate unit tests next to the file they test (`foo.service.ts` → `foo.service.spec.ts`).
- E2e files are grouped by domain module (`auth.e2e-spec.ts`, `users.e2e-spec.ts`).
- **Do not** add `admin/test` smoke endpoints on controllers — use e2e tests instead.

## Shared e2e helpers

Located in [`backend/test/support/`](../backend/test/support/):

| File | Purpose |
|------|---------|
| `create-test-app.ts` | Bootstrap Nest app with versioning + `ValidationPipe` |
| `e2e-db.ts` | `clearDatabase(app)` between tests |
| `auth.helper.ts` | `seedAdminUser`, `loginAsAdmin` for protected routes |
| `mocks/config.mock.ts` | `createMockConfigService()` for unit tests |

## Templates

### Pure unit test (mapper / static util)

No `TestingModule` needed:

```typescript
describe('UserMappers', () => {
  it('maps user fields to UserDto', () => {
    const inputUser = { /* plain object with _id, fields */ };
    const actual = UserMappers.toDto(inputUser);
    expect(actual.id).toBe(inputUser._id.toHexString());
  });
});
```

### Nest service with mocked dependencies

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../model/user.model';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    paginate: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: LoginRecordsService, useValue: { addInBackground: jest.fn() } },
        { provide: IdentitiesService, useValue: { getValid: jest.fn() } },
        { provide: ConfigService, useValue: createMockConfigService() },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('filters by role when query.role is set', async () => {
    mockUserModel.paginate.mockResolvedValue({ docs: [], totalDocs: 0 });
    await service.get({ role: UserRoleEnum.Admin } as GetUsersQuery);
    expect(mockUserModel.paginate).toHaveBeenCalledWith(
      expect.objectContaining({ role: UserRoleEnum.Admin }),
      expect.any(Object),
    );
  });
});
```

**Rule:** assert service *behavior* (filters, exceptions, return shapes) — not that Mongoose works.

### E2E HTTP test

```typescript
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, closeTestApp } from './support/create-test-app';
import { clearDatabase } from './support/e2e-db';
import { loginAsAdmin, seedAdminUser } from './support/auth.helper';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
    await clearDatabase(app);
    await seedAdminUser(app);
  });

  afterEach(async () => {
    await closeTestApp(app);
  });

  it('POST /v1/auth/login returns token for valid credentials', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ userName: 'e2e-admin', password: 'e2e-admin-pass' })
      .expect(201)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
      });
  });
});
```

## What to test when you change code

| Change | Add/update |
|--------|------------|
| Service business logic | Unit test for new/changed public method |
| Mapper field mapping | Unit test for new DTO fields |
| Controller route/guard/validation | E2e test for HTTP status + response shape |
| Shared util in `UtilsModule` | Unit test co-located with service |
| Contract enum/query only | Usually nothing |

## What not to test

- NestJS framework behavior (pipes, decorators)
- Third-party library internals (JWT, bcrypt)
- Trivial one-line delegations
- Every DTO field unless custom validation logic exists

## Coverage policy

Run `npm run test:cov` locally to inspect `backend/coverage/`.

Jest collects coverage from `src/**/*.ts` (excluding `main.ts` and `*.module.ts`).

Enable `coverageThreshold` at ~30% lines once the suite has ~10 unit spec files, then ramp toward 60–70% on services and mappers over time.

## CI

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs backend unit tests, then e2e tests, on every push/PR to `main`/`master`.
