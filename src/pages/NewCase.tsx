import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { casesApi } from '../lib/casesApi';
import { AiAssistantWidget } from '../components/cases/AiAssistantWidget';
import { ApiError } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { canCreate } from '../lib/rbac';
import {
  CASE_TYPE_CODES, CASE_TYPE_LABELS,
  CASE_FIELD_CODES, CASE_FIELD_LABELS,
  NEIGHBORHOOD_CODES,
  type CaseTypeCode, type CaseFieldCode, type NeighborhoodCode,
} from '../lib/constants';

export default function NewCase() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // RBAC guard
  if (!canCreate(user?.role ?? 'VIEWER')) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Không có quyền truy cập</h2>
        <p className="text-muted-foreground">Tài khoản của bạn không có quyền tạo hồ sơ mới.</p>
        <Link to="/cases"><Button variant="outline">Quay lại danh sách</Button></Link>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    senderName: '',
    contact: '',
    type: 'TVPL' as CaseTypeCode,
    field: 'DAN_SU' as CaseFieldCode,
    neighborhood: 'KP3' as NeighborhoodCode,
    summary: '',
    request: '',
    deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    summary?: string;
    suggestedType?: string;
    suggestedField?: string;
    confidenceScore?: number;
    legalRationale?: string;
  } | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'ACCEPTED' | 'REJECTED' | null>(null);

  const handleAiAnalyze = async () => {
    if (!formData.summary.trim()) {
      alert('Vui lòng nhập nội dung đơn thư trước khi phân tích AI.');
      return;
    }
    setIsAnalyzing(true);
    setAiResult(null);
    setFeedbackStatus(null);
    try {
      const [sumRes, clsRes] = await Promise.all([
        casesApi.aiSummarize(formData.summary),
        casesApi.aiClassify(formData.summary),
      ]);
      setAiResult({
        summary: sumRes.content,
        suggestedType: clsRes.suggestedType,
        suggestedField: clsRes.suggestedField,
        confidenceScore: clsRes.confidenceScore,
        legalRationale: clsRes.legalRationale,
      });
    } catch (err) {
      alert('Không thể phân tích AI. Vui lòng thử lại sau.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptAi = () => {
    if (!aiResult) return;
    setFormData(prev => ({
      ...prev,
      summary: aiResult.summary || prev.summary,
      type: (aiResult.suggestedType as CaseTypeCode) || prev.type,
      field: (aiResult.suggestedField as CaseFieldCode) || prev.field,
    }));
    setFeedbackStatus('ACCEPTED');
  };

  const handleRejectAi = () => {
    setFeedbackStatus('REJECTED');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const newCase = await casesApi.createCase({
        senderName: formData.senderName,
        contact: formData.contact || undefined,
        type: formData.type,
        field: formData.field,
        neighborhood: formData.neighborhood,
        summary: formData.summary,
        request: formData.request || formData.summary,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        documents: [],
      });
      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 403 ? 'Bạn không có quyền tạo hồ sơ.' : err.message);
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/cases">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Tạo hồ sơ mới</h2>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Họ tên người gửi <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.senderName}
                onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Thông tin liên hệ
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Số điện thoại / Email / Địa chỉ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Loại đơn</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as CaseTypeCode })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CASE_TYPE_CODES.map(code => (
                  <option key={code} value={code}>{CASE_TYPE_LABELS[code]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Lĩnh vực</label>
              <select
                value={formData.field}
                onChange={e => setFormData({ ...formData, field: e.target.value as CaseFieldCode })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CASE_FIELD_CODES.map(code => (
                  <option key={code} value={code}>{CASE_FIELD_LABELS[code]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Khu phố <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={formData.neighborhood}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value as NeighborhoodCode })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {NEIGHBORHOOD_CODES.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Ngày đến hạn xử lý</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Tóm tắt nội dung vụ việc <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Mô tả ngắn gọn nội dung yêu cầu của khách hàng..."
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Nhập chi tiết đơn hoặc yêu cầu của công dân để trợ lý AI phân tích.</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAiAnalyze}
                disabled={isAnalyzing || !formData.summary.trim()}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-medium"
              >
                {isAnalyzing ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin text-amber-600" /> Đang phân tích AI...</>
                ) : (
                  <><Sparkles className="mr-1.5 h-4 w-4 text-amber-600 animate-pulse" /> ✨ AI Phân tích Đơn</>
                )}
              </Button>
            </div>

            {aiResult && (
              <AiAssistantWidget
                summary={aiResult.summary}
                suggestedType={aiResult.suggestedType}
                suggestedField={aiResult.suggestedField}
                confidenceScore={aiResult.confidenceScore}
                legalRationale={aiResult.legalRationale}
                onAccept={handleAcceptAi}
                onReject={handleRejectAi}
                feedbackStatus={feedbackStatus}
              />
            )}
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t">
            <Link to="/cases">
              <Button type="button" variant="outline" disabled={isLoading}>Hủy bỏ</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Lưu hồ sơ</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
