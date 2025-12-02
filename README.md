# User Management REST API

A robust RESTful API built with **NestJS**, **Prisma**, and **PostgreSQL**. This project demonstrates a complete user management system with authentication, authorization, and security.

## Tech Stack

* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** JWT (JSON Web Tokens) & Passport strategy
* **Security:** Bcrypt (Password Hashing)
* **Validation:** class-validator & class-transformer
* **Containerization:** Docker & Docker Compose
* **Testing:** Jest (Unit Testing)
* **Package Manager:** pnpm

## Features

* **Authentication:**
    * User Registration (with password hashing).
    * User Login (returns JWT Access Token).
    * Protected Routes (Guard) using Bearer Token.
* **User Management (CRUD):**
    * Create, Read (List/Profile), Update, and Delete users.
    * **Security:** Passwords are never returned in API responses.
    * **UUIDs:** Uses UUID v4 for IDs to prevent enumeration attacks.
* **Error Handling:**
    * Global exception handling.
    * Standardized HTTP status codes (404, 409, 401, etc.).
    * Validation pipes for DTOs.

## Install dependencies

```bash
$ pnpm install
```

## Environment Configuration

Create a .env file in the root directory based on the following template:

```bash
#PORT
PORT=3000

# Database Connection (Docker container default)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestdb?schema=public"

# JWT Configuration
JWT_SECRET="super_secret_key_change_me_in_production"
```

## Start the Database

```bash
$ docker-compose up -d
```

## Run Migrations

```bash
$ npx prisma migrate dev --name init
```

## Run the App

```bash
# Development mode
$ pnpm run start:dev
```

## Project Structure

```bash
src/
├── auth/           # Authentication Module (Login, Register, Strategies)
│   ├── dto/        # Auth Data Transfer Objects
│   ├── jwt/        # JWT Strategies and Guards
│   └── ...
├── users/          # Users Module (CRUD Logic)
│   ├── dto/        # User Data Transfer Objects
│   └── ...
├── database/       # Database Module (Prisma Service)
└── app.module.ts   # Main Application Module
```
