import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface FinancialObligationSafetyBannerProps {
  isEstimate?: boolean;
  safetyWarnings?: string[];
}

export const FinancialObligationSafetyBanner: React.FC<FinancialObligationSafetyBannerProps> = ({
  isEstimate = true,
  safetyWarnings = [],
}) => {
  return (
    <div className="space-y-3">
      {/* Primary Mandatory Safety Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-amber-900">
            <p className="font-bold tracking-wide uppercase text-amber-800">
              KẾT QUẢ HỖ TRỢ NGHĨA VỤ TÀI CHÍNH CHỈ LÀ DỰ KIẾN.
            </p>
            <p className="font-semibold leading-relaxed">
              CÁN BỘ PHẢI KIỂM TRA HỒ SƠ, CĂN CỨ PHÁP LÝ, BẢNG GIÁ ĐẤT, THÔNG BÁO CỦA CƠ QUAN THUẾ VÀ CHỨNG TỪ THỰC TẾ TRƯỚC KHI SỬ DỤNG.
            </p>
            <p className="font-medium text-amber-800">
              HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ, KHÔNG PHÁT HÀNH THÔNG BÁO NỘP TIỀN.
            </p>
          </div>
        </div>
      </div>

      {/* Backend Safety Warnings & Estimate Indicator */}
      {isEstimate && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-2 text-xs text-blue-800 font-medium">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong className="uppercase mr-1">DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC:</strong>
            Số tiền chiết tính hiện tại được AI hỗ trợ tổng hợp từ dữ liệu tham khảo, cần có thông báo chính thức từ cơ quan thuế để xác định số nộp thực tế.
          </span>
        </div>
      )}

      {/* Additional Safety Warnings from API */}
      {safetyWarnings && safetyWarnings.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg space-y-1">
          <p className="text-xs font-bold text-orange-800 flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-4 h-4 text-orange-600" /> Cảnh báo an toàn từ hệ thống kiểm duyệt:
          </p>
          <ul className="list-disc list-inside text-xs text-orange-700 space-y-0.5 pl-1">
            {safetyWarnings.map((warn, index) => (
              <li key={index} className="font-medium">
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
