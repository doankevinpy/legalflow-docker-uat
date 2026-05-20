import type { LegalCase } from '../types';
import { storage } from '../utils/storage';
import { generateCaseId } from '../utils/caseId';
import { defaultChecklists } from './checklist';
import { addDays } from 'date-fns';

const MOCK_CASES: Omit<LegalCase, 'id' | 'caseId' | 'checklist'>[] = [
  {
    receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    senderName: 'Nguyễn Văn A',
    contactInfo: '0901234567 - nguyenvana@email.com',
    type: 'Khiếu nại',
    field: 'Đất đai',
    summary: 'Khiếu nại về quyết định bồi thường giải phóng mặt bằng dự án khu dân cư.',
    status: 'Mới tiếp nhận',
    assignee: 'Trần Thị B',
    logs: [
      { id: '1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), action: 'Tạo hồ sơ mới', user: 'Hệ thống' }
    ],
    notes: 'Cần kiểm tra kỹ hồ sơ gốc tại địa phương.',
    deadlineDate: new Date(addDays(new Date(), -1)).toISOString(), // Đã quá hạn 1 ngày
  },
  {
    receivedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    senderName: 'Lê Hoàng C',
    contactInfo: '0912345678',
    type: 'Tư vấn pháp lý',
    field: 'Doanh nghiệp',
    summary: 'Tư vấn thủ tục chia tách doanh nghiệp Cổ phần.',
    status: 'Đang xử lý',
    assignee: 'Phạm Văn D',
    logs: [
      { id: '2', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), action: 'Tạo hồ sơ mới', user: 'Hệ thống' },
      { id: '3', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), action: 'Cập nhật trạng thái thành: Đang xử lý', user: 'Phạm Văn D' }
    ],
    notes: '',
    deadlineDate: new Date(addDays(new Date(), 2)).toISOString(), // Sắp đến hạn (2 ngày)
  },
  {
    receivedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    senderName: 'Vũ Thị E',
    contactInfo: 'vuthie@email.com',
    type: 'Tố cáo',
    field: 'Lao động',
    summary: 'Tố cáo công ty X không đóng BHXH cho người lao động trong 2 năm.',
    status: 'Cần bổ sung',
    assignee: 'Trần Thị B',
    logs: [
      { id: '4', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), action: 'Tạo hồ sơ mới', user: 'Hệ thống' },
      { id: '5', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), action: 'Yêu cầu bổ sung tài liệu', user: 'Trần Thị B', note: 'Thiếu hợp đồng lao động bản sao.' }
    ],
    notes: 'Đã gửi email yêu cầu bổ sung nhưng chưa thấy phản hồi.',
    deadlineDate: new Date(addDays(new Date(), 10)).toISOString(), // Còn dài
  },
  {
    receivedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    senderName: 'Hoàng Quốc F',
    contactInfo: '0987654321',
    type: 'Khác',
    field: 'Hôn nhân gia đình',
    summary: 'Yêu cầu giải quyết ly hôn đơn phương có yếu tố nước ngoài.',
    status: 'Đã hoàn thành',
    assignee: 'Phạm Văn D',
    logs: [
      { id: '6', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), action: 'Tạo hồ sơ mới', user: 'Hệ thống' },
      { id: '7', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), action: 'Đóng hồ sơ', user: 'Phạm Văn D' }
    ],
    notes: 'Đã hoàn tất tư vấn và bàn giao kết quả cho KH.',
  }
];

export const seedData = () => {
  const currentCases = storage.getCases();
  if (currentCases.length === 0) {
    const seedCases: LegalCase[] = MOCK_CASES.map((data, index) => {
      // Mock some check lists as checked
      const checklist = JSON.parse(JSON.stringify(defaultChecklists[data.field] || defaultChecklists['Khác']));
      if (data.status === 'Đã hoàn thành') {
        checklist.forEach((item: any) => item.checked = true);
      } else if (data.status === 'Đang xử lý') {
        if (checklist[0]) checklist[0].checked = true;
      }

      return {
        ...data,
        id: crypto.randomUUID(),
        caseId: generateCaseId() + index, // Add index to ensure uniqueness for simultaneous generation
        checklist,
      };
    });
    
    storage.saveCases(seedCases);
  } else {
    // Migrate existing data to have deadlineDate if missing
    let migrated = false;
    const migratedCases = currentCases.map(c => {
      if (!c.deadlineDate && c.status !== 'Đã hoàn thành' && c.status !== 'Đóng') {
        migrated = true;
        return { ...c, deadlineDate: new Date(addDays(new Date(c.receivedDate), 7)).toISOString() };
      }
      return c;
    });
    if (migrated) {
      storage.saveCases(migratedCases);
    }
  }
};
