const fs = require('fs');
const path = require('path');

console.log('=== KHỞI ĐỘNG SAO LƯU CƠ SỞ DỮ LIỆU SQLITE ===');

// 1. Đọc và phân tích cú pháp DATABASE_URL từ file .env
function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || !trimmed) continue;
      const parts = trimmed.split('=');
      if (parts[0].trim() === 'DATABASE_URL') {
        let val = parts.slice(1).join('=').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        return val;
      }
    }
  }
  return null;
}

const dbUrl = getDatabaseUrl();
if (!dbUrl) {
  console.error('LỖI: Không tìm thấy cấu hình DATABASE_URL trong file .env hoặc môi trường.');
  process.exit(1);
}

if (!dbUrl.startsWith('file:')) {
  console.error(`LỖI: Hệ thống chỉ hỗ trợ SQLite với định dạng DATABASE_URL="file:...". Hiện tại: "${dbUrl}"`);
  process.exit(1);
}

// 2. Xác định đường dẫn cơ sở dữ liệu thực tế
const dbRelativePath = dbUrl.substring(5); // Loại bỏ tiền tố 'file:'

// Giải quyết đường dẫn tương đối từ backend root hoặc prisma folder
let dbPath = path.resolve(__dirname, '..', dbRelativePath);
if (!fs.existsSync(dbPath)) {
  const dbPathPrisma = path.resolve(__dirname, '..', 'prisma', dbRelativePath);
  if (fs.existsSync(dbPathPrisma)) {
    dbPath = dbPathPrisma;
  }
}

console.log(`Đường dẫn cơ sở dữ liệu nguồn: ${dbPath}`);

// 3. Kiểm tra xem tệp DB có tồn tại không
if (!fs.existsSync(dbPath)) {
  console.error(`LỖI: Không tìm thấy tệp cơ sở dữ liệu SQLite tại: ${dbPath}`);
  process.exit(1);
}

// 4. Tạo thư mục backups nếu chưa tồn tại
const backupsDir = path.resolve(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
  console.log(`Tạo thư mục lưu trữ bản sao lưu: ${backupsDir}`);
  fs.mkdirSync(backupsDir, { recursive: true });
}

// 5. Cảnh báo an toàn cho người dùng
console.warn('\x1b[33m%s\x1b[0m', 'KHUYẾN CÁO: Vui lòng đảm bảo tạm dừng backend hoặc chắc chắn không có giao dịch/thao tác ghi dữ liệu nào đang diễn ra để tránh dữ liệu bị hỏng hoặc bất đồng bộ.');

// 6. Tạo file backup dạng: backup_YYYYMMDD_HHMMSS.db
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const min = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
const timestamp = `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
const backupFileName = `backup_${timestamp}.db`;
const backupPath = path.join(backupsDir, backupFileName);

console.log(`Bắt đầu tạo bản sao lưu: ${backupFileName}...`);

try {
  fs.copyFileSync(dbPath, backupPath);
  
  // 7. Kiểm tra tính toàn vẹn của bản sao lưu
  if (!fs.existsSync(backupPath)) {
    throw new Error('Tệp sao lưu không được tạo thành công.');
  }
  
  const stats = fs.statSync(backupPath);
  if (stats.size === 0) {
    // Xóa file rỗng nếu copy lỗi tạo file 0 byte
    fs.unlinkSync(backupPath);
    throw new Error('Tệp sao lưu bị rỗng (0 byte). Quá trình sao lưu thất bại.');
  }
  
  console.log('\x1b[32m%s\x1b[0m', 'SAO LƯU THÀNH CÔNG!');
  console.log(`- Đường dẫn file: ${backupPath}`);
  console.log(`- Kích thước: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`- Thời gian tạo: ${now.toLocaleString()}`);
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'LỖI: Tiến trình sao lưu cơ sở dữ liệu SQLite thất bại.');
  console.error(error.message);
  process.exit(1);
}
