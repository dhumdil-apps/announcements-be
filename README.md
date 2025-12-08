# Announcements Backend

A REST API for managing city announcements built with NestJS and SQLite.

## Tech Stack

- NestJS 11 + TypeScript
- TypeORM + SQLite (persistent storage)

## API Endpoints

Base URL: `/api`

### Categories

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/categories` | List all categories |

### Announcements

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | `/announcements`     | List all announcements  |
| GET    | `/announcements/:id` | Get single announcement |
| POST   | `/announcements`     | Create new announcement |
| PUT    | `/announcements/:id` | Update announcement     |
| DELETE | `/announcements/:id` | Delete announcement     |

See [API.md](../announcements-fe/API.md) for full API specification.

## Project Structure

```
src/
  announcements/
    dto/
      create-announcement.dto.ts
      update-announcement.dto.ts
    announcement.entity.ts      # TypeORM entity
    announcements.controller.ts
    announcements.module.ts
    announcements.service.ts
  categories/
    category.entity.ts          # TypeORM entity
    categories.controller.ts
    categories.module.ts
    categories.service.ts
  app.module.ts                 # Main module with TypeORM config
  main.ts                       # App bootstrap with CORS and /api prefix
data/
  announcements.db              # SQLite database (auto-created)
```

## Database

- SQLite database stored at `data/announcements.db`
- Auto-created on first run with seed data
- Schema synchronized automatically via TypeORM

## Scripts

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Linting
npm run lint

# Testing
npm run test
npm run test:e2e
npm run test:cov
```

## Running with Frontend

```bash
# Terminal 1 - Start backend (port 3000)
cd announcements-be
npm run start:dev

# Terminal 2 - Start frontend (port 5173)
cd announcements-fe
npm run dev
```

The frontend will connect to the backend API at `http://localhost:3000/api`.
