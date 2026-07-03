import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { procedureCasesApi } from '../lib/procedureCasesApi';
import type { ProcedureCase, ProcedureType, ProcedureField, ProcedureStatus } from '../types/procedure';

export default function ProcedureCaseList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<ProcedureCase[]>([]);
  const [types, setTypes] = useState<ProcedureType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fieldFilter, setFieldFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
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
    } catch (err) {
      console.error('Error fetching procedure cases:', err);
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

  const formatStatus = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Mới tiếp nhận';
      case 'IN_REVIEW':
        return 'Đang thẩm tra';
      case 'SUPPLEMENT_REQUIRED':
        return 'Cần bổ sung';
      case 'PENDING_APPROVAL':
        return 'Chờ phê duyệt';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'REJECTED':
        return 'Từ chối';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ Thủ tục Hành chính (TTHC)</h1>
          <p className="text-sm text-gray-500">Quản lý và thẩm tra hồ sơ TTHC Đất đai & Xây dựng</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          + Tiếp nhận hồ sơ TTHC
        </button>
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

        <div className="flex gap-3">
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
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải danh sách hồ sơ...</div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Chưa có hồ sơ thủ tục hành chính nào phù hợp.</div>
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
              {cases.map((c) => (
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
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {formatStatus(c.status)}
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
              ))}
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
