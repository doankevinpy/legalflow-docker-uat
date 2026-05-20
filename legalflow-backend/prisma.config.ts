import { defineConfig } from '@prisma/config';
import * as path from 'path';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },
});
