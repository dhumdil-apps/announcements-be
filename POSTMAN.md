# Postman API Testing Guide

## Setup

1. Start the backend server:
   ```bash
   npm run start:dev
   ```

2. Base URL: `http://localhost:3000/api`

## Categories

### Get All Categories

- **Method:** GET
- **URL:** `http://localhost:3000/api/categories`

## Announcements

### Get All Announcements

- **Method:** GET
- **URL:** `http://localhost:3000/api/announcements`

### Get Announcements with Filters

**Filter by single category:**
- **Method:** GET
- **URL:** `http://localhost:3000/api/announcements?category=1`

**Filter by multiple categories (OR):**
- **Method:** GET
- **URL:** `http://localhost:3000/api/announcements?category=1&category=5`

**Search in title and content:**
- **Method:** GET
- **URL:** `http://localhost:3000/api/announcements?search=library`

**Combine search with category filter:**
- **Method:** GET
- **URL:** `http://localhost:3000/api/announcements?search=park&category=1`

### Get Single Announcement

- **Method:** GET
- **URL:** `http://localhost:3000/api/announcements/1`

### Create Announcement

- **Method:** POST
- **URL:** `http://localhost:3000/api/announcements`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Test Announcement",
    "content": "This is a test announcement content.",
    "publicationDate": "2024-12-20T10:00:00Z",
    "categories": ["1", "3"]
  }
  ```

### Update Announcement

- **Method:** PUT
- **URL:** `http://localhost:3000/api/announcements/1`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content here.",
    "categories": ["1"]
  }
  ```

### Delete Announcement

- **Method:** DELETE
- **URL:** `http://localhost:3000/api/announcements/1`
- **Expected Response:** `204 No Content`

## WebSocket Testing

Postman supports WebSocket testing:

1. Create a new WebSocket Request
2. **URL:** `ws://localhost:3000`
3. Click **Connect**
4. Listen for events:
   - `announcement:created` - triggered when creating an announcement
   - `announcement:updated` - triggered when updating an announcement

**Testing WebSocket events:**
1. Connect to the WebSocket in one Postman tab
2. In another tab, create or update an announcement via REST API
3. Observe the WebSocket tab for incoming events

## Expected Responses

### Success Response Format

```json
{
  "data": {
    "id": "1",
    "title": "Announcement Title",
    "content": "Content here...",
    "publicationDate": "2024-12-20T10:00:00Z",
    "lastUpdate": "2024-12-20T10:00:00Z",
    "categories": ["1", "3"]
  }
}
```

### Error Response Format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Announcement not found"
  }
}
```

## Quick Test Sequence

1. `GET /api/categories` - Verify categories are loaded
2. `GET /api/announcements` - Verify seed announcements exist
3. `POST /api/announcements` - Create a new announcement
4. `GET /api/announcements?search=test` - Search for the new announcement
5. `PUT /api/announcements/:id` - Update the announcement
6. `DELETE /api/announcements/:id` - Delete the announcement
