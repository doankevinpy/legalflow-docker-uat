import { useState } from 'react';
import { useCases } from '../hooks/useCases';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FileText, Copy, Check, Download } from 'lucide-react';
import { exportToDocx } from '../utils/exportDocx';

const DRAFT_TEMPLATES = [
  { id: 'receipt', name: 'Phiếu tiếp nhận hồ sơ' },
  { id: 'request_more', name: 'Yêu cầu bổ sung tài liệu' },
  { id: 'summary', name: 'Bản tóm tắt vụ việc' },
];

export default function Drafts() {
  const { cases, updateCase } = useCases();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('receipt');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!selectedCaseId) {
      alert('Vui lòng chọn một hồ sơ để tạo dự thảo.');
      return;
    }

    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (!selectedCase) return;

    let content = '';
    const today = format(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });

    if (selectedTemplate === 'receipt') {
      content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

PHIẾU TIẾP NHẬN HỒ SƠ
Mã hồ sơ: ${selectedCase.caseId}

Hôm nay, ${today}, chúng tôi tiến hành tiếp nhận hồ sơ của:
Ông/Bà: ${selectedCase.senderName}
Thông tin liên hệ: ${selectedCase.contactInfo}

Lĩnh vực: ${selectedCase.field}
Nội dung tóm tắt: ${selectedCase.summary}

Tài liệu đã nhận:
${selectedCase.checklist.filter(i => i.checked).map(i => `- ${i.label}`).join('\n') || '- (Không có tài liệu nào)'}

Tài liệu cần bổ sung (nếu có):
${selectedCase.checklist.filter(i => !i.checked).map(i => `- ${i.label}`).join('\n') || '- (Đã đủ tài liệu mặc định)'}

Người tiếp nhận
(Ký và ghi rõ họ tên)


${selectedCase.assignee}`;
    } else if (selectedTemplate === 'request_more') {
      content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

THÔNG BÁO YÊU CẦU BỔ SUNG TÀI LIỆU
V/v: Bổ sung hồ sơ mã ${selectedCase.caseId}

Kính gửi Ông/Bà: ${selectedCase.senderName}

Căn cứ vào hồ sơ yêu cầu ${selectedCase.type.toLowerCase()} lĩnh vực ${selectedCase.field.toLowerCase()} mà Ông/Bà đã gửi ngày ${format(new Date(selectedCase.receivedDate), 'dd/MM/yyyy')}.

Để có đủ cơ sở giải quyết vụ việc, chúng tôi kính đề nghị Ông/Bà bổ sung các tài liệu sau:
${selectedCase.checklist.filter(i => !i.checked).map(i => `[ ] ${i.label}`).join('\n')}

Vui lòng cung cấp các tài liệu trên trước ngày .../.../...... để quá trình xử lý không bị gián đoạn.

Trân trọng thông báo!
Người phụ trách
${selectedCase.assignee}`;
    } else {
      content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

BẢN TÓM TẮT VỤ VIỆC
Mã hồ sơ: ${selectedCase.caseId}

Kính gửi: Bộ phận chuyên môn / Giám đốc
Lĩnh vực: ${selectedCase.field}
Người gửi: ${selectedCase.senderName}
Liên hệ: ${selectedCase.contactInfo}

1. NỘI DUNG TÓM TẮT
${selectedCase.summary}

2. TÌNH TRẠNG HỒ SƠ
- Trạng thái hiện tại: ${selectedCase.status}
- Hồ sơ đã nhận: ${selectedCase.checklist.filter(i => i.checked).length} tài liệu
- Tài liệu còn thiếu: ${selectedCase.checklist.filter(i => !i.checked).length} tài liệu

3. ĐỀ XUẤT HƯỚNG XỬ LÝ (Dự kiến)
[Nhập đề xuất xử lý tại đây...]

Người lập tóm tắt
${selectedCase.assignee}`;
    }

    const disclaimer = `\n\n--------------------------------------------------\nLƯU Ý: Bản dự thảo, cần chuyên viên pháp lý kiểm tra trước khi sử dụng.`;

    setGeneratedText(content + disclaimer);
    setCopied(false);

    const templateName = DRAFT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Dự thảo';
    updateCase({
      ...selectedCase,
      logs: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: `Tạo dự thảo: ${templateName}`,
          user: 'Nhân viên (Local)'
        },
        ...selectedCase.logs,
      ]
    });
  };

  const handleExport = () => {
    if (!generatedText || !selectedCaseId) return;
    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (!selectedCase) return;
    
    // We pass the generated text excluding the disclaimer string, as the export util adds a nicely formatted one
    const textWithoutDisclaimer = generatedText.split('\n\n--------------------------------------------------')[0];
    
    const templateName = DRAFT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Du_thao';
    const fileName = `${templateName}_${selectedCase.caseId}`.replace(/ /g, '_');
    
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
        <h2 className="text-2xl font-bold tracking-tight">Tạo dự thảo văn bản</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Chọn hồ sơ</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Chọn hồ sơ --</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseId} - {c.senderName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">2. Chọn loại biểu mẫu</label>
              <div className="space-y-2">
                {DRAFT_TEMPLATES.map(template => (
                  <label key={template.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedTemplate === template.id ? 'bg-primary/10 border-primary' : 'hover:bg-secondary/50'}`}>
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{template.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full mt-4" onClick={handleGenerate}>
              <FileText className="mr-2 h-4 w-4" /> Tạo dự thảo
            </Button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm border border-blue-200 dark:border-blue-800">
            <strong className="block mb-1">Mẹo:</strong>
            Hệ thống sẽ tự động trích xuất thông tin khách hàng, danh sách tài liệu từ hồ sơ được chọn để điền vào biểu mẫu.
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="flex items-center justify-between border-b p-4 bg-secondary/30">
              <h3 className="font-semibold">Nội dung văn bản</h3>
              <div className="flex items-center gap-2">
                {generatedText && (
                  <>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copied ? 'Đã copy' : 'Copy Text'}
                    </Button>
                    <Button variant="default" size="sm" onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="mr-2 h-4 w-4" /> Xuất Word (.docx)
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 p-0">
              {generatedText ? (
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none bg-background"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-20" />
                  <p>Chọn hồ sơ và bấm "Tạo dự thảo" để xem kết quả</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
