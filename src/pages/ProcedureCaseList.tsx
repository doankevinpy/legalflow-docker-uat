import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { procedureCasesApi } from '../lib/procedureCasesApi';
import type { ProcedureCase, ProcedureType, ProcedureField, ProcedureStatus } from '../types/procedure';
import { useAuth } from '../contexts/AuthContext';
import { canCreate } from '../lib/rbac';
import { getApiErrorMessage } from '../lib/apiClient';

export default function ProcedureCaseList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? 'VIEWER';
  const [cases, setCases] = useState<ProcedureCase[]>([]);
  const [types, setTypes] = useState<ProcedureType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [keyword, setKeyword] = useState<string>('');

  // Modal create state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    procedureTypeId: '',
    field: 'DAT_DAI' as ProcedureField,
    applicantName: '',
    applicantAddress: '',
    applicantPhone: '',
    parcelNumber: '',
    mapSheetNumber: '',
    parcelArea: '',
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [typesRes, casesRes] = await Promise.all([
        procedureCasesApi.getProcedureTypes(),
        procedureCasesApi.getCases({
          field: fieldFilter ? (fieldFilter as ProcedureField) : undefined,
          status: statusFilter ? (statusFilter as ProcedureStatus) : undefined,
          keyword: keyword || undefined,
        }),
      ]);
      setTypes(typesRes);
      setCases(casesRes.data || []);
    } catch (err: any) {
      console.error('Error fetching procedure cases:', err);
      setError(getApiErrorMessage(err) || 'Không tải được danh sách hồ sơ từ máy chủ (lỗi kết nối hoặc API phản hồi lỗi).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fieldFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.procedureTypeId || !formData.applicantName) {
      alert('Vui lòng chọn loại thủ tục và nhập họ tên người nộp hồ sơ');
      return;
    }

    try {
      const selectedType = types.find((t) => t.id === formData.procedureTypeId);
      const field = selectedType ? selectedType.field : formData.field;

      const created = await procedureCasesApi.createCase({
        procedureTypeId: formData.procedureTypeId,
        field,
        applicantName: formData.applicantName,
        applicantAddress: formData.applicantAddress,
        applicantPhone: formData.applicantPhone,
        landParcelSummary: {
          parcelNumber: formData.parcelNumber,
          mapSheetNumber: formData.mapSheetNumber,
          area: formData.parcelArea,
        },
        notes: formData.notes,
      });

      setShowCreateModal(false);
      setFormData({
        procedureTypeId: '',
        field: 'DAT_DAI',
        applicantName: '',
        applicantAddress: '',
        applicantPhone: '',
        parcelNumber: '',
        mapSheetNumber: '',
        parcelArea: '',
        notes: '',
      });
      fetchData();
      if (created?.id) {
        navigate(`/procedure-cases/${created.id}`);
      }
    } catch (err: any) {
      alert('Lỗi tạo hồ sơ: ' + (err?.message || 'Không xác định'));
    }
  };

  const formatField = (field: string) => {
    switch (field) {
      case 'DAT_DAI':
        return 'Đất đai';
      case 'XAY_DUNG':
        return 'Xây dựng';
      default:
        return 'Khác';
    }
  };

  const formatStatusInfo = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'Mới tiếp nhận', className: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'IN_REVIEW':
        return { label: 'Đang thẩm tra', className: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'SUPPLEMENT_REQUIRED':
        return { label: 'Cần bổ sung', className: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'PENDING_APPROVAL':
        return { label: 'Chờ phê duyệt', className: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'COMPLETED':
        return { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'REJECTED':
        return { label: 'Từ chối', className: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const sortedCases = cases.slice().sort((a, b) => {
    const dateA = new Date(a.receivedAt || a.createdAt).getTime();
    const dateB = new Date(b.receivedAt || b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ Thủ tục Hành chính (TTHC)</h1>
          <p className="text-sm text-gray-500">Quản lý và thẩm tra hồ sơ TTHC Đất đai & Xây dựng</p>
        </div>
        {canCreate(role) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            + Tiếp nhận hồ sơ TTHC
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Tìm theo mã hồ sơ, tên người nộp, SĐT..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            Tìm kiếm
          </button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="">Tất cả lĩnh vực</option>
            <option value="DAT_DAI">Đất đai</option>
            <option value="XAY_DUNG">Xây dựng</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="SUBMITTED">Mới tiếp nhận</option>
            <option value="IN_REVIEW">Đang thẩm tra</option>
            <option value="SUPPLEMENT_REQUIRED">Cần bổ sung</option>
            <option value="PENDING_APPROVAL">Chờ phê duyệt</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="px-3 py-2 border rounded-lg text-sm bg-white font-medium text-slate-700"
          >
            <option value="newest">📅 Mới nhất trước</option>
            <option value="oldest">📅 Cũ nhất trước</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Đang tải danh sách hồ sơ...</span>
          </div>
        ) : error ? (
          <div className="p-10 text-center bg-rose-50/50 space-y-4 max-w-xl mx-auto my-6 rounded-2xl border border-rose-200">
            <div className="text-3xl">⚠️</div>
            <div className="space-y-1">
              <h3 className="font-bold text-rose-900 text-base">Không tải được danh sách hồ sơ</h3>
              <p className="text-xs text-rose-800 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm transition"
            >
              <span>🔄</span> Thử lại / Refresh
            </button>
          </div>
        ) : sortedCases.length === 0 ? (
          <div className="p-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-6 mx-6 space-y-3">
            <div className="text-3xl">📭</div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">Chưa có hồ sơ thủ tục hành chính phù hợp</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Không tìm thấy hồ sơ nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Vui lòng thử xóa từ khóa tìm kiếm hoặc bấm nút "Tiếp nhận hồ sơ TTHC" để tạo mới.
              </p>
            </div>
            {(keyword || fieldFilter || statusFilter) && (
              <button
                onClick={() => {
                  setKeyword('');
                  setFieldFilter('');
                  setStatusFilter('');
                }}
                className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition shadow-2xs"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase font-semibold text-gray-500">
                <th className="p-4">Mã hồ sơ</th>
                <th className="p-4">Lĩnh vực</th>
                <th className="p-4">Loại thủ tục</th>
                <th className="p-4">Người nộp</th>
                <th className="p-4">Ngày tiếp nhận</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {sortedCases.map((c) => {
                const statusInfo = formatStatusInfo(c.status);
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/procedure-cases/${c.id}`)}
                  >
                    <td className="p-4 font-mono font-bold text-blue-600">{c.caseCode}</td>
                    <td className="p-4 font-medium text-gray-700">{formatField(c.field)}</td>
                    <td className="p-4 text-gray-600 max-w-[220px] truncate">{c.procedureType?.name || '---'}</td>
                    <td className="p-4 font-medium text-gray-800">
                      <div>{c.applicantName}</div>
                      {c.applicantPhone && <div className="text-xs text-gray-500">{c.applicantPhone}</div>}
                    </td>
                    <td className="p-4 text-gray-600">{new Date(c.receivedAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/procedure-cases/${c.id}`);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      Xem chi tiết &rarr;
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Tiếp nhận hồ sơ Thủ tục hành chính</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Loại thủ tục <span className="text-red-500">*</span></label>
                <select
                  required
                  value={formData.procedureTypeId}
                  onChange={(e) => setFormData({ ...formData, procedureTypeId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">-- Chọn loại thủ tục --</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{formatField(t.field)}] {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Họ tên người nộp <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.applicantPhone}
                    onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Số tờ bản đồ / thửa đất</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={formData.mapSheetNumber}
                      onChange={(e) => setFormData({ ...formData, mapSheetNumber: e.target.value })}
                      placeholder="Tờ"
                      className="w-1/2 px-2 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={formData.parcelNumber}
                      onChange={(e) => setFormData({ ...formData, parcelNumber: e.target.value })}
                      placeholder="Thửa"
                      className="w-1/2 px-2 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Địa chỉ người nộp / thửa đất</label>
                <input
                  type="text"
                  value={formData.applicantAddress}
                  onChange={(e) => setFormData({ ...formData, applicantAddress: e.target.value })}
                  placeholder="Phường/Xã, Quận/Huyện..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Ghi chú tiếp nhận</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thêm..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm"
                >
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
