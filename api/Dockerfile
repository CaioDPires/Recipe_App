FROM golang:1.24.5
WORKDIR /app

# Copy Go modules from api/
COPY api/go.mod api/go.sum ./
RUN go mod download && go mod verify

# Copy Go source code
COPY api/main.go ./
COPY api/handlers ./handlers
COPY api/db ./db

# Copy migrations (still in root)
COPY api/migrations ./migrations

# Copy goose binary
COPY api/tools/goose /usr/local/bin/goose
RUN chmod +x /usr/local/bin/goose

# Build binary
RUN go build -o api .
EXPOSE 8080

CMD ["./api"]
