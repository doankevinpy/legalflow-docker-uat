import React, { useEffect, useState } from 'react';
import type {
  FinancialObligationAssessment,
  FinancialObligationItemType,
  OfficerReviewStatus,
  ManagerReviewStatus,
} from '../../types/financial-obligation';
import { financialObligationsApi } from '../../lib/financialObligationsApi';
import { FinancialObligationSafetyBanner } from './FinancialObligationSafetyBanner';
import { FinancialObligationStatusCard } from './FinancialObligationStatusCard';
import { MissingInfoChecklist } from './MissingInfoChecklist';
import { FinancialObligationEstimatePanel } from './FinancialObligationEstimatePanel';
import { TaxNoticePanel } from './TaxNoticePanel';
import { PaymentEvidencePanel } from './PaymentEvidencePanel';
import { OfficerVerificationPanel } from './OfficerVerificationPanel';
import { ManagerVerificationPanel } from './ManagerVerificationPanel';
import { FinancialObligationAuditLogPanel } from './FinancialObligationAuditLogPanel';
import { Plus, CheckCircle2, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';

interface FinancialObligationPanelProps {
  caseId: string;
  canAct: boolean;
  userRole: string;
}

export const FinancialObligationPanel: React.FC<FinancialObligationPanelProps> = ({
  caseId,
  canAct,
  userRole,
}) => {
  const [assessment, setAssessment] = useState<FinancialObligationAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [completionBlockedError, setCompletionBlockedError] = useState<string | null>(null);
  const [notApplicable, setNotApplicable] = useState<boolean>(false);

  const fetchAssessment = async () => {
    if (!caseId) return;
    setLoading(true);
    setError(null);
    setCompletionBlockedError(null);
    try {
      const res = await financialObligationsApi.getByCaseId(caseId);
      if (res && res.data) {
        setAssessment(res.data);
        if (res.data.assessmentStatus === 'NOT_APPLICABLE') {
          setNotApplicable(true);
        }
      } else {
        setAssessment(null);
      }
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || '';
      if (status === 404 || msg.includes('404')) {
        setAssessment(null);
      } else {
        setError(msg || 'Không thể tải dữ liệu nghĩa vụ tài chính');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!caseId) return;
      try {
        const res = await financialObligationsApi.getByCaseId(caseId);
        if (isMounted) {
          if (res && res.data) {
            setAssessment(res.data);
            if (res.data.assessmentStatus === 'NOT_APPLICABLE') {
              setNotApplicable(true);
            }
          } else {
            setAssessment(null);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const status = (err as { status?: number })?.status;
          const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || '';
          if (status === 404 || msg.includes('404')) {
            setAssessment(null);
          } else {
            setError(msg || 'Không thể tải dữ liệu nghĩa vụ tài chính');
          }
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [caseId]);

  const handleCreateAssessment = async () => {
    setLoadingAction(true);
    setError(null);
    try {
      const res = await financialObligationsApi.createAssessment(caseId, {
        procedureType: 'CAP_GCN_LAN_DAU',
        assessmentMode: 'MANUAL',
      });
      if (res && res.data) {
        setAssessment(res.data);
      } else {
        await fetchAssessment();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      setError(msg || 'Lỗi khi khởi tạo đánh giá nghĩa vụ tài chính');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!assessment) return;
    setLoadingAction(true);
    setError(null);
    try {
      const res = await financialObligationsApi.generateDraft(assessment.id);
      if (res && res.data) {
        setAssessment(res.data);
      } else {
        await fetchAssessment();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      alert(msg || 'Lỗi khi tạo AI dự toán');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddItem = async (data: {
    itemType: FinancialObligationItemType;
    itemLabel: string;
    estimatedAmount: number;
    calculationBasis?: string;
    legalBasis?: string;
    dataSource?: string;
    confidenceLevel?: number;
    notes?: string;
  }) => {
    if (!assessment) return;
    setLoadingAction(true);
    try {
      await financialObligationsApi.addItem(assessment.id, data);
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateItem = async (
    itemId: string,
    data: {
      itemType?: FinancialObligationItemType;
      itemLabel?: string;
      estimatedAmount?: number;
      calculationBasis?: string;
      legalBasis?: string;
      dataSource?: string;
      confidenceLevel?: number;
      notes?: string;
    },
  ) => {
    setLoadingAction(true);
    try {
      await financialObligationsApi.updateItem(itemId, data);
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddTaxNotice = async (data: {
    noticeNumber: string;
    issuingAuthority: string;
    issueDate: string;
    receivedDate: string;
    totalAmount: number;
    fileAttachmentId: string;
    notes?: string;
  }) => {
    if (!assessment) return;
    setLoadingAction(true);
    try {
      await financialObligationsApi.addTaxNotice(assessment.id, data);
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAddPaymentEvidence = async (data: {
    paymentDate: string;
    amountPaid: number;
    payerName: string;
    receiptNumber: string;
    treasuryOrBank: string;
    fileAttachmentId: string;
    notes?: string;
  }) => {
    if (!assessment) return;
    setLoadingAction(true);
    try {
      await financialObligationsApi.addPaymentEvidence(assessment.id, data);
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOfficerVerify = async (data: { officerReviewStatus?: OfficerReviewStatus; notes?: string }) => {
    if (!assessment) return;
    setLoadingAction(true);
    try {
      await financialObligationsApi.officerVerify(assessment.id, data);
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleManagerVerify = async (data: { managerReviewStatus?: ManagerReviewStatus; notes?: string }) => {
    if (!assessment) return;
    setLoadingAction(true);
    try {
      await financialObligationsApi.managerVerify(assessment.id, data);
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!assessment) return;
    setCompletionBlockedError(null);
    if (!confirm('Xác nhận hồ sơ đã hoàn thành đầy đủ nghĩa vụ tài chính theo quy định?')) {
      return;
    }
    setLoadingAction(true);
    try {
      const res = await financialObligationsApi.markCompleted(assessment.id, {
        notes: 'Cán bộ xác nhận hoàn thành đầy đủ nghĩa vụ tài chính sau khi đã đối chiếu đủ chứng từ hợp lệ.',
      });
      if (res && res.data) {
        setAssessment(res.data);
      } else {
        await fetchAssessment();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message;
      setCompletionBlockedError(
        msg || 'Hệ thống chặn hoàn thành (COMPLETION_BLOCKED) do hồ sơ chưa đáp ứng đủ các điều kiện bắt buộc.'
      );
      await fetchAssessment();
    } finally {
      setLoadingAction(false);
    }
  };

  // Evaluate blocking conditions on frontend to appropriately style/disable the button
  const hasTaxNotice = assessment ? !!assessment.taxNotice : false;
  const hasPaymentEvidence = assessment ? assessment.paymentEvidences && assessment.paymentEvidences.length > 0 : false;
  const isOfficerVerified = assessment ? assessment.officerReviewStatus === 'OFFICER_VERIFIED' : false;
  const isHighRisk = assessment ? assessment.riskLevel === 'HIGH' || assessment.riskLevel === 'CRITICAL' : false;
  const isManagerVerified = assessment ? (!isHighRisk || assessment.managerReviewStatus === 'MANAGER_VERIFIED') : false;
  const notMissingInfo = assessment ? assessment.assessmentStatus !== 'MISSING_INFORMATION' : false;
  const notEstimateOnly = assessment ? (!assessment.isEstimate || hasTaxNotice) : false;

  const canMarkCompleted =
    hasTaxNotice && hasPaymentEvidence && isOfficerVerified && isManagerVerified && notMissingInfo && notEstimateOnly;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-12 text-center space-y-3 shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-bold text-gray-700">Đang tải dữ liệu đánh giá nghĩa vụ tài chính...</p>
        <p className="text-xs text-gray-400">Vui lòng đợi giây lát trong khi hệ thống truy xuất hồ sơ từ máy chủ.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-gray-900">Không tải được dữ liệu nghĩa vụ tài chính</h4>
        <p className="text-xs text-red-600 font-medium max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchAssessment}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Thử tải lại dữ liệu
        </button>
      </div>
    );
  }

  if (notApplicable && !assessment) {
    return (
      <div className="bg-white rounded-xl border p-10 text-center space-y-3 shadow-sm">
        <div className="text-4xl">✅</div>
        <h4 className="font-bold text-gray-800 text-base">Hồ sơ không phát sinh nghĩa vụ tài chính</h4>
        <p className="text-xs text-gray-600 max-w-md mx-auto font-medium">
          Hồ sơ này thuộc diện không phát sinh tiền sử dụng đất, lệ phí trước bạ hoặc các khoản thu tài chính theo quy định.
        </p>
        {canAct && (
          <button
            onClick={() => setNotApplicable(false)}
            className="text-xs font-bold text-blue-600 hover:underline pt-2"
          >
            Chuyển sang chế độ đánh giá nghĩa vụ tài chính (Nếu cần)
          </button>
        )}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8 space-y-6">
        <FinancialObligationSafetyBanner isEstimate={true} />
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            💰
          </div>
          <h4 className="font-bold text-gray-900 text-base">Chưa có đánh giá nghĩa vụ tài chính cho hồ sơ này</h4>
          <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
            Hệ thống hỗ trợ cán bộ lập bảng tính dự kiến tiền sử dụng đất/lệ phí trước bạ, đối chiếu thông báo thuế chính thức và kiểm duyệt chứng từ nộp tiền.
          </p>
          {canAct && (
            <button
              onClick={handleCreateAssessment}
              disabled={loadingAction}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {loadingAction ? 'Đang khởi tạo assessment...' : 'Khởi tạo đánh giá nghĩa vụ tài chính'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Safety Banner (Exact text required by UX constraints) */}
      <FinancialObligationSafetyBanner
        isEstimate={assessment.isEstimate}
        safetyWarnings={
          assessment.warningText ? [assessment.warningText] : [
            'DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC',
            'Hệ thống không thay thế Cơ quan thuế ban hành Thông báo nộp tiền.'
          ]
        }
      />

      {/* 2. Status Card */}
      <FinancialObligationStatusCard assessment={assessment} />

      {/* 3. Missing Information & Safety Blocking Checklist */}
      <MissingInfoChecklist assessment={assessment} />

      {/* Completion blocked error alert */}
      {completionBlockedError && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-red-900">
            <p className="font-bold uppercase text-red-800">
              ⚠️ Backend chặn hoàn thành hồ sơ (COMPLETION_BLOCKED)
            </p>
            <p className="font-semibold">{completionBlockedError}</p>
            <p className="text-red-700">
              Vui lòng rà soát lại Checklist phía trên: Đảm bảo có thông báo thuế chính thức, chứng từ nộp tiền hợp lệ, cán bộ xác nhận đối chiếu và lãnh đạo phê duyệt (nếu rủi ro cao).
            </p>
          </div>
        </div>
      )}

      {/* 4. Estimated Obligation Panel (AI & Drafts) */}
      <FinancialObligationEstimatePanel
        assessment={assessment}
        canAct={canAct}
        onGenerateDraft={handleGenerateDraft}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        loadingAction={loadingAction}
      />

      {/* 5. Official Tax Notice Panel */}
      <TaxNoticePanel
        assessment={assessment}
        canAct={canAct}
        onAddTaxNotice={handleAddTaxNotice}
        loadingAction={loadingAction}
      />

      {/* 6. Payment Evidence Panel */}
      <PaymentEvidencePanel
        assessment={assessment}
        canAct={canAct}
        onAddPaymentEvidence={handleAddPaymentEvidence}
        loadingAction={loadingAction}
      />

      {/* 7. Officer Verification Panel */}
      <OfficerVerificationPanel
        assessment={assessment}
        canAct={canAct}
        onOfficerVerify={handleOfficerVerify}
        loadingAction={loadingAction}
      />

      {/* 8. Manager Verification Panel */}
      <ManagerVerificationPanel
        assessment={assessment}
        canAct={canAct}
        userRole={userRole}
        onManagerVerify={handleManagerVerify}
        loadingAction={loadingAction}
      />

      {/* Final Completion Action Bar */}
      <div className="bg-gray-50 border rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Hoàn tất kiểm duyệt nghĩa vụ tài chính</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {canMarkCompleted
              ? '✓ Tất cả điều kiện đã thỏa mãn. Cán bộ có thể đánh dấu hoàn thành.'
              : '⚠️ Nút đánh dấu hoàn thành bị khóa/chặn cho đến khi đủ điều kiện pháp lý và chứng từ.'}
          </p>
        </div>
        {canAct && (
          <div>
            <button
              onClick={handleMarkCompleted}
              disabled={!canMarkCompleted || loadingAction}
              title={
                !canMarkCompleted
                  ? 'Nút bị vô hiệu hóa: Cần có Thông báo thuế, Chứng từ nộp tiền và Xác nhận của Cán bộ/Quản lý'
                  : 'Đánh dấu hoàn thành nghĩa vụ tài chính'
              }
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 ${
                canMarkCompleted
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-75'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {loadingAction ? 'Đang xử lý...' : 'Đánh dấu hoàn thành'}
            </button>
          </div>
        )}
      </div>

      {/* 9. Audit Log Panel */}
      <FinancialObligationAuditLogPanel assessmentId={assessment.id} />
    </div>
  );
};
