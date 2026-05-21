import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const usersToSeed = [
    {
      email: 'admin@legalflow.local',
      fullName: 'Administrator',
      role: 'ADMIN',
      password: process.env.SEED_ADMIN_PASSWORD || 'Admin@123!',
    },
    {
      email: 'manager@legalflow.local',
      fullName: 'Manager User',
      role: 'MANAGER',
      password: process.env.SEED_MANAGER_PASSWORD || 'Manager@123!',
    },
    {
      email: 'staff@legalflow.local',
      fullName: 'Staff User',
      role: 'STAFF',
      password: process.env.SEED_STAFF_PASSWORD || 'Staff@123!',
    },
    {
      email: 'viewer@legalflow.local',
      fullName: 'Viewer User',
      role: 'VIEWER',
      password: process.env.SEED_VIEWER_PASSWORD || 'Viewer@123!',
    },
  ];

  console.log('Start seeding...');
  
  for (const u of usersToSeed) {
    const normalizedEmail = u.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(u.password, 10);
    
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        fullName: u.fullName,
        passwordHash,
        isActive: true,
      },
      create: {
        email: normalizedEmail,
        fullName: u.fullName,
        role: u.role,
        passwordHash,
        isActive: true,
      },
    });
    
    console.log(`Upserted User: ${user.email} with Role: ${user.role}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
