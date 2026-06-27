import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

async function promptInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('=== KỊCH BẢN ĐỔI MẬT KHẨU ADMIN LOCAL (AN TOÀN) ===\n');

  if (!process.env.DATABASE_URL) {
    throw new Error('Lỗi: Không tìm thấy DATABASE_URL trong biến môi trường.');
  }

  // Khởi tạo PrismaClient theo đúng kiến trúc của dự án
  let prisma: PrismaClient;
  let pool: Pool | null = null;

  if (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://')) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    prisma = new PrismaClient();
  }

  try {
    // 1. Xác định email Admin cần đổi mật khẩu
    let targetEmail = process.env.ADMIN_EMAIL || process.argv[3] || process.env.SEED_ADMIN_EMAIL;
    if (!targetEmail) {
      targetEmail = await promptInput('Nhập email tài khoản Admin cần đổi mật khẩu [mặc định: admin@legalflow.local]: ');
      if (!targetEmail) {
        targetEmail = 'admin@legalflow.local';
      }
    }

    // Tìm user admin trong database
    let adminUser = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!adminUser) {
      console.log(`⚠️ Không tìm thấy tài khoản với email "${targetEmail}". Đang tìm tài khoản Admin bất kỳ trong hệ thống...`);
      adminUser = await prisma.user.findFirst({
        where: { role: Role.ADMIN },
      });
    }

    if (!adminUser) {
      console.error('❌ Lỗi: Không tìm thấy bất kỳ tài khoản Admin nào trong cơ sở dữ liệu!');
      process.exit(1);
    }

    console.log(`👤 Tài khoản đích: ${adminUser.email} (Họ tên: ${adminUser.fullName || 'N/A'}, Vai trò: ${adminUser.role})`);

    // 2. Xác định mật khẩu mới
    let newPassword = process.env.NEW_ADMIN_PASSWORD || process.argv[2];
    if (!newPassword) {
      newPassword = await promptInput('Nhập mật khẩu mới cho tài khoản Admin (tối thiểu 6 ký tự): ');
    }

    if (!newPassword || newPassword.length < 6) {
      console.error('❌ Lỗi: Mật khẩu mới không hợp lệ hoặc quá ngắn (tối thiểu 6 ký tự).');
      process.exit(1);
    }

    // 3. Mã hóa mật khẩu (Bcrypt Hash)
    console.log('🔒 Đang tạo passwordHash (Bcrypt saltRounds = 10)...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // 4. Cập nhật vào Database (Tuyệt đối không làm mất các dữ liệu khác)
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { passwordHash },
    });

    console.log(`\n✅ THÀNH CÔNG! Đã cập nhật mật khẩu mới cho tài khoản Admin "${adminUser.email}".`);
    console.log('💡 Lưu ý: Mật khẩu đã được mã hóa một chiều (passwordHash) và lưu an toàn vào DB.');
  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình cập nhật mật khẩu:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    if (pool) {
      await pool.end();
    }
  }
}

main();
