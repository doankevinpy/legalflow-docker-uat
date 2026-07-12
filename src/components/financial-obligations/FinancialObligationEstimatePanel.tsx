import React, { useState } from 'react';
import type { FinancialObligationAssessment, FinancialObligationItem, FinancialObligationItemType } from '../../types/financial-obligation';
import { Plus, Edit2, Sparkles, ShieldAlert } from 'lucide-react';

interface FinancialObligationEstimatePanelProps {
  assessment: FinancialObligationAssessment;
  canAct: boolean;
  onGenerateDraft: () => Promise<void>;
  onAddItem: (data: {
    itemType: FinancialObligationItemType;
    itemLabel: string;
    estimatedAmount: number;
    calculationBasis?: string;
    legalBasis?: string;
    dataSource?: string;
    confidenceLevel?: number;
    notes?: string;
  }) => Promise<void>;
  onUpdateItem: (itemId: string, data: {
    itemType?: FinancialObligationItemType;
    itemLabel?: string;
    estimatedAmount?: number;
    calculationBasis?: string;
    legalBasis?: string;
    dataSource?: string;
    confidenceLevel?: number;
    notes?: string;
  }) => Promise<void>;
  loadingAction?: boolean;
}

const ITEM_TYPES: { type: FinancialObligationItemType; label: string }[] = [
  { type: 'LAND_USE_FEE', label: 'Tiền sử dụng đất (SDĐ)' },
  { type: 'DIFFERENTIAL_LAND_USE_FEE', label: 'Tiền sử dụng đất chênh lệch' },
  { type: 'LAND_RENTAL_FEE', label: 'Tiền thuê đất' },
  { type: 'REGISTRATION_FEE', label: 'Lệ phí trước bạ' },
  { type: 'PERSONAL_INCOME_TAX', label: 'Thuế thu nhập cá nhân (chuyển nhượng)' },
  { type: 'APPRAISAL_FEE', label: 'Phí thẩm định hồ sơ' },
  { type: 'ISSUANCE_FEE', label: 'Lệ phí cấp Giấy chứng nhận' },
  { type: 'CADASTRAL_FEE', label: 'Phí đo đạc / địa chính' },
  { type: 'OTHER_FEE', label: 'Khoản thu / phí khác' },
];

export const FinancialObligationEstimatePanel: React.FC<FinancialObligationEstimatePanelProps> = ({
  assessment,
  canAct,
  onGenerateDraft,
  onAddItem,
  onUpdateItem,
  loadingAction = false,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FinancialObligationItem | null>(null);

  // Form fields for estimate items ONLY (No official amount field allowed)
  const [itemType, setItemType] = useState<FinancialObligationItemType>('LAND_USE_FEE');
  const [itemLabel, setItemLabel] = useState<string>('');
  const [estimatedAmount, setEstimatedAmount] = useState<string>('');
  const [calculationBasis, setCalculationBasis] = useState<string>('');
  const [legalBasis, setLegalBasis] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('Bảng giá đất quy định / Khung giá tham khảo');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(85);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const formatCurrency = (amount?: number | string | null) => {
    if (amount === null || amount === undefined || amount === '') return '0 VNĐ';
    const num = typeof amount === 'string' ? Number(amount) : amount;
    if (isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const getItemTypeLabel = (type: FinancialObligationItemType) => {
    const found = ITEM_TYPES.find((t) => t.type === type);
    return found ? found.label : type;
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemType('LAND_USE_FEE');
    setItemLabel('Tiền sử dụng đất theo diện tích chuyển đổi mục đích');
    setEstimatedAmount('0');
    setCalculationBasis('Diện tích đất ở (m2) x Giá đất theo bảng giá quy định');
    setLegalBasis('Luật Đất đai 2024, Nghị định quy định về thu tiền sử dụng đất, bảng giá đất địa phương');
    setDataSource('Bảng giá đất quy định / Khung giá tham khảo');
    setConfidenceLevel(85);
    setNotes('Dự toán tham khảo phục vụ thẩm định hồ sơ');
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: FinancialObligationItem) => {
    setEditingItem(item);
    setItemType(item.itemType);
    setItemLabel(item.itemLabel);
    setEstimatedAmount(String(item.estimatedAmount));
    setCalculationBasis(item.calculationBasis || '');
    setLegalBasis(item.legalBasis || '');
    setDataSource(item.dataSource || 'Bảng giá đất quy định');
    setConfidenceLevel(item.confidenceLevel || 85);
    setNotes(item.notes || '');
    setModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemLabel || !estimatedAmount) return;
    const numAmount = Number(estimatedAmount);
    if (isNaN(numAmount) || numAmount < 0) {
      alert('Số tiền dự kiến phải là số hợp lệ (>= 0)');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await onUpdateItem(editingItem.id, {
          itemType,
          itemLabel,
          estimatedAmount: numAmount,
          calculationBasis,
          legalBasis,
          dataSource,
          confidenceLevel,
          notes,
        });
      } else {
        await onAddItem({
          itemType,
          itemLabel,
          estimatedAmount: numAmount,
          calculationBasis,
          legalBasis,
          dataSource,
          confidenceLevel,
          notes,
        });
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      alert(msg || 'Có lỗi xảy ra khi lưu khoản dự kiến');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Bảng chiết tính tham khảo (AI & Dự toán)
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
              DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Các khoản chiết tính dưới đây chỉ dùng để tham khảo nội bộ trong quá trình thẩm định hồ sơ.
          </p>
        </div>
        {canAct && (
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerateDraft}
              disabled={loadingAction}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loadingAction ? 'Đang tạo AI dự toán...' : 'Tạo bản dự kiến'}
            </button>
            <button
              onClick={handleOpenAddModal}
              disabled={loadingAction}
              className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm khoản dự kiến
            </button>
          </div>
        )}
      </div>

      {/* Warning banner prohibiting official amount entry here */}
      <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg text-xs text-blue-800 flex items-center gap-2 font-medium">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Ghi chú an toàn:</strong> Không được phép nhập số tiền chính thức tại khu vực này. Số tiền chính thức chỉ được ghi nhận từ <em>Thông báo nộp tiền do Cơ quan thuế ban hành</em> tại mục tiếp theo.
        </span>
      </div>

      {/* Items Table */}
      {(!assessment.items || assessment.items.length === 0) ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed space-y-3">
          <div className="text-3xl">📊</div>
          <h4 className="font-bold text-gray-700 text-sm">Chưa có khoản chiết tính dự kiến nào</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Bấm nút <strong>"Tạo bản dự kiến"</strong> để AI hỗ trợ tổng hợp nhanh các khoản mục tham khảo, hoặc bấm <strong>"Thêm khoản dự kiến"</strong> để nhập thủ công.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                <th className="p-3.5">Khoản mục / Loại phí</th>
                <th className="p-3.5">Số tiền dự kiến (VNĐ)</th>
                <th className="p-3.5">Căn cứ tính / Nguồn dữ liệu</th>
                <th className="p-3.5 text-center">Độ tin cậy</th>
                <th className="p-3.5">Nhãn an toàn</th>
                {canAct && <th className="p-3.5 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {assessment.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition">
                  <td className="p-3.5 space-y-1">
                    <div className="font-bold text-gray-900 text-sm">{item.itemLabel}</div>
                    <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block border border-blue-200">
                      {getItemTypeLabel(item.itemType)}
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold text-blue-900 text-sm whitespace-nowrap">
                    {formatCurrency(item.estimatedAmount)}
                  </td>
                  <td className="p-3.5 space-y-1 max-w-xs">
                    {item.calculationBasis && (
                      <div className="text-[11px] text-gray-700">
                        <span className="font-semibold text-gray-800">Công thức/CS:</span> {item.calculationBasis}
                      </div>
                    )}
                    {item.legalBasis && (
                      <div className="text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-700">Căn cứ:</span> {item.legalBasis}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400">Nguồn: {item.dataSource}</div>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded font-bold border border-indigo-200">
                      {item.confidenceLevel}%
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded font-bold text-[10px] border border-amber-300 block text-center uppercase">
                      DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC
                    </span>
                  </td>
                  {canAct && (
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition inline-flex items-center gap-1 font-semibold"
                        title="Cập nhật khoản dự kiến"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Sửa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingItem ? 'Cập nhật khoản dự kiến' : 'Thêm khoản dự kiến mới'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-xs text-amber-900 font-semibold">
              ⚠️ Ghi chú: Khoản mục được thêm tại đây mặc định được đánh dấu "DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC".
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Loại khoản mục / Lệ phí <span className="text-red-500">*</span></label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as FinancialObligationItemType)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 font-medium focus:bg-white"
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên nhãn hiển thị <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={itemLabel}
                  onChange={(e) => setItemLabel(e.target.value)}
                  placeholder="VD: Tiền sử dụng đất theo diện tích chuyển đổi..."
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Số tiền dự kiến (VNĐ) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min={0}
                  value={estimatedAmount}
                  onChange={(e) => setEstimatedAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-extrabold text-blue-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Công thức / Cơ sở tính toán</label>
                <input
                  type="text"
                  value={calculationBasis}
                  onChange={(e) => setCalculationBasis(e.target.value)}
                  placeholder="VD: Diện tích 150m2 x Giá đất 12,000,000 VNĐ"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Căn cứ pháp lý (Luật/Nghị định/Bảng giá)</label>
                <input
                  type="text"
                  value={legalBasis}
                  onChange={(e) => setLegalBasis(e.target.value)}
                  placeholder="VD: Nghị định 103/2024/NĐ-CP, Bảng giá đất QĐ 45/2024"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nguồn dữ liệu</label>
                  <input
                    type="text"
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Độ tin cậy (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-bold text-indigo-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi chú bổ sung</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú nội bộ cho khoản dự kiến này..."
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                >
                  {submitting ? 'Đang lưu...' : (editingItem ? 'Lưu thay đổi' : 'Thêm khoản dự kiến')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
