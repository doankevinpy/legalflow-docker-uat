import { useEffect, useState, useMemo } from 'react';
import {
  Scale,
  BookOpen,
  AlertTriangle,
  Search,
  Filter,
  Info,
  ShieldAlert,
  Eye,
  X,
  Layers,
  FileCode,
  ListCheck,
  History,
  Camera,
  ExternalLink,
  Database,
  FileText,
  Play,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { legalKnowledgeApi } from '../lib/legalKnowledgeApi';
import { useAuth } from '../contexts/AuthContext';
import { LegalKnowledgeImportTab } from '../components/legal-knowledge/LegalKnowledgeImportTab';
import type {
  LegalDocument,
  ProcedureTypeVersion,
  AiPromptVersion,
  ChecklistVersion,
  LegalUpdateLog,
  ProcedureAiAnalysisLegalSnapshot,
} from '../types/legalKnowledge';

type TabType = 'overview' | 'documents' | 'procedures' | 'prompts' | 'checklists' | 'logs' | 'snapshots' | 'import';

const parseLogNotes = (notes: any): any => {
  if (!notes) return {};
  if (typeof notes === 'string') {
    try {
      return JSON.parse(notes);
    } catch {
      return {};
    }
  }
  return typeof notes === 'object' ? notes : {};
};

export default function LegalKnowledgePage() {
  const { user } = useAuth();
  const role = user?.role ?? 'VIEWER';
  const canAnalyzeImpact = ['ADMIN', 'MANAGER'].includes(role);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // Data states
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [procedureVersions, setProcedureVersions] = useState<ProcedureTypeVersion[]>([]);
  const [promptVersions, setPromptVersions] = useState<AiPromptVersion[]>([]);
  const [checklistVersions, setChecklistVersions] = useState<ChecklistVersion[]>([]);
  const [updateLogs, setUpdateLogs] = useState<LegalUpdateLog[]>([]);
  const [snapshots, setSnapshots] = useState<ProcedureAiAnalysisLegalSnapshot[]>([]);

  // Filter states for Legal Documents
  const [docSearch, setDocSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Modal states
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [selectedProcVer, setSelectedProcVer] = useState<ProcedureTypeVersion | null>(null);
  const [selectedPromptVer, setSelectedPromptVer] = useState<AiPromptVersion | null>(null);
  const [selectedChecklistVer, setSelectedChecklistVer] = useState<ChecklistVersion | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<ProcedureAiAnalysisLegalSnapshot | null>(null);
  const [showImpactModal, setShowImpactModal] = useState<boolean>(false);
  const [impactSourceDocId, setImpactSourceDocId] = useState<string>('');
  const [impactTitle, setImpactTitle] = useState<string>('');
  const [impactNotes, setImpactNotes] = useState<string>('');
  const [analyzingImpact, setAnalyzingImpact] = useState<boolean>(false);
  const [impactResult, setImpactResult] = useState<any | null>(null);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<LegalUpdateLog | null>(null);

  // Workflow action modal states
  const [workflowModal, setWorkflowModal] = useState<{
    isOpen: boolean;
    action: string;
    title: string;
    requireNote: boolean;
    requireReason: boolean;
    isWarning: boolean;
    buttonLabel: string;
    buttonClass: string;
  } | null>(null);
  const [workflowNote, setWorkflowNote] = useState<string>('');
  const [workflowReason, setWorkflowReason] = useState<string>('');
  const [submittingWorkflow, setSubmittingWorkflow] = useState<boolean>(false);

  const handleWorkflowSubmit = async () => {
    if (!selectedLogForDetail || !workflowModal) return;
    if (workflowModal.requireNote && !workflowNote.trim() && !workflowReason.trim()) {
      alert('Vui lòng nhập ghi chú hoặc lý do theo yêu cầu.');
      return;
    }
    if (workflowModal.requireReason && !workflowReason.trim() && !workflowNote.trim()) {
      alert('Vui lòng nhập lý do theo yêu cầu.');
      return;
    }
    setSubmittingWorkflow(true);
    try {
      const res = await legalKnowledgeApi.workflowAction(selectedLogForDetail.id, {
        action: workflowModal.action,
        note: workflowNote,
        reason: workflowReason,
      });
      const updatedLog = res?.updateLog || res?.log || res?.data?.updateLog || res?.data?.log;
      if (updatedLog) {
        setSelectedLogForDetail(updatedLog);
      }
      setWorkflowModal(null);
      setWorkflowNote('');
      setWorkflowReason('');
      await fetchAllData();
    } catch (err: any) {
      console.error('Workflow action error:', err);
      alert(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi thực hiện thao tác workflow.');
    } finally {
      setSubmittingWorkflow(false);
    }
  };

  // Phase 8F-C Draft Version Modal state
  const [draftModalOpen, setDraftModalOpen] = useState<boolean>(false);
  const [draftType, setDraftType] = useState<string>('PROCEDURE_TYPE_VERSION');
  const [draftSourceId, setDraftSourceId] = useState<string>('');
  const [draftReason, setDraftReason] = useState<string>('');
  const [draftVerString, setDraftVerString] = useState<string>('');
  const [submittingDraft, setSubmittingDraft] = useState<boolean>(false);

  // Phase 8F-D Simulation Modal state
  const [simModalOpen, setSimModalOpen] = useState<boolean>(false);
  const [sampleCases, setSampleCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [simProcVerId, setSimProcVerId] = useState<string>('');
  const [simPromptVerId, setSimPromptVerId] = useState<string>('');
  const [simChecklistVerId, setSimChecklistVerId] = useState<string>('');
  const [simNote, setSimNote] = useState<string>('');
  const [submittingSim, setSubmittingSim] = useState<boolean>(false);

  // Phase 8F-E-C Activation Modal state
  const [actModalOpen, setActModalOpen] = useState<boolean>(false);
  const [actDraftType, setActDraftType] = useState<string>('PROCEDURE_TYPE_VERSION');
  const [actDraftVerId, setActDraftVerId] = useState<string>('');
  const [actReason, setActReason] = useState<string>('');
  const [actEffectiveFrom, setActEffectiveFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [actConfirmText, setActConfirmText] = useState<string>('');
  const [actAgreedRisk, setActAgreedRisk] = useState<boolean>(false);
  const [submittingAct, setSubmittingAct] = useState<boolean>(false);
  const [actError, setActError] = useState<string>('');

  // Phase 8F-E-D-A Post-activation Verification state
  const [verificationData, setVerificationData] = useState<any>(null);
  const [loadingVerification, setLoadingVerification] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>('');

  // Phase 8F-E-D-E Post-rollback Verification state
  const [rollbackVerificationData, setRollbackVerificationData] = useState<any>(null);
  const [loadingRollbackVerification, setLoadingRollbackVerification] = useState<boolean>(false);
  const [rollbackVerificationError, setRollbackVerificationError] = useState<string>('');

  // Phase 8F-E-D-D Manual Version Rollback state
  const [showRollbackModal, setShowRollbackModal] = useState<boolean>(false);
  const [rollbackStep, setRollbackStep] = useState<number>(1);
  const [rollbackReason, setRollbackReason] = useState<string>('');
  const [rollbackConfirmationText, setRollbackConfirmationText] = useState<string>('');
  const [rollbackSubmitting, setRollbackSubmitting] = useState<boolean>(false);
  const [rollbackResult, setRollbackResult] = useState<any>(null);
  const [rollbackError, setRollbackError] = useState<string>('');

  useEffect(() => {
    setVerificationData(null);
    setVerificationError('');
    setRollbackVerificationData(null);
    setRollbackVerificationError('');
    setShowRollbackModal(false);
    setRollbackStep(1);
    setRollbackReason('');
    setRollbackConfirmationText('');
    setRollbackSubmitting(false);
    setRollbackResult(null);
    setRollbackError('');
  }, [selectedLogForDetail?.id]);

  useEffect(() => {
    if (simModalOpen) {
      legalKnowledgeApi.getSampleCases()
        .then(res => {
          const list = Array.isArray(res) ? res : (res as any)?.data || [];
          setSampleCases(list);
          if (list.length > 0 && !selectedCaseId) {
            setSelectedCaseId(list[0].id);
          }
        })
        .catch(err => console.error('Error fetching sample cases:', err));
    }
  }, [simModalOpen]);

  useEffect(() => {
    if (simModalOpen && selectedLogForDetail) {
      const parsed = parseLogNotes(selectedLogForDetail.notes);
      const drafts = parsed?.draftVersions?.list || [];
      const procDrafts = drafts.filter((d: any) => d.type === 'PROCEDURE_TYPE_VERSION');
      const promptDrafts = drafts.filter((d: any) => d.type === 'AI_PROMPT_VERSION');
      const chkDrafts = drafts.filter((d: any) => d.type === 'CHECKLIST_VERSION');
      setSimProcVerId(procDrafts.length > 0 ? procDrafts[0].id : '');
      setSimPromptVerId(promptDrafts.length > 0 ? promptDrafts[0].id : '');
      setSimChecklistVerId(chkDrafts.length > 0 ? chkDrafts[0].id : '');
    }
  }, [simModalOpen, selectedLogForDetail]);

  useEffect(() => {
    if (draftModalOpen) {
      let activeList: any[] = [];
      if (draftType === 'PROCEDURE_TYPE_VERSION') {
        activeList = procedureVersions.filter(v => v.status === 'ACTIVE');
      } else if (draftType === 'AI_PROMPT_VERSION') {
        activeList = promptVersions.filter(v => v.status === 'ACTIVE');
      } else if (draftType === 'CHECKLIST_VERSION') {
        activeList = checklistVersions.filter(v => v.status === 'ACTIVE');
      }
      if (activeList.length > 0 && (!draftSourceId || !activeList.some(item => item.id === draftSourceId))) {
        setDraftSourceId(activeList[0].id);
      } else if (activeList.length === 0) {
        setDraftSourceId('');
      }
    }
  }, [draftModalOpen, draftType, procedureVersions, promptVersions, checklistVersions]);

  const handleCreateDraftSubmit = async () => {
    if (!selectedLogForDetail) return;
    if (!draftSourceId) {
      alert('Vui lòng chọn phiên bản nguồn ACTIVE để tạo bản nháp.');
      return;
    }
    if (!draftReason.trim()) {
      alert('Vui lòng nhập lý do tạo bản nháp version mới.');
      return;
    }
    setSubmittingDraft(true);
    try {
      const res = await legalKnowledgeApi.createDraftVersion(selectedLogForDetail.id, {
        draftType,
        sourceVersionId: draftSourceId,
        reason: draftReason,
        draftVersion: draftVerString.trim() || undefined,
      });
      const updatedLog = res?.updateLog || res?.log || res?.data?.updateLog || res?.data?.log;
      if (updatedLog) {
        setSelectedLogForDetail(updatedLog);
      }
      alert(res?.message || res?.data?.message || 'Đã tạo bản nháp version thành công.');
      setDraftModalOpen(false);
      setDraftReason('');
      setDraftVerString('');
      await fetchAllData();
    } catch (err: any) {
      console.error('Create draft error:', err);
      alert(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi tạo bản nháp version.');
    } finally {
      setSubmittingDraft(false);
    }
  };

  const handleRunSimulation = async () => {
    if (!selectedLogForDetail) return;
    if (!selectedCaseId) {
      alert('Vui lòng chọn một hồ sơ TTHC mẫu để chạy thử.');
      return;
    }
    if (!simProcVerId && !simPromptVerId && !simChecklistVerId) {
      alert('Vui lòng chọn ít nhất một bản nháp version để chạy kiểm thử song song.');
      return;
    }
    setSubmittingSim(true);
    try {
      const res = await legalKnowledgeApi.runDraftSimulation(selectedLogForDetail.id, {
        procedureCaseId: selectedCaseId,
        draftProcedureTypeVersionId: simProcVerId || undefined,
        draftPromptVersionId: simPromptVerId || undefined,
        draftChecklistVersionId: simChecklistVerId || undefined,
        note: simNote,
      });
      const updatedLog = res?.updateLog || res?.data?.updateLog;
      if (updatedLog) {
        setSelectedLogForDetail(updatedLog);
      }
      setSimModalOpen(false);
      setSimNote('');
      await fetchAllData();
      alert('Chạy thử kiểm thử song song (Shadow Testing) bản nháp thành công! Vui lòng xem kết quả trong chi tiết nhật ký.');
    } catch (err: any) {
      console.error('Run simulation error:', err);
      alert(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi chạy thử simulation.');
    } finally {
      setSubmittingSim(false);
    }
  };

  useEffect(() => {
    if (actModalOpen && selectedLogForDetail) {
      const parsed = parseLogNotes(selectedLogForDetail.notes);
      const drafts = parsed?.draftVersions?.list || [];
      const filtered = drafts.filter((d: any) => d.type === actDraftType && (d.currentStatus || d.status || 'DRAFT') === 'DRAFT');
      if (filtered.length > 0 && (!actDraftVerId || !filtered.some((item: any) => item.id === actDraftVerId))) {
        setActDraftVerId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActDraftVerId('');
      }
    }
  }, [actModalOpen, actDraftType, selectedLogForDetail]);

  const handleActivateVersion = async () => {
    if (!selectedLogForDetail) return;
    if (!actDraftVerId) {
      setActError('Vui lòng chọn bản nháp version cần kích hoạt.');
      return;
    }
    if (!actReason.trim()) {
      setActError('Vui lòng nhập lý do kích hoạt.');
      return;
    }
    if (!actEffectiveFrom) {
      setActError('Vui lòng chọn ngày có hiệu lực.');
      return;
    }
    if (actConfirmText !== 'KICH HOAT VERSION') {
      setActError('Chuỗi xác nhận không chính xác. Vui lòng nhập đúng "KICH HOAT VERSION".');
      return;
    }
    if (!actAgreedRisk) {
      setActError('Vui lòng xác nhận đã kiểm tra simulation và hiểu rủi ro.');
      return;
    }

    setSubmittingAct(true);
    setActError('');
    try {
      const payload = {
        draftType: actDraftType,
        draftVersionId: actDraftVerId,
        reason: actReason.trim(),
        effectiveFrom: actEffectiveFrom,
        confirmationText: actConfirmText,
      };
      const res = await legalKnowledgeApi.activateDraftVersion(selectedLogForDetail.id, payload);
      const updatedLog = res?.updateLog || res?.log || res?.data?.updateLog || res?.data?.log;
      if (updatedLog) {
        setSelectedLogForDetail(updatedLog);
      }
      setActModalOpen(false);
      setActReason('');
      setActConfirmText('');
      setActAgreedRisk(false);
      await fetchAllData();
      if (selectedLogForDetail?.id) {
        try {
          const freshLog = await legalKnowledgeApi.getUpdateLogById(selectedLogForDetail.id);
          if (freshLog) setSelectedLogForDetail(freshLog);
        } catch (e) {}
      }
      alert(res?.message || res?.data?.message || 'Kích hoạt version thủ công thành công! Version mới đã chuyển sang ACTIVE, version cũ đã chuyển sang REPLACED.');
    } catch (err: any) {
      console.error('Activate version error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi kích hoạt version.';
      setActError(Array.isArray(msg) ? msg.join('; ') : msg);
    } finally {
      setSubmittingAct(false);
    }
  };

  const handleRunVerification = async () => {
    if (!selectedLogForDetail?.id) {
      setVerificationError('Không tìm thấy ID nhật ký cập nhật để kiểm chứng.');
      return;
    }

    try {
      setLoadingVerification(true);
      setVerificationError('');
      setVerificationData(null);

      const res = await legalKnowledgeApi.getActivationVerification(selectedLogForDetail.id);
      const data = res?.data?.data || res?.data || res;

      console.log('LF activation verification result', data);

      if (!data || Object.keys(data).length === 0) {
        setVerificationError('API kiểm chứng không trả dữ liệu. Vui lòng kiểm tra backend endpoint activation-verification.');
        return;
      }

      setVerificationData(data);
    } catch (err: any) {
      console.error('Error fetching verification:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tải dữ liệu kiểm chứng sau kích hoạt.';
      setVerificationError(message);
    } finally {
      setLoadingVerification(false);
    }
  };

  const handleRunRollbackVerification = async () => {
    if (!selectedLogForDetail?.id) {
      setRollbackVerificationError('Không tìm thấy ID nhật ký cập nhật để kiểm chứng rollback.');
      return;
    }

    try {
      setLoadingRollbackVerification(true);
      setRollbackVerificationError('');
      setRollbackVerificationData(null);

      const res = await legalKnowledgeApi.getRollbackVerification(selectedLogForDetail.id);
      const data = res?.data?.data || res?.data || res;

      console.log('LF rollback verification result', data);

      if (!data || Object.keys(data).length === 0) {
        setRollbackVerificationError('API kiểm chứng không trả dữ liệu. Vui lòng kiểm tra backend endpoint rollback-verification.');
        return;
      }

      setRollbackVerificationData(data);
    } catch (err: any) {
      console.error('Error fetching rollback verification:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tải dữ liệu kiểm chứng sau rollback.';
      setRollbackVerificationError(message);
    } finally {
      setLoadingRollbackVerification(false);
    }
  };

  const handleRunRollback = async () => {
    if (!selectedLogForDetail?.id) return;
    if (!rollbackReason.trim() || rollbackReason.trim().length < 10) {
      setRollbackError('Vui lòng nhập lý do rollback tối thiểu 10 ký tự.');
      return;
    }
    const cleanConfirm = rollbackConfirmationText.trim();
    if (cleanConfirm !== 'ROLLBACK VERSION' && cleanConfirm !== 'TOI XAC NHAN ROLLBACK VERSION') {
      setRollbackError('Vui lòng nhập chính xác câu xác nhận: "ROLLBACK VERSION" hoặc "TOI XAC NHAN ROLLBACK VERSION".');
      return;
    }

    setRollbackSubmitting(true);
    setRollbackError('');
    setRollbackResult(null);

    try {
      const res = await legalKnowledgeApi.rollbackVersion(selectedLogForDetail.id, {
        rollbackReason: rollbackReason.trim(),
        confirmationText: cleanConfirm,
      });
      const data = res?.data?.data || res?.data || res;
      setRollbackResult(data);
      await fetchAllData();
      if (data?.updateLog) {
        setSelectedLogForDetail(data.updateLog);
      } else if (selectedLogForDetail?.id) {
        try {
          const logRes: any = await legalKnowledgeApi.getUpdateLogById(selectedLogForDetail.id);
          const updatedLog = logRes?.data?.data || logRes?.data || logRes;
          if (updatedLog) setSelectedLogForDetail(updatedLog);
        } catch (e) {
          console.error('Error refreshing log detail:', e);
        }
      }
    } catch (err: any) {
      console.error('Rollback error:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi thực hiện rollback version.';
      setRollbackError(Array.isArray(errMsg) ? errMsg.join('; ') : errMsg);
    } finally {
      setRollbackSubmitting(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [docsRes, procRes, promptRes, checkRes, logsRes, snapRes] = await Promise.all([
        legalKnowledgeApi.getDocuments(),
        legalKnowledgeApi.getProcedureTypeVersions(),
        legalKnowledgeApi.getPromptVersions(),
        legalKnowledgeApi.getChecklistVersions(),
        legalKnowledgeApi.getUpdateLogs(),
        legalKnowledgeApi.getSnapshots(),
      ]);
      setDocuments(docsRes || []);
      setProcedureVersions(procRes || []);
      setPromptVersions(promptRes || []);
      setChecklistVersions(checkRes || []);
      setUpdateLogs(logsRes || []);
      setSnapshots(snapRes || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu kho pháp lý:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAnalyzeImpact = async () => {
    setAnalyzingImpact(true);
    try {
      const res = await legalKnowledgeApi.analyzeImpactFromLog({
        sourceDocumentId: impactSourceDocId || undefined,
        title: impactTitle || undefined,
        notes: impactNotes || undefined,
      });
      const analysis = res?.impactAnalysis || res?.data?.impactAnalysis;
      if (analysis) {
        setImpactResult(analysis);
        fetchAllData();
      }
    } catch (err: any) {
      console.error('Failed to analyze impact:', err);
      alert(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi phân tích tác động pháp lý.');
    } finally {
      setAnalyzingImpact(false);
    }
  };

  // Helpers for formatting
  const formatDocType = (type: string) => {
    const map: Record<string, string> = {
      LAW: 'Luật',
      DECREE: 'Nghị định',
      CIRCULAR: 'Thông tư',
      DECISION: 'Quyết định',
      DIRECTIVE: 'Chỉ thị',
      GUIDANCE: 'Hướng dẫn',
      OTHER: 'Khác',
    };
    return map[type] || type;
  };

  const formatStatusBadge = (status: string) => {
    let bg = 'bg-slate-100 text-slate-700 border-slate-200';
    let label = status;
    switch (status) {
      case 'ACTIVE':
        bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
        label = 'Hiện hành (Active)';
        break;
      case 'DRAFT':
        bg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
        label = 'Dự thảo / Chờ duyệt';
        break;
      case 'REPLACED':
        bg = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300';
        label = 'Đã bị thay thế';
        break;
      case 'AMENDED':
        bg = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
        label = 'Đã sửa đổi';
        break;
      case 'EXPIRED':
        bg = 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400';
        label = 'Hết hiệu lực';
        break;
      case 'APPROVED':
        bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
        label = 'Đã phê duyệt (Approved)';
        break;
      case 'PENDING':
        bg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
        label = 'Chờ rà soát (Pending)';
        break;
      case 'REVIEWING':
        bg = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
        label = 'Đang rà soát (Reviewing)';
        break;
      case 'REJECTED':
        bg = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300';
        label = 'Đã từ chối (Rejected)';
        break;
      case 'APPLIED':
        bg = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300';
        label = 'Đã áp dụng (Applied)';
        break;
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${bg}`}>
        {label}
      </span>
    );
  };

  const formatRelationType = (type: string) => {
    const map: Record<string, string> = {
      REPLACES: 'Thay thế',
      AMENDS: 'Sửa đổi/bổ sung',
      GUIDES: 'Hướng dẫn thi hành',
      IMPLEMENTS: 'Quy định chi tiết',
      REFERENCES: 'Dẫn chiếu',
      SUPERSEDES: 'Bãi bỏ',
    };
    return map[type] || type;
  };

  const filteredDocs = documents.filter((doc) => {
    const matchSearch =
      !docSearch ||
      doc.documentCode.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.documentTitle.toLowerCase().includes(docSearch.toLowerCase());
    const matchStatus = !statusFilter || doc.status === statusFilter;
    const matchType = !typeFilter || doc.documentType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // Overview statistics
  const totalDocs = documents.length;
  const activeDocsCount = documents.filter((d) => d.status === 'ACTIVE').length;
  const draftDocsCount = documents.filter((d) => d.status === 'DRAFT').length;
  const replacedDocsCount = documents.filter((d) => d.status === 'REPLACED' || d.status === 'EXPIRED').length;

  // PHASE 8F-E-D-A: Parsed notes and verification display conditions
  const isLeader = role === 'ADMIN' || role === 'MANAGER';
  const parsedNotes = useMemo(() => parseLogNotes(selectedLogForDetail?.notes), [selectedLogForDetail]);
  const hasActivationHistory = Array.isArray(parsedNotes?.activationHistory) && parsedNotes.activationHistory.length > 0;
  const hasActivationWorkflow = Array.isArray(parsedNotes?.workflowHistory) && parsedNotes.workflowHistory.some((x: any) => x.action === 'ACTIVATE_DRAFT_VERSION' || x.event === 'ACTIVATE_DRAFT_VERSION');
  const hasDrafts = !!(parsedNotes?.draftVersions?.list?.length > 0 || parsedNotes?.draftVersions);
  const hasSimulations = Array.isArray(parsedNotes?.simulations) && parsedNotes.simulations.length > 0;
  const canShowVerificationBlock =
    isLeader &&
    (
      selectedLogForDetail?.reviewStatus === 'APPROVED' ||
      hasActivationHistory ||
      hasActivationWorkflow ||
      hasDrafts ||
      hasSimulations
    );

  // PHASE 8F-E-D-D: Rollback button visibility conditions
  const canShowRollbackButton =
    isLeader &&
    !!selectedLogForDetail &&
    selectedLogForDetail.reviewStatus === 'APPROVED';

  // PHASE 8F-E-D-E: Rollback verification block visibility conditions
  const hasRollbackHistory = Array.isArray(parsedNotes?.rollbackHistory) && parsedNotes.rollbackHistory.length > 0;
  const hasRollbackWorkflow = Array.isArray(parsedNotes?.workflowHistory) && parsedNotes.workflowHistory.some((x: any) => x.action === 'ROLLBACK_VERSION' || x.event === 'ROLLBACK_VERSION');
  const canShowRollbackVerificationBlock =
    !!selectedLogForDetail &&
    (
      selectedLogForDetail.reviewStatus === 'APPROVED' ||
      hasRollbackHistory ||
      hasRollbackWorkflow
    );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Scale className="h-7 w-7 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Kho Căn cứ Pháp lý & Phiên bản Nghiệp vụ</h1>
          </div>
          <p className="text-sm text-blue-100 max-w-3xl">
            Nền tảng kiểm soát và đối chiếu văn bản pháp luật, thủ tục hành chính, prompt AI rà soát và checklist kiểm tra. Đảm bảo tính minh bạch, kiểm chứng pháp lý và tuân thủ kỷ luật Human-in-the-Loop.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 text-xs backdrop-blur-md self-start md:self-center">
          <ShieldAlert className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <span>Chế độ: <strong>Chỉ xem (Read-only)</strong></span>
        </div>
      </div>

      {/* Mandatory Safety Warning Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm dark:bg-amber-950/30 dark:border-amber-400 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong className="font-bold">BẢN GỢI Ý AI / KHO DỮ LIỆU HỖ TRỢ – CÁN BỘ PHẢI KIỂM TRA:</strong> Kho căn cứ pháp lý và phiên bản nghiệp vụ là dữ liệu hỗ trợ cán bộ địa chính và chuyên viên thẩm tra kiểm tra, đối chiếu. Dữ liệu này <strong>không thay thế</strong> việc kiểm tra trực tiếp văn bản pháp luật hiện hành, văn bản sửa đổi, bổ sung, thay thế hoặc quy trình nội bộ tại thời điểm giải quyết hồ sơ thực tế.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 gap-2 pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <Database className="h-4 w-4" />
          Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Văn bản pháp lý ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('procedures')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'procedures'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          Phiên bản thủ tục ({procedureVersions.length})
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'prompts'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <FileCode className="h-4 w-4" />
          Phiên bản Prompt AI ({promptVersions.length})
        </button>
        <button
          onClick={() => setActiveTab('checklists')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'checklists'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <ListCheck className="h-4 w-4" />
          Phiên bản Checklist ({checklistVersions.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <History className="h-4 w-4" />
          Nhật ký cập nhật ({updateLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('snapshots')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
            activeTab === 'snapshots'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <Camera className="h-4 w-4" />
          Snapshot AI ({snapshots.length})
        </button>
        {role !== 'VIEWER' && (
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all whitespace-nowrap ${
              activeTab === 'import'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 font-medium'
            }`}
          >
            <Upload className="h-4 w-4" />
            Nhập dữ liệu CSV (Import)
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm">Đang tải dữ liệu từ kho pháp lý...</p>
        </div>
      ) : (
        <div className="mt-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Văn bản Pháp lý</span>
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalDocs}</span>
                    <span className="text-xs text-muted-foreground ml-2">văn bản</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex gap-2">
                    <span className="text-emerald-600 font-medium">{activeDocsCount} Active</span> • 
                    <span className="text-amber-600">{draftDocsCount} Draft</span> • 
                    <span className="text-red-500">{replacedDocsCount} Replaced</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Phiên bản Thủ tục</span>
                    <Layers className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{procedureVersions.length}</span>
                    <span className="text-xs text-muted-foreground ml-2">version</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Quy trình & thành phần hồ sơ TTHC
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Prompt AI Version</span>
                    <FileCode className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{promptVersions.length}</span>
                    <span className="text-xs text-muted-foreground ml-2">prompt</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Cấp GCN & Chuyển mục đích
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Checklist Nghiệp vụ</span>
                    <ListCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{checklistVersions.length}</span>
                    <span className="text-xs text-muted-foreground ml-2">checklist</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Tiêu chí thẩm tra theo luật
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Nhật ký & Snapshot</span>
                    <History className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{updateLogs.length + snapshots.length}</span>
                    <span className="text-xs text-muted-foreground ml-2">bản ghi</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Theo dõi lịch sử thay đổi
                  </div>
                </div>
              </div>

              {/* Architecture Explanation Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Kiến trúc Kiểm soát Phiên bản Pháp lý (Legal Knowledge Versioning & Update Control)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                      Tách biệt Luật & Logic
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Mã nguồn (source code) hoàn toàn không lập trình cứng (hardcode) các điều khoản luật hay thời hạn xử lý. Toàn bộ căn cứ pháp lý được lưu trữ độc lập trong cơ sở dữ liệu có định danh phiên bản rõ ràng.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
                      Quan hệ Sửa đổi & Thay thế
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Hệ thống liên kết văn bản mới với văn bản cũ thông qua quan hệ Sửa đổi/Bổ sung (`AMENDS`) hoặc Thay thế (`REPLACES`), giúp tự động cảnh báo khi có văn bản hết hiệu lực.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</span>
                      Đồng bộ Prompt & Checklist
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Khi luật thay đổi, Admin sẽ tạo phiên bản mới cho Thủ tục, Prompt AI và Checklist nghiệp vụ tương ứng, bảo đảm AI rà soát luôn dựa trên bối cảnh pháp lý chuẩn xác nhất.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEGAL DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
              {/* Filters */}
              <div className="p-4 border-b bg-gray-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã số, tên văn bản..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <Filter className="h-3.5 w-3.5" /> Lọc:
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="text-xs border rounded-lg px-3 py-2 bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="">Tất cả loại văn bản</option>
                    <option value="LAW">Luật (Law)</option>
                    <option value="DECREE">Nghị định (Decree)</option>
                    <option value="CIRCULAR">Thông tư (Circular)</option>
                    <option value="DECISION">Quyết định (Decision)</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs border rounded-lg px-3 py-2 bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVE">Hiện hành (Active)</option>
                    <option value="DRAFT">Dự thảo (Draft)</option>
                    <option value="REPLACED">Đã thay thế (Replaced)</option>
                    <option value="AMENDED">Đã sửa đổi (Amended)</option>
                    <option value="EXPIRED">Hết hiệu lực (Expired)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-4">Mã số</th>
                      <th className="p-4">Tên văn bản</th>
                      <th className="p-4">Loại</th>
                      <th className="p-4">Cơ quan ban hành</th>
                      <th className="p-4">Ngày ban hành / hiệu lực</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500 text-xs">
                          Không tìm thấy văn bản pháp lý nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {doc.documentCode}
                          </td>
                          <td className="p-4 font-medium text-gray-900 dark:text-white max-w-md">
                            <div className="line-clamp-2">{doc.documentTitle}</div>
                            {doc.summary && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1 italic">{doc.summary}</div>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                              {formatDocType(doc.documentType)}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap">
                            {doc.issuingAuthority || '---'}
                          </td>
                          <td className="p-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            <div>BH: {doc.issuedDate ? new Date(doc.issuedDate).toLocaleDateString('vi-VN') : '---'}</div>
                            <div>HL: {doc.effectiveFrom ? new Date(doc.effectiveFrom).toLocaleDateString('vi-VN') : '---'}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">{formatStatusBadge(doc.status)}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 rounded-lg text-xs font-medium transition"
                            >
                              <Eye className="h-3.5 w-3.5" /> Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROCEDURE VERSIONS */}
          {activeTab === 'procedures' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-800 dark:text-white">Danh sách Phiên bản Thủ tục Hành chính</h3>
                <span className="text-xs text-muted-foreground">Chỉ xem cấu hình nghiệp vụ</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-4">Tên thủ tục</th>
                      <th className="p-4">Mã thủ tục</th>
                      <th className="p-4">Version</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Thời hạn xử lý</th>
                      <th className="p-4">Cơ quan giải quyết</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {procedureVersions.map((proc) => (
                      <tr key={proc.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-4 font-bold text-gray-900 dark:text-white max-w-sm">{proc.procedureName}</td>
                        <td className="p-4 font-mono font-semibold text-blue-600 text-xs">{proc.procedureCode || '---'}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 rounded text-xs font-mono font-bold">
                            {proc.version}
                          </span>
                        </td>
                        <td className="p-4">{formatStatusBadge(proc.status)}</td>
                        <td className="p-4 text-xs font-medium">{proc.processingTimeDays ? `${proc.processingTimeDays} ngày làm việc` : '---'}</td>
                        <td className="p-4 text-xs text-gray-600">{proc.resolvingAgency || '---'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedProcVer(proc)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 rounded-lg text-xs font-medium transition"
                          >
                            <FileCode className="h-3.5 w-3.5" /> Xem cấu hình JSON
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: AI PROMPT VERSIONS */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs text-purple-900 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-200 flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>
                  <strong>Lưu ý nghiệp vụ AI:</strong> Prompt version định nghĩa cách AI đọc hồ sơ, đối chiếu quy định và đưa ra khuyến nghị. Prompt không phải là văn bản pháp luật chính thức; kết quả AI rà soát luôn phải được cán bộ kiểm tra lại.
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
                      <tr>
                        <th className="p-4">Prompt Key</th>
                        <th className="p-4">Version</th>
                        <th className="p-4">Mã TTHC / Nhóm</th>
                        <th className="p-4">Loại phân tích (Analysis Type)</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4">Ngày hiệu lực</th>
                        <th className="p-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {promptVersions.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">{p.promptKey}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 rounded text-xs font-mono font-bold">
                              {p.version}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-mono">{p.procedureTypeCode || p.procedureGroup || '---'}</td>
                          <td className="p-4 font-medium text-xs text-gray-700 dark:text-gray-300">{p.analysisType || '---'}</td>
                          <td className="p-4">{formatStatusBadge(p.status)}</td>
                          <td className="p-4 text-xs text-gray-500">
                            {p.effectiveFrom ? new Date(p.effectiveFrom).toLocaleDateString('vi-VN') : '---'}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedPromptVer(p)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 rounded-lg text-xs font-medium transition"
                            >
                              <Eye className="h-3.5 w-3.5" /> Xem chi tiết Prompt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHECKLIST VERSIONS */}
          {activeTab === 'checklists' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-sm text-gray-800 dark:text-white">Danh sách Phiên bản Checklist Thẩm tra Nghiệp vụ</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-4">Checklist Key</th>
                      <th className="p-4">Version</th>
                      <th className="p-4">Mã TTHC / Nhóm</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Ngày tạo</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {checklistVersions.map((chk) => (
                      <tr key={chk.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">{chk.checklistKey}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded text-xs font-mono font-bold">
                            {chk.version}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono">{chk.procedureTypeCode || chk.procedureGroup || '---'}</td>
                        <td className="p-4">{formatStatusBadge(chk.status)}</td>
                        <td className="p-4 text-xs text-gray-500">{new Date(chk.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedChecklistVer(chk)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg text-xs font-medium transition"
                          >
                            <ListCheck className="h-3.5 w-3.5" /> Xem Checklist Items
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: UPDATE LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white">Nhật ký Cập nhật Pháp lý (Legal Update Logs)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Lịch sử theo dõi thay đổi luật, nghị định, thông tư tác động đến TTHC và AI</p>
                </div>
                <div className="flex items-center gap-2">
                  {canAnalyzeImpact && (
                    <button
                      onClick={() => {
                        setImpactSourceDocId('');
                        setImpactTitle('');
                        setImpactNotes('');
                        setImpactResult(null);
                        setShowImpactModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Phân tích tác động
                    </button>
                  )}
                  <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 rounded font-semibold">Quy trình rà soát / Phê duyệt (Phase 8F-B)</span>
                </div>
              </div>
              {updateLogs.length === 0 ? (
                <div className="p-12 text-center text-gray-500 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                    <History className="h-8 w-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <p className="text-base font-bold text-gray-800 dark:text-gray-200">Chưa có nhật ký cập nhật pháp lý nào</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Hệ thống tự động ghi nhận nhật ký khi phát hiện văn bản mới hoặc khi chuyên viên tiến hành Phân tích tác động pháp lý (Phase 8E/8F-B).
                    </p>
                  </div>
                  {canAnalyzeImpact ? (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setImpactSourceDocId('');
                          setImpactTitle('');
                          setImpactNotes('');
                          setImpactResult(null);
                          setShowImpactModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md hover:shadow-lg"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        + Tạo nhật ký đầu tiên (Phân tích tác động)
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs text-gray-600 max-w-sm mx-auto">
                      Bạn đang ở quyền <strong className="text-gray-900 dark:text-white">{role}</strong>. Vui lòng liên hệ Quản lý hoặc Quản trị viên để thực hiện phân tích tác động pháp lý.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
                      <tr>
                        <th className="p-4">Tiêu đề cập nhật</th>
                        <th className="p-4">Văn bản nguồn</th>
                        <th className="p-4">Tác động dự kiến</th>
                        <th className="p-4">Trạng thái rà soát</th>
                        <th className="p-4">Ngày ghi nhận</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {updateLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-4 font-bold text-gray-900 dark:text-white max-w-sm">
                            <button
                              onClick={() => setSelectedLogForDetail(log)}
                              className="text-left hover:text-blue-600 hover:underline flex items-center gap-1.5"
                            >
                              <span>{log.updateTitle}</span>
                              <Eye className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            </button>
                          </td>
                          <td className="p-4 font-mono text-xs text-blue-600">{log.sourceDocument?.documentCode || log.sourceDocumentId || '---'}</td>
                          <td className="p-4 text-xs text-gray-600 max-w-md">{log.impactSummary || '---'}</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 items-start">
                              {formatStatusBadge(log.reviewStatus)}
                              {(() => {
                                const p = parseLogNotes(log?.notes);
                                if (p.subStatus && p.subStatus !== log.reviewStatus) {
                                  return <span className="text-[10px] text-gray-500 font-mono">({p.subStatus})</span>;
                                }
                                return null;
                              })()}
                            </div>
                          </td>
                          <td className="p-4 text-xs text-gray-500">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SNAPSHOT AI */}
          {activeTab === 'snapshots' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200 flex items-start gap-3">
                <Camera className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-sm">Chế độ chụp nhanh bối cảnh pháp lý (Legal Snapshot):</strong>
                  <p>
                    Snapshot căn cứ pháp lý sẽ được tích hợp hoàn chỉnh vào kết quả AI rà soát thực tế ở <strong>Phase 8D</strong>. Mỗi lần AI thực hiện rà soát hồ sơ, hệ thống sẽ lưu vết chính xác phiên bản luật, phiên bản prompt và phiên bản checklist đã sử dụng tại giây phút thẩm tra, phục vụ thanh tra và giải trình.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white">Danh sách Legal Snapshot đã lưu vết</h3>
                </div>
                {snapshots.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 space-y-2">
                    <Camera className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm font-medium">Chưa có bản ghi Snapshot căn cứ pháp lý nào.</p>
                    <p className="text-xs text-gray-400">Snapshot sẽ tự động tạo khi phát sinh lượt phân tích AI trong các Phase tiếp theo.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
                        <tr>
                          <th className="p-4">Mã phân tích AI (Analysis ID)</th>
                          <th className="p-4">Phiên bản KB</th>
                          <th className="p-4">Prompt Version</th>
                          <th className="p-4">Checklist Version</th>
                          <th className="p-4">Ngày tạo</th>
                          <th className="p-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {snapshots.map((snap) => (
                          <tr key={snap.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                            <td className="p-4 font-mono text-xs text-blue-600">{snap.procedureAiAnalysisId}</td>
                            <td className="p-4 font-mono font-bold text-xs">{snap.knowledgeBaseVersion || 'v1.0'}</td>
                            <td className="p-4 text-xs">{snap.promptVersion?.promptKey || snap.promptVersionId || '---'}</td>
                            <td className="p-4 text-xs">{snap.checklistVersion?.checklistKey || snap.checklistVersionId || '---'}</td>
                            <td className="p-4 text-xs text-gray-500">{new Date(snap.createdAt).toLocaleString('vi-VN')}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedSnapshot(snap)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium"
                              >
                                <Eye className="h-3.5 w-3.5" /> Xem JSON
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: IMPORT STUDIO (PHASE 11J) */}
          {activeTab === 'import' && role !== 'VIEWER' && (
            <LegalKnowledgeImportTab role={role} />
          )}
        </div>
      )}

      {/* MODAL 1: LEGAL DOCUMENT DETAIL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            {/* Modal Header */}
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Chi tiết Văn bản Pháp lý: <span className="font-mono text-blue-600">{selectedDoc.documentCode}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">{selectedDoc.documentTitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Mandatory warning in modal */}
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Cảnh báo kiểm tra:</strong> Cần cán bộ kiểm tra tính hiện hành của văn bản, các quy định sửa đổi, bổ sung hoặc thay thế tại thời điểm áp dụng trước khi sử dụng.
                </span>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Loại văn bản:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatDocType(selectedDoc.documentType)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Cơ quan ban hành:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedDoc.issuingAuthority || '---'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Trạng thái:</span>
                  <div>{formatStatusBadge(selectedDoc.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Ngày ban hành:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {selectedDoc.issuedDate ? new Date(selectedDoc.issuedDate).toLocaleDateString('vi-VN') : '---'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Ngày có hiệu lực:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedDoc.effectiveFrom ? new Date(selectedDoc.effectiveFrom).toLocaleDateString('vi-VN') : '---'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Ngày hết hiệu lực:</span>
                  <span className="font-mono text-red-500">
                    {selectedDoc.effectiveTo ? new Date(selectedDoc.effectiveTo).toLocaleDateString('vi-VN') : 'Không có / Không xác định'}
                  </span>
                </div>
              </div>

              {/* Summary & Notes */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">Tóm tắt nội dung & Phạm vi áp dụng</h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border text-gray-800 dark:text-gray-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedDoc.summary || selectedDoc.notes || 'Chưa có ghi chú tóm tắt cho văn bản này.'}
                </div>
              </div>

              {/* Document Relations */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-500" />
                  Quan hệ văn bản (Sửa đổi / Thay thế / Hướng dẫn)
                </h4>
                {(!selectedDoc.outgoingRelations?.length && !selectedDoc.incomingRelations?.length) ? (
                  <p className="text-xs text-gray-500 italic">Không có quan hệ sửa đổi/thay thế nào được ghi nhận.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDoc.outgoingRelations?.map((rel) => (
                      <div key={rel.id} className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded text-[10px]">
                            {formatRelationType(rel.relationType)}
                          </span>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">{rel.relatedDocument?.documentCode || rel.relatedDocumentId}</span>
                          <span className="text-gray-600 dark:text-gray-300 truncate max-w-sm">{rel.relatedDocument?.documentTitle}</span>
                        </div>
                        {rel.effectiveFrom && <span className="text-gray-400 text-[10px]">Từ: {new Date(rel.effectiveFrom).toLocaleDateString('vi-VN')}</span>}
                      </div>
                    ))}
                    {selectedDoc.incomingRelations?.map((rel) => (
                      <div key={rel.id} className="flex items-center justify-between p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-purple-600 text-white font-bold rounded text-[10px]">
                            Được {formatRelationType(rel.relationType)} bởi
                          </span>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">{rel.document?.documentCode || rel.documentId}</span>
                          <span className="text-gray-600 dark:text-gray-300 truncate max-w-sm">{rel.document?.documentTitle}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Source link */}
              {selectedDoc.sourceUrl && (
                <div className="pt-2">
                  <a
                    href={selectedDoc.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Mở văn bản gốc trên Cổng thông tin điện tử / Thư viện pháp luật
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-semibold text-xs rounded-xl transition"
              >
                Đóng (Chỉ xem)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PROCEDURE VERSION JSON CONFIG */}
      {selectedProcVer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Cấu hình Phiên bản Thủ tục: <span className="text-indigo-600">{selectedProcVer.procedureName}</span> ({selectedProcVer.version})
                </h3>
                <p className="text-xs text-muted-foreground font-mono">Mã: {selectedProcVer.procedureCode}</p>
              </div>
              <button onClick={() => setSelectedProcVer(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Thành phần hồ sơ yêu cầu (requiredDocuments):</h4>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(selectedProcVer.requiredDocuments, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Các bước quy trình thẩm tra (workflowSteps):</h4>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(selectedProcVer.workflowSteps, null, 2)}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex justify-end">
              <button onClick={() => setSelectedProcVer(null)} className="px-5 py-2 bg-gray-200 rounded-xl font-semibold text-xs">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PROMPT VERSION DETAILS */}
      {selectedPromptVer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Chi tiết AI Prompt Version: <span className="font-mono text-purple-600">{selectedPromptVer.promptKey}</span> ({selectedPromptVer.version})
                </h3>
                <p className="text-xs text-muted-foreground">Phân tích nghiệp vụ: {selectedPromptVer.analysisType}</p>
              </div>
              <button onClick={() => setSelectedPromptVer(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-amber-900 text-xs">
                ⚠️ Prompt version định hướng tư duy phân tích của AI theo bối cảnh pháp lý chuẩn. Không cho phép AI hoặc người dùng thường tự ý chỉnh sửa nội dung prompt trên UI read-only.
              </div>
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">System Prompt (Chỉ dẫn hệ thống cho AI):</h4>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                  {selectedPromptVer.systemPrompt}
                </pre>
              </div>
              {selectedPromptVer.outputSchema && (
                <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Output Schema (Cấu trúc đầu ra chuẩn JSON):</h4>
                  <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl font-mono overflow-x-auto max-h-48">
                    {JSON.stringify(selectedPromptVer.outputSchema, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex justify-end">
              <button onClick={() => setSelectedPromptVer(null)} className="px-5 py-2 bg-gray-200 rounded-xl font-semibold text-xs">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CHECKLIST VERSION DETAILS */}
      {selectedChecklistVer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Checklist Nghiệp vụ: <span className="font-mono text-emerald-600">{selectedChecklistVer.checklistKey}</span> ({selectedChecklistVer.version})
                </h3>
              </div>
              <button onClick={() => setSelectedChecklistVer(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <h4 className="font-bold text-gray-700 dark:text-gray-300">Danh sách Tiêu chí Thẩm tra (Checklist Items):</h4>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono overflow-x-auto max-h-80">
                {JSON.stringify(selectedChecklistVer.checklistItems, null, 2)}
              </pre>
            </div>
            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex justify-end">
              <button onClick={() => setSelectedChecklistVer(null)} className="px-5 py-2 bg-gray-200 rounded-xl font-semibold text-xs">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: SNAPSHOT DETAILS */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Legal Snapshot JSON Viewer</h3>
              <button onClick={() => setSelectedSnapshot(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <pre className="p-4 bg-slate-900 text-blue-300 rounded-xl font-mono overflow-x-auto max-h-96">
                {JSON.stringify(selectedSnapshot, null, 2)}
              </pre>
            </div>
            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex justify-end">
              <button onClick={() => setSelectedSnapshot(null)} className="px-5 py-2 bg-gray-200 rounded-xl font-semibold text-xs">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: IMPACT ANALYSIS (PHASE 8E) */}
      {showImpactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    AI Phân tích tác động cập nhật pháp lý (Phase 8E)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Đánh giá ảnh hưởng khi văn bản pháp luật thay đổi đối với thủ tục, prompt và checklist
                  </p>
                </div>
              </div>
              <button onClick={() => setShowImpactModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-sm uppercase">BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA</strong>
                  <p className="text-xs leading-relaxed">
                    AI chỉ tạo bản gợi ý phân tích tác động theo quy định. Cán bộ nghiệp vụ phải kiểm tra, đối chiếu toàn văn bản pháp luật hiện hành trước khi áp dụng vào thực tế giải quyết thủ tục hành chính. Hệ thống không tự động kích hoạt hay sửa đổi bất kỳ phiên bản nào.
                  </p>
                </div>
              </div>

              {!impactResult ? (
                <div className="space-y-4 max-w-2xl mx-auto py-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Văn bản pháp lý nguồn (Chọn từ kho căn cứ nếu có):
                    </label>
                    <select
                      value={impactSourceDocId}
                      onChange={(e) => {
                        setImpactSourceDocId(e.target.value);
                        const doc = documents.find((d) => d.id === e.target.value);
                        if (doc && !impactTitle) {
                          setImpactTitle(`${doc.documentCode} - ${doc.documentTitle}`);
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value="">-- Chọn văn bản trong kho (Hoặc để trống nếu nhập tự do) --</option>
                      {documents.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.documentCode} - {d.documentTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tiêu đề cập nhật / Tên văn bản mới <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={impactTitle}
                      onChange={(e) => setImpactTitle(e.target.value)}
                      placeholder="Ví dụ: Nghị định 102/2024/NĐ-CP quy định chi tiết thi hành Luật Đất đai"
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Ghi chú / Nội dung thay đổi chính cần rà soát:
                    </label>
                    <textarea
                      rows={3}
                      value={impactNotes}
                      onChange={(e) => setImpactNotes(e.target.value)}
                      placeholder="Ví dụ: Bổ sung quy định mới về thành phần hồ sơ và thời gian giải quyết chuyển mục đích sử dụng đất..."
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={handleAnalyzeImpact}
                      disabled={analyzingImpact || (!impactSourceDocId && !impactTitle)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow"
                    >
                      {analyzingImpact ? 'AI đang phân tích...' : 'Bắt đầu phân tích tác động'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* SUMMARY */}
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Info className="h-4 w-4" /> Tóm tắt đánh giá tác động AI:
                    </h4>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {impactResult.impactSummary}
                    </p>
                  </div>

                  {/* AFFECTED LEGAL DOCUMENTS */}
                  <div>
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
                      1. Văn bản pháp lý chịu ảnh hưởng / liên quan ({impactResult.affectedLegalDocuments?.length || 0}):
                    </h4>
                    {(!impactResult.affectedLegalDocuments || impactResult.affectedLegalDocuments.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">Không có văn bản liên quan bị tác động trực tiếp.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {impactResult.affectedLegalDocuments.map((doc: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-xl bg-gray-50/70 dark:bg-slate-800/60 space-y-1">
                            <div className="flex items-center justify-between font-bold text-xs text-blue-600 dark:text-blue-400">
                              <span>{doc.documentCode}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{doc.status}</span>
                            </div>
                            <p className="font-medium text-xs text-gray-800 dark:text-gray-200 line-clamp-1">{doc.documentTitle}</p>
                            <p className="text-[11px] text-gray-500">{doc.impactNote}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AFFECTED PROCEDURE TYPES */}
                  <div>
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
                      2. Thủ tục hành chính chịu tác động ({impactResult.affectedProcedureTypes?.length || 0}):
                    </h4>
                    {(!impactResult.affectedProcedureTypes || impactResult.affectedProcedureTypes.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">Không phát hiện thủ tục hành chính chịu ảnh hưởng.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {impactResult.affectedProcedureTypes.map((proc: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50 space-y-1">
                            <div className="flex items-center justify-between font-bold text-xs text-purple-700 dark:text-purple-300">
                              <span>{proc.procedureCode}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded">{proc.version}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">{proc.impactNote}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AFFECTED PROMPTS & CHECKLISTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
                        3. Prompt AI cần cập nhật ({impactResult.affectedPromptVersions?.length || 0}):
                      </h4>
                      <div className="space-y-2">
                        {(!impactResult.affectedPromptVersions || impactResult.affectedPromptVersions.length === 0) ? (
                          <p className="text-xs text-gray-400 italic">Không có prompt bị ảnh hưởng.</p>
                        ) : (
                          impactResult.affectedPromptVersions.map((p: any, idx: number) => (
                            <div key={idx} className="p-2.5 border rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 text-xs">
                              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex justify-between">
                                <span>{p.promptKey}</span>
                                <span>{p.version}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">{p.impactNote}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
                        4. Checklist nghiệp vụ ảnh hưởng ({impactResult.affectedChecklistVersions?.length || 0}):
                      </h4>
                      <div className="space-y-2">
                        {(!impactResult.affectedChecklistVersions || impactResult.affectedChecklistVersions.length === 0) ? (
                          <p className="text-xs text-gray-400 italic">Không có checklist bị ảnh hưởng.</p>
                        ) : (
                          impactResult.affectedChecklistVersions.map((c: any, idx: number) => (
                            <div key={idx} className="p-2.5 border rounded-lg bg-teal-50/40 dark:bg-teal-950/20 text-xs">
                              <div className="font-bold text-teal-800 dark:text-teal-300 flex justify-between">
                                <span>{c.checklistKey}</span>
                                <span>{c.version}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">{c.impactNote}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AFFECTED OPEN CASES */}
                  <div>
                    <h4 className="font-bold text-xs text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> 5. Hồ sơ TTHC đang xử lý cần lưu ý chuyển tiếp ({impactResult.affectedOpenProcedureCases?.length || 0}):
                    </h4>
                    {(!impactResult.affectedOpenProcedureCases || impactResult.affectedOpenProcedureCases.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">Hiện không có hồ sơ nào đang giải quyết ở các thủ tục liên quan.</p>
                    ) : (
                      <div className="space-y-2">
                        {impactResult.affectedOpenProcedureCases.map((c: any, idx: number) => (
                          <div key={idx} className="p-3 border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-red-800 dark:text-red-300 mr-2">{c.caseCode}</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">({c.applicantName})</span>
                              <p className="text-[11px] text-gray-500 mt-0.5">{c.impactNote}</p>
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-800 font-bold rounded">{c.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RECOMMENDED ACTIONS */}
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border space-y-3">
                    <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      6. Đề xuất hành động rà soát nghiệp vụ:
                    </h4>
                    <div className="space-y-2">
                      {(impactResult.recommendedActions || []).map((act: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <input type="checkbox" className="mt-0.5 rounded border-gray-300" defaultChecked={false} />
                          <span>{act.replace(/^\[[ x]\]\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RISK FLAGS */}
                  <div className="space-y-2">
                    {(impactResult.riskFlags || []).map((flag: string, idx: number) => (
                      <div key={idx} className="p-3 bg-red-100/60 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-xl text-xs font-medium">
                        {flag}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center text-xs text-gray-500 italic">
                    * Tuân thủ an toàn nghiệp vụ Phase 8E: Hệ thống không tự động tạo hay kích hoạt phiên bản, không tự ý sửa đổi căn cứ hay kết luận hồ sơ.
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              {impactResult ? (
                <button
                  onClick={() => setImpactResult(null)}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  ← Phân tích văn bản khác
                </button>
              ) : <div />}
              <button
                onClick={() => {
                  setShowImpactModal(false);
                  if (impactResult) fetchAllData();
                }}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl font-bold text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: UPDATE LOG DETAIL (PHASE 8E) */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Chi tiết Nhật ký Cập nhật: <span className="text-blue-600">{selectedLogForDetail.updateTitle}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ngày tạo: {new Date(selectedLogForDetail.createdAt).toLocaleString('vi-VN')} | Trạng thái: {selectedLogForDetail.reviewStatus}
                </p>
              </div>
              <button onClick={() => setSelectedLogForDetail(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              {/* PHASE 8F-E-D-A: VERIFICATION PANEL */}
              {selectedLogForDetail?.reviewStatus === 'APPROVED' && (
                <div className="my-3 p-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950 rounded-xl space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleRunVerification}
                      disabled={loadingVerification || !selectedLogForDetail?.id}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {loadingVerification ? (
                        <span className="inline-block animate-spin">⌛</span>
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                      Kiểm tra sau kích hoạt
                    </button>
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-200 font-medium">
                      Chức năng này chỉ đọc dữ liệu để hậu kiểm sau kích hoạt, không tự thay đổi version hoặc hồ sơ.
                    </div>
                  </div>
                </div>
              )}

              {loadingVerification && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <span className="inline-block animate-spin">⌛</span>
                  <span>Đang gọi API kiểm chứng sau kích hoạt...</span>
                </div>
              )}

              {verificationError && !loadingVerification && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-center gap-2 font-semibold">
                  <span>❌</span>
                  <span>{verificationError}</span>
                </div>
              )}

              {verificationData && !loadingVerification && (
                <div className="p-4 bg-gray-50 dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      Kết quả kiểm chứng: <span className={
                        verificationData.overallStatus === 'PASS' ? 'text-emerald-600 dark:text-emerald-400' :
                        verificationData.overallStatus === 'FAIL' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                      }>{verificationData.overallStatus || 'N/A'}</span>
                    </span>
                    {verificationData.verifiedAt && (
                      <span className="text-[11px] text-gray-500">
                        {new Date(verificationData.verifiedAt).toLocaleString('vi-VN')}
                      </span>
                    )}
                  </div>
                  {Array.isArray(verificationData.warnings) && verificationData.warnings.length > 0 && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <div className="font-semibold">Cảnh báo:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {verificationData.warnings.map((w: string, idx: number) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {verificationData.checks && (
                    <div className="text-xs space-y-1 bg-white dark:bg-slate-900 p-3 rounded-lg border">
                      <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Chi tiết kiểm tra:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                        <div>Lịch sử kích hoạt: <strong>{verificationData.checks.activationHistoryExists ? 'Có' : 'Không'}</strong></div>
                        <div>Phiên bản active: <strong>{verificationData.checks.activeVersionExists ? 'Đạt' : 'Lỗi'}</strong></div>
                        <div>Không trùng active: <strong>{verificationData.checks.noDuplicateActiveVersions ? 'Đạt' : 'Lỗi'}</strong></div>
                        <div>Hồ sơ TTHC giữ nguyên: <strong>{verificationData.checks.casesUnchanged ? 'Đạt' : 'Lỗi'}</strong></div>
                        <div>Bản chụp AI bảo toàn: <strong>{verificationData.checks.snapshotsPreserved ? 'Đạt' : 'Lỗi'}</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PHASE 8F-E-D-D: MANUAL VERSION ROLLBACK AREA */}
              {canShowRollbackButton && (
                <div className="my-3 p-4 bg-red-50/60 dark:bg-red-950/20 rounded-xl border-2 border-red-300 dark:border-red-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                      <h4 className="font-bold text-sm text-red-900 dark:text-red-300">
                        Hoàn tác version
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRollbackModal(true);
                        setRollbackStep(1);
                        setRollbackReason('');
                        setRollbackConfirmationText('');
                        setRollbackError('');
                        setRollbackResult(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Hoàn tác version
                    </button>
                  </div>
                  <div className="p-2.5 bg-red-100/70 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg text-[11px] text-red-900 dark:text-red-200 font-medium flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>
                      Chức năng này chỉ hoàn tác trạng thái version pháp lý. Không sửa hồ sơ TTHC, không sửa kết quả AI cũ, không sửa legal snapshot cũ.
                    </span>
                  </div>
                  {(!hasActivationHistory && !hasActivationWorkflow && !verificationData) && (
                    <div className="p-2.5 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-[11px] text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Chưa xác định được đầy đủ lịch sử kích hoạt trên giao diện. Backend sẽ kiểm tra lại điều kiện rollback trước khi thực hiện.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* PHASE 8F-E-D-E: POST-ROLLBACK VERIFICATION & READ-ONLY AUDIT DASHBOARD */}
              {canShowRollbackVerificationBlock && (
                <div className="my-3 p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300">
                        Kiểm chứng sau rollback (Read-only Audit Dashboard)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleRunRollbackVerification}
                      disabled={loadingRollbackVerification || !selectedLogForDetail?.id}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingRollbackVerification ? (
                        <span className="inline-block animate-spin">⌛</span>
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      Kiểm tra sau rollback
                    </button>
                  </div>

                  <div className="p-2.5 bg-purple-100/70 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 rounded-lg text-[11px] text-purple-900 dark:text-purple-200 font-medium flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Chức năng kiểm chứng này hoàn toàn read-only (chỉ đọc).</strong> Không tự thay đổi version, không tự rollback lại, không sửa hồ sơ TTHC cũ hay kết quả thẩm tra AI/legal snapshot cũ.
                    </span>
                  </div>

                  {loadingRollbackVerification && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <span className="inline-block animate-spin">⌛</span>
                      <span>Đang gọi API kiểm chứng sau rollback...</span>
                    </div>
                  )}

                  {rollbackVerificationError && !loadingRollbackVerification && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-center gap-2 font-semibold">
                      <span>❌</span>
                      <span>{rollbackVerificationError}</span>
                    </div>
                  )}

                  {!hasRollbackHistory && !rollbackVerificationData && !loadingRollbackVerification && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <span>ℹ️</span>
                      <span>
                        Chưa phát hiện lịch sử hoàn tác (rollbackHistory) trong nhật ký này. Bạn có thể bấm "Kiểm tra sau rollback" để xác minh chi tiết trạng thái hệ thống.
                      </span>
                    </div>
                  )}

                  {rollbackVerificationData && !loadingRollbackVerification && (
                    <div className="space-y-3 pt-2 border-t border-purple-200 dark:border-purple-800 text-xs">
                      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Trạng thái tổng quan (Overall Status):</span>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                          rollbackVerificationData.overallStatus === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : rollbackVerificationData.overallStatus === 'WARNING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {rollbackVerificationData.overallStatus === 'PASS' && '✔ PASS (An toàn / Đạt yêu cầu)'}
                          {rollbackVerificationData.overallStatus === 'WARNING' && '⚠ WARNING (Có cảnh báo)'}
                          {rollbackVerificationData.overallStatus === 'FAIL' && '✖ FAIL (Có lỗi / Bất thường)'}
                        </span>
                      </div>

                      {rollbackVerificationData.warnings && rollbackVerificationData.warnings.length > 0 && (
                        <div className={`p-2.5 rounded-lg border space-y-1 ${
                          rollbackVerificationData.overallStatus === 'WARNING'
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                            : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
                        }`}>
                          <div className={`font-bold ${
                            rollbackVerificationData.overallStatus === 'WARNING'
                              ? 'text-amber-800 dark:text-amber-300'
                              : 'text-red-800 dark:text-red-300'
                          }`}>Danh sách cảnh báo / thông báo:</div>
                          <ul className={`list-disc list-inside space-y-0.5 ${
                            rollbackVerificationData.overallStatus === 'WARNING'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-red-700 dark:text-red-400'
                          }`}>
                            {rollbackVerificationData.warnings.map((w: string, idx: number) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rollbackVerificationData.checks && (
                        <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-lg border">
                          <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Chi tiết kiểm chứng các mục:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                              <span>Tồn tại lịch sử rollback:</span>
                              <strong className={rollbackVerificationData.checks.rollbackHistoryExists ? 'text-emerald-600' : 'text-amber-600'}>
                                {rollbackVerificationData.checks.rollbackHistoryExists ? '✔ Có' : '⚠ Không'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                              <span>Sự kiện rollback trong workflow:</span>
                              <strong className={rollbackVerificationData.checks.workflowHistoryHasRollbackVersion ? 'text-emerald-600' : 'text-amber-600'}>
                                {rollbackVerificationData.checks.workflowHistoryHasRollbackVersion ? '✔ Có' : '⚠ Không'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                              <span>Trạng thái version khôi phục (ACTIVE):</span>
                              <strong className={rollbackVerificationData.checks.activeVersionExists ? 'text-emerald-600' : 'text-red-600'}>
                                {rollbackVerificationData.checks.activeVersionExists ? '✔ Đạt' : '✖ Lỗi'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                              <span>Trạng thái version bị thay thế (REPLACED):</span>
                              <strong className={rollbackVerificationData.checks.previousVersionReplaced ? 'text-emerald-600' : 'text-red-600'}>
                                {rollbackVerificationData.checks.previousVersionReplaced ? '✔ Đạt' : '✖ Lỗi'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                              <span>Không duplicate ACTIVE version:</span>
                              <strong className={rollbackVerificationData.checks.noDuplicateActiveVersions ? 'text-emerald-600' : 'text-red-600'}>
                                {rollbackVerificationData.checks.noDuplicateActiveVersions ? '✔ Đạt' : '✖ Lỗi'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                              <span>Hồ sơ TTHC giữ nguyên:</span>
                              <strong className={rollbackVerificationData.checks.casesUnchanged ? 'text-emerald-600' : 'text-red-600'}>
                                {rollbackVerificationData.checks.casesUnchanged ? '✔ Đạt' : '✖ Lỗi'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded col-span-1 sm:col-span-2">
                              <span>Kết quả thẩm tra AI / legal snapshot bảo toàn:</span>
                              <strong className={rollbackVerificationData.checks.aiAnalysesUnchanged && rollbackVerificationData.checks.legalSnapshotsPreserved ? 'text-emerald-600' : 'text-red-600'}>
                                {rollbackVerificationData.checks.aiAnalysesUnchanged && rollbackVerificationData.checks.legalSnapshotsPreserved ? '✔ Đạt (Bảo toàn)' : '✖ Lỗi'}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {rollbackVerificationData.versionChecks && rollbackVerificationData.versionChecks.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="font-semibold text-gray-700 dark:text-gray-300">Chi tiết phiên bản đã hoàn tác:</div>
                          <div className="space-y-1">
                            {rollbackVerificationData.versionChecks.map((chk: any, idx: number) => (
                              <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                <div className="flex items-center justify-between font-semibold">
                                  <span className="text-purple-600">{chk.type}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] ${chk.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {chk.passed ? '✔ Đạt' : '✖ Không đạt'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                                  <div>
                                    Version khôi phục về ACTIVE: <strong className="text-emerald-600">{chk.restoredVersionId}</strong> ({chk.restoredStatus})
                                  </div>
                                  <div>
                                    Version bị thay thế (REPLACED): <strong className="text-amber-600">{chk.replacedVersionId}</strong> ({chk.replacedStatus})
                                    <br />
                                    Số bản ACTIVE cùng phạm vi: <strong>{chk.activeCountInScope}</strong>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                          <div className="font-semibold text-gray-700 dark:text-gray-300">An toàn hồ sơ TTHC:</div>
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            Tổng số hồ sơ kiểm tra: <strong>{rollbackVerificationData.caseSafetyChecks?.totalCases || 0}</strong>
                            <br />
                            <span className="text-emerald-600 font-medium">✔ {rollbackVerificationData.caseSafetyChecks?.message}</span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                          <div className="font-semibold text-gray-700 dark:text-gray-300">An toàn AI & Snapshot:</div>
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            Thẩm tra AI / Snapshot: <strong>{rollbackVerificationData.aiSnapshotSafetyChecks?.totalAnalyses || 0} / {rollbackVerificationData.aiSnapshotSafetyChecks?.totalSnapshots || 0}</strong>
                            <br />
                            <span className="text-emerald-600 font-medium">✔ {rollbackVerificationData.aiSnapshotSafetyChecks?.message}</span>
                          </div>
                        </div>
                      </div>

                      {rollbackVerificationData.safetyStatement && (
                        <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded text-[11px] text-gray-700 dark:text-gray-300 italic text-center">
                          {rollbackVerificationData.safetyStatement}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Parse notes if JSON */}
              {(() => {
                const parsed = parsedNotes;

                if (!parsed || !parsed.impactSummary) {
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <h4 className="font-bold text-xs text-gray-500 uppercase mb-1">Tóm tắt tác động:</h4>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{selectedLogForDetail.impactSummary || 'Không có tóm tắt.'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <h4 className="font-bold text-xs text-gray-500 uppercase mb-1">Ghi chú chi tiết:</h4>
                        <pre className="text-xs font-mono whitespace-pre-wrap text-gray-700 dark:text-gray-300">{selectedLogForDetail.notes || '---'}</pre>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 text-xs font-bold">
                      {parsed.disclaimer || 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA'}
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-xl space-y-1">
                      <h4 className="font-bold text-xs text-blue-900 dark:text-blue-300 uppercase">Tóm tắt đánh giá:</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{parsed.impactSummary}</p>
                    </div>

                    {parsed.affectedLegalDocuments?.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">1. Văn bản bị ảnh hưởng ({parsed.affectedLegalDocuments.length}):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {parsed.affectedLegalDocuments.map((doc: any, i: number) => (
                            <div key={i} className="p-2.5 border rounded-lg bg-gray-50 text-xs">
                              <span className="font-bold text-blue-600">{doc.documentCode}</span>: <span className="text-gray-700">{doc.documentTitle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.affectedProcedureTypes?.length > 0 && (
                      <div>
                        <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">2. Thủ tục hành chính bị tác động ({parsed.affectedProcedureTypes.length}):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {parsed.affectedProcedureTypes.map((proc: any, i: number) => (
                            <div key={i} className="p-2.5 border rounded-lg bg-purple-50/50 text-xs font-bold text-purple-700">
                              {proc.procedureCode} ({proc.version})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.recommendedActions?.length > 0 && (
                      <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border space-y-2">
                        <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase">Đề xuất hành động:</h4>
                        {parsed.recommendedActions.map((act: string, i: number) => (
                          <div key={i} className="text-xs text-gray-700 dark:text-gray-300">
                            • {act.replace(/^\[[ x]\]\s*/, '')}
                          </div>
                        ))}
                      </div>
                    )}

                    {parsed.riskFlags?.length > 0 && (
                      <div className="space-y-1.5">
                        {parsed.riskFlags.map((flag: string, i: number) => (
                          <div key={i} className="p-2.5 bg-red-100/60 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-lg text-xs font-medium">
                            {flag}
                          </div>
                        ))}
                      </div>
                    )}

                    {parsed.draftVersions?.list?.length > 0 && (
                      <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-900 space-y-3">
                        <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300 uppercase flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-purple-600" />
                          Danh sách bản nháp version đã tạo ({parsed.draftVersions.list.length}):
                        </h4>
                        <div className="bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-2.5 rounded-lg text-xs leading-relaxed">
                          ⚠️ <span className="font-bold">Bản nháp version chưa có hiệu lực</span> và chưa được dùng bởi AI review thật. Cần kiểm thử, phê duyệt và kích hoạt thủ công ở phase sau.
                        </div>
                        <div className="space-y-2">
                          {parsed.draftVersions.list.map((dv: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-lg border flex flex-wrap items-center justify-between text-xs gap-2">
                              <div>
                                <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                  <span>{dv.type === 'PROCEDURE_TYPE_VERSION' ? 'Thủ tục hành chính' : dv.type === 'AI_PROMPT_VERSION' ? 'Prompt AI' : 'Checklist'}</span>
                                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded font-bold text-[10px]">DRAFT</span>
                                  <span className="text-purple-600 font-mono">{dv.version}</span>
                                </div>
                                <div className="text-gray-500 mt-1">Tên/Khóa: <span className="font-semibold text-gray-700 dark:text-gray-300">{dv.name}</span></div>
                                <div className="text-gray-500 italic mt-0.5">"Lý do: {dv.reason}"</div>
                              </div>
                              <div className="text-right text-[11px] text-gray-400">
                                {new Date(dv.createdAt).toLocaleString('vi-VN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.simulations?.length > 0 && (
                      <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 space-y-4">
                        <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-300 uppercase flex items-center gap-1.5">
                          <Play className="h-4 w-4 text-indigo-600" />
                          Kết quả chạy kiểm thử song song (Shadow Testing) ({parsed.simulations.length}):
                        </h4>
                        <div className="bg-blue-100 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 p-2.5 rounded-lg text-xs leading-relaxed">
                          ℹ️ <span className="font-bold">Dữ liệu kiểm thử độc lập:</span> Các kết quả dưới đây chỉ dùng để đánh giá tác động của bản nháp (DRAFT) so với bản hiện hành (ACTIVE), không làm thay đổi trạng thái hồ sơ thực tế hay kích hoạt version.
                        </div>
                        <div className="space-y-4">
                          {parsed.simulations.map((sim: any, idx: number) => (
                            <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-3 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-bold text-[10px]">SHADOW TEST</span>
                                  <span className="font-bold text-gray-800 dark:text-gray-200">Hồ sơ: {sim.caseCode}</span>
                                  <span className="text-gray-500">({sim.caseApplicant || 'N/A'})</span>
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {new Date(sim.executedAt || sim.timestamp).toLocaleString('vi-VN')}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg border space-y-1.5">
                                  <div className="font-bold text-gray-700 dark:text-gray-300 text-[11px] uppercase flex items-center justify-between">
                                    <span>Version hiện hành (ACTIVE)</span>
                                    <span className="px-1.5 py-0.5 bg-green-500 text-white rounded text-[9px]">{sim.activeResultSummary?.label || 'Đạt yêu cầu'}</span>
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                    • Điểm tin cậy AI: <span className="font-semibold text-gray-800 dark:text-gray-200">{sim.activeResultSummary?.confidenceScore || 85}%</span>
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                    • Vấn đề phát hiện: <span className="font-semibold text-gray-800 dark:text-gray-200">{sim.activeResultSummary?.issuesCount || 0}</span>
                                  </div>
                                </div>

                                <div className="p-2.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1.5">
                                  <div className="font-bold text-purple-900 dark:text-purple-300 text-[11px] uppercase flex items-center justify-between">
                                    <span>Version bản nháp (DRAFT)</span>
                                    <span className="px-1.5 py-0.5 bg-purple-600 text-white rounded text-[9px]">{sim.draftResultSummary?.label || 'Chặt chẽ hơn'}</span>
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                    • Điểm tin cậy AI: <span className="font-semibold text-gray-800 dark:text-gray-200">{sim.draftResultSummary?.confidenceScore || 92}%</span>
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                    • Vấn đề phát hiện: <span className="font-semibold text-gray-800 dark:text-gray-200">{sim.draftResultSummary?.issuesCount || 1}</span>
                                  </div>
                                </div>
                              </div>

                              {sim.diffSummary && (
                                <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                                  <div className="font-bold text-amber-900 dark:text-amber-300 text-[11px]">So sánh & Phân tích khác biệt:</div>
                                  {sim.diffSummary.generalEvaluation && (
                                    <div className="text-gray-700 dark:text-gray-300 text-[11px]">
                                      👉 <span className="font-medium">{sim.diffSummary.generalEvaluation}</span>
                                    </div>
                                  )}
                                  {sim.diffSummary.procedureDifferences?.length > 0 && (
                                    <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                      • Thủ tục: {sim.diffSummary.procedureDifferences.join('; ')}
                                    </div>
                                  )}
                                  {sim.diffSummary.promptDifferences?.length > 0 && (
                                    <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                      • Prompt AI: {sim.diffSummary.promptDifferences.join('; ')}
                                    </div>
                                  )}
                                  {sim.diffSummary.checklistDifferences?.length > 0 && (
                                    <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                      • Checklist: {sim.diffSummary.checklistDifferences.join('; ')}
                                    </div>
                                  )}
                                </div>
                              )}

                              {sim.riskFlags?.length > 0 && (
                                <div className="space-y-1">
                                  <div className="font-bold text-red-600 text-[11px]">Cảnh báo rủi ro khi áp dụng:</div>
                                  {sim.riskFlags.map((rf: string, rIdx: number) => (
                                    <div key={rIdx} className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded text-[11px] flex items-center gap-1.5">
                                      <AlertTriangle className="h-3 w-3 shrink-0" />
                                      <span>{rf}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {sim.recommendedReviewPoints?.length > 0 && (
                                <div className="space-y-1">
                                  <div className="font-bold text-blue-600 text-[11px]">Điểm cần lưu ý khi rà soát chính thức:</div>
                                  {sim.recommendedReviewPoints.map((pt: string, pIdx: number) => (
                                    <div key={pIdx} className="text-gray-600 dark:text-gray-400 text-[11px] pl-2">
                                      ✓ {pt}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {sim.officerNotes && (
                                <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded text-gray-700 dark:text-gray-300 italic text-[11px]">
                                  Ghi chú kiểm thử: "{sim.officerNotes}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.activationHistory?.length > 0 && (
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                        <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-300 uppercase flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Lịch sử kích hoạt version ({parsed.activationHistory.length}):
                        </h4>
                        <div className="space-y-2.5">
                          {parsed.activationHistory.map((act: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900/40 shadow-sm text-xs space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between font-bold text-gray-800 dark:text-gray-200 border-b pb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px]">ACTIVE</span>
                                  <span>{act.draftType === 'PROCEDURE_TYPE_VERSION' ? 'Thủ tục hành chính' : act.draftType === 'AI_PROMPT_VERSION' ? 'Prompt AI' : 'Checklist'}</span>
                                </div>
                                <span className="text-[11px] text-gray-400">{new Date(act.activatedAt || act.createdAt || Date.now()).toLocaleString('vi-VN')}</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                <div>• Version mới (ACTIVE): <span className="font-mono font-bold text-emerald-600">{act.newActiveVersionId || act.draftVersionId}</span></div>
                                <div>• Version cũ (REPLACED): <span className="font-mono font-bold text-gray-500">{act.previousActiveVersionId || 'N/A'}</span></div>
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                • Ngày hiệu lực: <span className="font-semibold text-gray-800 dark:text-gray-200">{act.effectiveFrom ? new Date(act.effectiveFrom).toLocaleDateString('vi-VN') : 'N/A'}</span>
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-[11px]">
                                • Thực hiện: <span className="font-semibold text-gray-800 dark:text-gray-200">{act.activatedByEmail || act.userEmail || 'N/A'} ({act.activatedByRole || act.userRole || 'N/A'})</span>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded text-gray-700 dark:text-gray-300 italic text-[11px]">
                                "Lý do: {act.reason}"
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.workflowHistory?.length > 0 && (
                      <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border space-y-3">
                        <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase flex items-center gap-1.5">
                          <History className="h-4 w-4 text-blue-600" />
                          Lịch sử rà soát / Workflow ({parsed.workflowHistory.length}):
                        </h4>
                        <div className="space-y-2.5">
                          {parsed.workflowHistory.map((item: any, i: number) => {
                            const actionMap: Record<string, string> = {
                              START_REVIEW: 'Bắt đầu rà soát',
                              ADD_NOTE: 'Thêm ghi chú rà soát',
                              REQUEST_MORE_INFO: 'Yêu cầu bổ sung thông tin',
                              APPROVE_FOR_VERSIONING: 'Phê duyệt hướng xử lý',
                              REJECT: 'Từ chối hướng xử lý',
                              CLOSE: 'Đóng nhật ký',
                              CREATE_DRAFT_VERSION: 'Tạo bản nháp version',
                              ACTIVATE_DRAFT_VERSION: 'Kích hoạt version thủ công',
                              ROLLBACK_VERSION: 'Hoàn tác version thủ công',
                            };
                            const actionText = actionMap[item.action] || item.actionLabel || item.action;
                            const timeVal = item.createdAt || item.timestamp;
                            const timeText = timeVal ? new Date(timeVal).toLocaleString('vi-VN') : '';
                            const actorText = item.userEmail || item.actorName || item.actor || item.userId || 'Hệ thống';
                            const roleText = item.userRole || item.actorRole || 'N/A';
                            return (
                              <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-lg border text-xs space-y-1">
                                <div className="flex items-center justify-between font-semibold">
                                  <span className="text-blue-600">{actionText}</span>
                                  <span className="text-gray-400 text-[11px]">{timeText}</span>
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  Thực hiện: <span className="font-medium text-gray-800 dark:text-gray-200">{actorText} ({roleText})</span>
                                </div>
                                {(item.note || item.reason) && (
                                  <div className="mt-1 p-2 bg-gray-50 dark:bg-slate-800 rounded text-gray-700 dark:text-gray-300 italic">
                                    "{item.note || item.reason}"
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* PHASE 8F-E-D-A: POST-ACTIVATION VERIFICATION & READ-ONLY AUDIT DASHBOARD */}
                    {canShowVerificationBlock && (
                      <div className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                            Kiểm chứng sau kích hoạt (Read-only Audit Dashboard)
                          </h4>
                        </div>

                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Bảng kiểm chứng này chỉ phục vụ hậu kiểm sau kích hoạt.</strong> Không tự thay đổi version, không sửa hồ sơ, không thay thế trách nhiệm kiểm tra của cán bộ.
                          </span>
                        </div>

                        <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
                          <button
                            type="button"
                            onClick={handleRunVerification}
                            disabled={loadingVerification || !selectedLogForDetail?.id}
                            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingVerification ? (
                              <span className="inline-block animate-spin">⌛</span>
                            ) : (
                              <ShieldCheck className="h-3.5 w-3.5" />
                            )}
                            Kiểm tra sau kích hoạt
                          </button>

                          <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            Read-only verification endpoint: activation-verification
                          </div>
                        </div>

                        {!hasActivationHistory && !verificationData && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>
                              Chưa phát hiện lịch sử kích hoạt trong nhật ký này. Bạn có thể chạy kiểm chứng read-only để xác minh trạng thái version hiện tại.
                            </span>
                          </div>
                        )}

                        {verificationData && (
                          <div className="space-y-3 pt-2 border-t border-emerald-200 dark:border-emerald-800 text-xs">
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border">
                              <span className="font-bold text-gray-700 dark:text-gray-300">Trạng thái tổng thể (Overall Status):</span>
                              <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                verificationData.overallStatus === 'PASS'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                  : verificationData.overallStatus === 'WARNING'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {verificationData.overallStatus === 'PASS' && '✔ PASS (Đạt yêu cầu)'}
                                {verificationData.overallStatus === 'WARNING' && '⚠ WARNING (Có cảnh báo)'}
                                {verificationData.overallStatus === 'FAIL' && '✖ FAIL (Có lỗi/bất thường)'}
                              </span>
                            </div>

                            {verificationData.warnings && verificationData.warnings.length > 0 && (
                              <div className={`p-2.5 rounded-lg border space-y-1 ${
                                verificationData.overallStatus === 'WARNING'
                                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
                              }`}>
                                <div className={`font-bold ${
                                  verificationData.overallStatus === 'WARNING'
                                    ? 'text-amber-800 dark:text-amber-300'
                                    : 'text-red-800 dark:text-red-300'
                                }`}>Cảnh báo phát hiện:</div>
                                <ul className={`list-disc list-inside space-y-0.5 ${
                                  verificationData.overallStatus === 'WARNING'
                                    ? 'text-amber-700 dark:text-amber-400'
                                    : 'text-red-700 dark:text-red-400'
                                }`}>
                                  {verificationData.warnings.map((w: string, idx: number) => (
                                    <li key={idx}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <div className="font-semibold text-gray-700 dark:text-gray-300">1. Kiểm chứng trạng thái Version (ACTIVE/REPLACED & Duy nhất):</div>
                              <div className="space-y-1">
                                {verificationData.versionChecks?.map((chk: any, idx: number) => (
                                  <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                    <div className="flex items-center justify-between font-semibold">
                                      <span className="text-blue-600">{chk.draftType}</span>
                                      <span className={`px-2 py-0.5 rounded text-[10px] ${chk.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {chk.passed ? '✔ Đạt' : '✖ Không đạt'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                                      <div>
                                        Version mới ACTIVE: <strong className="text-emerald-600">{chk.newActiveVersionId}</strong> ({chk.newActiveStatus})
                                        <br />
                                        Hiệu lực từ: {chk.effectiveFrom ? new Date(chk.effectiveFrom).toLocaleDateString('vi-VN') : 'N/A'}
                                      </div>
                                      <div>
                                        Version cũ REPLACED: <strong className="text-amber-600">{chk.previousActiveVersionId || 'Không có (Lần đầu)'}</strong> ({chk.previousActiveStatus})
                                        <br />
                                        Số bản ACTIVE cùng phạm vi: <strong>{chk.activeCountInScope}</strong>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                <div className="font-semibold text-gray-700 dark:text-gray-300">2. An toàn hồ sơ TTHC:</div>
                                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                                  Tổng số hồ sơ kiểm tra: <strong>{verificationData.caseSafetyChecks?.totalCases || 0}</strong>
                                  <br />
                                  <span className="text-emerald-600 font-medium">✔ {verificationData.caseSafetyChecks?.message}</span>
                                </div>
                              </div>
                              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                <div className="font-semibold text-gray-700 dark:text-gray-300">3. An toàn kết quả AI & Snapshot:</div>
                                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                                  Thẩm tra AI / Snapshot: <strong>{verificationData.aiSnapshotSafetyChecks?.totalAnalyses || 0} / {verificationData.aiSnapshotSafetyChecks?.totalSnapshots || 0}</strong>
                                  <br />
                                  <span className="text-emerald-600 font-medium">✔ {verificationData.aiSnapshotSafetyChecks?.message}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PHASE 8F-E-D-E: POST-ROLLBACK VERIFICATION & READ-ONLY AUDIT DASHBOARD (HISTORY SECTION) */}
                    {canShowRollbackVerificationBlock && (
                      <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 space-y-3 mt-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
                            <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300">
                              Kiểm chứng sau rollback (Read-only Audit Dashboard)
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={handleRunRollbackVerification}
                            disabled={loadingRollbackVerification || !selectedLogForDetail?.id}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingRollbackVerification ? (
                              <span className="inline-block animate-spin">⌛</span>
                            ) : (
                              <ShieldCheck className="h-3.5 w-3.5" />
                            )}
                            Kiểm tra sau rollback
                          </button>
                        </div>

                        <div className="p-2.5 bg-purple-100/70 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 rounded-lg text-[11px] text-purple-900 dark:text-purple-200 font-medium flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Chức năng kiểm chứng này hoàn toàn read-only (chỉ đọc).</strong> Không tự thay đổi version, không tự rollback lại, không sửa hồ sơ TTHC cũ hay kết quả thẩm tra AI/legal snapshot cũ.
                          </span>
                        </div>

                        {loadingRollbackVerification && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <span className="inline-block animate-spin">⌛</span>
                            <span>Đang gọi API kiểm chứng sau rollback...</span>
                          </div>
                        )}

                        {rollbackVerificationError && !loadingRollbackVerification && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-center gap-2 font-semibold">
                            <span>❌</span>
                            <span>{rollbackVerificationError}</span>
                          </div>
                        )}

                        {!hasRollbackHistory && !rollbackVerificationData && !loadingRollbackVerification && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>
                              Chưa phát hiện lịch sử hoàn tác (rollbackHistory) trong nhật ký này. Bạn có thể bấm "Kiểm tra sau rollback" để xác minh chi tiết trạng thái hệ thống.
                            </span>
                          </div>
                        )}

                        {rollbackVerificationData && !loadingRollbackVerification && (
                          <div className="space-y-3 pt-2 border-t border-purple-200 dark:border-purple-800 text-xs">
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border">
                              <span className="font-bold text-gray-700 dark:text-gray-300">Trạng thái tổng quan (Overall Status):</span>
                              <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                rollbackVerificationData.overallStatus === 'PASS'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                  : rollbackVerificationData.overallStatus === 'WARNING'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {rollbackVerificationData.overallStatus === 'PASS' && '✔ PASS (An toàn / Đạt yêu cầu)'}
                                {rollbackVerificationData.overallStatus === 'WARNING' && '⚠ WARNING (Có cảnh báo)'}
                                {rollbackVerificationData.overallStatus === 'FAIL' && '✖ FAIL (Có lỗi / Bất thường)'}
                              </span>
                            </div>

                            {rollbackVerificationData.warnings && rollbackVerificationData.warnings.length > 0 && (
                              <div className={`p-2.5 rounded-lg border space-y-1 ${
                                rollbackVerificationData.overallStatus === 'WARNING'
                                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
                              }`}>
                                <div className={`font-bold ${
                                  rollbackVerificationData.overallStatus === 'WARNING'
                                    ? 'text-amber-800 dark:text-amber-300'
                                    : 'text-red-800 dark:text-red-300'
                                }`}>Danh sách cảnh báo / thông báo:</div>
                                <ul className={`list-disc list-inside space-y-0.5 ${
                                  rollbackVerificationData.overallStatus === 'WARNING'
                                    ? 'text-amber-700 dark:text-amber-400'
                                    : 'text-red-700 dark:text-red-400'
                                }`}>
                                  {rollbackVerificationData.warnings.map((w: string, idx: number) => (
                                    <li key={idx}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {rollbackVerificationData.checks && (
                              <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-lg border">
                                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Chi tiết kiểm chứng các mục:</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                                    <span>Tồn tại lịch sử rollback:</span>
                                    <strong className={rollbackVerificationData.checks.rollbackHistoryExists ? 'text-emerald-600' : 'text-amber-600'}>
                                      {rollbackVerificationData.checks.rollbackHistoryExists ? '✔ Có' : '⚠ Không'}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                                    <span>Sự kiện rollback trong workflow:</span>
                                    <strong className={rollbackVerificationData.checks.workflowHistoryHasRollbackVersion ? 'text-emerald-600' : 'text-amber-600'}>
                                      {rollbackVerificationData.checks.workflowHistoryHasRollbackVersion ? '✔ Có' : '⚠ Không'}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                                    <span>Trạng thái version khôi phục (ACTIVE):</span>
                                    <strong className={rollbackVerificationData.checks.activeVersionExists ? 'text-emerald-600' : 'text-red-600'}>
                                      {rollbackVerificationData.checks.activeVersionExists ? '✔ Đạt' : '✖ Lỗi'}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                                    <span>Trạng thái version bị thay thế (REPLACED):</span>
                                    <strong className={rollbackVerificationData.checks.previousVersionReplaced ? 'text-emerald-600' : 'text-red-600'}>
                                      {rollbackVerificationData.checks.previousVersionReplaced ? '✔ Đạt' : '✖ Lỗi'}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                                    <span>Không duplicate ACTIVE version:</span>
                                    <strong className={rollbackVerificationData.checks.noDuplicateActiveVersions ? 'text-emerald-600' : 'text-red-600'}>
                                      {rollbackVerificationData.checks.noDuplicateActiveVersions ? '✔ Đạt' : '✖ Lỗi'}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded">
                                    <span>Hồ sơ TTHC giữ nguyên:</span>
                                    <strong className={rollbackVerificationData.checks.casesUnchanged ? 'text-emerald-600' : 'text-red-600'}>
                                      {rollbackVerificationData.checks.casesUnchanged ? '✔ Đạt' : '✖ Lỗi'}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-slate-800 rounded col-span-1 sm:col-span-2">
                                    <span>Kết quả thẩm tra AI / legal snapshot bảo toàn:</span>
                                    <strong className={rollbackVerificationData.checks.aiAnalysesUnchanged && rollbackVerificationData.checks.legalSnapshotsPreserved ? 'text-emerald-600' : 'text-red-600'}>
                                      {rollbackVerificationData.checks.aiAnalysesUnchanged && rollbackVerificationData.checks.legalSnapshotsPreserved ? '✔ Đạt (Bảo toàn)' : '✖ Lỗi'}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            )}

                            {rollbackVerificationData.versionChecks && rollbackVerificationData.versionChecks.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="font-semibold text-gray-700 dark:text-gray-300">Chi tiết phiên bản đã hoàn tác:</div>
                                <div className="space-y-1">
                                  {rollbackVerificationData.versionChecks.map((chk: any, idx: number) => (
                                    <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                      <div className="flex items-center justify-between font-semibold">
                                        <span className="text-purple-600">{chk.type}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] ${chk.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {chk.passed ? '✔ Đạt' : '✖ Không đạt'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                                        <div>
                                          Version khôi phục về ACTIVE: <strong className="text-emerald-600">{chk.restoredVersionId}</strong> ({chk.restoredStatus})
                                        </div>
                                        <div>
                                          Version bị thay thế (REPLACED): <strong className="text-amber-600">{chk.replacedVersionId}</strong> ({chk.replacedStatus})
                                          <br />
                                          Số bản ACTIVE cùng phạm vi: <strong>{chk.activeCountInScope}</strong>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                <div className="font-semibold text-gray-700 dark:text-gray-300">An toàn hồ sơ TTHC:</div>
                                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                                  Tổng số hồ sơ kiểm tra: <strong>{rollbackVerificationData.caseSafetyChecks?.totalCases || 0}</strong>
                                  <br />
                                  <span className="text-emerald-600 font-medium">✔ {rollbackVerificationData.caseSafetyChecks?.message}</span>
                                </div>
                              </div>
                              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                                <div className="font-semibold text-gray-700 dark:text-gray-300">An toàn AI & Snapshot:</div>
                                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                                  Thẩm tra AI / Snapshot: <strong>{rollbackVerificationData.aiSnapshotSafetyChecks?.totalAnalyses || 0} / {rollbackVerificationData.aiSnapshotSafetyChecks?.totalSnapshots || 0}</strong>
                                  <br />
                                  <span className="text-emerald-600 font-medium">✔ {rollbackVerificationData.aiSnapshotSafetyChecks?.message}</span>
                                </div>
                              </div>
                            </div>

                            {rollbackVerificationData.safetyStatement && (
                              <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded text-[11px] text-gray-700 dark:text-gray-300 italic text-center">
                                {rollbackVerificationData.safetyStatement}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const status = selectedLogForDetail.reviewStatus;
                  const isClosed = parsedNotes?.subStatus === 'CLOSED' || parsedNotes?.subStatus === 'REJECTED';
                  const isRejected = status === 'REJECTED' || isClosed;
                  const canAct = role === 'STAFF' || role === 'MANAGER' || role === 'ADMIN';
                  const isLeader = role === 'MANAGER' || role === 'ADMIN';

                  return (
                    <>
                      {canAct && status === 'PENDING' && !isRejected && (
                        <button
                          onClick={() => setWorkflowModal({
                            isOpen: true,
                            action: 'START_REVIEW',
                            title: 'Bắt đầu rà soát nhật ký cập nhật',
                            requireNote: false,
                            requireReason: false,
                            isWarning: false,
                            buttonLabel: 'Xác nhận bắt đầu',
                            buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                          })}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
                        >
                          Bắt đầu rà soát
                        </button>
                      )}

                      {canAct && !isRejected && (
                        <>
                          <button
                            onClick={() => setWorkflowModal({
                              isOpen: true,
                              action: 'ADD_NOTE',
                              title: 'Thêm ý kiến / ghi chú rà soát',
                              requireNote: true,
                              requireReason: false,
                              isWarning: false,
                              buttonLabel: 'Lưu ý kiến',
                              buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                            })}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition"
                          >
                            + Thêm ý kiến rà soát
                          </button>

                          <button
                            onClick={() => setWorkflowModal({
                              isOpen: true,
                              action: 'REQUEST_MORE_INFO',
                              title: 'Yêu cầu bổ sung thông tin rà soát',
                              requireNote: true,
                              requireReason: false,
                              isWarning: false,
                              buttonLabel: 'Gửi yêu cầu',
                              buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
                            })}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 rounded-xl font-semibold text-xs transition"
                          >
                            Yêu cầu bổ sung
                          </button>
                        </>
                      )}

                      {isLeader && !isRejected && status !== 'APPROVED' && (
                        <button
                          onClick={() => setWorkflowModal({
                            isOpen: true,
                            action: 'APPROVE_FOR_VERSIONING',
                            title: 'Phê duyệt hướng xử lý cập nhật',
                            requireNote: true,
                            requireReason: false,
                            isWarning: true,
                            buttonLabel: 'Phê duyệt hướng xử lý',
                            buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
                          })}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
                        >
                          Phê duyệt hướng xử lý
                        </button>
                      )}

                      {isLeader && !isRejected && (
                        <button
                          onClick={() => setWorkflowModal({
                            isOpen: true,
                            action: 'REJECT',
                            title: 'Từ chối hướng xử lý cập nhật',
                            requireNote: false,
                            requireReason: true,
                            isWarning: true,
                            buttonLabel: 'Từ chối',
                            buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
                          })}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-xl font-semibold text-xs transition"
                        >
                          Từ chối
                        </button>
                      )}

                      {isLeader && !isRejected && (
                        <button
                          onClick={() => setWorkflowModal({
                            isOpen: true,
                            action: 'CLOSE',
                            title: 'Đóng nhật ký cập nhật',
                            requireNote: false,
                            requireReason: false,
                            isWarning: false,
                            buttonLabel: 'Xác nhận đóng',
                            buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
                          })}
                          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-xs transition"
                        >
                          Đóng
                        </button>
                      )}

                      {role === 'STAFF' && status === 'APPROVED' && !isRejected && (
                        <button
                          disabled
                          title="Bạn không có quyền kích hoạt"
                          className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 rounded-xl font-semibold text-xs cursor-not-allowed border border-dashed flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Kích hoạt version
                        </button>
                      )}

                      {isLeader && status === 'APPROVED' && !isRejected ? (
                        <>
                          <button
                            onClick={() => setDraftModalOpen(true)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-1"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Tạo bản nháp version
                          </button>
                          {hasDrafts && (
                            <button
                              onClick={() => setSimModalOpen(true)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-1"
                            >
                              <Play className="h-3.5 w-3.5" />
                              Chạy thử bản nháp (Simulation)
                            </button>
                          )}
                          {hasDrafts && hasSimulations ? (
                            <button
                              onClick={() => {
                                const drafts = parsedNotes?.draftVersions?.list || [];
                                const firstDraft = drafts.find((d: any) => d.status === 'DRAFT');
                                if (firstDraft) {
                                  setActDraftType(firstDraft.type);
                                  setActDraftVerId(firstDraft.id);
                                } else {
                                  setActDraftType('PROCEDURE_TYPE_VERSION');
                                  setActDraftVerId('');
                                }
                                setActReason('');
                                setActEffectiveFrom(new Date().toISOString().split('T')[0]);
                                setActConfirmText('');
                                setActAgreedRisk(false);
                                setActError('');
                                setActModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Kích hoạt version
                            </button>
                          ) : (
                            <button
                              disabled
                              title={!hasDrafts ? 'Chưa có bản nháp version' : 'Chưa chạy simulation'}
                              className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 rounded-xl font-semibold text-xs cursor-not-allowed border border-dashed flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Kích hoạt version
                            </button>
                          )}
                        </>
                      ) : isLeader ? (
                        <>
                          <button
                            disabled
                            title="Chỉ tạo bản nháp sau khi đã phê duyệt hướng xử lý."
                            className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 rounded-xl font-semibold text-xs cursor-not-allowed border border-dashed"
                          >
                            Tạo bản nháp version
                          </button>
                          <button
                            disabled
                            title="Chưa phê duyệt hướng xử lý"
                            className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 rounded-xl font-semibold text-xs cursor-not-allowed border border-dashed flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Kích hoạt version
                          </button>
                        </>
                      ) : null}
                    </>
                  );
                })()}
              </div>
              <button onClick={() => setSelectedLogForDetail(null)} className="px-5 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-semibold text-xs transition">
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: WORKFLOW CONFIRM MODAL (PHASE 8F-B) */}
      {workflowModal && workflowModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
                {workflowModal.title}
              </h3>
              <button onClick={() => setWorkflowModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {workflowModal.isWarning && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-medium leading-relaxed">
                <span className="font-bold block mb-1">CẢNH BÁO HỆ THỐNG:</span>
                Phê duyệt hướng xử lý không đồng nghĩa với kích hoạt version pháp lý. Hệ thống chưa tự thay đổi ProcedureTypeVersion, AiPromptVersion, ChecklistVersion hoặc LegalDocument.
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  {workflowModal.requireReason ? 'Lý do từ chối (Bắt buộc):' : workflowModal.requireNote ? 'Ghi chú rà soát (Bắt buộc):' : 'Ghi chú / Ý kiến (Tùy chọn):'}
                </label>
                <textarea
                  rows={3}
                  value={workflowModal.requireReason ? workflowReason : workflowNote}
                  onChange={(e) => workflowModal.requireReason ? setWorkflowReason(e.target.value) : setWorkflowNote(e.target.value)}
                  placeholder="Nhập nội dung ý kiến rà soát, chỉ đạo hoặc lý do..."
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
              <button
                disabled={submittingWorkflow}
                onClick={() => setWorkflowModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                disabled={submittingWorkflow}
                onClick={handleWorkflowSubmit}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5 ${workflowModal.buttonClass}`}
              >
                {submittingWorkflow && <span className="animate-spin">⌛</span>}
                {workflowModal.buttonLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: DRAFT VERSION CREATION MODAL (PHASE 8F-C) */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-purple-200 dark:border-purple-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Tạo bản nháp phiên bản mới (Draft Version)
              </h3>
              <button onClick={() => setDraftModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-medium leading-relaxed">
              <span className="font-bold block mb-1">CẢNH BÁO HỆ THỐNG:</span>
              Bản nháp version chưa có hiệu lực và chưa được dùng bởi AI review thật. Cần kiểm thử, phê duyệt và kích hoạt thủ công ở phase sau. Hệ thống không tự động thay đổi version ACTIVE hiện tại.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  1. Loại đối tượng cần tạo bản nháp version:
                </label>
                <select
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-none transition"
                >
                  <option value="PROCEDURE_TYPE_VERSION">Thủ tục hành chính (Procedure Type)</option>
                  <option value="AI_PROMPT_VERSION">Prompt AI (AI Prompt)</option>
                  <option value="CHECKLIST_VERSION">Checklist (Checklist Version)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  2. Chọn phiên bản nguồn ACTIVE để kế thừa:
                </label>
                <select
                  value={draftSourceId}
                  onChange={(e) => setDraftSourceId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition"
                >
                  {(() => {
                    let list: any[] = [];
                    if (draftType === 'PROCEDURE_TYPE_VERSION') list = procedureVersions.filter(v => v.status === 'ACTIVE');
                    else if (draftType === 'AI_PROMPT_VERSION') list = promptVersions.filter(v => v.status === 'ACTIVE');
                    else if (draftType === 'CHECKLIST_VERSION') list = checklistVersions.filter(v => v.status === 'ACTIVE');

                    if (list.length === 0) {
                      return <option value="">Không có phiên bản ACTIVE nào</option>;
                    }
                    return list.map((item: any) => {
                      const label = item.procedureName || item.procedureCode || item.promptName || item.promptKey || item.checklistName || item.checklistKey || item.id;
                      return (
                        <option key={item.id} value={item.id}>
                          {label} (ver: {item.version})
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  3. Số phiên bản mới (Tùy chọn, để trống hệ thống tự tạo X.Y-draft):
                </label>
                <input
                  type="text"
                  value={draftVerString}
                  onChange={(e) => setDraftVerString(e.target.value)}
                  placeholder="Ví dụ: v2.1-draft"
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  4. Lý do tạo bản nháp version mới (Bắt buộc):
                </label>
                <textarea
                  rows={3}
                  value={draftReason}
                  onChange={(e) => setDraftReason(e.target.value)}
                  placeholder="Nhập lý do tạo bản nháp căn cứ trên cập nhật pháp lý..."
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
              <button
                disabled={submittingDraft}
                onClick={() => setDraftModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                disabled={submittingDraft || !draftSourceId}
                onClick={handleCreateDraftSubmit}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {submittingDraft && <span className="animate-spin">⌛</span>}
                Tạo bản nháp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: DRAFT VERSION SIMULATION & SHADOW TESTING MODAL (PHASE 8F-D) */}
      {simModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5 border border-indigo-200 dark:border-indigo-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <Play className="h-5 w-5 text-indigo-600" />
                Chạy thử bản nháp & Kiểm thử song song (Shadow Testing)
              </h3>
              <button onClick={() => setSimModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 rounded-xl text-blue-900 dark:text-blue-200 text-xs font-medium leading-relaxed">
              <span className="font-bold block mb-1">ℹ️ NGUYÊN TẮC SHADOW TESTING:</span>
              Hệ thống sẽ chạy thử AI review bằng các version DRAFT được chọn và đối chiếu với version ACTIVE hiện hành trên hồ sơ TTHC mẫu. Quá trình này <span className="underline font-bold">hoàn toàn độc lập</span>, không cập nhật kết quả vào hồ sơ thật, không tạo side effects, đảm bảo tính toàn vẹn dữ liệu.
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  1. Chọn hồ sơ TTHC mẫu để kiểm thử:
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  {sampleCases.length === 0 ? (
                    <option value="">Đang tải hồ sơ mẫu...</option>
                  ) : (
                    sampleCases.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        [{c.caseCode}] {c.applicantName} - {c.procedureName} ({c.status})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2.5 p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border">
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                  2. Cấu hình tổ hợp Version DRAFT áp dụng kiểm thử:
                </label>
                {(() => {
                  const drafts = parsedNotes?.draftVersions?.list || [];
                  const procDrafts = drafts.filter((d: any) => d.type === 'PROCEDURE_TYPE_VERSION');
                  const promptDrafts = drafts.filter((d: any) => d.type === 'AI_PROMPT_VERSION');
                  const chkDrafts = drafts.filter((d: any) => d.type === 'CHECKLIST_VERSION');

                  return (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">Thủ tục hành chính DRAFT:</span>
                        <select
                          value={simProcVerId}
                          onChange={(e) => setSimProcVerId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="">-- Dùng bản ACTIVE hiện hành --</option>
                          {procDrafts.map((d: any) => (
                            <option key={d.id} value={d.id}>[{d.version}] {d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">AI Prompt DRAFT:</span>
                        <select
                          value={simPromptVerId}
                          onChange={(e) => setSimPromptVerId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="">-- Dùng bản ACTIVE hiện hành --</option>
                          {promptDrafts.map((d: any) => (
                            <option key={d.id} value={d.id}>[{d.version}] {d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">Checklist DRAFT:</span>
                        <select
                          value={simChecklistVerId}
                          onChange={(e) => setSimChecklistVerId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="">-- Dùng bản ACTIVE hiện hành --</option>
                          {chkDrafts.map((d: any) => (
                            <option key={d.id} value={d.id}>[{d.version}] {d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                  3. Ghi chú kiểm thử / Ý kiến rà soát (Tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={simNote}
                  onChange={(e) => setSimNote(e.target.value)}
                  placeholder="Nhập ghi chú mục tiêu kiểm thử hoặc nhận xét về kết quả..."
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
              <button
                disabled={submittingSim}
                onClick={() => setSimModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                disabled={submittingSim || (!simProcVerId && !simPromptVerId && !simChecklistVerId)}
                onClick={handleRunSimulation}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {submittingSim && <span className="animate-spin">⌛</span>}
                Bắt đầu chạy thử (Run Simulation)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: ACTIVATION MODAL (PHASE 8F-E-C) */}
      {actModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5 border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Kích hoạt version pháp lý thủ công (Manual Activation)
              </h3>
              <button onClick={() => setActModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {actError && (
              <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-xl text-xs font-semibold">
                ⚠️ {actError}
              </div>
            )}

            {/* Bước 1 – Chọn draft */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 uppercase flex items-center gap-1.5">
                Bước 1 – Chọn bản nháp version cần kích hoạt:
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'PROCEDURE_TYPE_VERSION', label: 'Thủ tục hành chính' },
                  { id: 'AI_PROMPT_VERSION', label: 'Prompt AI' },
                  { id: 'CHECKLIST_VERSION', label: 'Checklist' },
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setActDraftType(type.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      actDraftType === type.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {(() => {
                const drafts = parsedNotes?.draftVersions?.list || [];
                const filtered = drafts.filter((d: any) => d.type === actDraftType && (d.currentStatus || d.status || 'DRAFT') === 'DRAFT');

                if (filtered.length === 0) {
                  return (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl text-xs italic">
                      {drafts.length > 0
                        ? "Có bản nháp trong nhật ký nhưng không có bản nào còn ở trạng thái DRAFT. Vui lòng kiểm tra trạng thái version hoặc refresh dữ liệu."
                        : "Không có bản nháp nào ở trạng thái DRAFT cho loại version này."}
                    </div>
                  );
                }

                return (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      Danh sách bản nháp DRAFT hợp lệ:
                    </label>
                    <select
                      value={actDraftVerId}
                      onChange={(e) => setActDraftVerId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    >
                      {filtered.map((d: any) => (
                        <option key={d.id} value={d.id}>
                          [{d.version}] {d.name} (Trạng thái: {d.currentStatus || d.status || 'DRAFT'})
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}
            </div>

            {/* Bước 2 – Xem cảnh báo */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-red-600 uppercase flex items-center gap-1.5">
                Bước 2 – Cảnh báo rủi ro (Bắt buộc đọc kỹ):
              </h4>
              <div className="p-3.5 bg-red-100/80 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-950 dark:text-red-200 rounded-xl text-xs font-medium leading-relaxed shadow-inner">
                <span className="font-bold block mb-1">⚠️ LƯU Ý TÁC ĐỘNG PHÁP LÝ:</span>
                Kích hoạt version sẽ ảnh hưởng đến các kết quả AI review mới phát sinh sau thời điểm kích hoạt. Kết quả AI cũ vẫn giữ legal snapshot tại thời điểm tạo. Thao tác này không tự sửa hồ sơ cũ.
              </div>
            </div>

            {/* Bước 3 – Nhập thông tin */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 uppercase flex items-center gap-1.5">
                Bước 3 – Nhập thông tin kích hoạt:
              </h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Lý do kích hoạt (Bắt buộc):
                </label>
                <textarea
                  rows={2}
                  value={actReason}
                  onChange={(e) => setActReason(e.target.value)}
                  placeholder="Nhập lý do nghiệp vụ hoặc căn cứ ban hành áp dụng version mới..."
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Ngày có hiệu lực (Bắt buộc):
                </label>
                <input
                  type="date"
                  value={actEffectiveFrom}
                  onChange={(e) => setActEffectiveFrom(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>

            {/* Bước 4 – Xác nhận thủ công */}
            <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border">
              <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 uppercase flex items-center gap-1.5">
                Bước 4 – Xác nhận thủ công nhiều lớp:
              </h4>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={actAgreedRisk}
                  onChange={(e) => setActAgreedRisk(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
                />
                <span className="font-medium">
                  Tôi xác nhận đã kiểm tra simulation và hiểu rằng version mới sẽ ảnh hưởng đến AI review mới.
                </span>
              </label>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nhập chính xác chuỗi <code className="bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-emerald-600 font-mono">KICH HOAT VERSION</code> để xác nhận:
                </label>
                <input
                  type="text"
                  value={actConfirmText}
                  onChange={(e) => setActConfirmText(e.target.value)}
                  placeholder="KICH HOAT VERSION"
                  className="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
              <button
                disabled={submittingAct}
                onClick={() => setActModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                disabled={
                  submittingAct ||
                  !actDraftVerId ||
                  !actReason.trim() ||
                  !actEffectiveFrom ||
                  actConfirmText !== 'KICH HOAT VERSION' ||
                  !actAgreedRisk
                }
                onClick={handleActivateVersion}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingAct && <span className="animate-spin">⌛</span>}
                Tôi hiểu rủi ro và kích hoạt version
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 8F-E-D-D: MODAL 12 - MANUAL VERSION ROLLBACK (4 STEPS) */}
      {showRollbackModal && selectedLogForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && rollbackStep < 4) {
                e.preventDefault();
              }
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 dark:bg-red-950/60 rounded-xl">
                  <RotateCcw className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Hoàn tác version (Manual Version Rollback)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bước {rollbackStep}/4: {
                      rollbackStep === 1 ? 'Xem version hiện tại' :
                      rollbackStep === 2 ? 'Xem version dự kiến khôi phục' :
                      rollbackStep === 3 ? 'Nhập lý do rollback' :
                      'Xác nhận bắt buộc'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRollbackModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error & Result Banners */}
            {rollbackError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-semibold">
                ✖ {rollbackError}
              </div>
            )}

            {rollbackResult && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sm flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Hoàn tác version thành công!
                </div>
                <div className="font-semibold text-emerald-800 dark:text-emerald-200">
                  No cases, AI analyses, or legal snapshots were modified.
                </div>
                {rollbackResult.affectedVersions && (
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
                    <span className="font-semibold">Các phiên bản bị ảnh hưởng:</span>
                    <pre className="mt-1 p-2 bg-white/60 dark:bg-slate-900/60 rounded border text-[11px] font-mono overflow-x-auto">
                      {JSON.stringify(rollbackResult.affectedVersions, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Xem version hiện tại */}
            {rollbackStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl font-medium flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cảnh báo nhạy cảm:</strong> Đây là thao tác hoàn tác phiên bản pháp lý đang vận hành. Vui lòng kiểm tra kỹ trạng thái phiên bản trước khi tiếp tục.
                  </span>
                </div>

                <div className="space-y-2 bg-gray-50 dark:bg-slate-800/50 p-3.5 rounded-xl border">
                  <div>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Tên nhật ký cập nhật:</span>{' '}
                    <strong className="text-gray-800 dark:text-gray-200">{selectedLogForDetail.updateTitle}</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Trạng thái log:</span>{' '}
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">{selectedLogForDetail.reviewStatus}</span>
                  </div>
                  {hasActivationHistory && (
                    <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Lịch sử kích hoạt gần nhất:</span>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border font-mono text-[11px] text-gray-600 dark:text-gray-400 overflow-x-auto">
                        {JSON.stringify(parsedNotes?.activationHistory?.[parsedNotes.activationHistory.length - 1] || parsedNotes?.activationHistory, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Xem version dự kiến khôi phục */}
            {rollbackStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 rounded-xl font-medium flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>
                    <strong>Backend sẽ kiểm tra lại điều kiện rollback trước khi thực hiện.</strong> Hệ thống sẽ xác minh tính hợp lệ và đảm bảo không có phiên bản ACTIVE trùng lặp trong cùng phạm vi.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 space-y-1">
                    <div className="font-bold text-red-600 dark:text-red-400">1. Version hiện tại (ACTIVE):</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sẽ bị chuyển trạng thái từ <strong className="text-emerald-600">ACTIVE</strong> sang <strong className="text-amber-600">REPLACED</strong> (đồng thời chấm dứt hiệu lực).
                    </p>
                  </div>
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">2. Version trước đó (REPLACED):</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sẽ được khôi phục trạng thái từ <strong className="text-amber-600">REPLACED</strong> sang <strong className="text-emerald-600">ACTIVE</strong> (đồng thời mở lại hiệu lực).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Nhập lý do rollback */}
            {rollbackStep === 3 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Lý do rollback (Bắt buộc, tối thiểu 10 ký tự):
                  </label>
                  <textarea
                    rows={4}
                    value={rollbackReason}
                    onChange={(e) => setRollbackReason(e.target.value)}
                    placeholder="Nhập lý do nghiệp vụ hoặc chỉ đạo yêu cầu hoàn tác về phiên bản trước..."
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none transition"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-gray-500">
                    <span>Vui lòng ghi rõ nguyên nhân để lưu vết kiểm toán (Audit Trail).</span>
                    <span className={rollbackReason.trim().length < 10 ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>
                      {rollbackReason.trim().length}/10 ký tự
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Xác nhận bắt buộc */}
            {rollbackStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-red-100 dark:bg-red-950/80 border-2 border-red-400 dark:border-red-700 text-red-950 dark:text-red-100 rounded-xl text-xs font-bold leading-relaxed shadow-md">
                  <span className="text-sm block mb-1 text-red-700 dark:text-red-300 uppercase">⚠️ CẢNH BÁO TÁC ĐỘNG PHÁP LÝ NGHIÊM TRỌNG:</span>
                  Rollback có thể thay đổi version pháp lý ACTIVE đang được hệ thống sử dụng cho các phân tích mới. Thao tác này không sửa hồ sơ cũ và không sửa legal snapshot cũ.
                </div>

                {!rollbackResult && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Nhập chính xác chuỗi <code className="bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded text-red-600 font-mono font-bold">ROLLBACK VERSION</code> hoặc <code className="bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded text-red-600 font-mono font-bold">TOI XAC NHAN ROLLBACK VERSION</code> để xác nhận:
                    </label>
                    <input
                      type="text"
                      value={rollbackConfirmationText}
                      onChange={(e) => setRollbackConfirmationText(e.target.value)}
                      placeholder="ROLLBACK VERSION"
                      disabled={rollbackSubmitting}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-red-500 outline-none transition uppercase"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRollbackModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                {rollbackResult ? 'Đóng' : 'Hủy bỏ'}
              </button>

              <div className="flex items-center gap-2">
                {rollbackStep > 1 && !rollbackResult && (
                  <button
                    type="button"
                    disabled={rollbackSubmitting}
                    onClick={() => setRollbackStep(prev => prev - 1)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    Quay lại
                  </button>
                )}

                {rollbackStep < 4 && (
                  <button
                    type="button"
                    disabled={rollbackStep === 3 && rollbackReason.trim().length < 10}
                    onClick={() => setRollbackStep(prev => prev + 1)}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp tục (Bước {rollbackStep + 1}/4)
                  </button>
                )}

                {rollbackStep === 4 && !rollbackResult && (
                  <button
                    type="button"
                    disabled={
                      rollbackSubmitting ||
                      rollbackReason.trim().length < 10 ||
                      (rollbackConfirmationText.trim() !== 'ROLLBACK VERSION' && rollbackConfirmationText.trim() !== 'TOI XAC NHAN ROLLBACK VERSION')
                    }
                    onClick={handleRunRollback}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rollbackSubmitting && <span className="animate-spin">⌛</span>}
                    Xác nhận rollback version
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


