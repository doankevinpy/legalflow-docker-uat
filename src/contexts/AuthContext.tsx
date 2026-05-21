// ============================================================
// AuthContext.tsx – Quản lý trạng thái xác thực toàn app
// Token lưu sessionStorage (mất khi đóng tab – MVP)
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/authApi';
import { clearToken, saveToken } from '../lib/apiClient';
import type { ApiUser } from '../lib/api-types';

interface AuthContextValue {
  user: ApiUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Logout handler (dùng useCallback để không re-create mỗi render)
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  // Khởi tạo: đọc token → validate profile
  useEffect(() => {
    const token = sessionStorage.getItem('lf_access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi.getProfile()
      .then(profile => setUser(profile))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Lắng nghe sự kiện 401 từ apiClient để tự logout
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('lf:unauthorized', handler);
    return () => window.removeEventListener('lf:unauthorized', handler);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await authApi.login(email, password);
    saveToken(accessToken);
    const profile = await authApi.getProfile();
    setUser(profile);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
