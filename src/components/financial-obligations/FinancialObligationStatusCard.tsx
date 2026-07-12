import React from 'react';
import type { FinancialObligationAssessment } from '../../types/financial-obligation';
import { DollarSign, Shield, UserCheck, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

interface FinancialObligationStatusCardProps {
  assessment: FinancialObligationAssessment;
}

export const FinancialObligationStatusCard: React.FC<FinancialObligationStatusCardProps> = ({ assessment }) => {
  const formatCurrency = (amount?: number | string | null) => {
    if (amount === null || amount === undefined || amount === '') return '0 VNĐ';
    const num = typeof amount === 'string' ? Number(amount) : amount;
    if (isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-300">Đã hoàn thành nghĩa vụ</span>;
      case 'BLOCKED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-300">Bị chặn hoàn thành</span>;
      case 'OFFICER_VERIFIED':
      case 'MANAGER_VERIFIED':
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold border border-indigo-300">Đã kiểm duyệt</span>;
      case 'MISSING_INFORMATION':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-300">Thiếu thông tin</span>;
      case 'ESTIMATED':
      case 'READY_FOR_REVIEW':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-300">Dự toán tham khảo</span>;
      case 'TAX_NOTICE_RECEIVED':
      case 'WAITING_FOR_PAYMENT':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-300">Đã có thông báo thuế</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold border border-gray-300">{status}</span>;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'LOW':
        return <span className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-semibold border border-green-200">Rủi ro thấp</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-semibold border border-yellow-200">Rủi ro trung bình</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-semibold border border-orange-200">Rủi ro cao</span>;
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 bg-red-50 text-red-700 rounded text-xs font-semibold border border-red-200 font-bold">Rủi ro đặc biệt</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-50 text-gray-700 rounded text-xs font-semibold border border-gray-200">{level}</span>;
    }
  };

  const getOfficerReviewBadge = (status: string) => {
    switch (status) {
      case 'OFFICER_VERIFIED':
        return <span className="text-green-700 font-semibold flex items-center gap-1 text-xs"><CheckCircle className="w-3.5 h-3.5" /> Cán bộ đã kiểm tra đối chiếu</span>;
      case 'REJECTED_NEEDS_INFO':
        return <span className="text-red-600 font-semibold flex items-center gap-1 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Yêu cầu bổ sung hồ sơ</span>;
      default:
        return <span className="text-amber-600 font-medium flex items-center gap-1 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Chưa xác nhận đối chiếu</span>;
    }
  };

  const getManagerReviewBadge = (status: string) => {
    switch (status) {
      case 'MANAGER_VERIFIED':
        return <span className="text-green-700 font-semibold flex items-center gap-1 text-xs"><CheckCircle className="w-3.5 h-3.5" /> Lãnh đạo đã phê duyệt</span>;
      case 'PENDING':
        return <span className="text-amber-600 font-semibold flex items-center gap-1 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Chờ lãnh đạo duyệt</span>;
      case 'REJECTED_TO_OFFICER':
        return <span className="text-red-600 font-semibold flex items-center gap-1 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Trả lại cán bộ rà soát</span>;
      default:
        return <span className="text-gray-500 font-medium text-xs">Không bắt buộc</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* Header / Status row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">Tổng quan trạng thái nghĩa vụ tài chính</h3>
            {getStatusBadge(assessment.assessmentStatus)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Chế độ đánh giá: <span className="font-semibold text-gray-700">{assessment.assessmentMode}</span> • Mã hồ sơ assessment: <span className="font-mono text-gray-600">{assessment.id.slice(0, 8)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
            <Shield className="w-4 h-4 text-gray-500" />
            <span>Mức độ rủi ro:</span>
            {getRiskBadge(assessment.riskLevel)}
          </div>
        </div>
      </div>

      {/* Amount cards differentiating Estimate vs Official */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estimated Amount Box */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-600" /> Số tiền dự kiến (Tham khảo)
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
              Dự tính tham khảo
            </span>
          </div>
          <div className="text-2xl font-extrabold text-blue-900 tracking-tight">
            {formatCurrency(assessment.estimatedTotalAmount)}
          </div>
          <p className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-1 rounded border border-amber-300 inline-block">
            ⚠️ DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC
          </p>
          <p className="text-[11px] text-blue-700 mt-1">
            Số tiền được tổng hợp từ các khoản mục chiết tính/Dữ liệu tham khảo. Cán bộ không được sử dụng số này để ra thông báo thu tiền.
          </p>
        </div>

        {/* Official Amount Box */}
        <div className={`border rounded-xl p-4 space-y-2 relative overflow-hidden ${
          assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined
            ? 'bg-green-50/70 border-green-300'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined ? 'text-green-800' : 'text-gray-600'
            }`}>
              <DollarSign className="w-4 h-4" /> Số tiền chính thức (Theo thông báo thuế)
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
              assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined ? 'Chính thức' : 'Chưa ban hành'}
            </span>
          </div>
          <div className={`text-2xl font-extrabold tracking-tight ${
            assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined ? 'text-green-900' : 'text-gray-400'
          }`}>
            {assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined
              ? formatCurrency(assessment.officialTotalAmount)
              : 'Chưa có thông báo thuế'}
          </div>
          {assessment.officialTotalAmount !== null && assessment.officialTotalAmount !== undefined ? (
            <p className="text-[11px] font-semibold text-green-800">
              ✓ Đã có căn cứ từ Thông báo nộp tiền của Cơ quan thuế có thẩm quyền ban hành.
            </p>
          ) : (
            <p className="text-[11px] text-gray-500">
              Hệ thống không tự động tính số tiền chính thức. Vui lòng nhập thông tin thông báo thuế do Cơ quan thuế ban hành tại mục bên dưới.
            </p>
          )}
        </div>
      </div>

      {/* Review & Verification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-gray-700">Kiểm tra đối chiếu (Cán bộ):</span>
          </div>
          {getOfficerReviewBadge(assessment.officerReviewStatus)}
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-gray-700">Phê duyệt rủi ro (Quản lý):</span>
          </div>
          {getManagerReviewBadge(assessment.managerReviewStatus)}
        </div>
      </div>
    </div>
  );
};
