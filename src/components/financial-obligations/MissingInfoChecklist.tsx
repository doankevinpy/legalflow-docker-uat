import React from 'react';
import type { FinancialObligationAssessment } from '../../types/financial-obligation';
import { CheckCircle2, XCircle, AlertCircle, ShieldAlert } from 'lucide-react';

interface MissingInfoChecklistProps {
  assessment: FinancialObligationAssessment;
}

export const MissingInfoChecklist: React.FC<MissingInfoChecklistProps> = ({ assessment }) => {
  const hasTaxNotice = !!assessment.taxNotice;
  const hasPaymentEvidence = assessment.paymentEvidences && assessment.paymentEvidences.length > 0;
  const isOfficerVerified = assessment.officerReviewStatus === 'OFFICER_VERIFIED';
  const isHighRisk = assessment.riskLevel === 'HIGH' || assessment.riskLevel === 'CRITICAL';
  const isManagerVerified = !isHighRisk || assessment.managerReviewStatus === 'MANAGER_VERIFIED';
  const notMissingInfo = assessment.assessmentStatus !== 'MISSING_INFORMATION';
  const notEstimateOnly = !assessment.isEstimate || hasTaxNotice;

  const checklistItems = [
    {
      id: 'tax_notice',
      title: 'Thông báo nộp tiền từ Cơ quan thuế',
      description: 'Hồ sơ phải có biên bản ghi nhận Thông báo thuế chính thức do Cơ quan thuế ban hành.',
      passed: hasTaxNotice,
      required: true,
      errorMsg: 'Chưa có thông báo thuế chính thức.',
    },
    {
      id: 'payment_evidence',
      title: 'Chứng từ nộp tiền vào Ngân sách Nhà nước',
      description: 'Biên lai, giấy nộp tiền vào Kho bạc hoặc chứng từ chuyển khoản ngân hàng hợp lệ.',
      passed: hasPaymentEvidence,
      required: true,
      errorMsg: 'Chưa tải lên chứng từ nộp tiền.',
    },
    {
      id: 'officer_verification',
      title: 'Cán bộ rà soát xác nhận đối chiếu thực tế',
      description: 'Cán bộ thụ lý đã đối chiếu hồ sơ thực tế, bảng giá đất, căn cứ pháp lý và xác nhận.',
      passed: isOfficerVerified,
      required: true,
      errorMsg: 'Cán bộ chưa xác nhận kiểm tra đối chiếu.',
    },
    {
      id: 'manager_verification',
      title: 'Phê duyệt rủi ro cao từ Lãnh đạo',
      description: isHighRisk
        ? 'Hồ sơ có mức độ rủi ro CAO/ĐẶC BIỆT cần sự phê duyệt formal từ cấp Quản lý/Lãnh đạo.'
        : 'Hồ sơ mức rủi ro Thấp/Trung bình không bắt buộc Lãnh đạo phê duyệt riêng.',
      passed: isManagerVerified,
      required: isHighRisk,
      errorMsg: 'Hồ sơ rủi ro cao chưa được Lãnh đạo phê duyệt.',
    },
    {
      id: 'not_estimate_only',
      title: 'Chuyển từ số tiền Dự kiến sang Số tiền Chính thức',
      description: 'Hồ sơ không thể hoàn thành nếu chỉ có số tiền chiết tính dự kiến mà chưa đối chiếu thông báo thuế.',
      passed: notEstimateOnly,
      required: true,
      errorMsg: 'Hồ sơ chỉ có số tiền dự kiến.',
    },
    {
      id: 'not_missing_info',
      title: 'Trạng thái thông tin đầy đủ',
      description: 'Hồ sơ không được ở trạng thái MISSING_INFORMATION.',
      passed: notMissingInfo,
      required: true,
      errorMsg: 'Hồ sơ đang bị đánh dấu thiếu thông tin.',
    },
  ];

  const allPassed = checklistItems.every((item) => item.passed);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">
            Checklist kiểm tra điều kiện hoàn thành nghĩa vụ tài chính
          </h3>
        </div>
        <div>
          {allPassed ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" /> Đủ điều kiện hoàn thành
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-300 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-600" /> Chưa đủ điều kiện hoàn thành
            </span>
          )}
        </div>
      </div>

      {!allPassed && (
        <div className="bg-red-50/80 border border-red-200 rounded-lg p-3 text-xs text-red-800 flex items-start gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wide">Quy tắc chặn an toàn (Completion Blocking Rules):</p>
            <p>
              Hệ thống không tự ý hoặc cho phép hoàn thành hồ sơ khi còn thiếu bất kỳ điều kiện bắt buộc nào dưới đây. Nút "Đánh dấu hoàn thành" sẽ bị chặn cho tới khi khắc phục đủ:
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border transition flex items-start gap-3 ${
              item.passed
                ? 'bg-green-50/50 border-green-200'
                : 'bg-red-50/50 border-red-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.passed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${item.passed ? 'text-green-900' : 'text-red-900'}`}>
                  {item.title}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-normal">{item.description}</p>
              {!item.passed && (
                <p className="text-[11px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded inline-block mt-1 border border-red-200">
                  ⚠️ {item.errorMsg}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
