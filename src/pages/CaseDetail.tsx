import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft, CheckSquare, Clock, FileText, Info, Trash2, CalendarClock,
  Loader2, Send, AlertCircle, Sparkles, FileEdit, Download, Printer,
} from 'lucide-react';
import { getDeadlineStatus } from '../utils/deadline';
import { casesApi } from '../lib/casesApi';
import { ApiError } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { canDelete, canEdit } from '../lib/rbac';
import {
  CASE_TYPE_LABELS, CASE_FIELD_LABELS, CASE_STATUS_CODES, CASE_STATUS_LABELS,
  type CaseTypeCode, type CaseFieldCode, type CaseStatusCode, AI_REVIEW_WARNING,
} from '../lib/constants';
import type { ApiCase } from '../lib/api-types';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { LandProfileTab } from '../components/cases/LandProfileTab';
import { AiAssistantWidget } from '../components/cases/AiAssistantWidget';
import { AiDraftPrintModal } from '../components/AiDraftPrintModal';

export default function CaseDetail() {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const role        = user?.role ?? 'VIEWER';

  const [currentCase, setCurrentCase] = useState<ApiCase | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');
  const [actionError, setActionError] = useState('');

  const [activeTab, setActiveTab] = useState<'info' | 'land-profile' | 'documents' | 'checklist' | 'notes' | 'history' | 'ai'>('info');
  const [noteInput, setNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [exportingNoteId, setExportingNoteId] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewingNoteId, setPreviewingNoteId] = useState<string | null>(null);
  const [activeNoteIdForModal, setActiveNoteIdForModal] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await casesApi.getCase(id);
      setCurrentCase(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không thể tải hồ sơ.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  useEffect(() => {
    if (currentCase?.aiSuggestion) {
      setAiSuggestion(currentCase.aiSuggestion);
    }
  }, [currentCase]);

  const handleAnalyzeAiDetail = async () => {
    if (!currentCase || !id) return;
    setIsAnalyzingAi(true);
    try {
      const text = currentCase.summary || currentCase.request;
      const [sumRes, clsRes] = await Promise.all([
        casesApi.aiSummarize(text, id),
        casesApi.aiClassify(text, id),
      ]);
      setAiSuggestion({
        suggestedSummary: sumRes.content,
        suggestedType: clsRes.suggestedType,
        suggestedField: clsRes.suggestedField,
        confidenceScore: clsRes.confidenceScore,
        legalRationale: clsRes.legalRationale,
        isApplied: false,
      });
    } catch (err) {
      alert('Không thể phân tích AI cho hồ sơ này.');
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleFeedbackAi = async (feedback: 'ACCEPTED' | 'REJECTED') => {
    if (!id) return;
    setIsSubmittingFeedback(true);
    try {
      await casesApi.aiSubmitFeedback(id, feedback, feedback === 'ACCEPTED');
      await load();
      alert(feedback === 'ACCEPTED' ? 'Đã áp dụng đề xuất vào hồ sơ.' : 'Đã từ chối đề xuất AI.');
    } catch (err) {
      alert('Ghi nhận phản hồi thất bại.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const [isSuggestingChecklist, setIsSuggestingChecklist] = useState(false);
  const [aiChecklistGroups, setAiChecklistGroups] = useState<any>(null);
  const [selectedChecklistItems, setSelectedChecklistItems] = useState<string[]>([]);
  const [isSubmittingChecklistFeedback, setIsSubmittingChecklistFeedback] = useState(false);

  const handleSuggestChecklist = async () => {
    if (!currentCase || !id) return;
    setIsSuggestingChecklist(true);
    try {
      const res = await casesApi.aiSuggestChecklist({
        caseId: id,
        type: currentCase.type,
        field: currentCase.field,
        summary: currentCase.summary,
        request: currentCase.request,
      });
      if (res.checklistGroups) {
        setAiChecklistGroups(res.checklistGroups);
        setSelectedChecklistItems([]);
      } else if (res.items) {
        setAiChecklistGroups({ tasks: res.items, documents: [], coordination: [], deadlines: [], risks: [], nextSteps: [] });
        setSelectedChecklistItems([]);
      }
    } catch (err) {
      alert('Không thể gợi ý quy trình xử lý cho hồ sơ này.');
    } finally {
      setIsSuggestingChecklist(false);
    }
  };

  const handleToggleSuggestItem = (item: string) => {
    setSelectedChecklistItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleApplyChecklist = async () => {
    if (!id) return;
    if (selectedChecklistItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 mục để áp dụng vào checklist hồ sơ.');
      return;
    }
    setIsSubmittingChecklistFeedback(true);
    try {
      await casesApi.aiSubmitFeedback(id, 'ACCEPTED', true, 'CHECKLIST', selectedChecklistItems);
      await load();
      alert('Đã tạo các đầu việc vào checklist của hồ sơ.');
      setAiChecklistGroups(null);
      setActiveTab('checklist');
    } catch (err) {
      alert('Áp dụng checklist thất bại.');
    } finally {
      setIsSubmittingChecklistFeedback(false);
    }
  };

  const handleRejectChecklist = async () => {
    if (!id) return;
    setIsSubmittingChecklistFeedback(true);
    try {
      await casesApi.aiSubmitFeedback(id, 'REJECTED', false, 'CHECKLIST', []);
      setAiChecklistGroups(null);
      alert('Đã từ chối gợi ý quy trình AI.');
    } catch (err) {
      alert('Ghi nhận phản hồi thất bại.');
    } finally {
      setIsSubmittingChecklistFeedback(false);
    }
  };

  // AI Drafting Phase 4A State & Handlers
  const [selectedDraftType, setSelectedDraftType] = useState<string>('PHIEU_XU_LY');
  const [customDraftInstructions, setCustomDraftInstructions] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<boolean>(false);
  const [generatedDraftTitle, setGeneratedDraftTitle] = useState<string>('');
  const [generatedDraftContent, setGeneratedDraftContent] = useState<string>('');
  const [isSubmittingDraftFeedback, setIsSubmittingDraftFeedback] = useState<boolean>(false);

  const handleSuggestDraft = async () => {
    if (!id) return;
    setIsGeneratingDraft(true);
    try {
      const res = await casesApi.aiSuggestDraft({
        caseId: id,
        draftType: selectedDraftType,
        customInstructions: customDraftInstructions,
      });
      const getTitle = (type: string) => {
        switch (type) {
          case 'PHIEU_XU_LY': return 'Phiếu xử lý đơn';
          case 'GIAY_MOI_LAM_VIEC': return 'Giấy mời làm việc/đối thoại';
          case 'THONG_BAO_THU_LY': return 'Thông báo thụ lý';
          case 'THONG_BAO_KHONG_THU_LY': return 'Thông báo không thụ lý';
          case 'VAN_BAN_CHUYEN_DON': return 'Văn bản chuyển đơn';
          case 'TRA_LOI_CONG_DAN_DU_THAO': return 'Trả lời công dân';
          default: return `Dự thảo: ${type}`;
        }
      };
      setGeneratedDraftTitle(res.draftTitle || getTitle(selectedDraftType));
      setGeneratedDraftContent(res.draftContent || res.content);
    } catch (err) {
      alert('Không thể tạo bản nháp văn bản cho hồ sơ này.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!id || !generatedDraftContent.trim()) return;
    setIsSubmittingDraftFeedback(true);
    try {
      await casesApi.aiSubmitFeedback(
        id,
        'ACCEPTED',
        true,
        'DRAFT',
        [],
        selectedDraftType,
        generatedDraftTitle,
        generatedDraftContent
      );
      await load();
      alert('Đã lưu bản nháp vào ghi chú hồ sơ thành công.');
      setGeneratedDraftContent('');
      setGeneratedDraftTitle('');
      setActiveTab('history');
    } catch (err) {
      alert('Lưu bản nháp thất bại.');
    } finally {
      setIsSubmittingDraftFeedback(false);
    }
  };

  const handleRejectDraft = async () => {
    if (!id) return;
    setIsSubmittingDraftFeedback(true);
    try {
      await casesApi.aiSubmitFeedback(
        id,
        'REJECTED',
        false,
        'DRAFT',
        [],
        selectedDraftType
      );
      setGeneratedDraftContent('');
      setGeneratedDraftTitle('');
      alert('Đã hủy / không sử dụng bản nháp AI.');
    } catch (err) {
      alert('Thao tác thất bại.');
    } finally {
      setIsSubmittingDraftFeedback(false);
    }
  };

  const userCanEdit  = currentCase
    ? canEdit(role, currentCase.createdById, currentCase.assignedToId, user?.id)
    : false;
  const userCanDelete = canDelete(role);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!currentCase || !userCanEdit) return;
    setActionError('');
    const newStatus = e.target.value;
    try {
      await casesApi.changeStatus(currentCase.id, newStatus);
      load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Lỗi đổi trạng thái');
    }
  };

  const handleToggleChecklist = async (itemId: string, isCompleted: boolean) => {
    if (!currentCase || !userCanEdit) return;
    setActionError('');
    try {
      await casesApi.patchChecklist(currentCase.id, itemId, !isCompleted);
      load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Lỗi cập nhật checklist');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCase || !noteInput.trim()) return;
    setIsSavingNote(true);
    setActionError('');
    try {
      await casesApi.addNote(currentCase.id, noteInput.trim());
      setNoteInput('');
      load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Lỗi thêm ghi chú');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleExportDocx = async (noteId: string) => {
    if (!currentCase) return;
    try {
      setExportingNoteId(noteId);
      const { blob, filename } = await casesApi.exportDocx(currentCase.id, noteId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `Ban_Nhap_AI_${currentCase.caseCode || currentCase.id}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Đã xuất Word (.docx) thành công!');
    } catch (err: any) {
      alert(err instanceof ApiError ? err.message : 'Không thể xuất file Word');
    } finally {
      setExportingNoteId(null);
    }
  };

  const handlePreviewPdf = async (noteId: string) => {
    if (!currentCase) return;
    try {
      setPreviewingNoteId(noteId);
      setActiveNoteIdForModal(noteId);
      const data = await casesApi.getDraftPreviewData(currentCase.id, noteId);
      setPreviewData(data);
      setPreviewModalOpen(true);
    } catch (err: any) {
      alert(err instanceof ApiError ? err.message : 'Không thể xem trước bản nháp PDF');
    } finally {
      setPreviewingNoteId(null);
    }
  };

  const handleDelete = async () => {
    if (!currentCase) return;
    setActionError('');
    if (!window.confirm(`Xóa hồ sơ ${currentCase.caseCode}? (Soft delete – dữ liệu vẫn còn trong database)`)) return;
    try {
      await casesApi.deleteCase(currentCase.id);
      navigate('/cases');
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Lỗi xóa hồ sơ');
    }
  };

  // ---- Loading / Error states ----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !currentCase) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">{error || 'Không tìm thấy hồ sơ'}</h2>
        <Button variant="link" onClick={() => navigate('/cases')}>Quay lại danh sách</Button>
      </div>
    );
  }

  const dlStatus = getDeadlineStatus(currentCase);
  const checklist = currentCase.checklist ?? [];
  const notes     = currentCase.notes ?? [];
  const histories = currentCase.histories ?? [];

  const ACTION_LABELS: Record<string, string> = {
    CREATE_CASE: 'Tạo hồ sơ',
    UPDATE_CASE: 'Cập nhật hồ sơ',
    CHANGE_STATUS: 'Đổi trạng thái',
    ADD_NOTE: 'Thêm ghi chú',
    UPDATE_CHECKLIST: 'Cập nhật checklist',
    SOFT_DELETE_CASE: 'Xóa hồ sơ',
  };

  const renderChecklistGroup = (title: string, icon: string, badgeColor: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="border rounded-lg p-4 bg-card shadow-sm space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <span>{icon}</span> {title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
              {items.length} mục
            </span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const isChecked = selectedChecklistItems.includes(item);
              return (
                <label key={idx} className="flex items-start gap-2.5 p-2 rounded hover:bg-secondary/60 cursor-pointer text-sm transition-colors border border-transparent hover:border-border">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSuggestItem(item)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
                  />
                  <span className={isChecked ? 'font-medium text-foreground leading-snug' : 'text-muted-foreground leading-snug'}>{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/cases">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{currentCase.caseCode}</h2>
            <p className="text-muted-foreground text-sm">
              Tiếp nhận: {format(new Date(currentCase.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userCanEdit ? (
            <select
              value={currentCase.status}
              onChange={handleStatusChange}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {CASE_STATUS_CODES.map(code => (
                <option key={code} value={code}>{CASE_STATUS_LABELS[code]}</option>
              ))}
            </select>
          ) : (
            <StatusBadge status={currentCase.status} />
          )}

          {userCanDelete && (
            <Button variant="destructive" size="icon" onClick={handleDelete} title="Xóa mềm hồ sơ">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab nav */}
        <div className="md:col-span-1 space-y-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            {([
              { key: 'info',      label: 'Thông tin chung',    Icon: Info },
              ...(currentCase?.field === 'DAT_DAI' ? [{ key: 'land-profile', label: 'Thông tin đất đai', Icon: FileText }] : []),
              { key: 'documents', label: `Tài liệu (${currentCase?.documents?.length || 0})`, Icon: FileText },
              { key: 'checklist', label: `Checklist (${checklist.filter(i=>i.isCompleted).length}/${checklist.length})`, Icon: CheckSquare },
              { key: 'notes',     label: `Ghi chú (${notes.length})`, Icon: FileText },
              { key: 'history',   label: `Lịch sử (${histories.length})`, Icon: Clock },
              { key: 'ai',        label: '✨ Trợ lý AI',             Icon: Sparkles },
            ] as Array<{ key: 'info' | 'land-profile' | 'documents' | 'checklist' | 'notes' | 'history' | 'ai'; label: string; Icon: any }>).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-3 p-4 text-left transition-colors border-l-4 ${
                  activeTab === key
                    ? 'bg-secondary/80 font-medium border-l-primary'
                    : 'hover:bg-secondary/40 border-l-transparent'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="md:col-span-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm min-h-[400px]">

            {/* INFO */}
            {activeTab === 'info' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold">Thông tin chung</h3>
                  <StatusBadge status={currentCase.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <Field label="Người gửi" value={currentCase.senderName} />
                  <Field label="Thông tin liên hệ" value={currentCase.contact ?? '–'} />
                  <Field label="Loại đơn" value={CASE_TYPE_LABELS[currentCase.type as CaseTypeCode] ?? currentCase.type} />
                  <Field label="Lĩnh vực" value={CASE_FIELD_LABELS[currentCase.field as CaseFieldCode] ?? currentCase.field} />
                  <Field label="Khu phố" value={currentCase.neighborhood} />
                  <Field label="Người phụ trách" value={currentCase.assignedTo?.fullName ?? '–'} />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Thời hạn xử lý</h4>
                    {currentCase.deadline ? (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{format(new Date(currentCase.deadline), 'dd/MM/yyyy', { locale: vi })}</p>
                        {dlStatus === 'overdue' && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                            <CalendarClock className="w-3 h-3" /> Quá hạn
                          </span>
                        )}
                        {dlStatus === 'soon' && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                            <CalendarClock className="w-3 h-3" /> Sắp đến hạn
                          </span>
                        )}
                      </div>
                    ) : <p className="text-muted-foreground">Không có hạn</p>}
                  </div>
                  <Field label="Mã hồ sơ" value={currentCase.caseCode} />
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Tóm tắt nội dung</h4>
                  <p className="text-base leading-relaxed whitespace-pre-wrap bg-secondary/30 p-4 rounded-lg">{currentCase.summary}</p>
                </div>
              </div>
            )}

            {/* LAND PROFILE */}
            {activeTab === 'land-profile' && currentCase.field === 'DAT_DAI' && (
              <LandProfileTab
                caseId={currentCase.id}
                userCanEdit={userCanEdit}
              />
            )}

            {/* DOCUMENTS */}
            {activeTab === 'documents' && (
              <div className="p-6">
                <DocumentUpload
                  caseId={currentCase.id}
                  documents={currentCase.documents || []}
                  userCanEdit={userCanEdit}
                  onUploadSuccess={load}
                />
              </div>
            )}

            {/* CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold">
                    Tài liệu cần thiết ({CASE_FIELD_LABELS[currentCase.field as CaseFieldCode] ?? currentCase.field})
                  </h3>
                  <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {checklist.filter(i => i.isCompleted).length} / {checklist.length} hoàn thành
                  </span>
                </div>
                <div className="space-y-3">
                  {checklist.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        userCanEdit ? 'hover:bg-secondary/20 cursor-pointer' : 'opacity-75'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => userCanEdit && handleToggleChecklist(item.id, item.isCompleted)}
                        disabled={!userCanEdit}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <span className={`text-base ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </span>
                        {item.isCompleted && item.completedAt && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Hoàn thành: {format(new Date(item.completedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                  {checklist.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Không có checklist.</p>
                  )}
                </div>
              </div>
            )}

            {/* NOTES */}
            {activeTab === 'notes' && (
              <div className="p-6 space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold">Ghi chú nội bộ</h3>
                </div>

                {/* Note list */}
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {notes.map(note => {
                    const isAiDraft = note.content && note.content.startsWith('[AI Dự thảo -');
                    const isExporting = exportingNoteId === note.id;
                    return (
                      <div key={note.id} className="bg-secondary/30 rounded-lg p-3 border">
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">
                            {note.user?.fullName ?? 'Người dùng'} – {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                          </p>
                          {isAiDraft && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs flex items-center gap-1 text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm"
                                onClick={() => handlePreviewPdf(note.id)}
                                disabled={previewingNoteId === note.id || isExporting}
                              >
                                {previewingNoteId === note.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Printer className="h-3 w-3 text-amber-600" />}
                                <span>🖨️ Xem & In PDF</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs flex items-center gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm"
                                onClick={() => handleExportDocx(note.id)}
                                disabled={isExporting || previewingNoteId === note.id}
                              >
                                {isExporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                <span>📄 Tải Word (.docx)</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {notes.length === 0 && (
                    <p className="text-muted-foreground text-sm py-4 text-center">Chưa có ghi chú nào.</p>
                  )}
                </div>

                {/* Add note form */}
                {userCanEdit && (
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <textarea
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder="Thêm ghi chú nội bộ..."
                      rows={2}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                    <Button type="submit" size="icon" disabled={isSavingNote || !noteInput.trim()}>
                      {isSavingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* HISTORY */}
            {activeTab === 'history' && (
              <div className="p-6 space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold">Lịch sử xử lý</h3>
                </div>
                <div className="space-y-6 pl-4 border-l-2 border-secondary ml-2">
                  {histories.map(h => {
                    let details: Record<string, unknown> = {};
                    try { details = JSON.parse(h.details); } catch { /* ignore */ }
                    return (
                      <div key={h.id} className="relative pl-6">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                          <span className="font-semibold text-base">{ACTION_LABELS[h.action] ?? h.action}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(h.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 mb-1">Bởi: {h.user?.fullName ?? 'Hệ thống'}</p>
                        {(details as Record<string, string>).from && (details as Record<string, string>).to && (
                          <p className="text-sm bg-secondary/40 p-2 rounded mt-2 border">
                            {CASE_STATUS_LABELS[(details as Record<string, string>).from as CaseStatusCode] ?? (details as Record<string, string>).from}
                            {' → '}
                            {CASE_STATUS_LABELS[(details as Record<string, string>).to as CaseStatusCode] ?? (details as Record<string, string>).to}
                          </p>
                        )}
                        {typeof (details as Record<string, string>).content === 'string' && (
                          <p className="text-sm bg-secondary/40 p-2 rounded mt-2 border italic">
                            "{(details as Record<string, string>).content}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {histories.length === 0 && (
                    <p className="text-muted-foreground text-sm">Chưa có lịch sử.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                        Trợ lý AI LegalFlow (Phase 2)
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phân tích nội dung đơn thư, gợi ý phân loại và tóm tắt hồ sơ.
                      </p>
                    </div>
                    <Button
                      onClick={handleAnalyzeAiDetail}
                      disabled={isAnalyzingAi}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {isAnalyzingAi ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang phân tích...</>
                      ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> ✨ AI Phân tích Lại</>
                      )}
                    </Button>
                  </div>

                  {aiSuggestion ? (
                    <AiAssistantWidget
                      summary={aiSuggestion.suggestedSummary}
                      suggestedType={aiSuggestion.suggestedType}
                      suggestedField={aiSuggestion.suggestedField}
                      confidenceScore={aiSuggestion.confidenceScore}
                      legalRationale={aiSuggestion.legalRationale}
                      onAccept={() => handleFeedbackAi('ACCEPTED')}
                      onReject={() => handleFeedbackAi('REJECTED')}
                      isSubmittingFeedback={isSubmittingFeedback}
                      feedbackStatus={aiSuggestion.isApplied ? 'ACCEPTED' : null}
                    />
                  ) : (
                    <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed p-6">
                      <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-3 animate-bounce" />
                      <h4 className="font-medium text-base mb-1">Chưa có kết quả phân tích AI</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                        Nhấn nút bên dưới để Trợ lý AI đọc tóm tắt đơn thư và đưa ra gợi ý phân loại chuẩn xác.
                      </p>
                      <Button
                        onClick={handleAnalyzeAiDetail}
                        disabled={isAnalyzingAi}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {isAnalyzingAi ? 'Đang xử lý...' : '✨ Phân tích ngay'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Phase 3 Checklist block */}
                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-indigo-600" />
                        📋 Đề xuất Quy trình & Checklist xử lý đơn
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Gợi ý lộ trình xác minh, tài liệu và mốc thời gian giải quyết theo luật định.
                      </p>
                    </div>
                    <Button
                      onClick={handleSuggestChecklist}
                      disabled={isSuggestingChecklist}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isSuggestingChecklist ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo quy trình...</>
                      ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> ✨ AI Gợi ý Quy trình Xử lý</>
                      )}
                    </Button>
                  </div>

                  {aiChecklistGroups ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                          <p className="font-semibold mb-1">{AI_REVIEW_WARNING}</p>
                          <p>Hãy tick chọn từng mục muốn áp dụng vào checklist của hồ sơ. Hệ thống không tự động giao việc cho cán bộ, không gửi văn bản cho công dân và không làm thay đổi trạng thái hồ sơ.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderChecklistGroup('Việc cần làm', '📋', 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', aiChecklistGroups.tasks)}
                        {renderChecklistGroup('Tài liệu cần kiểm tra', '📁', 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', aiChecklistGroups.documents)}
                        {renderChecklistGroup('Bộ phận/cán bộ phối hợp', '🤝', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', aiChecklistGroups.coordination)}
                        {renderChecklistGroup('Thời hạn lưu ý', '⏰', 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', aiChecklistGroups.deadlines)}
                        {renderChecklistGroup('Rủi ro nghiệp vụ/pháp lý', '⚠️', 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300', aiChecklistGroups.risks)}
                        {renderChecklistGroup('Đề xuất bước tiếp theo', '🚀', 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300', aiChecklistGroups.nextSteps)}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm font-medium text-muted-foreground">
                          Đã chọn: <strong className="text-foreground">{selectedChecklistItems.length}</strong> mục
                        </span>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            onClick={handleRejectChecklist}
                            disabled={isSubmittingChecklistFeedback}
                            className="border-destructive text-destructive hover:bg-destructive/10"
                          >
                            ❌ Không áp dụng
                          </Button>
                          <Button
                            onClick={handleApplyChecklist}
                            disabled={isSubmittingChecklistFeedback || selectedChecklistItems.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            {isSubmittingChecklistFeedback ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
                            ) : (
                              `✔️ Áp dụng checklist vào hồ sơ (${selectedChecklistItems.length})`
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed p-6">
                      <CheckSquare className="h-10 w-10 text-indigo-500 mx-auto mb-3 opacity-80" />
                      <h4 className="font-medium text-base mb-1">Chưa có đề xuất quy trình xử lý</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                        Nhấn nút phía trên để Trợ lý AI tự động phân tích đơn thư và đề xuất bộ checklist thụ lý theo 6 nhóm nghiệp vụ chuẩn.
                      </p>
                      <Button
                        onClick={handleSuggestChecklist}
                        disabled={isSuggestingChecklist}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {isSuggestingChecklist ? 'Đang phân tích...' : '✨ Gợi ý ngay'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Phase 4A AI Drafting Widget */}
                <div className="bg-card border rounded-xl p-6 shadow-sm mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <FileEdit className="h-5 w-5" />
                        📝 Soạn thảo văn bản nháp thông minh
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI hỗ trợ tạo bản nháp nội bộ cho các bước giải quyết đơn thư (Phase 4A).
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg p-3.5 mt-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-semibold">{AI_REVIEW_WARNING}. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG.</span>
                      <br />Hệ thống tuyệt đối không tự đổi trạng thái hồ sơ hay gửi văn bản cho công dân. Bản nháp được duyệt sẽ lưu vào Ghi chú hồ sơ.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Loại văn bản nháp</label>
                      <select
                        value={selectedDraftType}
                        onChange={(e) => setSelectedDraftType(e.target.value)}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="PHIEU_XU_LY">Phiếu xử lý đơn</option>
                        <option value="GIAY_MOI_LAM_VIEC">Giấy mời làm việc / đối thoại</option>
                        <option value="THONG_BAO_THU_LY">Thông báo thụ lý</option>
                        <option value="THONG_BAO_KHONG_THU_LY">Thông báo không thụ lý</option>
                        <option value="VAN_BAN_CHUYEN_DON">Văn bản chuyển đơn</option>
                        <option value="TRA_LOI_CONG_DAN_DU_THAO">Trả lời công dân (dự thảo)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Hướng dẫn bổ sung cho AI (không bắt buộc)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ví dụ: Mời làm việc 8h sáng thứ Sáu, mang theo sổ đỏ..."
                          value={customDraftInstructions}
                          onChange={(e) => setCustomDraftInstructions(e.target.value)}
                          className="flex-1 h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <Button
                          onClick={handleSuggestDraft}
                          disabled={isGeneratingDraft}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 h-10 px-4"
                        >
                          {isGeneratingDraft ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang soạn...</>
                          ) : (
                            '✨ Tạo bản nháp AI'
                          )}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          'Soạn ngắn gọn, trang trọng',
                          'Nhấn mạnh cần bổ sung hồ sơ',
                          'Giữ nguyên vai trò bản nháp nội bộ',
                          'Nêu rõ nội dung cần cán bộ kiểm tra',
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => setCustomDraftInstructions(prev => prev ? `${prev}. ${suggestion}` : suggestion)}
                            className="text-[11px] bg-secondary/60 hover:bg-secondary text-secondary-foreground px-2 py-1 rounded border transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {generatedDraftContent && (
                    <div className="mt-6 border rounded-lg p-4 bg-secondary/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-foreground">{generatedDraftTitle || 'Dự thảo văn bản'}</span>
                        <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded font-medium">
                          Chưa phát hành
                        </span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 p-3 mb-3 rounded-r text-xs font-medium flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{AI_REVIEW_WARNING}. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG.</span>
                      </div>
                      <textarea
                        value={generatedDraftContent}
                        onChange={(e) => setGeneratedDraftContent(e.target.value)}
                        rows={16}
                        className="w-full min-h-[320px] font-mono text-sm p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y leading-relaxed"
                      />
                      <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          onClick={handleRejectDraft}
                          disabled={isSubmittingDraftFeedback}
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          ❌ Không sử dụng bản nháp
                        </Button>
                        <Button
                          onClick={handleSaveDraft}
                          disabled={isSubmittingDraftFeedback || !generatedDraftContent.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {isSubmittingDraftFeedback ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
                          ) : (
                            '💾 Lưu vào ghi chú hồ sơ'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AiDraftPrintModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewData={previewData}
        onDownloadWord={() => {
          if (activeNoteIdForModal) {
            handleExportDocx(activeNoteIdForModal);
          }
        }}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-1">{label}</h4>
      <p className="font-medium text-base">{value}</p>
    </div>
  );
}
