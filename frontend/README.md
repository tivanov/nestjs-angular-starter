# Frontend (Angular Workspace)

Angular workspace containing two apps and shared frontend code.

## Projects

```text
frontend/projects/
├── admin-ui/   # Admin application (Angular Material + Tailwind)
├── user-ui/    # User application (Tailwind)
└── common-ui/  # Shared frontend code (services, base classes, pipes, auth utils)
```

## Stack

- Angular 21
- Angular Material (used in `admin-ui`)
- Tailwind CSS 4
- RxJS
- Shared contract imports from `@app/contracts`

## Contracts Integration

The workspace maps `@app/contracts` to `../backend/libs/contracts/src` in `frontend/tsconfig.json`.

When backend API payloads change:

1. Update contracts in backend `libs/contracts`.
2. Update backend implementation.
3. Update frontend consumers.

## Scripts

- `npm run start:admin` - run `admin-ui` on `5100`
- `npm run start:user` - run `user-ui` on `5200`
- `npm run build:admin` - build `admin-ui`
- `npm run build:user` - build `user-ui`
- `npm run build-prod:admin` - production build for `admin-ui`
- `npm run build-prod:user` - production build for `user-ui`
- `npm run build-stage:admin` - stage build for `admin-ui`
- `npm run build-stage:user` - stage build for `user-ui`
- `npm run test` - run tests

## Conventions

- Keep app-specific UI logic in its own project.
- Move reusable code to `projects/common-ui`.
- Reuse enums/constants from `@app/contracts` instead of duplicating values.
