import React, { useState } from 'react';
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ShieldAlert,
  Play,
  RotateCcw,
  Info,
  Lock,
  Database,
  FileText,
} from 'lucide-react';
import { legalKnowledgeApi } from '../../lib/legalKnowledgeApi';

interface LegalKnowledgeImportTabProps {
  role?: string;
}

interface ValidationRowReport {
  rowNumber: number;
  sourceId: string;
  status: 'VALID' | 'WARNING' | 'REJECTED' | 'DUPLICATE';
  errors: string[];
  warnings: string[];
}

interface ValidationReport {
  success: boolean;
  dryRun: boolean;
  noDatabaseWrite: boolean;
  totalRecords: number;
  validRecords: number;
  warningRecords: number;
  rejectedRecords: number;
  duplicateRecords: number;
  errors: string[];
  warnings: string[];
  records?: ValidationRowReport[];
}

const SAMPLE_CSV_DATA = `source_id,document_code,document_title,document_type,issuing_authority,issued_date,effective_date,legal_status,approval_status,local_scope,active_candidate,notes
SAMPLE-LAW-2024-01,Luật 31/2024/QH15,Luật Đất đai năm 2024,Law,Quốc hội,2024-01-18,2024-08-01,Effective,Approved,National,false,Dữ liệu mẫu kiểm thử Phase 11J (Tiền tố SAMPLE)
SAMPLE-ND-2024-102,NĐ 102/2024/NĐ-CP,Nghị định quy định chi tiết thi hành một số điều của Luật Đất đai,Decree,Chính phủ,2024-07-30,2024-08-01,Effective,Approved,National,false,Dữ liệu mẫu kiểm thử Phase 11J
SAMPLE-LOCAL-QD-01,QĐ 45/2024/QĐ-UBND,Quyết định hạn mức giao đất ở tại Hà Nội,Decision,UBND TP Hà Nội,2024-08-15,2024-09-01,Effective,Approved,Local,false,Dữ liệu mẫu địa phương Hà Nội (SAMPLE)
SAMPLE-DRAFT-2025,Dự thảo NĐ 2025,Dự thảo sửa đổi bổ sung quy định bồi thường,Draft,Bộ Tài nguyên và Môi trường,2025-01-10,2025-07-01,Draft,Approved,National,false,Bản mẫu thử nghiệm từ chối hoặc cảnh báo`.trim();

export const LegalKnowledgeImportTab: React.FC<LegalKnowledgeImportTabProps> = ({ role = 'VIEWER' }) => {
  const [csvInput, setCsvInput] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [executeResult, setExecuteResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Execute confirmation state
  const [backupConfirmed, setBackupConfirmed] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [confirmationText, setConfirmationText] = useState<string>('');

  const canExecute = ['ADMIN', 'MANAGER'].includes(role);
  const isViewer = role === 'VIEWER';

  if (isViewer) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-4">
        <Lock className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-base font-bold text-red-900 dark:text-red-200">
            Quyền hạn hạn chế (Role: VIEWER)
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300 mt-1 leading-relaxed">
            Tài khoản của bạn ở chế độ chỉ xem (VIEWER) nên không có quyền truy cập khu vực Nhập/Nạp dữ liệu tri thức pháp lý (Import UI). Vui lòng liên hệ Quản trị viên hệ thống (ADMIN) hoặc Lãnh đạo bộ phận (MANAGER) nếu bạn cần hỗ trợ kiểm tra dữ liệu.
          </p>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvInput(content);
        setValidationReport(null);
        setExecuteResult(null);
        setErrorMessage(null);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Không thể đọc file CSV. Vui lòng kiểm tra định dạng hoặc mã hóa file (UTF-8).');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleLoadSample = () => {
    setCsvInput(SAMPLE_CSV_DATA);
    setValidationReport(null);
    setExecuteResult(null);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setCsvInput('');
    setValidationReport(null);
    setExecuteResult(null);
    setErrorMessage(null);
    setBackupConfirmed(false);
    setReason('');
    setConfirmationText('');
  };

  const handleValidate = async () => {
    if (!csvInput.trim()) {
      setErrorMessage('Vui lòng nhập hoặc upload nội dung CSV trước khi thực hiện Validate.');
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);
    setExecuteResult(null);

    try {
      const res = await legalKnowledgeApi.validateCsvImport({
        csvText: csvInput,
        dryRun: true,
      });
      if (res && res.data) {
        setValidationReport(res.data);
      } else {
        setErrorMessage('Không nhận được kết quả phản hồi hợp lệ từ máy chủ.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Lỗi không xác định khi thực hiện Validate CSV - Dry Run.';
      setErrorMessage(`Lỗi từ API Validate: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleExecute = async () => {
    if (!canExecute) {
      setErrorMessage('Chỉ Lãnh đạo (ADMIN / MANAGER) mới có quyền thực thi Import.');
      return;
    }
    if (!backupConfirmed) {
      setErrorMessage('Vui lòng xác nhận bạn đã sao lưu dữ liệu (backup) trước khi thực thi import.');
      return;
    }
    if (!reason.trim()) {
      setErrorMessage('Vui lòng nhập lý do thực hiện import.');
      return;
    }
    if (confirmationText !== 'I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION') {
      setErrorMessage('Câu xác nhận (confirmation text) không khớp chính xác chuỗi yêu cầu.');
      return;
    }

    setIsExecuting(true);
    setErrorMessage(null);

    try {
      const res = await legalKnowledgeApi.executeCsvImport({
        csvText: csvInput,
        dryRun: false,
        reason: reason.trim(),
        confirmationText: confirmationText.trim(),
        backupConfirmed,
      });
      if (res && res.data) {
        setExecuteResult(res.data);
      } else {
        setErrorMessage('Không nhận được phản hồi thực thi từ máy chủ.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Lỗi không xác định khi gọi API thực thi Import.';
      setErrorMessage(`Lỗi từ API Execute: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const hasValidationBlocked =
    !validationReport ||
    validationReport.rejectedRecords > 0 ||
    validationReport.duplicateRecords > 0 ||
    (validationReport.errors && validationReport.errors.length > 0);

  return (
    <div className="space-y-6">
      {/* 1. Import Safety Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 border-l-4 border-amber-500 text-white p-5 rounded-xl shadow-md space-y-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-6 w-6 text-amber-400 flex-shrink-0 animate-pulse" />
          <h3 className="text-base font-extrabold tracking-wide uppercase text-amber-300">
            CẢNH BÁO AN TOÀN TRƯỚC KHI NẠP DỮ LIỆU PHÁP LÝ (IMPORT GOVERNANCE)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-amber-100 bg-black/20 p-3.5 rounded-lg border border-amber-500/30 font-medium">
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-amber-300 uppercase">IMPORT KHÔNG ĐỒNG NGHĨA VỚI ACTIVE VERSION:</strong> Mọi văn bản nạp qua CSV chỉ ở trạng thái chờ/dự thảo hoặc tham khảo.</li>
            <li><strong className="text-amber-300 uppercase">AI KHÔNG TỰ XÁC ĐỊNH VĂN BẢN MỚI NHẤT:</strong> Cán bộ chuyên môn phải tự kiểm tra, đối chiếu hiệu lực pháp lý thực tế.</li>
          </ul>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-amber-300 uppercase">CẦN BACKUP TRƯỚC KHI IMPORT THẬT:</strong> Bắt buộc hoàn tất sao lưu an toàn toàn bộ hệ thống trước khi thực thi.</li>
            <li><strong className="text-amber-300 uppercase">KHÔNG DÙNG DỮ LIỆU CHƯA DUYỆT:</strong> Tuyệt đối không dùng văn bản pháp luật chưa phê duyệt cho hồ sơ TTHC chính thức.</li>
          </ul>
        </div>
      </div>

      {/* Role Notice Banner */}
      <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 p-3.5 rounded-lg text-xs sm:text-sm text-blue-900 dark:text-blue-200">
        <div className="flex items-center gap-2 font-medium">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span>
            Quyền truy cập hiện tại của bạn: <strong className="font-bold uppercase text-blue-700 dark:text-blue-300">{role}</strong>. Frontend chỉ hỗ trợ UI rà soát; Backend nghiêm ngặt kiểm tra RBAC và chặn mọi lệnh trái phép.
          </span>
        </div>
        <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded font-semibold whitespace-nowrap ml-2">
          {canExecute ? 'Được phép Execute' : 'Chỉ Validate Dry-Run'}
        </span>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-4 rounded-xl flex items-start gap-3 text-red-900 dark:text-red-200 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-bold">Đã xảy ra lỗi trong quá trình xử lý:</p>
            <p className="mt-1 text-xs sm:text-sm font-mono bg-red-100/50 dark:bg-red-900/40 p-2 rounded border border-red-200 dark:border-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2. CSV Input Area */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              Khu vực Nhập Dữ liệu Tri thức Pháp lý (CSV Input Area)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hỗ trợ tải lên file <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.csv</code> hoặc dán trực tiếp dữ liệu theo đúng định dạng cột tiêu chuẩn.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700">
              <Upload className="h-3.5 w-3.5 text-blue-600" />
              Upload file CSV
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Tải mẫu CSV (SAMPLE)
            </button>
            {csvInput && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Xóa làm lại
              </button>
            )}
          </div>
        </div>

        <div>
          <textarea
            value={csvInput}
            onChange={(e) => {
              setCsvInput(e.target.value);
              setValidationReport(null);
              setExecuteResult(null);
              setErrorMessage(null);
            }}
            rows={8}
            placeholder="Dán nội dung CSV tại đây (Ví dụ: source_id,document_code,document_title,document_type,issuing_authority,issued_date,effective_date,legal_status,approval_status,local_scope,active_candidate,notes...)"
            className="w-full font-mono text-xs p-3.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>

        {/* 3. Validate Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {csvInput ? (
              <span>Độ dài: <strong className="text-gray-700 dark:text-gray-300">{csvInput.length}</strong> ký tự (~ <strong className="text-gray-700 dark:text-gray-300">{csvInput.split('\n').filter((l) => l.trim()).length}</strong> dòng)</span>
            ) : (
              <span>Chưa có dữ liệu CSV nào trong khung nhập.</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleValidate}
            disabled={isValidating || !csvInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Đang rà soát Dry-Run...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Validate CSV - Dry Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Validation Result Area */}
      {validationReport && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Báo cáo Kết quả Kiểm chứng (Validation Report - Phase 11H/J)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kết quả kiểm tra cẩn trọng theo 14 quy tắc chuẩn hóa. Chưa thực hiện ghi bất kỳ dữ liệu nào vào Database.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800">
                Dry-Run: {validationReport.dryRun ? 'TRUE' : 'FALSE'}
              </span>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded border border-blue-300 dark:border-blue-800">
                No DB Write: {validationReport.noDatabaseWrite ? 'TRUE' : 'FALSE'}
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border text-center">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tổng số dòng</div>
              <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{validationReport.totalRecords}</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-900 text-center">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">Hợp lệ (Valid)</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{validationReport.validRecords}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-lg border border-amber-200 dark:border-amber-900 text-center">
              <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">Cảnh báo (Warning)</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{validationReport.warningRecords}</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-lg border border-red-200 dark:border-red-900 text-center">
              <div className="text-xs text-red-700 dark:text-red-400 font-semibold uppercase tracking-wider">Bị từ chối (Rejected)</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{validationReport.rejectedRecords}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-lg border border-purple-200 dark:border-purple-900 text-center">
              <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold uppercase tracking-wider">Trùng lặp (Duplicate)</div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{validationReport.duplicateRecords}</div>
            </div>
          </div>

          {/* Global Errors & Warnings List */}
          {(validationReport.errors.length > 0 || validationReport.warnings.length > 0) && (
            <div className="space-y-3">
              {validationReport.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 p-3.5 rounded-lg space-y-1.5 text-xs text-red-900 dark:text-red-200">
                  <div className="font-bold flex items-center gap-1.5 text-red-800 dark:text-red-300">
                    <XCircle className="h-4 w-4" /> Lỗi tổng thể tệp CSV ({validationReport.errors.length}):
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {validationReport.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              {validationReport.warnings.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 p-3.5 rounded-lg space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" /> Cảnh báo kiểm soát AI Governance / Legal Grounds ({validationReport.warnings.length}):
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {validationReport.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Record-Level Table */}
          {validationReport.records && validationReport.records.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Chi tiết Kiểm tra Từng Dòng Dữ liệu ({validationReport.records.length} records)
              </h4>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-2.5 font-semibold w-16 text-center">Row</th>
                      <th className="p-2.5 font-semibold w-48">Source ID / Document Code</th>
                      <th className="p-2.5 font-semibold w-28 text-center">Status</th>
                      <th className="p-2.5 font-semibold">Errors & Warnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {validationReport.records.map((rec) => (
                      <tr key={rec.rowNumber} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-2.5 text-center font-mono font-bold text-gray-500">{rec.rowNumber}</td>
                        <td className="p-2.5 font-mono font-semibold text-gray-800 dark:text-gray-200">{rec.sourceId || 'N/A'}</td>
                        <td className="p-2.5 text-center">
                          {rec.status === 'VALID' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" /> VALID
                            </span>
                          )}
                          {rec.status === 'WARNING' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <AlertTriangle className="h-3 w-3" /> WARNING
                            </span>
                          )}
                          {rec.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                              <XCircle className="h-3 w-3" /> REJECTED
                            </span>
                          )}
                          {rec.status === 'DUPLICATE' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              <AlertTriangle className="h-3 w-3" /> DUPLICATE
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 space-y-1">
                          {rec.errors && rec.errors.length > 0 && (
                            <div className="space-y-0.5">
                              {rec.errors.map((err, i) => (
                                <div key={i} className="text-red-600 dark:text-red-400 font-semibold">
                                  • [Lỗi] {err}
                                </div>
                              ))}
                            </div>
                          )}
                          {rec.warnings && rec.warnings.length > 0 && (
                            <div className="space-y-0.5">
                              {rec.warnings.map((warn, i) => (
                                <div key={i} className="text-amber-700 dark:text-amber-400">
                                  • [Cảnh báo] {warn}
                                </div>
                              ))}
                            </div>
                          )}
                          {!rec.errors?.length && !rec.warnings?.length && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium italic">
                              Hợp lệ - Không phát hiện lỗi hay bất thường
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Execute Import Safety Section */}
      {validationReport && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5 animate-fadeIn">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-indigo-600" />
              Thực thi Nạp Tri thức Pháp lý (Controlled Execute Section - Phase 11I/J)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chỉ khả dụng sau khi quá trình Validate Dry-Run hoàn tất không có bản ghi lỗi hay bị từ chối.
            </p>
          </div>

          {/* Role or Validation Blocker Notices */}
          {!canExecute ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">Quyền hạn thực thi bị hạn chế:</p>
                <p className="mt-1">
                  Tài khoản <strong className="uppercase">{role}</strong> chỉ được phép thực hiện rà soát trước (Validate CSV - Dry Run). Chức năng Thực thi Import chính thức (Execute) chỉ dành cho Lãnh đạo có thẩm quyền (<strong className="uppercase">ADMIN / MANAGER</strong>).
                </p>
              </div>
            </div>
          ) : hasValidationBlocked ? (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-4 rounded-lg flex items-start gap-3 text-red-900 dark:text-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <p className="font-bold">Không thể thực thi Import vì tệp CSV chưa đạt điều kiện an toàn:</p>
                <ul className="list-disc list-inside pl-1 space-y-0.5">
                  {validationReport.rejectedRecords > 0 && (
                    <li>Có <strong className="text-red-700 dark:text-red-400 font-bold">{validationReport.rejectedRecords}</strong> dòng bị từ chối (REJECTED).</li>
                  )}
                  {validationReport.duplicateRecords > 0 && (
                    <li>Có <strong className="text-purple-700 dark:text-purple-400 font-bold">{validationReport.duplicateRecords}</strong> dòng bị trùng lặp mã (DUPLICATE).</li>
                  )}
                  {validationReport.errors && validationReport.errors.length > 0 && (
                    <li>Phát hiện <strong className="text-red-700 dark:text-red-400 font-bold">{validationReport.errors.length}</strong> lỗi cấu trúc chung trong tệp CSV.</li>
                  )}
                </ul>
                <p className="italic pt-1 text-xs text-red-800 dark:text-red-300">
                  Vui lòng chỉnh sửa tệp CSV và bấm Validate lại để loại bỏ toàn bộ lỗi trước khi tiếp tục.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* Mandatory Governance Notice */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-3.5 rounded-lg flex items-start gap-3 text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm">
                <Info className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold uppercase">Cảnh báo quy trình 2 bước:</strong> Execute import vẫn không được tự active legal version (`noAutoActive: true`). Active version là bước riêng rẽ có kiểm soát chặt chẽ sau khi Lãnh đạo thẩm định đầy đủ trên UI.
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* Checkbox Backup Confirmation */}
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:border-blue-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupConfirmed}
                    onChange={(e) => setBackupConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium">
                    Tôi xác nhận đã kiểm tra an toàn và đã thực hiện sao lưu dữ liệu (backup) trước khi thực thi nạp tri thức pháp lý.
                  </div>
                </label>

                {/* Reason Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                    Lý do thực hiện nạp tri thức (Reason) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ví dụ: Nạp bổ sung Luật Đất đai 2024 và Nghị định 102/2024/NĐ-CP theo yêu cầu phê duyệt đợt 1..."
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Exact Confirmation Text Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                    Nhập chính xác chuỗi xác nhận an toàn <span className="text-red-500">*</span>:
                  </label>
                  <div className="text-[11px] font-mono bg-gray-200 dark:bg-slate-800 p-2 rounded text-gray-800 dark:text-gray-200 select-all border border-gray-300 dark:border-gray-700 font-bold">
                    I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION
                  </div>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Nhập chính xác: I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"
                    className="w-full font-mono text-xs sm:text-sm p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Execute Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={
                    isExecuting ||
                    !backupConfirmed ||
                    !reason.trim() ||
                    confirmationText !== 'I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION'
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  {isExecuting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Đang thực thi an toàn...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Thực thi Import an toàn (Controlled Execute)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Execution Result Card */}
      {executeResult && (
        <div className="bg-gradient-to-br from-emerald-900/90 to-slate-900 text-white p-6 rounded-xl border border-emerald-500/40 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold tracking-wide">
                  PHẢN HỒI THỰC THI NẠP TRI THỨC PHÁP LÝ (EXECUTE RESPONSE)
                </h3>
                <p className="text-xs text-emerald-200">
                  Mã phản hồi từ hệ thống: <strong className="font-mono text-white">{executeResult.status || 'SUCCESS'}</strong>
                </p>
              </div>
            </div>
            <div className="bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-400/30 text-xs font-bold text-emerald-300">
              noAutoActive: {executeResult.noAutoActive ? 'TRUE' : 'FALSE'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-black/30 p-4 rounded-lg border border-emerald-500/20 font-medium">
            <div>
              <span className="text-emerald-300 uppercase font-semibold">Người thực thi:</span>
              <p className="text-sm font-bold text-white mt-0.5">{executeResult.audit?.actor || 'Admin/Manager User'} ({executeResult.audit?.role || role})</p>
            </div>
            <div>
              <span className="text-emerald-300 uppercase font-semibold">Thời gian ghi nhận:</span>
              <p className="text-sm font-mono text-white mt-0.5">{executeResult.audit?.timestamp || new Date().toISOString()}</p>
            </div>
            <div>
              <span className="text-emerald-300 uppercase font-semibold">Yêu cầu xác thực sao lưu:</span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{executeResult.backupConfirmed ? 'Đã xác nhận (TRUE)' : 'N/A'}</p>
            </div>
          </div>

          {executeResult.warnings && executeResult.warnings.length > 0 && (
            <div className="bg-amber-950/60 border border-amber-500/40 p-3.5 rounded-lg space-y-1.5 text-xs text-amber-200">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="h-4 w-4" /> Ghi chú an toàn & Giới hạn kỹ thuật từ máy chủ ({executeResult.warnings.length}):
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {executeResult.warnings.map((w: string, idx: number) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-emerald-100 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800 leading-relaxed flex items-center gap-2">
            <Info className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Lưu ý quan trọng:</strong> Hệ thống đã đảm bảo cờ <code>noAutoActive: true</code>. Các phiên bản hoặc văn bản vừa import chưa thay thế phiên bản đang `ACTIVE`. Cán bộ lãnh đạo cần vào các tab <em>Văn bản pháp lý / Phiên bản thủ tục</em> để kiểm tra trước khi kích hoạt chính thức.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
