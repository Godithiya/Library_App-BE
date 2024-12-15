# Books API

Books API is a backend application for managing book records using Node.js, Express, and Prisma with an SQLite database. It provides CRUD operations to create, read, update, and delete book data. The API is designed with validation, pagination, and error handling to ensure robust functionality.

---

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- SQLite (installed locally)
- Prisma CLI

### Steps
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm start
   ```

---

## API Endpoints

### Base URL
```
http://localhost:<PORT>/api/book
```

### 1. Create Book
**Endpoint:** `/create`  
**Method:** `POST`  
**Description:** Adds a new book to the database.

**Request Body:**
```json
{
  "title": "string",
  "author": "string",
  "genre": "string",
  "publication_year": "number",
  "stock": "number"
}
```
**Response:**
- **201 (Created):** Book successfully created.
- **400 (Bad Request):** Invalid input or missing required fields.
- **409 (Conflict):** Duplicate book detected.

---

### 2. Get All Books
**Endpoint:** `/list`  
**Method:** `GET`  
**Description:** Retrieves a paginated list of books.

**Query Parameters:**
- `page`: Current page number (default: 1).
- `limit`: Number of items per page (default: 10).

**Response:**
- **200 (OK):** Successfully retrieved books.
- **400 (Bad Request):** Invalid pagination parameters.
- **404 (Not Found):** No books found.

---

### 3. Update Book
**Endpoint:** `/update`  
**Method:** `PATCH`  
**Description:** Updates details of an existing book.

**Request Body:**
```json
{
  "id": "number",
  "data": {
    "title": "string",
    "author": "string",
    "genre": "string",
    "publication_year": "number",
    "stock": "number"
  }
}
```
**Response:**
- **201 (Created):** Book successfully updated.
- **400 (Bad Request):** Invalid input or missing fields.
- **500 (Internal Server Error):** Unexpected server error.

---

### 4. Delete Books
**Endpoint:** `/delete`  
**Method:** `DELETE`  
**Description:** Deletes one or more books by ID.

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```
**Response:**
- **200 (OK):** Books successfully deleted.
- **400 (Bad Request):** Invalid input or missing fields.
- **404 (Not Found):** No books found with the given IDs.
- **500 (Internal Server Error):** Unexpected server error.

---

## Code Structure

### Prisma Schema
The database model is defined in `prisma/schema.prisma`:
```prisma
model books {
  id               Int      @id @default(autoincrement())
  title            String
  author           String
  genre            String
  publication_year Int
  stock            Int
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
}
```

### Routes
Routes are defined in `books_routes.js`:
- **POST** `/api/book/create` - `create_book`
- **GET** `/api/book/list` - `all_book`
- **PATCH** `/api/book/update` - `update_book`
- **DELETE** `/api/book/delete` - `delete_book`

### Controllers
Each route is handled by a separate function:
1. **Create Book:** `create_book`
2. **List Books:** `all_book`
3. **Update Book:** `update_book`
4. **Delete Books:** `delete_book`

All controllers are in their respective files under the `src` directory.

---

## Validation
- **Input Validation:** Ensures all required fields are present and have valid types.
- **Publication Year:** Cannot be in the future.
- **Duplicate Records:** Prevents adding duplicate books based on title and author.

---

## Error Handling
- Provides meaningful error messages with appropriate HTTP status codes.
- Logs errors to the console for debugging.

---

## Pagination
- Uses `skip` and `take` parameters in Prisma to handle pagination.
- Defaults: `page = 1`, `limit = 10`.

---

## License
This project is licensed under the MIT License. See `LICENSE` for details.

