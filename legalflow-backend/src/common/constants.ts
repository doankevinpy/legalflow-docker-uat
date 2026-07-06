// Biểu thức chính quy cho mật khẩu:
// Ít nhất 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PASSWORD_MESSAGE_VI =
  'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';

// AI Governance Warning Banner (Phase 9B-B)
export const AI_REVIEW_WARNING = '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
export const AI_REVIEW_WARNING_TEXT = 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
