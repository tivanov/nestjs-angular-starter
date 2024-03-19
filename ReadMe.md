# NestJS + Angular Starter

This is a starter project to quickly kick off NestJS + Angular web applications.

It contains a simple role based user authentication integrated in the backend and frontend.

The starter has implemented some production features and should provide a good baseline for new projects without having to worry about the boring details.

## Backend

The folder `backend` contains the NestJS backend as a monorepo. The folder contains a separate `libs` folder for NestJS library projects.

Already present is the `contracts` library for contracts shared between the backend and the frontend (DTOs, enums, error codes etc.).

You can add any other library projects there.

### Config

App config is in the `config` folder as a javascript object.

## Frontend

The frontend contains two projects and a library for shared code. 
The projects are meant to represent an admin interface and user interface.

Both projects use signals + local storage for state management.

## Setup & Run

There are 3 package.json files: in the project root, frontend and backend dirs. You need to first install those.

```bash
  npm i
  cd backend && npm i
  cd ../frontend && npm i
```

Then you can run everything in dev mode by simply running 

```bash
  npm run dev
```

from the main root.
