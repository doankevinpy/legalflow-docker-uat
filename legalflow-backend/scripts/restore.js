const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('=== KHỞI ĐỘNG PHỤC HỒI CƠ SỞ DỮ LIỆU SQLITE ===');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

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

let dbPath = path.resolve(__dirname, '..', dbRelativePath);
if (!fs.existsSync(dbPath)) {
  const dbPathPrisma = path.resolve(__dirname, '..', 'prisma', dbRelativePath);
  if (fs.existsSync(dbPathPrisma)) {
    dbPath = dbPathPrisma;
  }
}

console.log(`Đường dẫn cơ sở dữ liệu đích: ${dbPath}`);

// 3. Quét danh sách các file backup
const backupsDir = path.resolve(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
  console.error(`LỖI: Thư mục chứa bản sao lưu không tồn tại tại: ${backupsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(backupsDir)
  .filter(file => file.endsWith('.db') && (file.startsWith('backup_') || file.startsWith('pre_restore_')))
  .map(file => {
    const filePath = path.join(backupsDir, file);
    const stats = fs.statSync(filePath);
    return { name: file, path: filePath, mtime: stats.mtime, size: stats.size };
  })
  .sort((a, b) => b.mtime - a.mtime); // Sắp xếp thời gian mới nhất lên đầu

if (files.length === 0) {
  console.error('LỖI: Không tìm thấy bản sao lưu nào (.db) trong thư mục backups/. Vui lòng tạo bản sao lưu trước.');
  process.exit(1);
}

async function main() {
  let selectedBackup = null;
  
  // 4. Xác định file backup cần khôi phục
  const argFile = process.argv[2];
  if (argFile) {
    const matched = files.find(f => f.name === argFile);
    if (!matched) {
      console.error(`LỖI: Không tìm thấy tệp sao lưu có tên "${argFile}" trong thư mục backups/.`);
      process.exit(1);
    }
    selectedBackup = matched;
  } else {
    // Hiển thị menu cho người dùng chọn
    console.log('\nDanh sách bản sao lưu khả dụng:');
    const limit = Math.min(files.length, 10);
    for (let i = 0; i < limit; i++) {
      const f = files[i];
      console.log(`[${i + 1}] ${f.name} - ${(f.size / 1024).toFixed(2)} KB - Thay đổi: ${f.mtime.toLocaleString()}`);
    }
    
    const choice = await askQuestion(`\nChọn số thứ tự [1-${limit}] muốn phục hồi (nhấn Enter để chọn bản mới nhất [1]): `);
    if (choice === '') {
      selectedBackup = files[0];
    } else {
      const idx = parseInt(choice, 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= limit) {
        console.error('LỖI: Lựa chọn không hợp lệ.');
        process.exit(1);
      }
      selectedBackup = files[idx];
    }
  }
  
  console.log('\n------------------------------------------------------------');
  console.log(`TẬP TIN KHÔI PHỤC ĐƯỢC CHỌN: ${selectedBackup.name}`);
  console.log(`ĐƯỜNG DẪN FILE SAO LƯU: ${selectedBackup.path}`);
  console.log('------------------------------------------------------------');
  
  // 5. Cảnh báo xác nhận lớp thứ nhất
  console.warn('\x1b[31m%s\x1b[0m', 'CẢNH BÁO NGUY HIỂM: Thao tác này sẽ ghi đè và làm MẤT VĨNH VIỄN toàn bộ dữ liệu SQLite hiện tại của hệ thống!');
  const confirm1 = await askQuestion('Bạn có chắc chắn muốn tiếp tục không? (gõ "y" hoặc "yes" để tiếp tục, gõ phím khác để hủy): ');
  
  if (confirm1.toLowerCase() !== 'y' && confirm1.toLowerCase() !== 'yes') {
    console.log('Đã hủy quá trình khôi phục. Cơ sở dữ liệu hiện tại được an toàn.');
    process.exit(0);
  }
  
  // 6. Cảnh báo xác nhận lớp thứ hai (Double Confirmation)
  console.warn('\x1b[31m%s\x1b[0m', 'XÁC NHẬN LỚP THỨ HAI: Đây là thao tác không thể quay lại!');
  const confirm2 = await askQuestion('Vui lòng gõ chính xác cụm từ "RESTORE-CONFIRM" để bắt đầu: ');
  
  if (confirm2 !== 'RESTORE-CONFIRM') {
    console.log('Xác thực sai từ khóa. Đã hủy quá trình khôi phục. Cơ sở dữ liệu hiện tại được an toàn.');
    process.exit(0);
  }
  
  // 7. Tạo mốc sao lưu dự phòng pre-restore trước khi ghi đè
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const preRestoreName = `pre_restore_${yyyy}${mm}${dd}_${hh}${min}${ss}.db`;
  const preRestorePath = path.join(backupsDir, preRestoreName);
  
  console.log(`\nĐang tiến hành tạo bản sao lưu dự phòng tự động: ${preRestoreName}...`);
  try {
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, preRestorePath);
      console.log(`- Bản dự phòng khẩn cấp được lưu tại: ${preRestorePath}`);
    } else {
      console.log('- Không phát hiện database cũ, bỏ qua tạo dự phòng pre_restore.');
    }
  } catch (err) {
    console.error('LỖI: Không thể tạo bản sao lưu an toàn pre_restore. Hủy quá trình khôi phục dữ liệu.');
    console.error(err.message);
    process.exit(1);
  }
  
  // 8. Thực hiện khôi phục ghi đè
  console.log(`Đang tiến hành khôi phục ghi đè dữ liệu SQLite...`);
  try {
    fs.copyFileSync(selectedBackup.path, dbPath);
    
    console.log('\x1b[32m%s\x1b[0m', '\nPHỤC HỒI CƠ SỞ DỮ LIỆU SQLITE THÀNH CÔNG!');
    console.log(`- Nguồn khôi phục: ${selectedBackup.name}`);
    console.log(`- Trạng thái DB: Đã được cập nhật thành công.`);
    console.log('\n> [QUAN TRỌNG] VUI LÒNG KHỞI ĐỘNG LẠI SERVER BACKEND (nếu đang bật) để tải lại dữ liệu mới nhất!');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', '\nLỖI NGHIÊM TRỌNG: Ghi đè tệp SQLite thất bại.');
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      console.error('\x1b[31m%s\x1b[0m', '=> Nguyên nhân: File database hiện tại đang bị khóa (có thể NestJS Backend đang chạy).');
      console.error('=> Cách xử lý: Vui lòng tắt server backend (Ctrl+C hoặc kill port 3000) và thực hiện lại lệnh restore!');
    } else {
      console.error(err.message);
    }
    
    // Gợi ý phục hồi lại nếu đè dở dang bị hỏng
    if (fs.existsSync(preRestorePath)) {
      console.log(`\nGợi ý phục hồi lại dữ liệu ban đầu trước sự cố bằng cách chạy:`);
      console.log(`node scripts/restore.js ${preRestoreName}`);
    }
    process.exit(1);
  }
}

main();
