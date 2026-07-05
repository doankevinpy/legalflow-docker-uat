import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { legalKnowledgeApi } from '../lib/legalKnowledgeApi';
import { useAuth } from '../contexts/AuthContext';
import type {
  LegalDocument,
  ProcedureTypeVersion,
  AiPromptVersion,
  ChecklistVersion,
  LegalUpdateLog,
  ProcedureAiAnalysisLegalSnapshot,
} from '../types/legalKnowledge';

type TabType = 'overview' | 'documents' | 'procedures' | 'prompts' | 'checklists' | 'logs' | 'snapshots';

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
                                try {
                                  if (log.notes) {
                                    const p = JSON.parse(log.notes);
                                    if (p.subStatus && p.subStatus !== log.reviewStatus) {
                                      return <span className="text-[10px] text-gray-500 font-mono">({p.subStatus})</span>;
                                    }
                                  }
                                } catch (e) {}
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
              {/* Parse notes if JSON */}
              {(() => {
                let parsed: any = null;
                try {
                  if (selectedLogForDetail.notes) {
                    parsed = JSON.parse(selectedLogForDetail.notes);
                  }
                } catch (e) {}

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
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const status = selectedLogForDetail.reviewStatus;
                  let isClosed = false;
                  try {
                    if (selectedLogForDetail.notes) {
                      const p = JSON.parse(selectedLogForDetail.notes);
                      if (p.subStatus === 'CLOSED' || p.subStatus === 'REJECTED') isClosed = true;
                    }
                  } catch (e) {}
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
                              title: 'Thêm ghi chú rà soát',
                              requireNote: true,
                              requireReason: false,
                              isWarning: false,
                              buttonLabel: 'Lưu ghi chú',
                              buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                            })}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-semibold text-xs transition"
                          >
                            Thêm ghi chú
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
                            buttonLabel: 'Phê duyệt',
                            buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                          })}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
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

                      <button
                        disabled
                        title="Phase sau mới hỗ trợ tạo draft version mới"
                        className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 rounded-xl font-semibold text-xs cursor-not-allowed border border-dashed"
                      >
                        Tạo version mới (Phase sau)
                      </button>
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
    </div>
  );
}
