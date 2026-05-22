import { useState, useEffect } from 'react';
import { usersApi } from '../lib/usersApi';
import type { CreateUserDto } from '../lib/usersApi';
import type { ApiUser } from '../lib/api-types';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../lib/apiClient';
import { Button } from '../components/ui/Button';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  AlertTriangle,
  X,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  UserX,
  UserCheck,
} from 'lucide-react';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateUserDto>({
    email: '',
    fullName: '',
    role: 'STAFF',
    passwordTemp: '',
  });
  const [resetPasswordTemp, setResetPasswordTemp] = useState('');
  
  // Password visibility
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Confirmation overlay state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: 'LOCK' | 'UNLOCK' | 'ROLE_CHANGE' | 'DELETE';
    userId: string;
    newRole?: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper validation for temporary passwords
  const validatePasswordComplexity = (password: string): string | null => {
    if (password.length < 8) {
      return 'Mật khẩu phải chứa ít nhất 8 ký tự';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa';
    }
    if (!/[a-z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ cái viết thường';
    }
    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ số';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*...)';
    }
    return null;
  };

  // Actions
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailTrimmed = createForm.email.trim().toLowerCase();
    if (!emailTrimmed) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!createForm.fullName.trim()) {
      setError('Vui lòng nhập họ và tên');
      return;
    }

    const passwordError = validatePasswordComplexity(createForm.passwordTemp);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const newUser = await usersApi.create({
        ...createForm,
        email: emailTrimmed,
      });
      setUsers([newUser, ...users]);
      setSuccess(`Đã tạo thành công tài khoản cho ${newUser.fullName} (${newUser.email}). Mật khẩu tạm thời đã được lưu an toàn.`);
      setIsCreateModalOpen(false);
      setCreateForm({
        email: '',
        fullName: '',
        role: 'STAFF',
        passwordTemp: '',
      });
      setShowCreatePassword(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Có lỗi xảy ra khi tạo người dùng.');
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError(null);
    setSuccess(null);

    const passwordError = validatePasswordComplexity(resetPasswordTemp);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await usersApi.resetPassword(selectedUser.id, resetPasswordTemp);
      setSuccess(`Đã đặt lại mật khẩu tạm thời thành công cho tài khoản ${selectedUser.fullName} (${selectedUser.email}).`);
      setIsResetPasswordModalOpen(false);
      setResetPasswordTemp('');
      setSelectedUser(null);
      setShowResetPassword(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Có lỗi xảy ra khi đặt lại mật khẩu.');
      }
    }
  };

  const triggerConfirm = (
    actionType: 'LOCK' | 'UNLOCK' | 'ROLE_CHANGE' | 'DELETE',
    user: ApiUser,
    newRole?: string
  ) => {
    let title = '';
    let message = '';

    switch (actionType) {
      case 'LOCK':
        title = 'Khóa tài khoản';
        message = `Bạn có chắc chắn muốn KHÓA tài khoản của ${user.fullName} (${user.email})? Người dùng này sẽ lập tức không thể đăng nhập hoặc thực hiện thao tác trên hệ thống.`;
        break;
      case 'UNLOCK':
        title = 'Mở khóa tài khoản';
        message = `Bạn có chắc chắn muốn MỞ KHÓA tài khoản cho ${user.fullName} (${user.email})?`;
        break;
      case 'ROLE_CHANGE':
        title = 'Thay đổi vai trò';
        message = `Bạn có chắc chắn muốn thay đổi vai trò của ${user.fullName} thành [${newRole}]?`;
        break;
      case 'DELETE':
        title = 'Xóa tài khoản vĩnh viễn';
        message = `CẢNH BÁO: Hành động này KHÔNG thể hoàn tác! Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản ${user.fullName} (${user.email}) khỏi hệ thống?`;
        break;
    }

    setConfirmConfig({
      isOpen: true,
      title,
      message,
      actionType,
      userId: user.id,
      newRole,
    });
  };

  const executeConfirmAction = async () => {
    if (!confirmConfig) return;
    const { actionType, userId, newRole } = confirmConfig;
    setConfirmConfig(null);
    setError(null);
    setSuccess(null);

    try {
      if (actionType === 'LOCK' || actionType === 'UNLOCK') {
        const isActive = actionType === 'UNLOCK';
        const updated = await usersApi.update(userId, { isActive });
        setUsers(users.map(u => u.id === userId ? updated : u));
        setSuccess(`Đã ${isActive ? 'mở khóa' : 'khóa'} tài khoản thành công.`);
      } else if (actionType === 'ROLE_CHANGE' && newRole) {
        const updated = await usersApi.update(userId, { role: newRole });
        setUsers(users.map(u => u.id === userId ? updated : u));
        setSuccess(`Đã chuyển vai trò tài khoản sang ${newRole} thành công.`);
      } else if (actionType === 'DELETE') {
        await usersApi.delete(userId);
        setUsers(users.filter(u => u.id !== userId));
        setSuccess('Đã xóa tài khoản thành công.');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('Không thể xóa tài khoản này vì đã có dữ liệu nghiệp vụ liên kết. Hãy khóa tài khoản thay thế.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Có lỗi xảy ra khi thực hiện thao tác.');
      }
    }
  };

  // Filters calculation
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesStatus =
      statusFilter !== ''
        ? statusFilter === 'active'
          ? u.isActive === true
          : u.isActive === false
        : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20';
      case 'MANAGER':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20';
      case 'STAFF':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20';
      default: // VIEWER
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20';
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(w => w[0])
      .slice(-2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Quản lý tài khoản người dùng
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Quản trị viên hệ thống có quyền tạo tài khoản mới, phân quyền tác nghiệp (Admin, Manager, Staff, Viewer), cấp lại mật khẩu tạm thời hoặc tạm khóa người dùng.
          </p>
        </div>
        <div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Tạo tài khoản mới
          </Button>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-xl flex items-start gap-3 border border-destructive/20 shadow-sm animate-in fade-in duration-200">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Đã xảy ra lỗi</h4>
            <p className="text-sm mt-0.5 font-medium">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3 border border-emerald-500/20 shadow-sm animate-in fade-in duration-200">
          <Check className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h4 className="font-bold text-sm">Thao tác thành công</h4>
            <p className="text-sm mt-0.5 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Filters Area */}
      <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-secondary/40">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-bold">Bộ lọc & Tìm kiếm</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo họ tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN (Quản trị)</option>
              <option value="MANAGER">MANAGER (Quản lý)</option>
              <option value="STAFF">STAFF (Chuyên viên)</option>
              <option value="VIEWER">VIEWER (Chỉ xem)</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Đã bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải danh sách người dùng...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Users className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Không tìm thấy người dùng</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Không tìm thấy kết quả phù hợp với từ khóa hoặc bộ lọc đã chọn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/40 border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  <th className="px-6 py-4">Thành viên</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/40">
                {filteredUsers.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-secondary/10 transition-colors group"
                    >
                      {/* Avatar & Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm shrink-0">
                            <span className="text-xs font-black text-primary">
                              {getUserInitials(user.fullName)}
                            </span>
                          </div>
                          <div className="ml-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">
                                {user.fullName}
                              </span>
                              {isSelf && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-primary/10 text-primary uppercase">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground block">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role selection dropdown or badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={isSelf} // Self role protection
                            value={user.role}
                            onChange={(e) => triggerConfirm('ROLE_CHANGE', user, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${getRoleBadgeStyle(
                              user.role
                            )}`}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="STAFF">STAFF</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                        </div>
                      </td>

                      {/* Active Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            user.isActive
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck className="h-3 w-3" /> Hoạt động
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3" /> Đã bị khóa
                            </>
                          )}
                        </span>
                      </td>

                      {/* Creation date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          {/* Toggle Lock / Unlock */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isSelf} // Self lock protection
                            onClick={() =>
                              triggerConfirm(user.isActive ? 'LOCK' : 'UNLOCK', user)
                            }
                            className={`h-8 w-8 rounded-lg ${
                              user.isActive
                                ? 'hover:bg-amber-500/10 hover:text-amber-600'
                                : 'hover:bg-emerald-500/10 hover:text-emerald-600'
                            }`}
                            title={
                              isSelf
                                ? 'Bạn không thể tự khóa tài khoản của chính mình'
                                : user.isActive
                                ? 'Khóa tài khoản'
                                : 'Mở khóa tài khoản'
                            }
                          >
                            {user.isActive ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Reset Password */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-600"
                            title="Đặt lại mật khẩu tạm"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>

                          {/* Hard Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isSelf} // Self delete protection
                            onClick={() => triggerConfirm('DELETE', user)}
                            className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-600 text-muted-foreground hover:text-rose-600 disabled:opacity-30"
                            title={
                              isSelf ? 'Bạn không thể tự xóa tài khoản của chính mình' : 'Xóa tài khoản'
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Thêm tài khoản mới</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Họ và tên <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={createForm.fullName}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, fullName: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email đăng nhập <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Vai trò hệ thống <span className="text-destructive">*</span>
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                  <option value="MANAGER">MANAGER (Quản lý hồ sơ)</option>
                  <option value="STAFF">STAFF (Chuyên viên xử lý)</option>
                  <option value="VIEWER">VIEWER (Thanh tra / Chỉ xem)</option>
                </select>
              </div>

              {/* Temporary Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                  <span>Mật khẩu tạm thời <span className="text-destructive">*</span></span>
                  <span className="text-[10px] lowercase text-muted-foreground">(Cung cấp riêng cho người dùng)</span>
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    placeholder="Mật khẩu bảo mật..."
                    value={createForm.passwordTemp}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, passwordTemp: e.target.value })
                    }
                    className="h-10 w-full pr-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showCreatePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength indicators */}
                <div className="pt-2 space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground">Điều kiện bảo mật mật khẩu:</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                    <div className="flex items-center gap-1">
                      {createForm.passwordTemp.length >= 8 ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={createForm.passwordTemp.length >= 8 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Tối thiểu 8 ký tự</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[A-Z]/.test(createForm.passwordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[A-Z]/.test(createForm.passwordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Chữ hoa (A-Z)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[a-z]/.test(createForm.passwordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[a-z]/.test(createForm.passwordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Chữ thường (a-z)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(createForm.passwordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[0-9]/.test(createForm.passwordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Có chữ số (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      {/[!@#$%^&*(),.?":{}|<>]/.test(createForm.passwordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[!@#$%^&*(),.?":{}|<>]/.test(createForm.passwordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Ký tự đặc biệt (!@#$%^&*...)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={!!validatePasswordComplexity(createForm.passwordTemp)}
                >
                  Lưu tài khoản
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Đặt lại mật khẩu tạm</h3>
              </div>
              <button
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setSelectedUser(null);
                  setResetPasswordTemp('');
                }}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="bg-secondary/30 rounded-xl p-4 border space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Tài khoản đích:</p>
                <p className="text-sm font-bold text-foreground">{selectedUser.fullName}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
              </div>

              {/* Temporary Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mật khẩu tạm thời mới <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Mật khẩu bảo mật mới..."
                    value={resetPasswordTemp}
                    onChange={(e) => setResetPasswordTemp(e.target.value)}
                    className="h-10 w-full pr-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength indicators */}
                <div className="pt-2 space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground">Điều kiện bảo mật mật khẩu:</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                    <div className="flex items-center gap-1">
                      {resetPasswordTemp.length >= 8 ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={resetPasswordTemp.length >= 8 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Tối thiểu 8 ký tự</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[A-Z]/.test(resetPasswordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[A-Z]/.test(resetPasswordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Chữ hoa (A-Z)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[a-z]/.test(resetPasswordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[a-z]/.test(resetPasswordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Chữ thường (a-z)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(resetPasswordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[0-9]/.test(resetPasswordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Có chữ số (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      {/[!@#$%^&*(),.?":{}|<>]/.test(resetPasswordTemp) ? (
                        <Check className="h-3 w-3 text-emerald-500 font-bold shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={/[!@#$%^&*(),.?":{}|<>]/.test(resetPasswordTemp) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>Ký tự đặc biệt (!@#$%^&*...)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsResetPasswordModalOpen(false);
                    setSelectedUser(null);
                    setResetPasswordTemp('');
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={!!validatePasswordComplexity(resetPasswordTemp)}
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION OVERLAY */}
      {confirmConfig?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-2xl p-6 scale-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{confirmConfig.title}</h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {confirmConfig.message}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfirmConfig(null)}
              >
                Hủy bỏ
              </Button>
              <Button
                variant={confirmConfig.actionType === 'DELETE' ? 'destructive' : 'default'}
                onClick={executeConfirmAction}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
