import type { LegalCase } from '../types';
import { differenceInDays, startOfDay, isBefore } from 'date-fns';

export type DeadlineStatus = 'overdue' | 'soon' | 'normal' | 'none';

export function getDeadlineStatus(legalCase: LegalCase): DeadlineStatus {
  // Nếu không có hạn, hoặc hồ sơ đã đóng/hoàn thành thì không cảnh báo
  if (!legalCase.deadlineDate) return 'none';
  if (legalCase.status === 'Đã hoàn thành' || legalCase.status === 'Đóng') return 'none';

  const today = startOfDay(new Date());
  const deadline = startOfDay(new Date(legalCase.deadlineDate));

  // Nếu hạn chót đã trôi qua so với hôm nay
  if (isBefore(deadline, today)) {
    return 'overdue';
  }

  // Số ngày còn lại (kể cả hôm nay)
  const daysLeft = differenceInDays(deadline, today);

  // <= 3 ngày thì báo sắp đến hạn theo yêu cầu của user
  if (daysLeft >= 0 && daysLeft <= 3) {
    return 'soon';
  }

  return 'normal';
}

export function formatDeadlineStatus(status: DeadlineStatus): string {
  switch (status) {
    case 'overdue': return 'Quá hạn xử lý';
    case 'soon': return 'Sắp đến hạn';
    case 'normal': return 'Còn hạn';
    default: return 'Không có hạn';
  }
}
