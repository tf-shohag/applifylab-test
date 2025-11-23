# Social Feed Application

A full-stack social media feed application built with **Next.js** (Frontend) and **Go/Gin** (Backend).

## 🚀 Features

- **Authentication**: User registration and login with JWT.
- **Social Feed**: View posts from users.
- **Post Creation**: Create text posts and upload images.
- **Interactions**: Like posts, comment on posts, like comments.
- **Profile**: View user profile.
- **Responsive Design**: Fully responsive UI matching the provided design.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Axios, Bootstrap (CSS).
- **Backend**: Go 1.23, Gin Framework, GORM.
- **Database**: PostgreSQL.
- **Containerization**: Docker, Docker Compose.

## 🐳 Getting Started (Docker) - Recommended

The easiest way to run the application is using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed.

### Steps

1.  **Clone the repository** (if you haven't already).
2.  **Run with Docker Compose**:
    ```bash
    # If you have Docker Compose v2 (most common now):
    docker compose up --build

    # If you have older Docker Compose v1:
    docker-compose up --build
    ```

3.  **Access the application**:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:8081](http://localhost:8081)
    - Database: Port 5432

## 💻 Getting Started (Local Development)

If you prefer to run services locally without Docker.

### Prerequisites
- Node.js (v20+)
- Go (v1.23+)
- PostgreSQL running locally

### 1. Database Setup
Create a PostgreSQL database named `social_feed`:
```bash
createdb social_feed
```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Copy the environment file:
    ```bash
    cp .env.example .env
    ```
3.  Update `.env` with your database credentials if needed.
4.  Run the server:
    ```bash
    go run cmd/server/main.go
    ```
    The server will start on `http://localhost:8080`.

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:3000`.

## 📂 Project Structure

```
.
├── backend/                # Go Backend
│   ├── cmd/server/         # Entry point
│   ├── internal/           # Application logic (handlers, models, etc.)
│   └── uploads/            # User uploaded files
├── frontend/               # Next.js Frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   └── lib/api/            # API integration layer
└── docker-compose.yml      # Docker orchestration
```

## 📝 API Documentation

Detailed API documentation is available in [backend/README.md](backend/README.md).
Frontend API usage guide is in [frontend/lib/api/README.md](frontend/lib/api/README.md).
# applifylab-test
