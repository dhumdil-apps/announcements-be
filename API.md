# API Specification (Node.js Backend)

Base URL: `/api`

## Endpoints

### Categories

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/categories` | List all categories  |

### Announcements

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/announcements`    | List all announcements   |
| GET    | `/announcements/:id`| Get single announcement  |
| POST   | `/announcements`    | Create new announcement  |
| PUT    | `/announcements/:id`| Update announcement      |
| DELETE | `/announcements/:id`| Delete announcement      |

## Data Models

```typescript
interface Category {
  id: string;
  label: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  publicationDate: string;  // ISO 8601 format
  lastUpdate: string;       // ISO 8601 format
  categories: string[];     // Array of category IDs
}
```

## Request/Response Examples

### GET /api/announcements

#### Query Parameters

| Parameter  | Type               | Description                                      |
| ---------- | ------------------ | ------------------------------------------------ |
| `category` | string or string[] | Filter by category ID(s). Multiple values use OR |
| `search`   | string             | Case-insensitive search in title and content     |

#### Examples

```
GET /api/announcements
GET /api/announcements?category=1
GET /api/announcements?category=1&category=5
GET /api/announcements?search=library
GET /api/announcements?search=park&category=1
```

#### Response

```json
{
  "data": [
    {
      "id": "1",
      "title": "City Hall Holiday Hours",
      "content": "City Hall will be closed...",
      "publicationDate": "2024-12-15T09:00:00Z",
      "lastUpdate": "2024-12-18T14:30:00Z",
      "categories": ["1", "6"]
    }
  ]
}
```

### POST /api/announcements

Request:
```json
{
  "title": "New Announcement",
  "content": "Announcement content...",
  "publicationDate": "2024-12-20T10:00:00Z",
  "categories": ["1", "3"]
}
```

Response:
```json
{
  "data": {
    "id": "5",
    "title": "New Announcement",
    "content": "Announcement content...",
    "publicationDate": "2024-12-20T10:00:00Z",
    "lastUpdate": "2024-12-20T10:00:00Z",
    "categories": ["1", "3"]
  }
}
```

### PUT /api/announcements/:id

Request:
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "publicationDate": "2024-12-20T10:00:00Z",
  "categories": ["1"]
}
```

### DELETE /api/announcements/:id

Response: `204 No Content`

## Error Responses

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Announcement not found"
  }
}
```

| Status | Code            | Description                    |
| ------ | --------------- | ------------------------------ |
| 400    | VALIDATION_ERROR| Invalid request body           |
| 404    | NOT_FOUND       | Resource not found             |
| 500    | INTERNAL_ERROR  | Server error                   |

## WebSocket Events

Real-time notifications via Socket.IO.

**Connection:** `ws://localhost:3000`

### Events

| Event                   | Payload                | Description                  |
| ----------------------- | ---------------------- | ---------------------------- |
| `announcement:created`  | `Announcement` object  | New announcement created     |
| `announcement:updated`  | `Announcement` object  | Announcement was updated     |

### Example Payload

```json
{
  "id": "5",
  "title": "New Announcement",
  "content": "Announcement content...",
  "publicationDate": "2024-12-20T10:00:00Z",
  "lastUpdate": "2024-12-20T10:00:00Z",
  "categories": ["1", "3"]
}
```
