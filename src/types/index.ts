export type CaseType =
  | 'Khiếu nại'
  | 'Tố cáo'
  | 'Kiến nghị'
  | 'Phản ánh'
  | 'Tư vấn pháp lý'
  | 'Khác';

export type CaseField =
  | 'Đất đai'
  | 'Dân sự'
  | 'Lao động'
  | 'Hôn nhân gia đình'
  | 'Doanh nghiệp'
  | 'Hành chính'
  | 'Khác';

export type Neighborhood = 'KP1' | 'KP2' | 'KP3' | 'KP4' | 'KP5' | 'Khác';

export type CaseStatus = 'Mới tiếp nhận' | 'Đang xử lý' | 'Cần bổ sung' | 'Đã hoàn thành' | 'Đóng';

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface CaseLog {
  id: string;
  date: string;
  action: string;
  note?: string;
  user?: string;
}

export interface LegalCase {
  id: string;
  caseId: string; // Mã hồ sơ (e.g. HS-2405-001)
  receivedDate: string; // ISO string
  deadlineDate?: string; // ISO string (ngày đến hạn xử lý)
  senderName: string;
  contactInfo: string;
  type: CaseType;
  field: CaseField;
  neighborhood: Neighborhood; // Thêm trường Khu phố
  summary: string;
  status: CaseStatus;
  assignee: string; // Người phụ trách
  checklist: ChecklistItem[];
  logs: CaseLog[];
  notes: string;
}
