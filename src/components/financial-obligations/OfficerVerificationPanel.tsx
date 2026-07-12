import React, { useState } from 'react';
import type { FinancialObligationAssessment, OfficerReviewStatus } from '../../types/financial-obligation';
import { UserCheck, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface OfficerVerificationPanelProps {
  assessment: FinancialObligationAssessment;
  canAct: boolean;
  onOfficerVerify: (data: { officerReviewStatus?: OfficerReviewStatus; notes?: string }) => Promise<void>;
  loadingAction?: boolean;
}

export const OfficerVerificationPanel: React.FC<OfficerVerificationPanelProps> = ({
  assessment,
  canAct,
  onOfficerVerify,
  loadingAction = false,
}) => {
  const [notes, setNotes] = useState<string>(assessment.warningText || '');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleVerify = async (status: OfficerReviewStatus) => {
    if (status === 'OFFICER_VERIFIED' && !confirm('Xác nhận đã đối chiếu hồ sơ thực tế, bảng giá đất và thông báo thuế hợp lệ?')) {
      return;
    }
    setSubmitting(true);
    try {
      await onOfficerVerify({
        officerReviewStatus: status,
        notes: notes || (status === 'OFFICER_VERIFIED' ? 'Cán bộ đã kiểm tra đối chiếu hồ sơ gốc và xác nhận nghĩa vụ tài chính hợp lệ.' : 'Yêu cầu bổ sung thêm thông tin.'),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      alert(msg || 'Lỗi khi xác nhận cán bộ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            7. Kiểm tra & Xác nhận đối chiếu của Cán bộ thụ lý
            {assessment.officerReviewStatus === 'OFFICER_VERIFIED' ? (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã kiểm tra đối chiếu
              </span>
            ) : assessment.officerReviewStatus === 'REJECTED_NEEDS_INFO' ? (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Yêu cầu bổ sung
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Chưa xác nhận đối chiếu
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Cán bộ thụ lý có trách nhiệm đối chiếu hồ sơ thực tế, căn cứ pháp lý với kết quả chiết tính/thông báo thuế trước khi trình ký hoặc đánh dấu hoàn thành.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-600" /> Ghi chú rà soát / Ý kiến thẩm định cán bộ:
          </label>
          <textarea
            rows={3}
            disabled={!canAct || submitting || loadingAction}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ý kiến thẩm định của cán bộ về nghĩa vụ tài chính của hồ sơ này..."
            className="w-full p-3 border rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {canAct && (
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleVerify('REJECTED_NEEDS_INFO')}
              disabled={submitting || loadingAction}
              className="px-4 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              Lưu ghi chú / Yêu cầu bổ sung thông tin
            </button>
            <button
              onClick={() => handleVerify('OFFICER_VERIFIED')}
              disabled={submitting || loadingAction}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" /> Cán bộ xác nhận đã kiểm tra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
