// ============================================================
// constants.ts – Single source of truth cho tất cả code↔label
// Backend lưu code, frontend hiển thị label tiếng Việt
// ============================================================

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
