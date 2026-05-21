// ============================================================
// LoginPage.tsx – Màn hình đăng nhập
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../lib/apiClient';
import { Scale, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  // Nếu đã login → redirect dashboard
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Email hoặc mật khẩu không đúng.');
        } else if (err.status === 0) {
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend đang chạy.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
            <Scale className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LegalFlow</h1>
          <p className="text-slate-400 text-sm mt-1">Hệ thống quản lý hồ sơ pháp lý</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Đăng nhập</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
              <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@legalflow.local"
                className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Mật khẩu</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center">
              Tài khoản thử nghiệm: <span className="text-slate-400">admin@legalflow.local</span> / <span className="text-slate-400">Admin@123456</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          LegalFlow MVP – Chỉ dùng dữ liệu giả hoặc đã ẩn danh
        </p>
      </div>
    </div>
  );
}
