# Announcements Backend

A REST API for managing city announcements built with NestJS and SQLite.

## Tech Stack

- NestJS 11 + TypeScript
- TypeORM + SQLite (persistent storage)
- Socket.IO (real-time notifications)

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

#### Query Parameters for GET `/announcements`

| Parameter  | Type               | Description                                      |
| ---------- | ------------------ | ------------------------------------------------ |
| `category` | string or string[] | Filter by category ID(s). Multiple values use OR |
| `search`   | string             | Case-insensitive search in title and content     |

**Examples:**
- `GET /announcements?category=1` - Filter by single category
- `GET /announcements?category=1&category=5` - Filter by multiple categories (OR)
- `GET /announcements?search=library` - Search in title and content
- `GET /announcements?search=park&category=1` - Combine search with category filter

See [API.md](./API.md) for full API specification.

## WebSocket Events

The server emits real-time events via Socket.IO when announcements change.

**Connection:** `ws://localhost:3000`

| Event                   | Payload                | Description                  |
| ----------------------- | ---------------------- | ---------------------------- |
| `announcement:created`  | `Announcement` object  | New announcement created     |
| `announcement:updated`  | `Announcement` object  | Announcement was updated     |

**Frontend example:**
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('announcement:created', (announcement) => {
  console.log('New announcement:', announcement);
});

socket.on('announcement:updated', (announcement) => {
  console.log('Updated announcement:', announcement);
});
```

## Project Structure

```
src/
  announcements/
    dto/
      create-announcement.dto.ts
      update-announcement.dto.ts
    announcement.entity.ts      # TypeORM entity
    announcements.controller.ts
    announcements.gateway.ts    # WebSocket gateway
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

## TODOs:

- [ ] SQLite FTS5 (Full-Text Search)
