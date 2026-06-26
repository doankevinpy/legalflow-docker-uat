import 'dotenv/config';
import { PrismaClient, Role, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in environment variables');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedCore() {
  console.log('--- Starting Core Seed ---');
  
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminFullName = process.env.SEED_ADMIN_FULL_NAME || 'Administrator';

  if (!adminEmail || !adminPassword) {
    throw new Error('FATAL: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required for Core Seed.');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      fullName: adminFullName,
      isActive: true,
      // CRITICAL: DO NOT overwrite passwordHash if user already exists
    },
    create: {
      email: adminEmail,
      passwordHash: passwordHash,
      role: Role.ADMIN,
      fullName: adminFullName,
      isActive: true,
    },
  });

  console.log(`Core seed completed. Admin email: ${admin.email}`);
}

async function seedMock() {
  if (process.env.SEED_MOCK_DATA !== 'true') {
    console.log('--- Mock Seed Skipped (SEED_MOCK_DATA is not true) ---');
    return;
  }
  
  console.log('--- Starting Mock Seed ---');

  if (process.env.SEED_MOCK_USERS === 'true') {
    console.log('Seeding mock users...');
    const saltRounds = 10;
    const mockPassword = process.env.SEED_MOCK_USER_PASSWORD || 'MockUser@local-only-not-for-prod';
    const passwordHash = await bcrypt.hash(mockPassword, saltRounds);

    const mockUsers = [
      { email: 'manager@legalflow.local', role: Role.MANAGER, fullName: 'Mock Manager' },
      { email: 'staff@legalflow.local', role: Role.STAFF, fullName: 'Mock Staff' },
      { email: 'viewer@legalflow.local', role: Role.VIEWER, fullName: 'Mock Viewer' },
    ];

    for (const user of mockUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: { role: user.role, fullName: user.fullName },
        create: {
          email: user.email,
          passwordHash: passwordHash,
          role: user.role,
          fullName: user.fullName,
          isActive: true,
        },
      });
      console.log(`Upserted mock user: ${user.email}`);
    }
  } else {
    console.log('Mock users skipped.');
  }

  if (process.env.SEED_MOCK_CASES === 'true') {
    console.log('Seeding mock cases...');
    const admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (!admin) {
      console.log('Cannot seed cases: No admin user found to assign createdById.');
    } else {
      const neighborhoods = ['KP1', 'KP2', 'KP3', 'KP4', 'KP5'];
      const fields = ['DAT_DAI', 'DAN_SU', 'LAO_DONG', 'HON_NHAN_GIA_DINH', 'DOANH_NGHIEP', 'HANH_CHINH', 'KHAC'];
      const types = ['KN', 'TC', 'KNG', 'PA', 'TVPL', 'KHAC'];
      const statuses = ['NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];

      let seededCount = 0;
      for (let i = 1; i <= 30; i++) {
        const caseCode = `2026-MOCK-A${i.toString().padStart(3, '0')}`;
        
        // Pseudo-random selection based on index to ensure consistent mock data
        const neighborhood = neighborhoods[i % neighborhoods.length];
        const field = fields[(i * 3) % fields.length]; // Skewed a bit for variety
        const type = types[(i * 5) % types.length];
        const status = statuses[(i * 7) % statuses.length];

        const mockCase = {
          caseCode,
          senderName: `Mock Sender ${i}`,
          type,
          field,
          neighborhood,
          summary: `Mock summary for analytics ${i}`,
          request: `Mock request content ${i}`,
          status,
          createdById: admin.id,
        };

        await prisma.legalCase.upsert({
          where: { caseCode: mockCase.caseCode },
          update: { summary: mockCase.summary, status: mockCase.status as any },
          create: {
            caseCode: mockCase.caseCode,
            senderName: mockCase.senderName,
            type: mockCase.type as any,
            field: mockCase.field as any,
            neighborhood: mockCase.neighborhood as any,
            summary: mockCase.summary,
            request: mockCase.request,
            status: mockCase.status as any,
            createdById: mockCase.createdById,
            documents: [{ name: `mock-doc-${i}.pdf`, url: `http://mock.local/doc${i}.pdf` }],
          },
        });
        seededCount++;
      }
      console.log(`Upserted ${seededCount} mock cases for analytics.`);
    }
  } else {
    console.log('Mock cases skipped.');
  }

  console.log('--- Mock Seed Completed ---');
}

async function main() {
  await seedCore();
  await seedMock();
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
