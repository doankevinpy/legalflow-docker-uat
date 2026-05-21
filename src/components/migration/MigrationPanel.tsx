// ============================================================
// MigrationPanel.tsx – Công cụ migration dữ liệu localStorage → Backend
// 5 bước thủ công: Detect → Export → Preview → Import → Report
// ============================================================

import { useState } from 'react';
import { Button } from '../ui/Button';
import { casesApi } from '../../lib/casesApi';
import { ApiError } from '../../lib/apiClient';
import {
  CASE_TYPE_REVERSE, CASE_FIELD_REVERSE,
  CASE_STATUS_REVERSE, NEIGHBORHOOD_REVERSE,
  CASE_TYPE_LABELS, CASE_STATUS_LABELS,
  type CaseTypeCode, type CaseStatusCode,
} from '../../lib/constants';
import { CheckCircle, XCircle, Download, Upload, AlertTriangle, Loader2 } from 'lucide-react';

interface LocalCase {
  id: string;
  caseId: string;
  senderName?: string;
  contactInfo?: string;
  type?: string;
  field?: string;
  neighborhood?: string;
  summary?: string;
  notes?: string;
  status?: string;
  receivedDate?: string;
  deadlineDate?: string;
  [key: string]: unknown;
}

interface ImportResult {
  localId: string;
  localCaseId: string;
  senderName: string;
  success: boolean;
  newCaseCode?: string;
  error?: string;
}

const STORAGE_KEY = 'legalflow_cases';

type Step = 'detect' | 'export' | 'preview' | 'import' | 'report';

export function MigrationPanel() {
  const [step, setStep]               = useState<Step>('detect');
  const [localCases, setLocalCases]   = useState<LocalCase[]>([]);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [results, setResults]         = useState<ImportResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // ---- Step 1: Detect ----
  const detect = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setLocalCases([]);
    } else {
      try {
        setLocalCases(JSON.parse(raw) as LocalCase[]);
      } catch {
        setLocalCases([]);
      }
    }
    setStep('detect');
  };

  // ---- Step 2: Export backup ----
  const exportBackup = () => {
    const raw = localStorage.getItem(STORAGE_KEY) ?? '[]';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legalflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStep('preview');
    setSelected(new Set(localCases.map(c => c.id)));
  };

  // ---- Step 3: Preview toggle ----
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(localCases.map(c => c.id)) : new Set());
  };
  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ---- Step 4: Import ----
  const runImport = async () => {
    const toImport = localCases.filter(c => selected.has(c.id));
    if (!toImport.length) return;
    setIsImporting(true);
    setResults([]);
    const newResults: ImportResult[] = [];

    for (const c of toImport) {
      const result: ImportResult = {
        localId: c.id,
        localCaseId: c.caseId,
        senderName: c.senderName ?? '–',
        success: false,
      };

      // Validate required fields
      if (!c.senderName?.trim()) {
        result.error = 'senderName không được để trống';
        newResults.push(result);
        continue;
      }

      // Map fields
      const typeCode   = CASE_TYPE_REVERSE[c.type ?? ''];
      const fieldCode  = CASE_FIELD_REVERSE[c.field ?? ''];
      const nhCode     = NEIGHBORHOOD_REVERSE[c.neighborhood ?? ''] ?? 'KHAC';

      if (!typeCode) {
        result.error = `Loại đơn không hợp lệ: "${c.type}"`;
        newResults.push(result);
        continue;
      }
      if (!fieldCode) {
        result.error = `Lĩnh vực không hợp lệ: "${c.field}"`;
        newResults.push(result);
        continue;
      }

      try {
        const created = await casesApi.createCase({
          senderName: c.senderName.trim(),
          contact: c.contactInfo ?? undefined,
          type: typeCode,
          field: fieldCode,
          neighborhood: nhCode,
          summary: c.summary?.trim() || '(Không có tóm tắt)',
          request: c.summary?.trim() || '(Không có tóm tắt)',
          receivedDate: c.receivedDate,
          deadline: c.deadlineDate,
          documents: [],
        });

        // Import notes nếu có
        if (c.notes?.trim()) {
          try {
            await casesApi.addNote(created.id, `[Import từ localStorage] ${c.notes.trim()}`);
          } catch { /* không block nếu note fail */ }
        }

        result.success = true;
        result.newCaseCode = created.caseCode;
      } catch (err) {
        result.error = err instanceof ApiError ? err.message : 'Lỗi không xác định';
      }
      newResults.push(result);
    }

    setResults(newResults);
    setIsImporting(false);
    setStep('report');
  };

  const successCount = results.filter(r => r.success).length;
  const failCount    = results.filter(r => !r.success).length;

  // ---- Render ----
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Migration là thao tác thủ công. Hãy export backup trước, sau đó xác nhận từng bước.</span>
      </div>

      {/* DETECT */}
      {step === 'detect' && (
        <div className="space-y-4">
          <Button onClick={detect} variant="outline">
            🔍 Kiểm tra dữ liệu localStorage
          </Button>
          {localCases.length > 0 ? (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
              Tìm thấy <strong>{localCases.length}</strong> hồ sơ trong localStorage.
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-50 border text-muted-foreground text-sm">
              Không tìm thấy dữ liệu hoặc chưa kiểm tra.
            </div>
          )}
          {localCases.length > 0 && (
            <Button onClick={exportBackup} className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export backup & Tiếp tục
            </Button>
          )}
        </div>
      )}

      {/* PREVIEW */}
      {(step === 'preview' || step === 'import') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Chọn hồ sơ để import ({selected.size}/{localCases.length})</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>Chọn tất cả</Button>
              <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>Bỏ chọn</Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-auto max-h-72">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 w-10"></th>
                  <th className="px-3 py-3 text-left">Mã hồ sơ</th>
                  <th className="px-3 py-3 text-left">Người gửi</th>
                  <th className="px-3 py-3 text-left">Loại đơn</th>
                  <th className="px-3 py-3 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {localCases.map(c => (
                  <tr key={c.id} className="hover:bg-secondary/20">
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleOne(c.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{c.caseId}</td>
                    <td className="px-3 py-2">{c.senderName ?? '–'}</td>
                    <td className="px-3 py-2">
                      {CASE_TYPE_LABELS[CASE_TYPE_REVERSE[c.type ?? ''] as CaseTypeCode] ?? c.type ?? '–'}
                    </td>
                    <td className="px-3 py-2">
                      {CASE_STATUS_LABELS[CASE_STATUS_REVERSE[c.status ?? ''] as CaseStatusCode] ?? c.status ?? '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            onClick={runImport}
            disabled={isImporting || selected.size === 0}
            className="flex items-center gap-2"
          >
            {isImporting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Đang import...</>
            ) : (
              <><Upload className="h-4 w-4" /> Import {selected.size} hồ sơ lên backend</>
            )}
          </Button>
        </div>
      )}

      {/* REPORT */}
      {step === 'report' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-800">{successCount}</p>
              <p className="text-sm text-green-700">Thành công</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-800">{failCount}</p>
              <p className="text-sm text-red-700">Thất bại</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-auto max-h-60">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Mã cũ</th>
                  <th className="px-3 py-2 text-left">Mã mới</th>
                  <th className="px-3 py-2 text-left">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.map(r => (
                  <tr key={r.localId} className={r.success ? 'bg-green-50/50' : 'bg-red-50/50'}>
                    <td className="px-3 py-2 font-mono text-xs">{r.localCaseId}</td>
                    <td className="px-3 py-2 font-mono text-xs text-green-700">{r.newCaseCode ?? '–'}</td>
                    <td className="px-3 py-2">
                      {r.success ? (
                        <span className="flex items-center gap-1 text-green-700"><CheckCircle className="h-3 w-3" /> OK</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-700"><XCircle className="h-3 w-3" /> {r.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {failCount === 0 && (
            <div className="border border-orange-300 bg-orange-50 rounded-lg p-3 text-sm text-orange-800 space-y-2">
              <p className="font-medium">⚠️ Tất cả hồ sơ đã import thành công.</p>
              <p>Dữ liệu localStorage chưa bị xóa. Bấm nút bên dưới để xóa thủ công.</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Xóa toàn bộ dữ liệu hồ sơ trong localStorage? Hành động này không thể hoàn tác.')) {
                    localStorage.removeItem(STORAGE_KEY);
                    alert('Đã xóa localStorage thành công.');
                    setStep('detect');
                    setLocalCases([]);
                  }
                }}
              >
                Xóa localStorage (thủ công)
              </Button>
            </div>
          )}

          <Button variant="outline" onClick={() => { setStep('detect'); setResults([]); }}>
            Bắt đầu lại
          </Button>
        </div>
      )}
    </div>
  );
}
