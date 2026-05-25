const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAudit() {
  const logs = await prisma.adminAuditLog.findMany({
    where: {
      action: { in: ['LOGIN_SUCCESS', 'LOGIN_FAILED'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  let pass = true;
  for (const log of logs) {
    if (log.details.includes('password') || log.details.includes('passwordHash') || log.details.includes('secret')) {
      console.log(`❌ FAIL: Tìm thấy thông tin nhạy cảm trong Audit Log ID ${log.id}`);
      pass = false;
    }
  }
  if (pass) console.log('✅ PASS: AdminAuditLog không chứa thông tin nhạy cảm');
  
  const rateLimitLogs = await prisma.adminAuditLog.findMany({
    where: { action: 'RATE_LIMIT_HIT' }
  });
  if (rateLimitLogs.length === 0) {
    console.log('✅ PASS: RATE_LIMIT_HIT không bị ghi vào DB');
  } else {
    console.log('❌ FAIL: RATE_LIMIT_HIT bị ghi vào DB!');
  }
}

checkAudit().catch(console.error).finally(() => prisma.$disconnect());
