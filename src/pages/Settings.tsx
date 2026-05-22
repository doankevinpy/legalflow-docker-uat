import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  DatabaseZap, 
  Trash2, 
  Calendar, 
  ShieldAlert,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Sliders,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { storage } from '../utils/storage';
import { MigrationPanel } from '../components/migration/MigrationPanel';
import type { LegalCase } from '../types';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../lib/authApi';

interface MigrationReport {
  totalLocalCases: number;
  importedCount: number;
  alreadyMigratedCount: number;
  skippedCount: number;
  failedCount: number;
  pendingCount: number;
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { replaceCases } = useCases();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile');

  // Common notification states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Password strength check criteria
  const strengthCriteria = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[@$!%*?&#]/.test(newPassword),
  };
  const isPasswordStrong = Object.values(strengthCriteria).every(Boolean);

  // States quản lý trạng thái di chuyển và dọn dẹp (Tab Hệ thống)
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
    
    // Đăng ký event lắng nghe sự thay đổi của localStorage
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
    const confirm1 = window.confirm(
      'CẢNH BÁO AN TOÀN:\n\n' +
      'Thao tác này sẽ XÓA VĨNH VIỄN toàn bộ dữ liệu hồ sơ cũ trong localStorage trên trình duyệt này.\n' +
      '• Hành động này HOÀN TOÀN KHÔNG ảnh hưởng hay làm mất bất kỳ dữ liệu nào trên Backend máy chủ.\n' +
      '• Bạn không thể tự động khôi phục dữ liệu cục bộ trừ khi đã tải xuống file sao lưu JSON trước đó.\n\n' +
      'Bạn có chắc chắn muốn tiến hành dọn dẹp bộ nhớ đệm này không?'
    );

    if (!confirm1) return;

    const confirm2 = window.confirm(
      'ĐÂY LÀ XÁC NHẬN CUỐI CÙNG:\n\n' +
      'Hãy chắc chắn rằng bạn đã lưu trữ file backup JSON an sau khi tải xuống.\n' +
      'Bấm OK một lần nữa để hoàn tất xóa sạch localStorage cục bộ.'
    );

    if (!confirm2) return;

    localStorage.removeItem('legalflow_cases');
    localStorage.removeItem('legalflow_migration_backed_up');
    localStorage.removeItem('legalflow_migration_completed');
    localStorage.removeItem('legalflow_migration_report');

    localStorage.setItem('legalflow_local_cleanup_completed', 'true');
    localStorage.setItem('legalflow_local_cleanup_completed_at', new Date().toISOString());

    updateMigrationStats();
    setSuccess('Đã dọn dẹp bộ nhớ localStorage cục bộ thành công! Dữ liệu backend an toàn tuyệt đối.');
    setError(null);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear alerts
    setPasswordError(null);
    setPasswordSuccess(null);

    // Front-end validations
    if (!currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }

    if (!isPasswordStrong) {
      setPasswordError('Mật khẩu mới không đạt chuẩn bảo mật.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('Mật khẩu mới không được giống mật khẩu hiện tại.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    try {
      setIsChangingPassword(true);
      
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordSuccess(res.message || 'Thay đổi mật khẩu thành công. Hệ thống tự động đăng xuất sau 1.5 giây...');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Auto logout after 1.5s
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err: any) {
      const apiMsg = err?.message || err?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.';
      setPasswordError(apiMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/10 text-red-700 border border-red-500/20';
      case 'MANAGER':
        return 'bg-blue-500/10 text-blue-700 border border-blue-500/20';
      case 'STAFF':
        return 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 border border-slate-500/20';
    }
  };

  const canCleanup = isBackedUp && isCompleted && pendingCount === 0 && failedCount === 0 && oldCasesCount > 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý tài khoản cá nhân, thay đổi mật khẩu và cấu hình lưu trữ dữ liệu.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/80">
        <button
          onClick={() => {
            setActiveTab('profile');
            setError(null);
            setSuccess(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4.5 w-4.5" />
          Tài khoản của tôi
        </button>
        <button
          onClick={() => {
            setActiveTab('system');
            setError(null);
            setSuccess(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === 'system'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sliders className="h-4.5 w-4.5" />
          Cài đặt hệ thống & Dữ liệu
        </button>
      </div>

      {/* General Alert */}
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

      {/* ==================== TAB 1: PROFILE & PASSWORD ==================== */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Card thông tin user */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-black shadow-inner">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{user?.fullName || 'Người dùng'}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 mt-1.5 rounded-full text-xs font-bold ${getRoleBadgeColor(user?.role || '')}`}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 space-y-3.5 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Họ và tên:</span>
                  <span className="font-semibold text-foreground">{user?.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Địa chỉ Email:</span>
                  <span className="font-semibold text-foreground">{user?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Trạng thái tài khoản:</span>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form đổi mật khẩu */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <KeyRound className="h-5 w-5 text-primary shrink-0" />
                <h3 className="text-lg font-bold text-foreground">Đổi mật khẩu tài khoản</h3>
              </div>

              {passwordError && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-xl flex items-center gap-3 border border-destructive/20 shadow-sm animate-in fade-in duration-200">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">{passwordError}</p>
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3 border border-emerald-500/20 shadow-sm animate-in fade-in duration-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm font-medium">{passwordSuccess}</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-5">
                {/* Current password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Mật khẩu hiện tại <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại của bạn"
                      disabled={isChangingPassword}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background/50 hover:bg-background/80 focus:bg-background text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isChangingPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Mật khẩu mới <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="h-4.5 w-4.5 animate-pulse" />
                    </span>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, thường, số, ký tự đặc biệt"
                      disabled={isChangingPassword}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background/50 hover:bg-background/80 focus:bg-background text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isChangingPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {showNewPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  {/* Real-time Checklist */}
                  {newPassword.length > 0 && (
                    <div className="bg-secondary/20 rounded-xl p-3.5 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground animate-in slide-in-from-top duration-200">
                      <div className="col-span-1 sm:col-span-2 font-semibold text-foreground flex items-center gap-1.5">
                        <Sliders className="h-3.5 w-3.5 text-primary" /> Tiêu chuẩn mật khẩu bảo mật:
                      </div>
                      <div className={`flex items-center gap-1.5 font-medium ${strengthCriteria.minLength ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {strengthCriteria.minLength ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                        Độ dài từ 8 ký tự trở lên
                      </div>
                      <div className={`flex items-center gap-1.5 font-medium ${strengthCriteria.hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {strengthCriteria.hasUppercase ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                        Có chữ cái IN HOA (A-Z)
                      </div>
                      <div className={`flex items-center gap-1.5 font-medium ${strengthCriteria.hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {strengthCriteria.hasLowercase ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                        Có chữ viết thường (a-z)
                      </div>
                      <div className={`flex items-center gap-1.5 font-medium ${strengthCriteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {strengthCriteria.hasNumber ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                        Có chữ số (0-9)
                      </div>
                      <div className={`flex items-center gap-1.5 font-medium ${strengthCriteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {strengthCriteria.hasSpecial ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                        Có ký tự đặc biệt (@$!%*?&#)
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Xác nhận mật khẩu mới <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới để xác nhận"
                      disabled={isChangingPassword}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background/50 hover:bg-background/80 focus:bg-background text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isChangingPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <p className="text-[11px] font-bold text-destructive flex items-center gap-1 mt-1 animate-pulse">
                      <X className="h-3.5 w-3.5" /> Mật khẩu xác nhận chưa trùng khớp.
                    </p>
                  )}
                  {confirmPassword.length > 0 && newPassword === confirmPassword && (
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                      <Check className="h-3.5 w-3.5" /> Mật khẩu xác nhận trùng khớp hoàn toàn.
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword || !isPasswordStrong || newPassword !== confirmPassword}
                    className="w-full py-2.5 font-bold flex items-center justify-center gap-2 rounded-xl transition-all shadow-md active:scale-[0.99] disabled:scale-100 disabled:opacity-60"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Đang lưu thay đổi...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4.5 w-4.5" />
                        Cập nhật mật khẩu mới
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SYSTEM & LOCAL STORAGE ==================== */}
      {activeTab === 'system' && (
        <div className="space-y-6 animate-in fade-in duration-300">
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
                    Dữ liệu `localStorage` cũ đã được dọn dẹp sạch sẽ và an toàn. Ứng dụng LegalFlow hiện đang vận hành trực tiếp, thời gian thực và ổn định 100% trên hệ thống máy chủ Backend đám mây.
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
                    <div className="border rounded-xl p-3.5 bg-secondary/10 flex flex-col justify-between">
                      <span className="text-xs text-muted-foreground font-medium">Hồ sơ local cũ:</span>
                      <span className="text-2xl font-black mt-2 text-foreground">{oldCasesCount}</span>
                    </div>

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
                        <Trash2 className="h-4.5 w-4.5" /> Xóa dữ liệu localStorage cũ
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
                  <h3 className="text-lg font-bold text-foreground">Sao lưu dữ liệu cục bộ</h3>
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
                      <h3 className="text-lg font-bold text-foreground">Migration dữ liệu lên Backend</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Chuyển hồ sơ từ localStorage sang backend API. Dữ liệu localStorage sẽ không bị xóa tự động – bạn phải xác nhận thủ công sau khi import thành công.
                      </p>
                    </div>
                  </div>
                  <MigrationPanel />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
