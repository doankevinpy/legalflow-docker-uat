// ============================================================
// api-types.ts – TypeScript interfaces phản ánh backend response
// Dùng code (KN, DAT_DAI...) không dùng tiếng Việt
// ============================================================

export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentMeta {
  id?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
  uploadedBy?: string;
  name?: string; // Fallback cho old mock data
  url?: string; // Fallback cho old mock data
  note?: string; // Fallback cho old mock data
}

export interface ApiCaseNote {
  id: string;
  caseId: string;
  userId: string;
  user?: Pick<ApiUser, 'id' | 'fullName'>;
  content: string;
  createdAt: string;
}

export interface ApiChecklistItem {
  id: string;
  caseId: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  completedById?: string;
  createdAt: string;
}

export interface ApiCaseHistory {
  id: string;
  caseId: string;
  userId: string;
  user?: Pick<ApiUser, 'id' | 'fullName'>;
  action: string;
  details: string; // JSON string
  createdAt: string;
}

export interface ApiCase {
  id: string;
  caseCode: string;
  senderName: string;
  contact?: string;
  type: string;
  field: string;
  neighborhood: string;
  summary: string;
  request: string;
  documents: DocumentMeta[];
  receivedDate: string;
  deadline?: string;
  status: string;
  assignedToId?: string;
  assignedTo?: Pick<ApiUser, 'id' | 'fullName' | 'email'>;
  createdById?: string;
  createdBy?: Pick<ApiUser, 'id' | 'fullName' | 'email'>;
  deletedAt?: string;
  deletedById?: string;
  notes?: ApiCaseNote[];
  checklist?: ApiChecklistItem[];
  histories?: ApiCaseHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CaseStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byField: Record<string, number>;
  byNeighborhood: Record<string, number>;
  overdue: number;
  needsMoreInfo: number;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreateCaseDto {
  senderName: string;
  contact?: string;
  type: string;
  field: string;
  neighborhood: string;
  summary: string;
  request: string;
  documents?: DocumentMeta[];
  receivedDate?: string;
  deadline?: string;
  assignedToId?: string;
}

export interface UpdateCaseDto extends Partial<CreateCaseDto> {}

export interface QueryCasesParams {
  search?: string;
  status?: string;
  type?: string;
  field?: string;
  neighborhood?: string;
  assignedToId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiLandProfile {
  id: string;
  caseId: string;
  procedureType: string;
  landType: string;
  currentLandUseType: string;
  requestedLandUseType?: string;
  area: number;
  neighborhood: string;
  planningStatus: string;
  disputeStatus: string;
  originOfLandStatus: string;
  documentCompleteness: string;
  financialObligationStatus: string;
  outcome?: string;
  reasonCode?: string;
  complaintFlag: boolean;
  complaintType?: string;
  processingDays?: number;
  overdueDays?: number;
  riskReviewStatus: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateLandProfilePayload = Omit<
  ApiLandProfile,
  'id' | 'caseId' | 'createdAt' | 'updatedAt'
>;

export type UpdateLandProfilePayload = Partial<CreateLandProfilePayload>;

