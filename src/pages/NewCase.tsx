import { useState } from 'react';
import { useCases } from '../hooks/useCases';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import type { CaseType, CaseField } from '../types';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addDays, format } from 'date-fns';

const CASE_TYPES: CaseType[] = ['Khiếu nại', 'Tố cáo', 'Kiến nghị', 'Phản ánh', 'Tư vấn pháp lý', 'Khác'];
const CASE_FIELDS: CaseField[] = ['Đất đai', 'Dân sự', 'Lao động', 'Hôn nhân gia đình', 'Doanh nghiệp', 'Hành chính', 'Khác'];
const NEIGHBORHOODS = ['KP1', 'KP2', 'KP3', 'KP4', 'KP5', 'Khác'];

export default function NewCase() {
  const { addCase } = useCases();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senderName: '',
    contactInfo: '',
    type: 'Tư vấn pháp lý' as CaseType,
    field: 'Dân sự' as CaseField,
    neighborhood: 'KP3' as any,
    summary: '',
    assignee: 'Nhân viên (Local)',
    deadlineDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCase = addCase({
      receivedDate: new Date().toISOString(),
      senderName: formData.senderName,
      contactInfo: formData.contactInfo,
      type: formData.type,
      field: formData.field,
      neighborhood: formData.neighborhood,
      summary: formData.summary,
      status: 'Mới tiếp nhận',
      assignee: formData.assignee,
      deadlineDate: new Date(formData.deadlineDate).toISOString(),
      notes: '',
    });

    navigate(`/cases/${newCase.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/cases">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Tạo hồ sơ mới</h2>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Họ tên người gửi <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Thông tin liên hệ <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Số điện thoại / Email / Địa chỉ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Loại đơn</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as CaseType})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CASE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Lĩnh vực</label>
              <select
                value={formData.field}
                onChange={(e) => setFormData({...formData, field: e.target.value as CaseField})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CASE_FIELDS.map(field => <option key={field} value={field}>{field}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Khu phố <span className="text-destructive">*</span></label>
              <select
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData({...formData, neighborhood: e.target.value as any})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Ngày đến hạn xử lý</label>
              <input
                type="date"
                value={formData.deadlineDate}
                onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Tóm tắt nội dung vụ việc <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Mô tả ngắn gọn nội dung yêu cầu của khách hàng..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t">
            <Link to="/cases">
              <Button type="button" variant="outline">Hủy bỏ</Button>
            </Link>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Lưu hồ sơ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
