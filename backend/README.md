# Social Feed Backend API

A RESTful API backend built with Go (Golang) for a social media feed application.

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **Posts**: Create, read, update, delete posts with image support
- **Comments**: Comment on posts and reply to comments
- **Likes**: Like/unlike posts and comments
- **Privacy**: Support for private and public posts
- **File Upload**: Image upload with validation
- **Pagination**: Efficient pagination for posts

## Tech Stack

- **Go 1.21+**
- **Gin** - HTTP web framework
- **GORM** - ORM for database operations
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher

## Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
go mod download
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create PostgreSQL database
```bash
createdb social_feed
```

5. Run the server
```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `POST /api/posts` - Create post (protected)
- `GET /api/posts` - Get all posts with pagination (protected)
- `GET /api/posts/:id` - Get single post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)
- `POST /api/posts/:id/like` - Toggle like on post (protected)
- `GET /api/posts/:id/likes` - Get users who liked post (protected)

### Comments
- `POST /api/posts/:id/comments` - Create comment on post (protected)
- `GET /api/posts/:id/comments` - Get comments for post (protected)
- `POST /api/comments/:id/replies` - Create reply to comment (protected)
- `GET /api/comments/:id/replies` - Get replies for comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected, owner only)
- `POST /api/comments/:id/like` - Toggle like on comment (protected)
- `GET /api/comments/:id/likes` - Get users who liked comment (protected)

### File Upload
- `POST /api/upload` - Upload image (protected)
- `GET /uploads/:filename` - Serve uploaded file

### Health Check
- `GET /health` - Health check endpoint

## Request/Response Examples

### Register
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

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Hello World!",
    "is_private": false
  }'
```

### Get Posts
```bash
curl -X GET "http://localhost:8080/api/posts?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Upload Image
```bash
curl -X POST http://localhost:8080/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## Environment Variables

```env
PORT=8080
GIN_MODE=debug

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=social_feed
DB_SSLMODE=disable

JWT_SECRET=your-super-secret-jwt-key
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=5242880
ALLOWED_ORIGINS=http://localhost:3000
```

## Database Schema

The application uses the following tables:
- **users** - User accounts
- **posts** - User posts
- **comments** - Comments and replies
- **likes** - Polymorphic likes for posts and comments

## Development

### Run with hot reload
```bash
# Install air for hot reload
go install github.com/cosmtrek/air@latest

# Run with air
air
```

### Run tests
```bash
go test ./...
```

### Build for production
```bash
go build -o server cmd/server/main.go
./server
```

## Security Features

- Password hashing with bcrypt (cost factor 12)
- JWT-based authentication
- CORS protection
- Input validation
- File upload validation
- Authorization checks for resource ownership

## License

MIT
