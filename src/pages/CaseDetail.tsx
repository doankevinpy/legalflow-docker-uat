import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft, CheckSquare, Clock, FileText, Info, Trash2, CalendarClock,
  Loader2, Send, AlertCircle,
} from 'lucide-react';
import { getDeadlineStatus } from '../utils/deadline';
import { casesApi } from '../lib/casesApi';
import { ApiError } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { canDelete, canEdit } from '../lib/rbac';
import {
  CASE_TYPE_LABELS, CASE_FIELD_LABELS, CASE_STATUS_CODES, CASE_STATUS_LABELS,
  type CaseTypeCode, type CaseFieldCode, type CaseStatusCode,
} from '../lib/constants';
import type { ApiCase } from '../lib/api-types';
import { DocumentUpload } from '../components/documents/DocumentUpload';

export default function CaseDetail() {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const role        = user?.role ?? 'VIEWER';

  const [currentCase, setCurrentCase] = useState<ApiCase | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');
  const [actionError, setActionError] = useState('');

  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'checklist' | 'notes' | 'history'>('info');
  const [noteInput, setNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

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
              { key: 'documents', label: `Tài liệu (${currentCase?.documents?.length || 0})`, Icon: FileText },
              { key: 'checklist', label: `Checklist (${checklist.filter(i=>i.isCompleted).length}/${checklist.length})`, Icon: CheckSquare },
              { key: 'notes',     label: `Ghi chú (${notes.length})`, Icon: FileText },
              { key: 'history',   label: `Lịch sử (${histories.length})`, Icon: Clock },
            ] as const).map(({ key, label, Icon }) => (
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
                  {notes.map(note => (
                    <div key={note.id} className="bg-secondary/30 rounded-lg p-3 border">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {note.user?.fullName ?? 'Người dùng'} – {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>
                    </div>
                  ))}
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
          </div>
        </div>
      </div>
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
