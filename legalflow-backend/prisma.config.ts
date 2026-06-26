import 'dotenv/config';
import { defineConfig } from '@prisma/config';
import * as path from 'path';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Please create legalflow-backend/.env from .env.postgres.example');
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: process.env.NODE_ENV === 'production' ? 'node dist/prisma/seed.js' : 'ts-node ./prisma/seed.ts',
  },
});
