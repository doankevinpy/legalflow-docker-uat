import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  PlusCircle, 
  FileText,
  Scale,
  Settings,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Danh sách hồ sơ', href: '/cases', icon: FolderOpen },
  { name: 'Tạo mới', href: '/cases/new', icon: PlusCircle },
  { name: 'Dự thảo văn bản', href: '/drafts', icon: FileText },
  { name: 'Công cụ Ẩn danh', href: '/anonymizer', icon: Shield },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-card border-r shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <Scale className="h-8 w-8 text-primary" />
        <span className="ml-3 text-xl font-bold tracking-tight">LegalFlow</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.href === '/cases' 
            ? location.pathname === '/cases' 
            : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors
                  ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">NV</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">Nhân viên</p>
            <p className="text-xs text-muted-foreground">Local Version</p>
          </div>
        </div>
      </div>
    </div>
  );
}
