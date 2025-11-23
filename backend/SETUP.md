# Go Backend Setup Instructions

## Quick Start

1. **Set up PostgreSQL database**
```bash
# Create database
createdb social_feed

# Or using psql
psql -U postgres
CREATE DATABASE social_feed;
\q
```

2. **Configure environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

3. **Run the server**
```bash
go run cmd/server/main.go
```

The server will automatically:
- Connect to PostgreSQL
- Run database migrations
- Create all required tables
- Start on http://localhost:8080

## Testing the API

### 1. Register a user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response.

### 3. Create a post
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "My first post!",
    "is_private": false
  }'
```

### 4. Get all posts
```bash
curl -X GET http://localhost:8080/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
backend/
├── cmd/server/main.go          # Application entry point
├── internal/
│   ├── config/config.go        # Configuration
│   ├── database/database.go    # Database connection
│   ├── middleware/             # Auth & CORS middleware
│   ├── models/                 # Database models
│   ├── handlers/               # HTTP handlers
│   └── utils/                  # Utilities (JWT, password, response)
├── uploads/                    # Uploaded files
├── .env                        # Environment variables
└── README.md                   # Documentation
```

## Environment Variables

Required in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=social_feed
JWT_SECRET=your-secret-key-min-32-chars
```

## Next Steps

1. Set up PostgreSQL
2. Configure `.env` file
3. Run the server
4. Test with the frontend at http://localhost:3000
