export type ProcedureField = 'DAT_DAI' | 'XAY_DUNG' | 'KHAC';

export type ProcedureGroup =
  | 'CAP_GCN_LAN_DAU'
  | 'CHUYEN_MUC_DICH_SDD'
  | 'NGHIA_VU_TAI_CHINH'
  | 'CAP_PHEP_XAY_DUNG'
  | 'KHAC';

export type ProcedureStatus =
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'SUPPLEMENT_REQUIRED'
  | 'PENDING_APPROVAL'
  | 'COMPLETED'
  | 'REJECTED';

export type ProcedureDocReviewStatus = 'VALID' | 'MISSING' | 'NEEDS_VERIFICATION';

export type ProcedurePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ProcedureNoteType = 'GENERAL' | 'OFFICER_REVIEW' | 'FIELD_INSPECTION';

export interface ProcedureType {
  id: string;
  code: string;
  name: string;
  field: ProcedureField;
  group: ProcedureGroup;
  description?: string;
  legalBasis?: string;
  requiredDocuments?: any[];
  processingTimeDays: number;
  isActive: boolean;
}

export interface ProcedureDocument {
  id: string;
  procedureCaseId: string;
  documentType: string;
  title: string;
  fileUrl?: string;
  objectKey?: string;
  extractedText?: string;
  reviewStatus: ProcedureDocReviewStatus;
  officerNote?: string;
  createdAt: string;
}

export interface ProcedureChecklistItem {
  id: string;
  procedureCaseId: string;
  checklistGroup: string;
  title: string;
  description?: string;
  priority: ProcedurePriority;
  isCompleted: boolean;
  completedById?: string;
  completedBy?: { id: string; fullName: string };
  completedAt?: string;
  isAiSuggested: boolean;
  createdAt: string;
}

export interface ProcedureNote {
  id: string;
  procedureCaseId: string;
  userId: string;
  user?: { id: string; fullName: string; role: string };
  content: string;
  noteType: ProcedureNoteType;
  createdAt: string;
}

export interface ProcedureAuditLog {
  id: string;
  procedureCaseId?: string;
  userId: string;
  user?: { id: string; fullName: string };
  actionType: string;
  entityType: string;
  entityId?: string;
  inputPayload?: any;
  outputPayload?: any;
  createdAt: string;
}

export interface ProcedureCase {
  id: string;
  caseCode: string;
  procedureTypeId: string;
  procedureType?: ProcedureType;
  field: ProcedureField;
  applicantName: string;
  applicantAddress?: string;
  applicantPhone?: string;
  landParcelSummary?: Record<string, any>;
  constructionSummary?: Record<string, any>;
  status: ProcedureStatus;
  receivedAt: string;
  dueDate?: string;
  assignedToId?: string;
  assignedTo?: { id: string; fullName: string; email: string };
  createdById?: string;
  createdBy?: { id: string; fullName: string; email: string };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  documents?: ProcedureDocument[];
  checklistItems?: ProcedureChecklistItem[];
  procedureNotes?: ProcedureNote[];
  auditLogs?: ProcedureAuditLog[];
}
