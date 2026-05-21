import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FileText, Copy, Check, Download, Loader2, AlertCircle } from 'lucide-react';
import { exportToDocx } from '../utils/exportDocx';
import { casesApi } from '../lib/casesApi';
import { ApiError } from '../lib/apiClient';
import {
  CASE_TYPE_LABELS,
  CASE_FIELD_LABELS,
  NEIGHBORHOOD_LABELS,
  CASE_STATUS_LABELS,
  type CaseTypeCode,
  type CaseFieldCode,
  type NeighborhoodCode,
  type CaseStatusCode,
} from '../lib/constants';
import type { ApiCase } from '../lib/api-types';

const DRAFT_TEMPLATES = [
  { id: 'receipt', name: 'Phiếu tiếp nhận hồ sơ' },
  { id: 'request_more', name: 'Yêu cầu bổ sung tài liệu' },
  { id: 'summary', name: 'Bản tóm tắt vụ việc' },
];

export default function Drafts() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('receipt');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loadingCases, setLoadingCases] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchCases() {
      setLoadingCases(true);
      setError('');
      try {
        const res = await casesApi.getCases({ limit: 100 });
        setCases(res.data || []);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Lỗi kết nối hoặc tải danh sách hồ sơ.');
      } finally {
        setLoadingCases(false);
      }
    }
    fetchCases();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCaseId) {
      alert('Vui lòng chọn một hồ sơ để tạo dự thảo.');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const selectedCase = await casesApi.getCase(selectedCaseId);
      if (!selectedCase) {
        throw new Error('Không tìm thấy dữ liệu chi tiết của hồ sơ này.');
      }

      let content = '';
      const today = format(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });
      
      const checklist = selectedCase.checklist || [];
      const typeLabel = CASE_TYPE_LABELS[selectedCase.type as CaseTypeCode] || selectedCase.type;
      const fieldLabel = CASE_FIELD_LABELS[selectedCase.field as CaseFieldCode] || selectedCase.field;
      const neighborhoodLabel = NEIGHBORHOOD_LABELS[selectedCase.neighborhood as NeighborhoodCode] || selectedCase.neighborhood;
      const statusLabel = CASE_STATUS_LABELS[selectedCase.status as CaseStatusCode] || selectedCase.status;
      const assigneeLabel = selectedCase.assignedTo?.fullName || 'Chưa phân công';
      const contactInfo = selectedCase.contact || 'Chưa cung cấp';

      if (selectedTemplate === 'receipt') {
        content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

PHIẾU TIẾP NHẬN HỒ SƠ
Mã hồ sơ: ${selectedCase.caseCode}

Hôm nay, ${today}, chúng tôi tiến hành tiếp nhận hồ sơ của:
Ông/Bà: ${selectedCase.senderName}
Thông tin liên hệ: ${contactInfo}

Lĩnh vực: ${fieldLabel}
Khu phố: ${neighborhoodLabel}
Nội dung tóm tắt: ${selectedCase.summary}

Tài liệu đã nhận:
${checklist.filter(i => i.isCompleted).map(i => `- ${i.title}`).join('\n') || '- (Không có tài liệu nào)'}

Tài liệu cần bổ sung (nếu có):
${checklist.filter(i => !i.isCompleted).map(i => `- ${i.title}`).join('\n') || '- (Đã đủ tài liệu mặc định)'}

Người tiếp nhận
(Ký và ghi rõ họ tên)


${assigneeLabel}`;
      } else if (selectedTemplate === 'request_more') {
        const receivedDateFormatted = selectedCase.receivedDate
          ? format(new Date(selectedCase.receivedDate), 'dd/MM/yyyy')
          : '.../.../......';

        content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

THÔNG BÁO YÊU CẦU BỔ SUNG TÀI LIỆU
V/v: Bổ sung hồ sơ mã ${selectedCase.caseCode}

Kính gửi Ông/Bà: ${selectedCase.senderName}

Căn cứ vào hồ sơ yêu cầu ${typeLabel.toLowerCase()} lĩnh vực ${fieldLabel.toLowerCase()} mà Ông/Bà đã gửi ngày ${receivedDateFormatted}.

Để có đủ cơ sở giải quyết vụ việc, chúng tôi kính đề nghị Ông/Bà bổ sung các tài liệu sau:
${checklist.filter(i => !i.isCompleted).map(i => `[ ] ${i.title}`).join('\n') || '- (Không có tài liệu nào thiếu)'}

Vui lòng cung cấp các tài liệu trên trước ngày .../.../...... để quá trình xử lý không bị gián đoạn.

Trân trọng thông báo!
Người phụ trách
${assigneeLabel}`;
      } else {
        content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

BẢN TÓM TẮT VỤ VIỆC
Mã hồ sơ: ${selectedCase.caseCode}

Kính gửi: Bộ phận chuyên môn / Giám đốc
Lĩnh vực: ${fieldLabel}
Khu phố: ${neighborhoodLabel}
Người gửi: ${selectedCase.senderName}
Liên hệ: ${contactInfo}

1. NỘI DUNG TÓM TẮT
${selectedCase.summary}

2. TÌNH TRẠNG HỒ SƠ
- Trạng thái hiện tại: ${statusLabel}
- Hồ sơ đã nhận: ${checklist.filter(i => i.isCompleted).length} tài liệu
- Tài liệu còn thiếu: ${checklist.filter(i => !i.isCompleted).length} tài liệu

3. ĐỀ XUẤT HƯỚNG XỬ LÝ (Dự kiến)
[Nhập đề xuất xử lý tại đây...]

Người lập tóm tắt
${assigneeLabel}`;
      }

      const disclaimer = `\n\n--------------------------------------------------\nLƯU Ý: Bản dự thảo, cần chuyên viên pháp lý kiểm tra trước khi sử dụng.`;

      setGeneratedText(content + disclaimer);
      setCopied(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lỗi khi lấy thông tin chi tiết hồ sơ hoặc tạo dự thảo.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedText || !selectedCaseId) return;
    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (!selectedCase) return;
    
    // We pass the generated text excluding the disclaimer string, as the export util adds a nicely formatted one
    const textWithoutDisclaimer = generatedText.split('\n\n--------------------------------------------------')[0];
    
    const templateName = DRAFT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Dự thảo';
    const fileName = `${templateName}_${selectedCase.caseCode}`.replace(/ /g, '_');
    
    exportToDocx(templateName, textWithoutDisclaimer, fileName);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-hover bg-clip-text">
          Tạo dự thảo văn bản
        </h2>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Đã xảy ra lỗi</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                1. Chọn hồ sơ
              </label>
              {loadingCases ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 border border-dashed rounded-lg bg-secondary/20">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Đang tải danh sách hồ sơ...
                </div>
              ) : (
                <select
                  value={selectedCaseId}
                  onChange={(e) => {
                    setSelectedCaseId(e.target.value);
                    setError('');
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                >
                  <option value="">-- Chọn hồ sơ --</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseCode} - {c.senderName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                2. Chọn loại biểu mẫu
              </label>
              <div className="space-y-2">
                {DRAFT_TEMPLATES.map((template) => (
                  <label
                    key={template.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? 'bg-primary/10 border-primary shadow-sm font-semibold'
                        : 'hover:bg-secondary/50 border-transparent hover:border-input'
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm">{template.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-4 flex items-center justify-center gap-2 shadow-sm py-2"
              onClick={handleGenerate}
              disabled={generating || loadingCases || !selectedCaseId}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tạo dự thảo...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" /> Tạo dự thảo
                </>
              )}
            </Button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm border border-blue-200 dark:border-blue-800/50 shadow-sm leading-relaxed">
            <strong className="block mb-1.5 font-semibold text-blue-900 dark:text-blue-200">Mẹo thông minh:</strong>
            Hệ thống tự động đồng bộ chi tiết hồ sơ từ máy chủ để điền thông tin chuyên nghiệp (Checklist, Lĩnh vực, Trạng thái) thành bản dự thảo tiếng Việt chuẩn.
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden flex flex-col h-[600px] transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between border-b p-4 bg-secondary/30 backdrop-blur-sm">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Nội dung văn bản
              </h3>
              <div className="flex items-center gap-2">
                {generatedText && (
                  <>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-9">
                      {copied ? <Check className="mr-2 h-4 w-4 text-green-500 animate-in zoom-in" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copied ? 'Đã sao chép' : 'Sao chép'}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleExport}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm h-9"
                    >
                      <Download className="mr-2 h-4 w-4" /> Xuất Word (.docx)
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 p-0">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-background/50">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
                  <p className="font-medium animate-pulse">Đang nạp chi tiết từ máy chủ và biên dịch mẫu...</p>
                </div>
              ) : generatedText ? (
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none bg-background leading-relaxed select-text"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 opacity-10" />
                  <p className="font-medium">Vui lòng chọn hồ sơ ở cột trái và bấm "Tạo dự thảo"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
