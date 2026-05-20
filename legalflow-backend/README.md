# LegalFlow Backend Phase 1

This backend provides a standalone API for the MVP phase, utilizing NestJS, Prisma ORM, and SQLite.

## Installation

```bash
cd legalflow-backend
npm install
```

## Setup Environment

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Review `.env` and set appropriate values. The MVP `.env` is configured for local SQLite.

## Database Migration & Seeding

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```
**Seed Accounts (Development Only):**
- admin@legalflow.local / Admin@123! (Role: ADMIN)
- manager@legalflow.local / Manager@123! (Role: MANAGER)
- staff@legalflow.local / Staff@123! (Role: STAFF)
- viewer@legalflow.local / Viewer@123! (Role: VIEWER)

## Start Application

```bash
npm run start:dev
```

## Available Endpoints

- `GET /health`: Health check
- `POST /auth/login`: Issue JWT token
- `GET /auth/profile`: Get logged in user profile (Requires Bearer token)
- `GET /auth/admin-only`: Demo endpoint for RBAC (Requires ADMIN Role)
