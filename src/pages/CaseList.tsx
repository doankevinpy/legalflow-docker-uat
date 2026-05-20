import { useState } from 'react';
import { useCases } from '../hooks/useCases';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Search, Filter, Plus, ChevronRight, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeadlineStatus } from '../utils/deadline';

export default function CaseList() {
  const { cases } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<string>('all');

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesField = fieldFilter === 'all' || c.field === fieldFilter;
    
    let matchesDeadline = true;
    if (deadlineFilter !== 'all') {
      const dlStatus = getDeadlineStatus(c);
      if (deadlineFilter === 'overdue') matchesDeadline = dlStatus === 'overdue';
      else if (deadlineFilter === 'soon') matchesDeadline = dlStatus === 'soon';
    }

    return matchesSearch && matchesStatus && matchesField && matchesDeadline;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Danh sách hồ sơ</h2>
        <Link to="/cases/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Tạo hồ sơ mới</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã, tên, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Mới tiếp nhận">Mới tiếp nhận</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Cần bổ sung">Cần bổ sung</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đóng">Đóng</option>
            </select>
          </div>
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tất cả lĩnh vực</option>
            <option value="Đất đai">Đất đai</option>
            <option value="Dân sự">Dân sự</option>
            <option value="Lao động">Lao động</option>
            <option value="Hôn nhân gia đình">Hôn nhân gia đình</option>
            <option value="Doanh nghiệp">Doanh nghiệp</option>
            <option value="Hành chính">Hành chính</option>
            <option value="Khác">Khác</option>
          </select>
          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tất cả thời hạn</option>
            <option value="overdue">Quá hạn</option>
            <option value="soon">Sắp đến hạn</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Mã hồ sơ</th>
                <th className="px-6 py-4 font-medium">Người gửi</th>
                <th className="px-6 py-4 font-medium">Lĩnh vực</th>
                <th className="px-6 py-4 font-medium">Ngày tiếp nhận</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCases.map((c) => {
                const dlStatus = getDeadlineStatus(c);
                let rowBg = "hover:bg-secondary/30";
                if (dlStatus === 'overdue') rowBg = "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40";
                else if (dlStatus === 'soon') rowBg = "bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40";

                return (
                  <tr key={c.id} className={`${rowBg} transition-colors group`}>
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      {c.caseId}
                      {dlStatus === 'overdue' && <span title="Quá hạn"><CalendarClock className="h-4 w-4 text-red-600" /></span>}
                      {dlStatus === 'soon' && <span title="Sắp đến hạn"><CalendarClock className="h-4 w-4 text-orange-500" /></span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{c.senderName}</div>
                      <div className="text-xs text-muted-foreground">{c.contactInfo}</div>
                    </td>
                    <td className="px-6 py-4">{c.field}</td>
                    <td className="px-6 py-4">
                      <div>{format(new Date(c.receivedDate), 'dd/MM/yyyy', { locale: vi })}</div>
                      {c.deadlineDate && (
                         <div className={`text-xs mt-1 ${dlStatus === 'overdue' ? 'text-red-600 font-medium' : dlStatus === 'soon' ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                           Hạn: {format(new Date(c.deadlineDate), 'dd/MM/yyyy', { locale: vi })}
                         </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/cases/${c.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Chi tiết <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Không tìm thấy hồ sơ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
