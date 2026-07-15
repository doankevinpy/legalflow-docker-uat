import React, { useState } from 'react';
import type { FinancialObligationAssessment } from '../../types/financial-obligation';
import { FileText, Plus, CheckCircle2, AlertCircle, Calendar, Paperclip } from 'lucide-react';

interface TaxNoticePanelProps {
  assessment: FinancialObligationAssessment;
  canAct: boolean;
  onAddTaxNotice: (data: {
    noticeNumber: string;
    issuingAuthority: string;
    issueDate: string;
    receivedDate: string;
    totalAmount: number;
    fileAttachmentId: string;
    notes?: string;
  }) => Promise<void>;
  loadingAction?: boolean;
}

export const TaxNoticePanel: React.FC<TaxNoticePanelProps> = ({
  assessment,
  canAct,
  onAddTaxNotice,
  loadingAction = false,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [noticeNumber, setNoticeNumber] = useState<string>('');
  const [issuingAuthority, setIssuingAuthority] = useState<string>('Chi cục Thuế khu vực / Cục Thuế tỉnh/TP');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [receivedDate, setReceivedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [fileAttachmentId, setFileAttachmentId] = useState<string>('DOC-TAX-NOTICE-001');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const taxNotice = assessment.taxNotice;

  const formatCurrency = (amount?: number | string | null) => {
    if (amount === null || amount === undefined || amount === '') return '0 VNĐ';
    const num = typeof amount === 'string' ? Number(amount) : amount;
    if (isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleOpenModal = () => {
    setNoticeNumber('');
    // SAFETY HARDENING (Phase 12E): Do NOT pre-fill estimated amount into official amount field.
    // Officers must enter the official amount from the tax authority notice document.
    setTotalAmount('');
    setFileAttachmentId(`FILE-TAX-${Date.now()}`);
    setNotes('Ghi nhận từ thông báo nộp tiền chính thức do cơ quan thuế ban hành.');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeNumber || !issuingAuthority || !fileAttachmentId || !totalAmount) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (Số thông báo, Cơ quan ban hành, Số tiền, ID tệp chứng từ)');
      return;
    }
    const numAmount = Number(totalAmount);
    if (isNaN(numAmount) || numAmount < 0) {
      alert('Số tiền thông báo phải là số hợp lệ (>= 0)');
      return;
    }

    setSubmitting(true);
    try {
      await onAddTaxNotice({
        noticeNumber,
        issuingAuthority,
        issueDate,
        receivedDate,
        totalAmount: numAmount,
        fileAttachmentId,
        notes,
      });
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      alert(msg || 'Có lỗi xảy ra khi lưu ghi nhận thông báo thuế');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            5. Ghi nhận Thông báo thuế chính thức
            {taxNotice ? (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã ghi nhận
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Chưa có thông báo thuế
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Ghi nhận thông tin Thông báo nộp tiền sử dụng đất/lệ phí trước bạ do Cơ quan thuế ban hành. Hệ thống <strong>không phát hành</strong> và <strong>không thay thế</strong> cơ quan thuế.
          </p>
        </div>
        {canAct && (
          <button
            onClick={handleOpenModal}
            disabled={loadingAction}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Nhập thông báo thuế
          </button>
        )}
      </div>

      {!taxNotice ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed space-y-3">
          <div className="text-3xl">🏛️</div>
          <h4 className="font-bold text-gray-700 text-sm">Chưa có thông báo thuế chính thức</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Hồ sơ hiện chỉ có số tiền chiết tính dự kiến. Cán bộ cần đợi hoặc nhập Thông báo nộp thuế do Cơ quan thuế thẩm quyền ban hành trước khi tiếp nhận chứng từ thanh toán.
          </p>
          {canAct && (
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Nhập thông báo thuế ngay
            </button>
          )}
        </div>
      ) : (
        <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Thông báo thuế số: {taxNotice.noticeNumber}</h4>
                <p className="text-xs text-purple-700 font-medium">Cơ quan ban hành: {taxNotice.issuingAuthority}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Số tiền theo thông báo:</span>
              <span className="text-xl font-extrabold text-green-700">{formatCurrency(taxNotice.totalAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-gray-500 block">Ngày ban hành:</span>
                <span className="font-bold text-gray-800">{new Date(taxNotice.issueDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-gray-500 block">Ngày tiếp nhận:</span>
                <span className="font-bold text-gray-800">{new Date(taxNotice.receivedDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border">
              <Paperclip className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-gray-500 block">Mã tệp đính kèm (File ID):</span>
                <span className="font-mono font-bold text-purple-700">{taxNotice.fileAttachmentId}</span>
              </div>
            </div>
          </div>

          {taxNotice.notes && (
            <div className="text-xs bg-white p-3 rounded-lg border text-gray-700 font-medium">
              <span className="font-bold text-gray-900">Ghi chú xác nhận:</span> {taxNotice.notes}
            </div>
          )}
        </div>
      )}

      {/* Modal form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">Nhập ghi nhận Thông báo thuế chính thức</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-xs text-amber-900 font-semibold">
              ⚠️ Ghi chú: Thao tác này nhằm cập nhật số liệu và tệp scan từ Thông báo nộp tiền do Cơ quan thuế ban hành, giúp xác định số tiền chính thức (`officialTotalAmount`).
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Số thông báo thuế <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={noticeNumber}
                  onChange={(e) => setNoticeNumber(e.target.value)}
                  placeholder="VD: 1234/TB-CCTKV"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 font-bold text-gray-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Cơ quan thuế ban hành <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngày ban hành <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-gray-50 font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngày nhận thông báo <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-gray-50 font-medium focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tổng số tiền theo thông báo (VNĐ) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min={0}
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-extrabold text-green-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mã tệp đính kèm (File ID / Scan Thông báo) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={fileAttachmentId}
                  onChange={(e) => setFileAttachmentId(e.target.value)}
                  placeholder="VD: FILE-TAX-NOTICE-2026-001"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 font-mono text-purple-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi chú đối chiếu</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-100">Hủy</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-sm">
                  {submitting ? 'Đang lưu...' : 'Lưu thông báo thuế'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
