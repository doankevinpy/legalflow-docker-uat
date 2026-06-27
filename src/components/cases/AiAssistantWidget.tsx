import React from 'react';
import { Sparkles, Check, X, AlertTriangle, FileText, Tag, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { CASE_TYPE_LABELS, CASE_FIELD_LABELS, type CaseTypeCode, type CaseFieldCode } from '../../lib/constants';

interface AiAssistantWidgetProps {
  summary?: string;
  suggestedType?: string;
  suggestedField?: string;
  confidenceScore?: number;
  legalRationale?: string;
  onAccept: () => void;
  onReject: () => void;
  isSubmittingFeedback?: boolean;
  feedbackStatus?: 'ACCEPTED' | 'REJECTED' | null;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  summary,
  suggestedType,
  suggestedField,
  confidenceScore,
  legalRationale,
  onAccept,
  onReject,
  isSubmittingFeedback = false,
  feedbackStatus = null,
}) => {
  const typeLabel = suggestedType && CASE_TYPE_LABELS[suggestedType as CaseTypeCode] ? CASE_TYPE_LABELS[suggestedType as CaseTypeCode] : suggestedType;
  const fieldLabel = suggestedField && CASE_FIELD_LABELS[suggestedField as CaseFieldCode] ? CASE_FIELD_LABELS[suggestedField as CaseFieldCode] : suggestedField;
  const scorePercent = confidenceScore ? Math.round(confidenceScore * 100) : null;

  if (feedbackStatus === 'REJECTED') {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-gray-500 text-sm">
        <span>Đã từ chối đề xuất từ AI trợ lý.</span>
      </div>
    );
  }

  return (
    <div className="mt-4 p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200 rounded-xl shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2 text-amber-800 font-semibold text-base">
          <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
          <span>✨ Kết quả Phân tích từ Trợ lý AI LegalFlow</span>
        </div>
        {scorePercent !== null && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-medium border border-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Độ tin cậy: {scorePercent}%</span>
          </div>
        )}
      </div>

      {/* HITL Legal Warning */}
      <div className="flex items-start gap-2.5 p-3 bg-amber-100/70 border-l-4 border-amber-500 rounded text-amber-900 text-xs leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">⚠️ Lưu ý pháp lý (Human-in-the-Loop): </span>
          AI chỉ hỗ trợ tư vấn và đề xuất sơ bộ. Cán bộ thụ lý chịu trách nhiệm kiểm tra, đối chiếu hồ sơ gốc trước khi áp dụng. Nhấn chấp nhận sẽ điền tóm tắt và phân loại vào biểu mẫu, tuyệt đối không tự động đổi trạng thái hồ sơ.
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Summary */}
        {summary && (
          <div className="md:col-span-2 bg-white/80 p-3.5 rounded-lg border border-amber-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Tóm tắt nội dung đơn</span>
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {/* Suggested Type */}
        {suggestedType && (
          <div className="bg-white/80 p-3 rounded-lg border border-amber-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Loại đơn đề xuất</span>
            </div>
            <p className="text-gray-900 font-medium">{typeLabel} <span className="text-xs text-gray-400">({suggestedType})</span></p>
          </div>
        )}

        {/* Suggested Field */}
        {suggestedField && (
          <div className="bg-white/80 p-3 rounded-lg border border-amber-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Lĩnh vực đề xuất</span>
            </div>
            <p className="text-gray-900 font-medium">{fieldLabel} <span className="text-xs text-gray-400">({suggestedField})</span></p>
          </div>
        )}

        {/* Rationale */}
        {legalRationale && (
          <div className="md:col-span-2 bg-white/80 p-3.5 rounded-lg border border-amber-100 shadow-2xs space-y-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lý do đề xuất / Căn cứ pháp lý</div>
            <p className="text-gray-700 italic text-xs leading-relaxed">{legalRationale}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {feedbackStatus === 'ACCEPTED' ? (
          <div className="flex items-center gap-1.5 text-green-700 font-medium text-sm py-1.5 px-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-4 h-4" />
            <span>Đã chấp nhận và áp dụng vào hồ sơ</span>
          </div>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onReject}
              disabled={isSubmittingFeedback}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <X className="w-4 h-4 mr-1.5" />
              Từ chối đề xuất
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onAccept}
              disabled={isSubmittingFeedback}
              className="bg-amber-600 hover:bg-amber-700 text-white border-none"
            >
              <Check className="w-4 h-4 mr-1.5" />
              {isSubmittingFeedback ? 'Đang áp dụng...' : 'Chấp nhận đề xuất'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
