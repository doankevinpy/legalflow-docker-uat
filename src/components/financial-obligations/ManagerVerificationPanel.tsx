import React, { useState } from 'react';
import type { FinancialObligationAssessment, ManagerReviewStatus } from '../../types/financial-obligation';
import { Briefcase, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface ManagerVerificationPanelProps {
  assessment: FinancialObligationAssessment;
  canAct: boolean;
  userRole: string;
  onManagerVerify: (data: { managerReviewStatus?: ManagerReviewStatus; notes?: string }) => Promise<void>;
  loadingAction?: boolean;
}

export const ManagerVerificationPanel: React.FC<ManagerVerificationPanelProps> = ({
  assessment,
  canAct,
  userRole,
  onManagerVerify,
  loadingAction = false,
}) => {
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isHighRisk = assessment.riskLevel === 'HIGH' || assessment.riskLevel === 'CRITICAL';
  const isManagerOrAdmin = userRole === 'MANAGER' || userRole === 'ADMIN';

  const handleAction = async (status: ManagerReviewStatus) => {
    // SAFETY HARDENING (Phase 12E): Require explicit confirmation for manager approval
    if (status === 'MANAGER_VERIFIED') {
      const confirmed = confirm(
        'Xác nhận Lãnh đạo đã xem xét hồ sơ, đối chiếu mức rủi ro, các khoản miễn/giảm và thông báo thuế?\n\nHành động này không thể hoàn tác.'
      );
      if (!confirmed) return;
    }
    setSubmitting(true);
    try {
      await onManagerVerify({
        managerReviewStatus: status,
        notes: notes || (status === 'MANAGER_VERIFIED' ? 'Lãnh đạo đã xem xét và phê duyệt mức rủi ro / miễn giảm của hồ sơ.' : 'Trình quản lý rà soát hồ sơ rủi ro cao.'),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      alert(msg || 'Lỗi khi thao tác trình/duyệt quản lý');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isHighRisk && assessment.managerReviewStatus === 'NOT_REQUIRED') {
    return (
      <div className="bg-gray-50/70 border rounded-xl p-4 text-xs text-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span>
            <strong>8. Phê duyệt của Lãnh đạo (Không bắt buộc):</strong> Hồ sơ thuộc mức rủi ro Thấp/Trung bình, không yêu cầu phê duyệt riêng từ cấp Quản lý.
          </span>
        </div>
        {canAct && (
          <button
            onClick={() => handleAction('PENDING')}
            disabled={submitting || loadingAction}
            className="px-3 py-1.5 bg-white border hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold transition shadow-sm"
          >
            Trình quản lý kiểm tra
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border shadow-sm p-6 space-y-4 ${isHighRisk ? 'bg-orange-50/40 border-orange-200' : 'bg-white'}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            8. Phê duyệt hồ sơ rủi ro cao / Miễn giảm từ Lãnh đạo
            {assessment.managerReviewStatus === 'MANAGER_VERIFIED' ? (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lãnh đạo đã duyệt
              </span>
            ) : assessment.managerReviewStatus === 'PENDING' ? (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Chờ Lãnh đạo duyệt
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Chưa trình phê duyệt
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Hồ sơ có mức độ rủi ro <strong>{assessment.riskLevel}</strong> hoặc có khoản miễn/giảm lệ phí đặc biệt cần Lãnh đạo xem xét phê duyệt trước khi hoàn thành.
          </p>
        </div>
      </div>

      {isHighRisk && assessment.managerReviewStatus !== 'MANAGER_VERIFIED' && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-800 flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            <strong>Quy tắc chặn:</strong> Hồ sơ rủi ro CAO/ĐẶC BIỆT phải được Lãnh đạo phê duyệt (`MANAGER_VERIFIED`) mới có thể Đánh dấu hoàn thành nghĩa vụ tài chính.
          </span>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Ghi chú trình ký / Ý kiến chỉ đạo của Lãnh đạo:</label>
          <textarea
            rows={2}
            disabled={!canAct || submitting || loadingAction}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú hoặc ý kiến phê duyệt của Lãnh đạo..."
            className="w-full p-2.5 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {canAct && (
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleAction('PENDING')}
              disabled={submitting || loadingAction}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              Trình quản lý kiểm tra
            </button>
            {isManagerOrAdmin ? (
              <button
                onClick={() => handleAction('MANAGER_VERIFIED')}
                disabled={submitting || loadingAction}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Quản lý phê duyệt
              </button>
            ) : (
              <span className="text-xs text-gray-500 font-medium italic">
                (Chỉ tài khoản Quản lý / Lãnh đạo mới có quyền phê duyệt)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
