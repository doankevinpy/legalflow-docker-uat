import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/cases': 'Danh sách hồ sơ',
  '/cases/new': 'Tạo hồ sơ mới',
  '/drafts': 'Dự thảo văn bản',
  '/anonymizer': 'Công cụ Ẩn danh',
  '/settings': 'Cài đặt',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  
  // Try to find exact match first, then fallback to dynamic routes
  let title = routeNames[location.pathname];
  if (!title) {
    if (location.pathname.startsWith('/cases/')) {
      title = 'Chi tiết hồ sơ';
    } else {
      title = 'LegalFlow';
    }
  }

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
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <button
            type="button"
            className="relative rounded-full bg-background p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            <span className="sr-only">Xem thông báo</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
