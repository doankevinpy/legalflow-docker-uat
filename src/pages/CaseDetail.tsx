import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCases } from '../hooks/useCases';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeft, CheckSquare, Clock, FileText, Info, Trash2, CalendarClock } from 'lucide-react';
import { getDeadlineStatus } from '../utils/deadline';
import type { CaseStatus } from '../types';

const STATUS_OPTIONS: CaseStatus[] = ['Mới tiếp nhận', 'Đang xử lý', 'Cần bổ sung', 'Đã hoàn thành', 'Đóng'];

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, updateCase, updateStatus, deleteCase } = useCases();
  const [activeTab, setActiveTab] = useState<'info' | 'checklist' | 'notes' | 'history'>('info');

  const currentCase = cases.find(c => c.id === id);

  if (!currentCase) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Không tìm thấy hồ sơ</h2>
        <Button variant="link" onClick={() => navigate('/cases')}>Quay lại danh sách</Button>
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as CaseStatus;
    const note = window.prompt(`Nhập ghi chú cho việc chuyển trạng thái thành "${newStatus}" (tùy chọn):`);
    if (note !== null) {
      updateStatus(currentCase.id, newStatus, 'Nhân viên (Local)', note);
    } else {
      e.target.value = currentCase.status;
    }
  };

  const toggleChecklist = (itemId: string) => {
    const itemToToggle = currentCase.checklist.find(item => item.id === itemId);
    if (!itemToToggle) return;

    const newChecklist = currentCase.checklist.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    const actionText = !itemToToggle.checked 
      ? `Đánh dấu hoàn thành tài liệu: ${itemToToggle.label}` 
      : `Bỏ đánh dấu tài liệu: ${itemToToggle.label}`;

    updateCase({ 
      ...currentCase, 
      checklist: newChecklist,
      logs: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: actionText,
          user: 'Nhân viên (Local)',
        },
        ...currentCase.logs,
      ]
    });
  };

  const saveNotes = (notes: string) => {
    updateCase({ ...currentCase, notes });
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này? Hành động này không thể hoàn tác.')) {
      deleteCase(currentCase.id);
      navigate('/cases');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/cases">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{currentCase.caseId}</h2>
            <p className="text-muted-foreground text-sm">Tiếp nhận: {format(new Date(currentCase.receivedDate), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentCase.status}
            onChange={handleStatusChange}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button variant="destructive" size="icon" onClick={handleDelete} title="Xóa hồ sơ">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-3 p-4 text-left transition-colors ${activeTab === 'info' ? 'bg-secondary/80 font-medium border-l-4 border-l-primary' : 'hover:bg-secondary/40 border-l-4 border-l-transparent'}`}
            >
              <Info className="h-5 w-5" /> Thông tin chung
            </button>
            <button 
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-3 p-4 text-left transition-colors ${activeTab === 'checklist' ? 'bg-secondary/80 font-medium border-l-4 border-l-primary' : 'hover:bg-secondary/40 border-l-4 border-l-transparent'}`}
            >
              <CheckSquare className="h-5 w-5" /> Tài liệu (Checklist)
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-3 p-4 text-left transition-colors ${activeTab === 'notes' ? 'bg-secondary/80 font-medium border-l-4 border-l-primary' : 'hover:bg-secondary/40 border-l-4 border-l-transparent'}`}
            >
              <FileText className="h-5 w-5" /> Ghi chú nội bộ
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-3 p-4 text-left transition-colors ${activeTab === 'history' ? 'bg-secondary/80 font-medium border-l-4 border-l-primary' : 'hover:bg-secondary/40 border-l-4 border-l-transparent'}`}
            >
              <Clock className="h-5 w-5" /> Lịch sử xử lý
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm min-h-[400px]">
            {activeTab === 'info' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold">Thông tin chung</h3>
                  <StatusBadge status={currentCase.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Người gửi</h4>
                    <p className="font-medium text-base">{currentCase.senderName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Thông tin liên hệ</h4>
                    <p className="font-medium text-base">{currentCase.contactInfo}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Loại đơn</h4>
                    <p className="font-medium text-base">{currentCase.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Lĩnh vực</h4>
                    <p className="font-medium text-base">{currentCase.field}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Người phụ trách</h4>
                    <p className="font-medium text-base">{currentCase.assignee}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Thời hạn xử lý</h4>
                    {currentCase.deadlineDate ? (
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-base">
                          {format(new Date(currentCase.deadlineDate), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        {(() => {
                          const dlStatus = getDeadlineStatus(currentCase);
                          if (dlStatus === 'overdue') return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-semibold"><CalendarClock className="w-3 h-3"/> Quá hạn</span>;
                          if (dlStatus === 'soon') return <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-semibold"><CalendarClock className="w-3 h-3"/> Sắp đến hạn</span>;
                          return null;
                        })()}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Không có hạn</p>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Tóm tắt nội dung</h4>
                  <p className="text-base leading-relaxed whitespace-pre-wrap bg-secondary/30 p-4 rounded-lg">{currentCase.summary}</p>
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold">Tài liệu cần thiết ({currentCase.field})</h3>
                  <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {currentCase.checklist.filter(i => i.checked).length} / {currentCase.checklist.length} hoàn thành
                  </span>
                </div>
                <div className="space-y-3">
                  {currentCase.checklist.map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-secondary/20 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={item.checked}
                        onChange={() => toggleChecklist(item.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className={`text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                  {currentCase.checklist.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Không có danh sách tài liệu mặc định cho lĩnh vực này.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-6 space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold">Ghi chú nội bộ</h3>
                </div>
                <textarea
                  value={currentCase.notes}
                  onChange={(e) => saveNotes(e.target.value)}
                  placeholder="Thêm ghi chú riêng tư về hồ sơ này... (tự động lưu)"
                  className="flex-1 min-h-[250px] w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">* Ghi chú được tự động lưu vào bộ nhớ cục bộ.</p>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6 space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold">Lịch sử xử lý</h3>
                </div>
                <div className="space-y-6 pl-4 border-l-2 border-secondary ml-2">
                  {currentCase.logs.map((log) => (
                    <div key={log.id} className="relative pl-6">
                      <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                        <span className="font-semibold text-base">{log.action}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.date), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 mb-1">Bởi: {log.user}</p>
                      {log.note && (
                        <p className="text-sm bg-secondary/40 p-2 rounded mt-2 border italic">
                          "{log.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
