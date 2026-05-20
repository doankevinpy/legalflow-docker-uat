export function anonymizeText(text: string): string {
  if (!text) return text;

  let result = text;

  // 1. Email pattern
  // Bắt các chuỗi dạng email chuẩn
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  result = result.replace(emailRegex, '[EMAIL_ĐÃ_ẨN]');

  // 2. Phone number pattern (Vietnam)
  // Bắt các chuỗi 10 số (bắt đầu bằng 0 hoặc +84) có thể cách nhau bởi khoảng trắng hoặc dấu chấm
  // Ví dụ: 0912345678, 091.234.5678, 091 234 5678, +84912345678
  const phoneRegex = /(?:\+84|0)[1-9](?:[\s.-]*\d){8}\b/g;
  result = result.replace(phoneRegex, '[SĐT_ĐÃ_ẨN]');

  // 3. ID Card (CCCD/CMND) pattern
  // CCCD: 12 số, CMND: 9 hoặc 12 số.
  // Đảm bảo không nằm trong một chuỗi số dài hơn (dùng word boundary)
  const idCardRegex = /\b(\d{9}|\d{12})\b/g;
  result = result.replace(idCardRegex, (_match) => {
    // Nếu nó khớp chính xác với regex của SĐT, ta ưu tiên SĐT trước (nếu chạy SĐT trước thì đã không còn match).
    // Tuy nhiên chuỗi 9 số hoặc 12 số liên tục sẽ bị bắt.
    return '[CCCD_ĐÃ_ẨN]';
  });

  return result;
}
