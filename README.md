Recipe App

A containerized recipe management application with a Golang-based CRUD API and PostgreSQL database. The backend provides endpoints for creating, reading, updating, and deleting recipes with ingredients and instructions. The services run inside Docker containers for easy deployment and scalability. A frontend interface is planned for future development.
Features

    RESTful API for recipe management.

    PostgreSQL database with schema for recipes and ingredients.

    Dockerized services for reproducible environments.

    Clean, modular Golang codebase following best practices.

Tech Stack

    Backend: Go (Golang)

    Database: PostgreSQL

    Containerization: Docker, Docker Compose


Getting Started
Prerequisites

    Docker & Docker Compose

    Go 1.24.5 (for local development)

Running with Docker

docker-compose up --build

This will start both the API and PostgreSQL database in containers.
Local Development

    Install Go modules:

go mod tidy

Start the API locally:

    go run server.go

    Make sure PostgreSQL is running and configured with the right environment variables.

API Endpoints

    GET /recipes – List all recipes

    GET /recipes/{id} – Get a single recipe

    POST /recipes – Create a new recipe

    PUT /recipes/{id} – Update a recipe

    DELETE /recipes/{id} – Delete a recipe

License

This project is licensed under the MIT License.
