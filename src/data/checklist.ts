import type { CaseField, ChecklistItem } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const defaultChecklists: Record<CaseField, ChecklistItem[]> = {
  'Đất đai': [
    { id: generateId(), label: 'Giấy chứng nhận QSDĐ (Sổ đỏ/Sổ hồng)', checked: false },
    { id: generateId(), label: 'Căn cước công dân của các bên', checked: false },
    { id: generateId(), label: 'Giấy xác nhận tình trạng hôn nhân (nếu có)', checked: false },
    { id: generateId(), label: 'Hợp đồng mua bán/chuyển nhượng (bản gốc)', checked: false },
    { id: generateId(), label: 'Biên lai nộp thuế (nếu có)', checked: false },
  ],
  'Dân sự': [
    { id: generateId(), label: 'Căn cước công dân', checked: false },
    { id: generateId(), label: 'Hợp đồng/Giao dịch dân sự (nếu có)', checked: false },
    { id: generateId(), label: 'Tài liệu chứng minh thiệt hại', checked: false },
  ],
  'Lao động': [
    { id: generateId(), label: 'Căn cước công dân', checked: false },
    { id: generateId(), label: 'Hợp đồng lao động', checked: false },
    { id: generateId(), label: 'Bảng lương/Sao kê lương 6 tháng gần nhất', checked: false },
    { id: generateId(), label: 'Quyết định thôi việc/kỷ luật (nếu có)', checked: false },
    { id: generateId(), label: 'Sổ bảo hiểm xã hội', checked: false },
  ],
  'Hôn nhân gia đình': [
    { id: generateId(), label: 'Căn cước công dân của 2 vợ chồng', checked: false },
    { id: generateId(), label: 'Giấy chứng nhận đăng ký kết hôn (Bản gốc)', checked: false },
    { id: generateId(), label: 'Giấy khai sinh của các con (Bản sao/Trích lục)', checked: false },
    { id: generateId(), label: 'Giấy tờ chứng minh tài sản chung (nếu có tranh chấp)', checked: false },
  ],
  'Doanh nghiệp': [
    { id: generateId(), label: 'Giấy chứng nhận đăng ký doanh nghiệp', checked: false },
    { id: generateId(), label: 'Căn cước công dân của người đại diện pháp luật', checked: false },
    { id: generateId(), label: 'Điều lệ công ty', checked: false },
    { id: generateId(), label: 'Biên bản họp Hội đồng quản trị/HĐTV (nếu có)', checked: false },
  ],
  'Hành chính': [
    { id: generateId(), label: 'Căn cước công dân', checked: false },
    { id: generateId(), label: 'Quyết định hành chính/Hành vi hành chính bị khiếu kiện', checked: false },
    { id: generateId(), label: 'Tài liệu chứng minh quyền lợi bị xâm phạm', checked: false },
  ],
  'Khác': [
    { id: generateId(), label: 'Căn cước công dân', checked: false },
    { id: generateId(), label: 'Tài liệu liên quan (tùy vụ việc)', checked: false },
  ],
};
