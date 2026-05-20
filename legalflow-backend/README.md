# LegalFlow Backend Phase 1 & 2

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
npx prisma migrate dev
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

### Auth
- `GET /health`: Health check
- `POST /auth/login`: Issue JWT token
- `GET /auth/profile`: Get logged in user profile
- `GET /auth/admin-only`: Demo endpoint for RBAC

### Cases
- `GET /cases`: Query list (Search, Filter, Pagination)
- `POST /cases`: Create new case
- `GET /cases/stats`: Get dashboard statistics
- `GET /cases/:id`: Get detail, notes, checklists, histories
- `PATCH /cases/:id`: Update case details
- `DELETE /cases/:id`: Soft delete a case (Admin/Manager only)
- `POST /cases/:id/notes`: Add note
- `PATCH /cases/:id/checklist/:itemId`: Tick checklist
- `PATCH /cases/:id/status`: Change status

## Documentation & Testing
Run integration tests using:
```bash
node verify-cases.js
```
Please read `backend-walkthrough.md` in the project root for more information on format codes, RBAC, and MVP limits.
