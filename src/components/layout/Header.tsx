import { Menu, LogOut, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/cases': 'Danh sách hồ sơ',
  '/procedure-cases': 'Hồ sơ Thủ tục Hành chính',
  '/legal-knowledge': 'Kho căn cứ pháp lý',
  '/cases/new': 'Tạo hồ sơ mới',
  '/drafts': 'Dự thảo văn bản',
  '/anonymizer': 'Công cụ Ẩn danh',
  '/settings': 'Cài đặt',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  MANAGER: 'Quản lý',
  STAFF: 'Nhân viên',
  VIEWER: 'Xem',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  MANAGER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  STAFF: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  VIEWER: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  let title = routeNames[location.pathname];
  if (!title) {
    if (location.pathname.startsWith('/cases/')) {
      title = 'Chi tiết hồ sơ';
    } else if (location.pathname.startsWith('/procedure-cases/')) {
      title = 'Chi tiết hồ sơ TTHC';
    } else {
      title = 'LegalFlow';
    }
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : 'NV';

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <button
        type="button"
        className="border-r px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Mở sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>

        <div className="ml-4 flex items-center gap-3">
          {user && (
            <>
              {/* Role badge */}
              <span
                className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[user.role] ?? ROLE_COLORS.VIEWER}`}
              >
                {ROLE_LABELS[user.role] ?? user.role}
              </span>

              {/* User info */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{initials}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium leading-none">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Mobile: user icon */}
              <div className="sm:hidden h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>

              {/* Logout */}
              <button
                id="btn-logout"
                type="button"
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Đăng xuất</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
