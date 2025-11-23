# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server/main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy .env.example to .env (will be overridden by docker-compose)
COPY .env.example .env

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]
