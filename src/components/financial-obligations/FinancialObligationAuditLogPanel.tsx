import React, { useState } from 'react';
import type { FinancialObligationAuditLog } from '../../types/financial-obligation';
import { financialObligationsApi } from '../../lib/financialObligationsApi';
import { History, RefreshCw, AlertOctagon, User, Clock } from 'lucide-react';

interface FinancialObligationAuditLogPanelProps {
  assessmentId: string;
}

export const FinancialObligationAuditLogPanel: React.FC<FinancialObligationAuditLogPanelProps> = ({
  assessmentId,
}) => {
  const [logs, setLogs] = useState<FinancialObligationAuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const fetchLogs = async () => {
    if (!assessmentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await financialObligationsApi.getAuditLogs(assessmentId);
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải lịch sử kiểm toán';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'ASSESSMENT_CREATED':
        return 'Khởi tạo đánh giá nghĩa vụ tài chính';
      case 'AI_SUGGESTION_GENERATED':
        return 'AI hỗ trợ tạo bảng chiết tính dự kiến';
      case 'ITEM_CREATED':
        return 'Thêm khoản mục dự kiến';
      case 'ITEM_UPDATED':
        return 'Cập nhật khoản mục dự kiến';
      case 'TAX_NOTICE_UPLOADED':
        return 'Ghi nhận Thông báo thuế chính thức';
      case 'PAYMENT_EVIDENCE_UPLOADED':
        return 'Tải lên chứng từ nộp tiền vào NSNN';
      case 'OFFICER_VERIFIED':
        return 'Cán bộ rà soát xác nhận đối chiếu';
      case 'MANAGER_VERIFIED':
        return 'Quản lý/Lãnh đạo phê duyệt';
      case 'COMPLETED':
        return 'Đánh dấu hoàn thành nghĩa vụ tài chính';
      case 'COMPLETION_BLOCKED':
        return '⚠️ Bị hệ thống chặn hoàn thành do chưa đủ điều kiện';
      default:
        return action;
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-base font-bold text-gray-900">
            9. Nhật ký kiểm toán & Theo dõi thao tác (Audit Trail)
          </h3>
          {logs.length > 0 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
              {logs.length} sự kiện
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!expanded) setExpanded(true);
              fetchLogs();
            }}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold border transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Xem audit log
          </button>
          <button
            onClick={() => {
              const next = !expanded;
              setExpanded(next);
              if (next && logs.length === 0) {
                fetchLogs();
              }
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline px-2"
          >
            {expanded ? 'Thu gọn' : 'Mở rộng'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 pt-2 border-t">
          {loading ? (
            <div className="p-6 text-center text-xs text-gray-500 font-medium">Đang tải lịch sử thao tác...</div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg font-semibold">{error}</div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 font-medium italic">Chưa có bản ghi audit log nào được ghi nhận.</div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-4 transition ${
                    log.action === 'COMPLETION_BLOCKED'
                      ? 'bg-red-50/90 border-red-300'
                      : log.action === 'COMPLETED'
                      ? 'bg-green-50/70 border-green-200'
                      : 'bg-gray-50/70 border-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {log.action === 'COMPLETION_BLOCKED' ? (
                        <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <History className="w-4 h-4 text-gray-500 shrink-0" />
                      )}
                      <span className={`font-bold ${log.action === 'COMPLETION_BLOCKED' ? 'text-red-900' : 'text-gray-900'}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </div>
                    {log.reason && (
                      <div className="text-gray-600 font-medium pl-6">
                        <span className="font-semibold">Lý do/Chi tiết:</span> {log.reason}
                      </div>
                    )}
                    {(log.beforeValue || log.afterValue) && (
                      <div className="text-gray-500 font-mono text-[10px] pl-6">
                        {log.beforeValue && <span>Trước: {log.beforeValue} → </span>}
                        {log.afterValue && <span>Sau: {log.afterValue}</span>}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="flex items-center justify-end gap-1 text-gray-600 font-medium">
                      <User className="w-3 h-3 text-gray-400" />
                      <span>{log.actor?.fullName || log.actorId}</span>
                      {log.actor?.role && (
                        <span className="px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded text-[9px] font-bold">
                          {log.actor.role}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-gray-400 text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
