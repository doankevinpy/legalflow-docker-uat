import React, { useState } from 'react';
import type { FinancialObligationAssessment } from '../../types/financial-obligation';
import { CreditCard, Plus, CheckCircle2, AlertCircle, Calendar, Paperclip, Building } from 'lucide-react';

interface PaymentEvidencePanelProps {
  assessment: FinancialObligationAssessment;
  canAct: boolean;
  onAddPaymentEvidence: (data: {
    paymentDate: string;
    amountPaid: number;
    payerName: string;
    receiptNumber: string;
    treasuryOrBank: string;
    fileAttachmentId: string;
    notes?: string;
  }) => Promise<void>;
  loadingAction?: boolean;
}

export const PaymentEvidencePanel: React.FC<PaymentEvidencePanelProps> = ({
  assessment,
  canAct,
  onAddPaymentEvidence,
  loadingAction = false,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [payerName, setPayerName] = useState<string>('');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [treasuryOrBank, setTreasuryOrBank] = useState<string>('Kho bạc Nhà nước quận/huyện');
  const [fileAttachmentId, setFileAttachmentId] = useState<string>('DOC-PAYMENT-EVIDENCE-001');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const paymentEvidences = assessment.paymentEvidences || [];

  const formatCurrency = (amount?: number | string | null) => {
    if (amount === null || amount === undefined || amount === '') return '0 VNĐ';
    const num = typeof amount === 'string' ? Number(amount) : amount;
    if (isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleOpenModal = () => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setAmountPaid(
      assessment.officialTotalAmount
        ? String(assessment.officialTotalAmount)
        : (assessment.estimatedTotalAmount ? String(assessment.estimatedTotalAmount) : '')
    );
    setPayerName('Người nộp tiền theo Giấy báo/Giấy nộp tiền');
    setReceiptNumber('');
    setTreasuryOrBank('Kho bạc Nhà nước quận/huyện hoặc Ngân hàng ủy nhiệm thu');
    setFileAttachmentId(`FILE-PAYMENT-${Date.now()}`);
    setNotes('Giấy nộp tiền vào Ngân sách Nhà nước hợp lệ.');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentDate || !amountPaid || !payerName || !receiptNumber || !treasuryOrBank || !fileAttachmentId) {
      alert('Vui lòng nhập đầy đủ các thông tin bắt buộc');
      return;
    }
    const numAmount = Number(amountPaid);
    if (isNaN(numAmount) || numAmount < 0) {
      alert('Số tiền nộp phải là số hợp lệ (>= 0)');
      return;
    }

    setSubmitting(true);
    try {
      await onAddPaymentEvidence({
        paymentDate,
        amountPaid: numAmount,
        payerName,
        receiptNumber,
        treasuryOrBank,
        fileAttachmentId,
        notes,
      });
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      alert(msg || 'Có lỗi xảy ra khi lưu chứng từ nộp tiền');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            6. Chứng từ nộp tiền vào Ngân sách Nhà nước
            {paymentEvidences.length > 0 ? (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã có chứng từ ({paymentEvidences.length})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Chưa có chứng từ nộp tiền
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Ghi nhận thông tin chứng từ chứng minh người nộp tiền đã thực hiện nghĩa vụ tài chính tại Kho bạc/Ngân hàng ủy nhiệm thu.
          </p>
        </div>
        {canAct && (
          <button
            onClick={handleOpenModal}
            disabled={loadingAction}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Nhập chứng từ nộp tiền
          </button>
        )}
      </div>

      {paymentEvidences.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed space-y-3">
          <div className="text-3xl">💳</div>
          <h4 className="font-bold text-gray-700 text-sm">Chưa có chứng từ nộp tiền</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Sau khi nhận được Giấy nộp tiền vào NSNN / Biên lai chuyển khoản hợp lệ từ người nộp tiền, vui lòng nhập vào hệ thống để làm căn cứ hoàn thành hồ sơ.
          </p>
          {canAct && (
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Nhập chứng từ nộp tiền ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {paymentEvidences.map((evidence, index) => (
            <div key={evidence.id} className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Chứng từ #{index + 1} — Số biên lai/GNT: <span className="font-mono text-emerald-800">{evidence.receiptNumber}</span>
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium">Người nộp: {evidence.payerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Số tiền đã nộp:</span>
                  <span className="text-xl font-extrabold text-emerald-800">{formatCurrency(evidence.amountPaid)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 block">Ngày nộp tiền:</span>
                    <span className="font-bold text-gray-800">{new Date(evidence.paymentDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 block">Kho bạc / Ngân hàng thu:</span>
                    <span className="font-bold text-gray-800">{evidence.treasuryOrBank}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-gray-500 block">Mã tệp scan (File ID):</span>
                    <span className="font-mono font-bold text-emerald-700">{evidence.fileAttachmentId}</span>
                  </div>
                </div>
              </div>

              {evidence.notes && (
                <div className="text-xs bg-white p-3 rounded-lg border text-gray-700 font-medium">
                  <span className="font-bold text-gray-900">Ghi chú xác minh:</span> {evidence.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">Nhập chứng từ nộp tiền vào NSNN</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Số biên lai / Số Giấy nộp tiền <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="VD: BL-2026-987654"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 font-bold text-gray-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên người nộp tiền / Đơn vị nộp <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngày nộp tiền <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-gray-50 font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số tiền thực nộp (VNĐ) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-extrabold text-emerald-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Kho bạc Nhà nước / Ngân hàng thu <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={treasuryOrBank}
                  onChange={(e) => setTreasuryOrBank(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mã tệp đính kèm (File ID / Scan Biên lai) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={fileAttachmentId}
                  onChange={(e) => setFileAttachmentId(e.target.value)}
                  placeholder="VD: FILE-PAY-EVIDENCE-001"
                  className="w-full p-2.5 border rounded-lg bg-gray-50 font-mono text-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi chú xác minh</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-100">Hủy</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm">
                  {submitting ? 'Đang lưu...' : 'Lưu chứng từ nộp tiền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
