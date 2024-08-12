# NestJS + Angular Starter

This is a starter project to quickly kick off NestJS + Angular web applications.

It contains a simple role based user authentication integrated in the backend and frontend.

The starter has implemented some production features and should provide a good baseline for new projects without having to worry about the boring details.

Please note that this code is provided as-is and you should always be prepared for some bugs.

## Backend

The folder `backend` contains the NestJS backend as a monorepo. The folder contains a separate `libs` folder for NestJS library projects.

Already present is the `contracts` library for contracts shared between the backend and the frontend (DTOs, enums, error codes etc.).

You can add any other library projects there.

The backend uses a MongoDB database.

### Config

Backend config is in the `config` folder as a javascript object. It can be overriden for production.

## Frontend

The frontend contains two projects. Both projects use signals + local storage for state management.

Tailwind is also setup with default config.

### Admin UI

The Admin UI project is located in the `frontend/projects/admin-ui` folder. The project uses Material Components to build a simple admin user interface.

Curently it only contains the user management section, but can be easily expanded. 

The user managemet section is an example of a pattern to be used in the future for managing lists of entities (see `BaseListComponent` class).

### User UI

The user-facing part of the application. It is just a blank project that uses SSR.

### Common UI

Just a folder with code meant to be shared between projects. Contains auth interceptors, services, base classes etc.

## Setup & Run

There are 3 package.json files: in the project root, frontend and backend dirs. You need to first install those.

From the project root run:

```bash
  npm i
  cd frontend && npm i
  cd ../backend && npm i
```

While in the `backend` folder you can run the db seed script:

```bash
  npm run init-db:dev
```

This will:

- create the db as configured in the `development.ts` config file
- create a user for every specified role in the UserRoleEnum

Then you can run everything in dev mode from the project root by simply running

```bash
  npm run dev
```

Or you can look in the separate package.json files for individual run scripts.

## Shared Contracts

Since both the frontend and backend use TypeScript, this allows for sharing of DTOs, Commands, Queries and Enums. These can be found in the backend/libs/contracts folder.

This folder is defined as an alias in the frontend tsconfig, so any additional contracts can be added there as well and will be available for use on the frontend.
