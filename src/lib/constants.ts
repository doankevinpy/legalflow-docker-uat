// ============================================================
// constants.ts – Single source of truth cho tất cả code↔label
// Backend lưu code, frontend hiển thị label tiếng Việt
// ============================================================

// ---------- AI Governance Warning Banner (Phase 9B-B) ----------
export const AI_REVIEW_WARNING = '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
export const AI_REVIEW_WARNING_TEXT = 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';

// ---------- Case Type ----------
export const CASE_TYPE_CODES = ['KN', 'TC', 'KNG', 'PA', 'TVPL', 'KHAC'] as const;
export type CaseTypeCode = (typeof CASE_TYPE_CODES)[number];

export const CASE_TYPE_LABELS: Record<CaseTypeCode, string> = {
  KN: 'Khiếu nại',
  TC: 'Tố cáo',
  KNG: 'Kiến nghị',
  PA: 'Phản ánh',
  TVPL: 'Tư vấn pháp lý',
  KHAC: 'Khác',
};

// ---------- Case Field ----------
export const CASE_FIELD_CODES = [
  'DAT_DAI',
  'DAN_SU',
  'LAO_DONG',
  'HON_NHAN_GIA_DINH',
  'DOANH_NGHIEP',
  'HANH_CHINH',
  'KHAC',
] as const;
export type CaseFieldCode = (typeof CASE_FIELD_CODES)[number];

export const CASE_FIELD_LABELS: Record<CaseFieldCode, string> = {
  DAT_DAI: 'Đất đai',
  DAN_SU: 'Dân sự',
  LAO_DONG: 'Lao động',
  HON_NHAN_GIA_DINH: 'Hôn nhân gia đình',
  DOANH_NGHIEP: 'Doanh nghiệp',
  HANH_CHINH: 'Hành chính',
  KHAC: 'Khác',
};

// ---------- Neighborhood ----------
export const NEIGHBORHOOD_CODES = ['KP1', 'KP2', 'KP3', 'KP4', 'KP5', 'KHAC'] as const;
export type NeighborhoodCode = (typeof NEIGHBORHOOD_CODES)[number];

export const NEIGHBORHOOD_LABELS: Record<NeighborhoodCode, string> = {
  KP1: 'Khu phố 1',
  KP2: 'Khu phố 2',
  KP3: 'Khu phố 3',
  KP4: 'Khu phố 4',
  KP5: 'Khu phố 5',
  KHAC: 'Khác',
};

// ---------- Case Status ----------
export const CASE_STATUS_CODES = [
  'NEW',
  'NEEDS_MORE_INFO',
  'IN_PROGRESS',
  'RESPONDED',
  'CLOSED',
] as const;
export type CaseStatusCode = (typeof CASE_STATUS_CODES)[number];

export const CASE_STATUS_LABELS: Record<CaseStatusCode, string> = {
  NEW: 'Mới tiếp nhận',
  NEEDS_MORE_INFO: 'Cần bổ sung',
  IN_PROGRESS: 'Đang xử lý',
  RESPONDED: 'Đã phản hồi',
  CLOSED: 'Đóng hồ sơ',
};

// ---------- Roles ----------
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  VIEWER: 'VIEWER',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

// ---------- Reverse maps (label → code) dùng cho Migration ----------
export const CASE_TYPE_REVERSE: Record<string, CaseTypeCode> = {
  'Khiếu nại': 'KN',
  'Tố cáo': 'TC',
  'Kiến nghị': 'KNG',
  'Phản ánh': 'PA',
  'Tư vấn pháp lý': 'TVPL',
  'Khác': 'KHAC',
};

export const CASE_FIELD_REVERSE: Record<string, CaseFieldCode> = {
  'Đất đai': 'DAT_DAI',
  'Dân sự': 'DAN_SU',
  'Lao động': 'LAO_DONG',
  'Hôn nhân gia đình': 'HON_NHAN_GIA_DINH',
  'Doanh nghiệp': 'DOANH_NGHIEP',
  'Hành chính': 'HANH_CHINH',
  'Khác': 'KHAC',
};

export const CASE_STATUS_REVERSE: Record<string, CaseStatusCode> = {
  'Mới tiếp nhận': 'NEW',
  'Cần bổ sung': 'NEEDS_MORE_INFO',
  'Đang xử lý': 'IN_PROGRESS',
  'Đã phản hồi': 'RESPONDED',
  'Đã hoàn thành': 'RESPONDED', // map old label
  'Đóng hồ sơ': 'CLOSED',
  'Đóng': 'CLOSED',
};

export const NEIGHBORHOOD_REVERSE: Record<string, NeighborhoodCode> = {
  KP1: 'KP1', KP2: 'KP2', KP3: 'KP3', KP4: 'KP4', KP5: 'KP5',
  'Khác': 'KHAC', KHAC: 'KHAC',
};

export const LAND_PROCEDURE_LABELS: Record<string, string> = {
  CAP_GIAY_CHUNG_NHAN: 'Cấp Giấy chứng nhận',
  CHUYEN_MUC_DICH_SD: 'Chuyển mục đích sử dụng đất',
  TRANH_CHAP_DAT_DAI: 'Giải quyết tranh chấp đất đai',
  GIAO_DAT_CHO_THUE_DAT: 'Giao đất, cho thuê đất',
  THU_HOI_DAT_BOI_THUONG: 'Thu hồi đất, bồi thường giải phóng mặt bằng',
  KHAC: 'Khác',
};

export const LAND_TYPE_LABELS: Record<string, string> = {
  DAT_O_DO_THI: 'Đất ở tại đô thị (ODT)',
  DAT_O_NONG_THON: 'Đất ở tại nông thôn (ONT)',
  DAT_TRONG_LUA: 'Đất trồng lúa',
  DAT_TRONG_CAY_LAU_NAM: 'Đất trồng cây lâu năm',
  DAT_RUNG_PHONG_HO: 'Đất rừng phòng hộ',
  DAT_SAN_XUAT_KINH_DOANH: 'Đất sản xuất kinh doanh',
  KHAC: 'Khác',
};

export const PLANNING_STATUS_LABELS: Record<string, string> = {
  TRONG_QUY_HOACH: 'Trong quy hoạch',
  NGOAI_QUY_HOACH: 'Ngoài quy hoạch',
  CAN_XAC_MINH_THEM: 'Cần xác minh thêm',
};

export const DISPUTE_STATUS_LABELS: Record<string, string> = {
  DANG_TRANH_CHAP: 'Đang tranh chấp',
  KHONG_TRANH_CHAP: 'Không tranh chấp',
  CAN_XAC_MINH_THEM: 'Cần xác minh thêm',
};

export const ORIGIN_OF_LAND_STATUS_LABELS: Record<string, string> = {
  NHAN_CHUYEN_NHUONG: 'Nhận chuyển nhượng',
  DUOC_THUA_KE: 'Được thừa kế',
  DUOC_TANG_CHO: 'Được tặng cho',
  DAT_KHAI_HOANG: 'Đất khai hoang',
  NHA_NUOC_GIAO_DAT: 'Nhà nước giao đất',
  NHA_NUOC_CHO_THUE_DAT: 'Nhà nước cho thuê đất',
  KHAC: 'Khác',
};

export const DOCUMENT_COMPLETENESS_LABELS: Record<string, string> = {
  DU_HO_SO: 'Đủ hồ sơ',
  THIEU_HO_SO: 'Thiếu hồ sơ',
};

export const FINANCIAL_OBLIGATION_STATUS_LABELS: Record<string, string> = {
  HOAN_THANH: 'Hoàn thành',
  CHUA_HOAN_THANH: 'Chưa hoàn thành',
  MIEN_GIAM: 'Miễn giảm',
};

export const LAND_OUTCOME_LABELS: Record<string, string> = {
  CHAP_THUAN: 'Chấp thuận',
  TU_CHOI: 'Từ chối',
  CHUYEN_TRA: 'Chuyển trả',
};

export const LAND_REASON_CODE_LABELS: Record<string, string> = {
  QUY_HOACH_XUNG_DOT: 'Quy hoạch xung đột',
  TRANH_CHAP_CHUA_GIAI_QUYET: 'Tranh chấp chưa giải quyết',
  THIEU_GIAY_TO_PHAP_LY: 'Thiếu giấy tờ pháp lý',
  CHUA_HOAN_THANH_NGHIA_VU_TAI_CHINH: 'Chưa hoàn thành nghĩa vụ tài chính',
  HO_SO_KHONG_HOP_LE: 'Hồ sơ không hợp lệ',
  KHAC: 'Khác',
};

export const COMPLAINT_TYPE_LABELS: Record<string, string> = {
  KN: 'Khiếu nại',
  TC: 'Tố cáo',
  PA: 'Phản ánh',
};

export const RISK_REVIEW_STATUS_LABELS: Record<string, string> = {
  AN_TOAN: 'An toàn',
  CAN_RA_SOAT: 'Cần rà soát',
  DA_XAC_MINH_BINH_THUONG: 'Đã xác minh bình thường',
  DA_XU_LY_DIEU_CHINH: 'Đã xử lý điều chỉnh',
};
