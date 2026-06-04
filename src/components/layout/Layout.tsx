import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const envLabel = import.meta.env.VITE_APP_ENV_LABEL || 'MVP';
  const showBanner = import.meta.env.VITE_SHOW_ENV_BANNER !== 'false';

  useEffect(() => {
    if (envLabel === 'OFFICIAL_PILOT') {
      document.title = '[OFFICIAL PILOT] LegalFlow';
    } else if (envLabel === 'MVP') {
      document.title = '[MVP] LegalFlow';
    } else {
      document.title = 'LegalFlow';
    }
  }, [envLabel]);

  return (
    <div className="flex h-screen bg-secondary/30 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {/* Dynamic Warning Banner */}
        {showBanner && (
          envLabel === 'OFFICIAL_PILOT' ? (
            <div className="bg-orange-50 border-b border-orange-200 px-4 py-2.5 flex items-center gap-2 text-orange-950 text-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-orange-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <span>
                <strong>HỆ THỐNG LEGALFLOW ĐANG VẬN HÀNH THEO MÔ HÌNH PILOT CHÍNH THỨC CÓ KIỂM SOÁT.</strong> CHỈ NHẬP, SỬA, TẢI LÊN HỒ SƠ THUỘC PHẠM VI ĐƯỢC PHÊ DUYỆT.
              </span>
            </div>
          ) : (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2 text-amber-800 text-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-amber-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <span>
                <strong>LegalFlow đang ở giai đoạn MVP.</strong> Chỉ sử dụng dữ liệu giả hoặc dữ liệu đã ẩn danh. Không nhập dữ liệu pháp lý thật, dữ liệu cá nhân hoặc hồ sơ nhạy cảm.
              </span>
            </div>
          )
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
