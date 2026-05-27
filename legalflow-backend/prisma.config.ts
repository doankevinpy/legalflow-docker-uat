import { defineConfig } from '@prisma/config';
import * as path from 'path';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  migrations: {
    seed: process.env.NODE_ENV === 'production' ? 'node dist/prisma/seed.js' : 'ts-node ./prisma/seed.ts',
  },
});
