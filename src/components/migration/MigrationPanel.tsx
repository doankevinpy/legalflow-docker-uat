// ============================================================
// MigrationPanel.tsx – Công cụ migration dữ liệu localStorage → Backend
// Phiên bản Quản lý Báo cáo, Chống Trùng Đa Yếu Tố và Cổng An Toàn
// ============================================================

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { casesApi } from '../../lib/casesApi';
import { ApiError } from '../../lib/apiClient';
import {
  CASE_TYPE_REVERSE, CASE_FIELD_REVERSE,
  NEIGHBORHOOD_REVERSE,
} from '../../lib/constants';
import { CheckCircle, XCircle, Download, Upload, AlertTriangle, Loader2, HelpCircle } from 'lucide-react';

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

export interface MigrationItem {
  caseId: string;
  senderName: string;
  type?: string;
  field?: string;
  neighborhood?: string;
  summary?: string;
  receivedDate?: string;
  status: 'pending' | 'imported' | 'already_migrated' | 'possible_duplicate' | 'failed' | 'skipped';
  newCaseCode?: string;
  error?: string;
  forceImport?: boolean;
}

export interface MigrationReport {
  totalLocalCases: number;
  importedCount: number;
  alreadyMigratedCount: number;
  skippedCount: number;
  failedCount: number;
  pendingCount: number;
  items: Record<string, MigrationItem>;
}

const STORAGE_KEY = 'legalflow_cases';
const REPORT_KEY = 'legalflow_migration_report';
const BACKED_UP_KEY = 'legalflow_migration_backed_up';

type Step = 'detect' | 'export' | 'preview' | 'import' | 'report';

export function MigrationPanel() {
  const [step, setStep]               = useState<Step>('detect');
  const [localCases, setLocalCases]   = useState<LocalCase[]>([]);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [report, setReport]           = useState<MigrationReport | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [currentImportResults, setCurrentImportResults] = useState<{ id: string; success: boolean; msg: string }[]>([]);

  // Tự động kiểm tra dữ liệu local và report khi mount
  useEffect(() => {
    const rawCases = localStorage.getItem(STORAGE_KEY);
    let parsedCases: LocalCase[] = [];
    if (rawCases) {
      try {
        parsedCases = JSON.parse(rawCases) as LocalCase[];
        setLocalCases(parsedCases);
      } catch {
        // Ignored
      }
    }

    const rawReport = localStorage.getItem(REPORT_KEY);
    if (rawReport) {
      try {
        const parsedReport = JSON.parse(rawReport) as MigrationReport;
        // Kiểm tra xem số lượng hồ sơ trong report có khớp với local cases hiện tại không
        if (parsedReport.totalLocalCases === parsedCases.length) {
          setReport(parsedReport);
        } else {
          // Nếu không khớp (dữ liệu local thay đổi), tạo mới report
          const newReport = buildDefaultReport(parsedCases);
          saveReport(newReport);
        }
      } catch {
        const newReport = buildDefaultReport(parsedCases);
        saveReport(newReport);
      }
    } else if (parsedCases.length > 0) {
      const newReport = buildDefaultReport(parsedCases);
      saveReport(newReport);
    }
  }, []);

  const buildDefaultReport = (cases: LocalCase[]): MigrationReport => {
    const items: Record<string, MigrationItem> = {};
    cases.forEach(c => {
      items[c.id] = {
        caseId: c.caseId,
        senderName: c.senderName ?? '–',
        type: c.type,
        field: c.field,
        neighborhood: c.neighborhood,
        summary: c.summary,
        receivedDate: c.receivedDate,
        status: 'pending',
      };
    });
    return {
      totalLocalCases: cases.length,
      importedCount: 0,
      alreadyMigratedCount: 0,
      skippedCount: 0,
      failedCount: 0,
      pendingCount: cases.length,
      items,
    };
  };

  const updateReportStats = (items: Record<string, MigrationItem>): MigrationReport => {
    const total = Object.keys(items).length;
    let imported = 0;
    let alreadyMigrated = 0;
    let skipped = 0;
    let failed = 0;
    let pending = 0;

    Object.values(items).forEach(item => {
      switch (item.status) {
        case 'imported':
          imported++;
          break;
        case 'already_migrated':
          alreadyMigrated++;
          break;
        case 'skipped':
          skipped++;
          break;
        case 'failed':
          failed++;
          break;
        case 'possible_duplicate':
        case 'pending':
          pending++;
          break;
      }
    });

    return {
      totalLocalCases: total,
      importedCount: imported,
      alreadyMigratedCount: alreadyMigrated,
      skippedCount: skipped,
      failedCount: failed,
      pendingCount: pending,
      items,
    };
  };

  const saveReport = (newReport: MigrationReport) => {
    setReport(newReport);
    localStorage.setItem(REPORT_KEY, JSON.stringify(newReport));

    // Cờ hoàn thành di chuyển 100% (pending === 0 và failed === 0)
    const hasUnresolved = Object.values(newReport.items).some(
      item => item.status === 'pending' || item.status === 'failed' || item.status === 'possible_duplicate'
    );

    if (!hasUnresolved && newReport.totalLocalCases > 0) {
      localStorage.setItem('legalflow_migration_completed', 'true');
    } else {
      localStorage.removeItem('legalflow_migration_completed');
    }
  };

  // ---- Step 1: Detect ----
  const detect = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsedCases: LocalCase[] = [];
    if (raw) {
      try {
        parsedCases = JSON.parse(raw) as LocalCase[];
        setLocalCases(parsedCases);
      } catch {
        setLocalCases([]);
      }
    } else {
      setLocalCases([]);
    }

    const rawReport = localStorage.getItem(REPORT_KEY);
    if (rawReport) {
      try {
        const parsedReport = JSON.parse(rawReport) as MigrationReport;
        if (parsedReport.totalLocalCases === parsedCases.length) {
          setReport(parsedReport);
        } else {
          const newReport = buildDefaultReport(parsedCases);
          saveReport(newReport);
        }
      } catch {
        const newReport = buildDefaultReport(parsedCases);
        saveReport(newReport);
      }
    } else if (parsedCases.length > 0) {
      const newReport = buildDefaultReport(parsedCases);
      saveReport(newReport);
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

    // Kích hoạt cờ sao lưu an toàn
    localStorage.setItem(BACKED_UP_KEY, 'true');

    // Chuyển sang bước tiếp theo
    setStep('preview');

    // Mặc định chọn tất cả những hồ sơ có thể di chuyển được
    if (report) {
      const initSelected = new Set<string>();
      Object.entries(report.items).forEach(([id, item]) => {
        if (item.status === 'pending' || item.status === 'failed' || item.status === 'possible_duplicate') {
          initSelected.add(id);
        }
      });
      setSelected(initSelected);
    } else {
      setSelected(new Set(localCases.map(c => c.id)));
    }
  };

  // ---- Step 3: Preview toggle ----
  const toggleAll = (checked: boolean) => {
    if (!report) return;
    if (checked) {
      const activeIds = Object.entries(report.items)
        .filter(([_, item]) => item.status === 'pending' || item.status === 'failed' || item.status === 'possible_duplicate')
        .map(([id]) => id);
      setSelected(new Set(activeIds));
    } else {
      setSelected(new Set());
    }
  };

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Nút hành động nhanh: Bỏ qua (Skip) / Khôi phục cho hồ sơ
  const toggleSkipItem = (id: string) => {
    if (!report) return;
    const newItems = { ...report.items };
    const currentItem = newItems[id];
    if (currentItem.status === 'skipped') {
      currentItem.status = 'pending';
    } else {
      currentItem.status = 'skipped';
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    const nextReport = updateReportStats(newItems);
    saveReport(nextReport);
  };

  // Giải quyết trạng thái Nghi trùng có kiểm soát
  const resolvePossibleDuplicate = (id: string, action: 'skip' | 'force_pending') => {
    if (!report) return;
    const newItems = { ...report.items };
    if (action === 'skip') {
      newItems[id] = { ...newItems[id], status: 'skipped', error: undefined };
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      newItems[id] = { ...newItems[id], status: 'pending', error: undefined, forceImport: true };
      setSelected(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
    const nextReport = updateReportStats(newItems);
    saveReport(nextReport);
  };

  // Chuẩn hóa chuỗi phục vụ kiểm tra trùng lặp
  const cleanStr = (s: string | undefined) => {
    if (!s) return '';
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '')
      .trim();
  };

  // ---- Step 4: Import với Chống Trùng Đa Yếu Tố ----
  const runImport = async () => {
    if (!report) return;
    const toImportIds = localCases.filter(c => selected.has(c.id)).map(c => c.id);
    if (!toImportIds.length) return;

    setIsImporting(true);
    setCurrentImportResults([]);
    const tempResults: { id: string; success: boolean; msg: string }[] = [];
    const newItems = { ...report.items };

    for (const id of toImportIds) {
      const c = localCases.find(lc => lc.id === id);
      if (!c) continue;

      const reportItem = newItems[id];

      // Validate required fields
      if (!c.senderName?.trim()) {
        reportItem.status = 'failed';
        reportItem.error = 'Tên người gửi không được để trống';
        tempResults.push({ id, success: false, msg: 'Tên người gửi trống' });
        continue;
      }

      // Map categories
      const typeCode   = CASE_TYPE_REVERSE[c.type ?? ''];
      const fieldCode  = CASE_FIELD_REVERSE[c.field ?? ''];
      const nhCode     = NEIGHBORHOOD_REVERSE[c.neighborhood ?? ''] ?? 'KHAC';

      if (!typeCode) {
        reportItem.status = 'failed';
        reportItem.error = `Loại đơn không hợp lệ: "${c.type}"`;
        tempResults.push({ id, success: false, msg: 'Loại đơn không hợp lệ' });
        continue;
      }
      if (!fieldCode) {
        reportItem.status = 'failed';
        reportItem.error = `Lĩnh vực không hợp lệ: "${c.field}"`;
        tempResults.push({ id, success: false, msg: 'Lĩnh vực không hợp lệ' });
        continue;
      }

      // CHỐNG TRÙNG LẶP ĐA YẾU TỐ
      let isDuplicate = false;

      try {
        // 1. Kiểm tra khớp mã trực tiếp (Chỉ check nếu không phải mã cũ HS-)
        const isOldHsFormat = c.caseId.startsWith('HS-');
        if (!isOldHsFormat) {
          const searchCodeRes = await casesApi.getCases({ search: c.caseId });
          const exactCodeMatch = searchCodeRes.data.find(dbCase => dbCase.caseCode === c.caseId);
          if (exactCodeMatch) {
            isDuplicate = true;
            reportItem.status = 'already_migrated';
            reportItem.newCaseCode = exactCodeMatch.caseCode;
            reportItem.error = undefined;
            tempResults.push({ id, success: true, msg: 'Đã di chuyển trước đó (Khớp mã)' });
          }
        }

        // 2. Kiểm tra sâu (Nghi trùng nội dung) - chỉ khi chưa trùng mã trực tiếp và không bấm "Vẫn import"
        if (!isDuplicate && !reportItem.forceImport) {
          const searchNameRes = await casesApi.getCases({ search: c.senderName.trim() });
          
          // Kiểm tra xem có bản ghi nào trùng khớp sâu không
          const cleanLocalName = cleanStr(c.senderName);
          const typeCode = CASE_TYPE_REVERSE[c.type ?? ''];
          const nhCode = NEIGHBORHOOD_REVERSE[c.neighborhood ?? ''] ?? 'KHAC';

          const matchingDbCase = searchNameRes.data.find(dbCase => {
            const cleanDbName = cleanStr(dbCase.senderName);
            
            // So khớp tên
            const nameMatch = cleanLocalName === cleanDbName && cleanLocalName.length > 0;
            
            // So khớp Meta (Loại đơn và Khu phố)
            const metaMatch = dbCase.type === typeCode && dbCase.neighborhood === nhCode;
            
            // So khớp Ngày nhận
            let dateMatch = false;
            if (c.receivedDate && dbCase.receivedDate) {
              const d1 = new Date(c.receivedDate).toISOString().slice(0, 10);
              const d2 = new Date(dbCase.receivedDate).toISOString().slice(0, 10);
              dateMatch = d1 === d2;
            }

            return nameMatch && metaMatch && dateMatch;
          });

          if (matchingDbCase) {
            // Phát hiện nghi trùng - Đánh dấu possible_duplicate và yêu cầu confirm
            reportItem.status = 'possible_duplicate';
            reportItem.error = 'Phát hiện nghi trùng dữ liệu trên Backend';
            tempResults.push({ id, success: false, msg: 'Nghi ngờ trùng lặp nội dung' });
            continue;
          }
        }
      } catch (err) {
        // Nếu API check trùng lỗi, tiếp tục luồng tạo để tránh tắc nghẽn
      }

      // Bỏ qua nếu đã phát hiện trùng mã
      if (isDuplicate) {
        continue;
      }

      // Tiến hành tạo hồ sơ mới trên Backend
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

        // Di chuyển notes nếu có
        if (c.notes?.trim()) {
          try {
            await casesApi.addNote(created.id, `[Import từ localStorage] ${c.notes.trim()}`);
          } catch {
            // Không block tiến trình nếu lỗi note
          }
        }

        reportItem.status = 'imported';
        reportItem.newCaseCode = created.caseCode;
        reportItem.error = undefined;
        reportItem.forceImport = undefined; // Reset cờ
        tempResults.push({ id, success: true, msg: 'Đã di chuyển thành công' });
      } catch (err) {
        reportItem.status = 'failed';
        reportItem.error = err instanceof ApiError ? err.message : 'Lỗi không xác định';
        tempResults.push({ id, success: false, msg: reportItem.error });
      }
    }

    const nextReport = updateReportStats(newItems);
    saveReport(nextReport);
    setCurrentImportResults(tempResults);
    setIsImporting(false);
    setSelected(new Set()); // Clear selection
    setStep('report');
  };

  // ---- RENDER ----
  return (
    <div className="space-y-4">
      {/* DETECT */}
      {step === 'detect' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Migration là thao tác kiểm soát thủ công. Hãy tạo bản sao lưu an toàn trước khi thực hiện.</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={detect} variant="outline">
              🔍 Quét bộ nhớ localStorage
            </Button>
          </div>

          {localCases.length > 0 ? (
            <div className="p-4 rounded-xl border bg-card/50 shadow-sm space-y-2">
              <p className="text-sm font-medium">Kết quả phân tích:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-secondary/40 p-2.5 rounded-lg">
                  <p className="text-muted-foreground">Tổng số hồ sơ cũ:</p>
                  <p className="text-lg font-bold">{localCases.length}</p>
                </div>
                {report && (
                  <>
                    <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-2.5 rounded-lg">
                      <p>Đã di chuyển:</p>
                      <p className="text-lg font-bold">{report.importedCount + report.alreadyMigratedCount}</p>
                    </div>
                    <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-2.5 rounded-lg">
                      <p>Đang chờ xử lý:</p>
                      <p className="text-lg font-bold">{report.pendingCount}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed text-center text-sm text-muted-foreground bg-secondary/10">
              Không tìm thấy dữ liệu hồ sơ cũ hoặc dữ liệu đã được dọn dẹp sạch sẽ.
            </div>
          )}

          {localCases.length > 0 && (
            <Button onClick={exportBackup} className="flex items-center gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" /> Sao lưu dữ liệu JSON & Tiến tục
            </Button>
          )}
        </div>
      )}

      {/* PREVIEW & IMPORT */}
      {(step === 'preview' || step === 'import') && report && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Bảng di chuyển dữ liệu cũ</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chọn hồ sơ, giải quyết các ca nghi trùng và nhấn nút di chuyển lên server.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => toggleAll(true)} className="text-xs flex-1 sm:flex-initial">Chọn tất cả</Button>
              <Button variant="outline" size="sm" onClick={() => toggleAll(false)} className="text-xs flex-1 sm:flex-initial">Bỏ chọn</Button>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden shadow-sm max-h-96 overflow-y-auto bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 border-b text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 w-10 text-center"></th>
                  <th className="px-3 py-3 text-left">Mã hồ sơ cũ</th>
                  <th className="px-3 py-3 text-left">Người gửi</th>
                  <th className="px-3 py-3 text-left">Trạng thái xử lý</th>
                  <th className="px-3 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {localCases.map(c => {
                  const item = report.items[c.id];
                  if (!item) return null;

                  const isHsFormat = item.caseId.startsWith('HS-');
                  const canSelect = item.status === 'pending' || item.status === 'failed' || item.status === 'possible_duplicate';

                  return (
                    <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          disabled={!canSelect}
                          onChange={() => toggleOne(c.id)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-40"
                        />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        <div>{item.caseId}</div>
                        {isHsFormat && (
                          <div className="text-[10px] text-amber-600 font-sans mt-0.5 flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" /> Mã cũ (HS) → Server sinh mã mới
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-medium">{item.senderName}</td>
                      <td className="px-3 py-2.5">
                        {item.status === 'pending' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            Chờ di chuyển
                          </span>
                        )}
                        {item.status === 'imported' && (
                          <span className="inline-flex flex-col px-2 py-0.5 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                            <span>Di chuyển thành công</span>
                            {item.newCaseCode && <strong className="font-mono text-[10px] mt-0.5">({item.newCaseCode})</strong>}
                          </span>
                        )}
                        {item.status === 'already_migrated' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                            Đã trùng khớp DB
                          </span>
                        )}
                        {item.status === 'possible_duplicate' && (
                          <span className="inline-flex flex-col px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="font-semibold">⚠️ Nghi trùng nội dung</span>
                            <span className="text-[9px] mt-0.5 opacity-80">Trùng tên/loại/ngày nhận trên Server</span>
                          </span>
                        )}
                        {item.status === 'skipped' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-dashed">
                            Chủ động bỏ qua
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span className="inline-flex flex-col px-2 py-0.5 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                            <span>Lỗi: {item.error}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right space-x-2">
                        {/* Hành động giải quyết nghi trùng */}
                        {item.status === 'possible_duplicate' && (
                          <div className="inline-flex gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] border-amber-300 text-amber-700 hover:bg-amber-50"
                              onClick={() => resolvePossibleDuplicate(c.id, 'skip')}
                            >
                              Xác nhận đã trùng (Skip)
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] border-primary text-primary hover:bg-primary/5"
                              onClick={() => resolvePossibleDuplicate(c.id, 'force_pending')}
                            >
                              Vẫn import tạo mới
                            </Button>
                          </div>
                        )}

                        {/* Cho phép bỏ qua / khôi phục thủ công */}
                        {(item.status === 'pending' || item.status === 'failed') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] text-muted-foreground hover:text-foreground"
                            onClick={() => toggleSkipItem(c.id)}
                          >
                            Bỏ qua
                          </Button>
                        )}
                        {item.status === 'skipped' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] text-primary hover:underline"
                            onClick={() => toggleSkipItem(c.id)}
                          >
                            Kích hoạt lại
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={runImport}
              disabled={isImporting || selected.size === 0}
              className="flex items-center gap-2 flex-1 sm:flex-initial"
            >
              {isImporting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Đang di chuyển dữ liệu...</>
              ) : (
                <><Upload className="h-4 w-4" /> Di chuyển {selected.size} hồ sơ lên server</>
              )}
            </Button>
            <Button variant="outline" onClick={() => setStep('detect')} disabled={isImporting}>
              Quay lại
            </Button>
          </div>
        </div>
      )}

      {/* REPORT */}
      {step === 'report' && report && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-800">{report.importedCount}</p>
              <p className="text-[10px] text-green-700">Tạo mới thành công</p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center">
              <CheckCircle className="h-5 w-5 text-teal-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-teal-800">{report.alreadyMigratedCount}</p>
              <p className="text-[10px] text-teal-700">Đã khớp trên DB</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-red-800">{report.failedCount}</p>
              <p className="text-[10px] text-red-700">Gặp lỗi</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <HelpCircle className="h-5 w-5 text-slate-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{report.pendingCount}</p>
              <p className="text-[10px] text-slate-700">Chờ xử lý / Nghi trùng</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Kết quả lượt di chuyển vừa qua:</h4>
            {currentImportResults.length > 0 ? (
              <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/40 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left">Mã local</th>
                      <th className="px-3 py-2 text-left">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentImportResults.map((r, index) => {
                      const item = report.items[r.id];
                      return (
                        <tr key={index} className={r.success ? 'bg-green-50/20' : 'bg-red-50/20'}>
                          <td className="px-3 py-1.5 font-mono font-medium">{item?.caseId ?? '–'}</td>
                          <td className="px-3 py-1.5">
                            {r.success ? (
                              <span className="text-green-700 font-medium">✓ {r.msg}</span>
                            ) : (
                              <span className="text-red-700 font-medium">✗ {r.msg}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Không có hồ sơ nào được xử lý trong chu kỳ vừa chạy.</p>
            )}
          </div>

          {report.pendingCount === 0 && report.failedCount === 0 ? (
            <div className="p-3.5 rounded-xl border border-green-200 bg-green-50/30 text-green-800 text-xs space-y-1.5">
              <p className="font-semibold text-sm">🎉 Tuyệt vời! Tất cả hồ sơ cũ đã được giải quyết 100%.</p>
              <p className="text-muted-foreground">
                Để dọn dẹp trình duyệt cục bộ, vui lòng quay lại mục <strong>Cài đặt & Dữ liệu</strong> chính để tiến hành xóa an toàn.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 text-amber-800 text-xs">
              <p className="font-semibold">⚠️ Vẫn còn {report.pendingCount + report.failedCount} hồ sơ chưa xử lý xong.</p>
              <p className="text-muted-foreground mt-0.5">
                Vui lòng xử lý toàn bộ (hoặc di chuyển thành công, hoặc bấm chọn 'Bỏ qua') trước khi hệ thống kích hoạt nút xóa.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => setStep('preview')} variant="outline">
              Quay lại Preview & Sửa lỗi
            </Button>
            <Button variant="ghost" onClick={() => { setStep('detect'); setCurrentImportResults([]); }}>
              Bắt đầu lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
