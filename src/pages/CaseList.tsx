import { useState, useEffect, useCallback } from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Search, Filter, Plus, ChevronRight, CalendarClock, ChevronLeft, Loader2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { casesApi } from '../lib/casesApi';
import { ApiError } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { canCreate, canDelete } from '../lib/rbac';
import { getDeadlineStatus } from '../utils/deadline';
import {
  CASE_TYPE_CODES, CASE_TYPE_LABELS,
  CASE_FIELD_CODES, CASE_FIELD_LABELS,
  CASE_STATUS_CODES, CASE_STATUS_LABELS,
  NEIGHBORHOOD_CODES,
  type CaseFieldCode,
} from '../lib/constants';
import type { ApiCase } from '../lib/api-types';

const LIMIT = 15;

export default function CaseList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role ?? 'VIEWER';

  const [cases, setCases]     = useState<ApiCase[]>([]);
  const [total, setTotal]     = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]       = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]     = useState('');
  const [deleteError, setDeleteError] = useState('');

  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fieldFilter, setFieldFilter]   = useState('');
  const [typeFilter, setTypeFilter]     = useState('');
  const [neighborhoodFilter, setNH]     = useState('');
  const [deadlineFilter, setDL]         = useState('');

  const load = useCallback(async (p: number = page) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await casesApi.getCases({
        search: search || undefined,
        status: statusFilter || undefined,
        field: fieldFilter || undefined,
        type: typeFilter || undefined,
        neighborhood: neighborhoodFilter || undefined,
        page: p,
        limit: LIMIT,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setCases(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lỗi tải danh sách hồ sơ');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, fieldFilter, typeFilter, neighborhoodFilter, page]);

  // Load on filter/page change
  useEffect(() => { load(page); }, [page]); // eslint-disable-line

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1);
  };

  const handleFilterChange = () => {
    setPage(1);
    load(1);
  };

  const handleDelete = async (id: string, caseCode: string) => {
    setDeleteError('');
    if (!window.confirm(`Xóa hồ sơ ${caseCode}? Hành động này sẽ lưu vào lịch sử (soft delete).`)) return;
    try {
      await casesApi.deleteCase(id);
      load(page);
    } catch (err) {
      if (err instanceof ApiError) {
        setDeleteError(err.status === 403 ? 'Bạn không có quyền xóa hồ sơ này.' : err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Danh sách hồ sơ</h2>
        {canCreate(role) && (
          <Link to="/cases/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Tạo hồ sơ mới</Button>
          </Link>
        )}
      </div>

      {deleteError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{deleteError}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-card p-4 rounded-xl shadow-sm border">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã, tên, nội dung..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); handleFilterChange(); }}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Tất cả trạng thái</option>
            {CASE_STATUS_CODES.map(c => (
              <option key={c} value={c}>{CASE_STATUS_LABELS[c]}</option>
            ))}
          </select>

          <select value={fieldFilter} onChange={e => { setFieldFilter(e.target.value); handleFilterChange(); }}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Tất cả lĩnh vực</option>
            {CASE_FIELD_CODES.map(c => (
              <option key={c} value={c}>{CASE_FIELD_LABELS[c]}</option>
            ))}
          </select>

          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); handleFilterChange(); }}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Tất cả loại đơn</option>
            {CASE_TYPE_CODES.map(c => (
              <option key={c} value={c}>{CASE_TYPE_LABELS[c]}</option>
            ))}
          </select>

          <select value={neighborhoodFilter} onChange={e => { setNH(e.target.value); handleFilterChange(); }}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Tất cả khu phố</option>
            {NEIGHBORHOOD_CODES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={deadlineFilter} onChange={e => setDL(e.target.value)}
            className="bg-background border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Tất cả thời hạn</option>
            <option value="overdue">Quá hạn</option>
            <option value="soon">Sắp đến hạn</option>
          </select>

          <Button type="button" size="sm" onClick={() => { setPage(1); load(1); }}>Tìm</Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Mã hồ sơ</th>
                <th className="px-6 py-4 font-medium">Người gửi</th>
                <th className="px-6 py-4 font-medium">Lĩnh vực</th>
                <th className="px-6 py-4 font-medium">Khu phố</th>
                <th className="px-6 py-4 font-medium">Ngày tiếp nhận</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : cases.filter(c => {
                if (!deadlineFilter) return true;
                const dlStatus = getDeadlineStatus(c);
                return dlStatus === deadlineFilter;
              }).map((c) => {
                const dlStatus = getDeadlineStatus(c);
                let rowBg = 'hover:bg-secondary/30';
                if (dlStatus === 'overdue') rowBg = 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40';
                else if (dlStatus === 'soon') rowBg = 'bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40';

                return (
                  <tr key={c.id} className={`${rowBg} transition-colors group`}>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        {c.caseCode}
                        {dlStatus === 'overdue' && <span title="Quá hạn"><CalendarClock className="h-4 w-4 text-red-600" /></span>}
                        {dlStatus === 'soon' && <span title="Sắp đến hạn"><CalendarClock className="h-4 w-4 text-orange-500" /></span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{c.senderName}</div>
                      <div className="text-xs text-muted-foreground">{c.contact}</div>
                    </td>
                    <td className="px-6 py-4">{CASE_FIELD_LABELS[c.field as CaseFieldCode] ?? c.field}</td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{c.neighborhood}</td>
                    <td className="px-6 py-4">
                      <div>{format(new Date(c.createdAt), 'dd/MM/yyyy', { locale: vi })}</div>
                      {c.deadline && (
                        <div className={`text-xs mt-1 ${dlStatus === 'overdue' ? 'text-red-600 font-medium' : dlStatus === 'soon' ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                          Hạn: {format(new Date(c.deadline), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canDelete(role) && (
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(c.id, c.caseCode)}
                            title="Xóa mềm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${c.id}`)}>
                          Chi tiết <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && cases.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Không tìm thấy hồ sơ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Hiển thị {cases.length} / {total} hồ sơ
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Trang {page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
