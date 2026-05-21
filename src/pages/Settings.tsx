import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Download, Upload, AlertCircle, CheckCircle2, DatabaseZap, Trash2, Calendar, ShieldAlert } from 'lucide-react';
import { storage } from '../utils/storage';
import { MigrationPanel } from '../components/migration/MigrationPanel';
import type { LegalCase } from '../types';
import { useCases } from '../hooks/useCases';

interface MigrationReport {
  totalLocalCases: number;
  importedCount: number;
  alreadyMigratedCount: number;
  skippedCount: number;
  failedCount: number;
  pendingCount: number;
}

export default function Settings() {
  const { replaceCases } = useCases();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States quản lý trạng thái di chuyển và dọn dẹp
  const [oldCasesCount, setOldCasesCount] = useState<number>(0);
  const [isBackedUp, setIsBackedUp] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);
  
  const [isCleanedUp, setIsCleanedUp] = useState<boolean>(false);
  const [cleanupTime, setCleanupTime] = useState<string>('');

  // Đọc các giá trị từ localStorage
  const updateMigrationStats = () => {
    // 1. Số lượng hồ sơ local cũ
    const cases = storage.getCases();
    setOldCasesCount(cases.length);

    // 2. Trạng thái sao lưu (backed_up)
    const backedUp = localStorage.getItem('legalflow_migration_backed_up') === 'true';
    setIsBackedUp(backedUp);

    // 3. Trạng thái dọn dẹp vĩnh viễn (cleanup_completed)
    const cleaned = localStorage.getItem('legalflow_local_cleanup_completed') === 'true';
    setIsCleanedUp(cleaned);
    const cleanedAt = localStorage.getItem('legalflow_local_cleanup_completed_at') ?? '';
    setCleanupTime(cleanedAt);

    // 4. Trạng thái báo cáo di chuyển chi tiết
    const rawReport = localStorage.getItem('legalflow_migration_report');
    if (rawReport) {
      try {
        const report = JSON.parse(rawReport) as MigrationReport;
        setPendingCount(report.pendingCount);
        setFailedCount(report.failedCount);
      } catch {
        setPendingCount(cases.length);
        setFailedCount(0);
      }
    } else {
      setPendingCount(cases.length);
      setFailedCount(0);
    }

    // 5. Trạng thái hoàn thành di chuyển (completed)
    const completed = localStorage.getItem('legalflow_migration_completed') === 'true';
    setIsCompleted(completed);
  };

  useEffect(() => {
    updateMigrationStats();
    
    // Đăng ký event lắng nghe sự thay đổi của localStorage (khi chạy import trong MigrationPanel)
    const handleStorageChange = () => {
      updateMigrationStats();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Custom trigger event từ cùng một window
    const interval = setInterval(updateMigrationStats, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleExport = () => {
    try {
      const cases = storage.getCases();
      const dataStr = JSON.stringify(cases, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `legalflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      // Kích hoạt cờ sao lưu khi xuất backup
      localStorage.setItem('legalflow_migration_backed_up', 'true');
      updateMigrationStats();

      setSuccess('Đã tải xuống dữ liệu sao lưu thành công. Đã ghi nhận cờ sao lưu cục bộ.');
      setError(null);
    } catch {
      setError('Có lỗi xảy ra khi xuất dữ liệu.');
    }
  };

  const validateCases = (data: unknown): data is LegalCase[] => {
    if (!Array.isArray(data)) return false;
    for (const item of data) {
      if (!item.id || !item.caseId || !item.field || !item.status) return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateCases(json)) {
          if (window.confirm('Cảnh báo: Thao tác này sẽ ghi đè toàn bộ dữ liệu localStorage. Bạn có chắc không?')) {
            replaceCases(json);
            
            // Khôi phục lại trạng thái chưa dọn dẹp
            localStorage.removeItem('legalflow_local_cleanup_completed');
            localStorage.removeItem('legalflow_local_cleanup_completed_at');
            localStorage.removeItem('legalflow_migration_completed');
            localStorage.removeItem('legalflow_migration_report');
            localStorage.removeItem('legalflow_migration_backed_up');
            
            updateMigrationStats();
            setSuccess('Khôi phục dữ liệu localStorage thành công!');
            setError(null);
          }
        } else {
          setError('File không đúng định dạng dữ liệu LegalFlow.');
          setSuccess(null);
        }
      } catch {
        setError('Không thể đọc file. Vui lòng đảm bảo đây là file JSON hợp lệ.');
        setSuccess(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // QUY TRÌNH DỌN DẸP AN TOÀN VỚI XÁC NHẬN HAI LỚP (DOUBLE CONFIRM)
  const handleCleanupLocalStorage = () => {
    // Lớp 1
    const confirm1 = window.confirm(
      'CẢNH BÁO AN TOÀN:\n\n' +
      'Thao tác này sẽ XÓA VĨNH VIỄN toàn bộ dữ liệu hồ sơ cũ trong localStorage trên trình duyệt này.\n' +
      '• Hành động này HOÀN TOÀN KHÔNG ảnh hưởng hay làm mất bất kỳ dữ liệu nào trên Backend máy chủ.\n' +
      '• Bạn không thể tự động khôi phục dữ liệu cục bộ trừ khi đã tải xuống file sao lưu JSON trước đó.\n\n' +
      'Bạn có chắc chắn muốn tiến hành dọn dẹp bộ nhớ đệm này không?'
    );

    if (!confirm1) return;

    // Lớp 2
    const confirm2 = window.confirm(
      'ĐÂY LÀ XÁC NHẬN CUỐI CÙNG:\n\n' +
      'Hãy chắc chắn rằng bạn đã lưu trữ file backup JSON an toàn trên máy tính của mình.\n' +
      'Bấm OK một lần nữa để hoàn tất xóa sạch localStorage cục bộ.'
    );

    if (!confirm2) return;

    // Thực thi xóa an toàn tuyệt đối
    localStorage.removeItem('legalflow_cases');
    localStorage.removeItem('legalflow_migration_backed_up');
    localStorage.removeItem('legalflow_migration_completed');
    localStorage.removeItem('legalflow_migration_report');

    // Thiết lập marker dọn dẹp vĩnh viễn
    localStorage.setItem('legalflow_local_cleanup_completed', 'true');
    localStorage.setItem('legalflow_local_cleanup_completed_at', new Date().toISOString());

    updateMigrationStats();
    setSuccess('Đã dọn dẹp bộ nhớ localStorage cục bộ thành công! Dữ liệu backend an toàn tuyệt đối.');
    setError(null);
  };

  // Nút xóa chỉ hiển thị khi thỏa mãn 4 điều kiện an toàn
  const canCleanup = isBackedUp && isCompleted && pendingCount === 0 && failedCount === 0 && oldCasesCount > 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <h2 className="text-2xl font-bold tracking-tight">Cài đặt & Dữ liệu</h2>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-xl flex items-center gap-3 border border-destructive/20 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3 border border-emerald-500/20 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* DASHBOARD ĐÃ DỌN DẸP VĨNH VIỄN */}
      {isCleanedUp ? (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-6 space-y-4 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">Trình duyệt đã sạch sẽ!</h3>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                Dữ liệu `localStorage` cũ đã được dọn dẹp sạch sẽ và an toàn. Ứng dụng LegalFlow hiện đang vận hành trực tiếp,リアルタイム và ổn định 100% trên hệ thống máy chủ Backend đám mây.
              </p>
            </div>
          </div>

          <div className="border-t border-emerald-200/50 dark:border-emerald-800/20 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-4 w-4" />
              Thời gian dọn dẹp: {new Date(cleanupTime).toLocaleString('vi-VN')}
            </span>
            
            <div className="flex gap-2">
              <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs hover:bg-emerald-500/10 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold"
              >
                Khôi phục lại dữ liệu local (nếu cần)
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* MIGRATION STATUS DASHBOARD CARD */}
          {oldCasesCount > 0 && (
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <div className="flex items-start gap-3">
                <DatabaseZap className="h-6 w-6 text-primary shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Thống kê Bộ nhớ Cục bộ Cũ</h3>
                  <p className="text-xs text-muted-foreground">
                    Kiểm tra và kiểm soát tiến trình di chuyển dữ liệu localStorage lên máy chủ đám mây.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Tiêu chí 1: Số hồ sơ cục bộ */}
                <div className="border rounded-xl p-3.5 bg-secondary/10 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Hồ sơ local cũ:</span>
                  <span className="text-2xl font-black mt-2 text-foreground">{oldCasesCount}</span>
                </div>

                {/* Tiêu chí 2: Trạng thái Sao lưu */}
                <div className="border rounded-xl p-3.5 bg-secondary/10 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Trạng thái Sao lưu:</span>
                  <div className="mt-2">
                    {isBackedUp ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Đã sao lưu (JSON)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" /> Chưa sao lưu
                      </span>
                    )}
                  </div>
                </div>

                {/* Tiêu chí 3: Trạng thái Di chuyển */}
                <div className="border rounded-xl p-3.5 bg-secondary/10 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Trạng thái Di chuyển:</span>
                  <div className="mt-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Hoàn thành 100%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" /> Chưa hoàn thành
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RÀNG BUỘC CỔNG AN TOÀN ĐỂ XÓA LOCALSTORAGE */}
              {canCleanup ? (
                <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl space-y-3 animate-in slide-in-from-bottom duration-300">
                  <div className="flex gap-2.5 text-destructive">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">⚠️ Đã đủ điều kiện dọn dẹp bộ nhớ cục bộ cũ!</p>
                      <p className="text-xs opacity-90 mt-0.5">
                        Tất cả hồ sơ cũ đã được sao lưu ra file JSON và được di chuyển 100% lên máy chủ an toàn. Hệ thống khuyến cáo bạn nên thực hiện dọn dẹp để làm sạch trình duyệt.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleCleanupLocalStorage}
                    className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Xóa dữ liệu localStorage cũ
                  </Button>
                </div>
              ) : (
                <div className="bg-muted/40 border p-4 rounded-xl text-xs text-muted-foreground flex gap-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-500" />
                  <div>
                    <span className="font-semibold text-foreground">Lý do chưa thể dọn dẹp:</span>
                    <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                      <li className={isBackedUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500 font-medium'}>
                        {isBackedUp ? '✓ Đã tạo bản sao lưu dữ liệu cục bộ thành công.' : '• Cần bấm nút sao lưu dữ liệu local để tránh rủi ro mất mát.'}
                      </li>
                      <li className={isCompleted && pendingCount === 0 && failedCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500 font-medium'}>
                        {isCompleted && pendingCount === 0 && failedCount === 0 
                          ? '✓ 100% hồ sơ local đã được di chuyển/xử lý (không còn hồ sơ chờ hoặc lỗi).' 
                          : `• Vẫn còn ${pendingCount + failedCount} hồ sơ local cũ chưa xử lý hoàn tất.`}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Backup localStorage */}
          <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold">Sao lưu dữ liệu cục bộ</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tải xuống toàn bộ hồ sơ từ localStorage (dữ liệu cũ trước khi tích hợp backend) dưới dạng file JSON.
              </p>
            </div>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Tải dữ liệu localStorage xuống
            </Button>
          </div>

          {/* Restore localStorage */}
          <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-destructive">Khôi phục dữ liệu cục bộ</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tải lên file JSON bản sao lưu để khôi phục localStorage.{' '}
                <strong className="text-foreground">Lưu ý: Hành động này sẽ ghi đè toàn bộ dữ liệu localStorage hiện tại.</strong>
              </p>
            </div>
            <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            <Button variant="destructive" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Khôi phục từ file JSON
            </Button>
          </div>

          {/* Migration to Backend */}
          {oldCasesCount > 0 && (
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <div className="flex items-start gap-3">
                <DatabaseZap className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold">Migration dữ liệu lên Backend</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Chuyển hồ sơ từ localStorage sang backend API. Dữ liệu localStorage sẽ không bị xóa tự động
                    – bạn phải xác nhận thủ công sau khi import thành công.
                  </p>
                </div>
              </div>
              <MigrationPanel />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
