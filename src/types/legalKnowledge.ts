export type LegalDocumentType = 'LAW' | 'DECREE' | 'CIRCULAR' | 'DECISION' | 'DIRECTIVE' | 'GUIDANCE' | 'OTHER';
export type LegalDocumentStatus = 'DRAFT' | 'ACTIVE' | 'AMENDED' | 'REPLACED' | 'EXPIRED' | 'ARCHIVED';
export type LegalDocumentRelationType = 'REPLACES' | 'AMENDS' | 'GUIDES' | 'IMPLEMENTS' | 'REFERENCES' | 'SUPERSEDES';
export type VersionStatus = 'DRAFT' | 'REVIEWING' | 'APPROVED' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED';
export type LegalUpdateReviewStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'APPLIED' | 'PENDING_REVIEW' | 'IN_REVIEW' | 'APPROVED_FOR_UPDATE';

export interface LegalDocumentRelation {
  id: string;
  documentId: string;
  relatedDocumentId: string;
  relationType: LegalDocumentRelationType;
  description?: string;
  effectiveFrom?: string;
  createdAt: string;
  document?: LegalDocument;
  relatedDocument?: LegalDocument;
}

export interface LegalDocument {
  id: string;
  documentCode: string;
  documentTitle: string;
  documentType: LegalDocumentType;
  issuingAuthority?: string;
  issuedDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  status: LegalDocumentStatus;
  sourceUrl?: string;
  fileObjectKey?: string;
  summary?: string;
  notes?: string;
  createdById?: string;
  approvedById?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  outgoingRelations?: LegalDocumentRelation[];
  incomingRelations?: LegalDocumentRelation[];
}

export interface ProcedureTypeVersion {
  id: string;
  procedureTypeId: string;
  version: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  status: VersionStatus;
  procedureName: string;
  procedureCode?: string;
  field?: string;
  group?: string;
  requiredDocuments?: any;
  processingTimeDays?: number;
  receivingAgency?: string;
  resolvingAgency?: string;
  workflowSteps?: any;
  legalBasisDocumentIds?: any;
  approvedById?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiPromptVersion {
  id: string;
  promptKey: string;
  version: string;
  procedureTypeCode?: string;
  procedureGroup?: string;
  analysisType?: string;
  systemPrompt: string;
  outputSchema?: any;
  legalDocumentIds?: any;
  effectiveFrom?: string;
  effectiveTo?: string;
  status: VersionStatus;
  approvedById?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistVersion {
  id: string;
  checklistKey: string;
  version: string;
  procedureTypeCode?: string;
  procedureGroup?: string;
  checklistItems: any;
  legalDocumentIds?: any;
  effectiveFrom?: string;
  effectiveTo?: string;
  status: VersionStatus;
  approvedById?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalUpdateLog {
  id: string;
  updateTitle: string;
  sourceDocumentId?: string;
  affectedDocumentIds?: any;
  affectedProcedureTypes?: any;
  affectedPromptKeys?: any;
  affectedChecklistKeys?: any;
  impactSummary?: string;
  reviewStatus: LegalUpdateReviewStatus;
  reviewedById?: string;
  reviewedBy?: { id: string; email: string; fullName: string; role: string };
  reviewedAt?: string;
  appliedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  sourceDocument?: LegalDocument;
}

export interface ProcedureAiAnalysisLegalSnapshot {
  id: string;
  procedureAiAnalysisId: string;
  legalDocumentIds?: any;
  promptVersionId?: string;
  checklistVersionId?: string;
  procedureTypeVersionId?: string;
  knowledgeBaseVersion?: string;
  snapshotJson?: any;
  createdAt: string;
  procedureAiAnalysis?: any;
  procedureTypeVersion?: ProcedureTypeVersion;
  promptVersion?: AiPromptVersion;
  checklistVersion?: ChecklistVersion;
}
