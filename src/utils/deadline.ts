import { differenceInDays, startOfDay, isBefore } from 'date-fns';

export type DeadlineStatus = 'overdue' | 'soon' | 'normal' | 'none';

interface CaseWithDeadline {
  deadline?: string | null;
  deadlineDate?: string | null; // backward compat cho localStorage
  status?: string;
}

export function getDeadlineStatus(legalCase: CaseWithDeadline): DeadlineStatus {
  // Hỗ trợ cả field backend (deadline) và field localStorage cũ (deadlineDate)
  const deadlineStr = legalCase.deadline ?? legalCase.deadlineDate;

  if (!deadlineStr) return 'none';

  // Hồ sơ đã đóng thì không cảnh báo (hỗ trợ cả code lẫn label tiếng Việt)
  const closedStatuses = ['CLOSED', 'RESPONDED', 'Đã hoàn thành', 'Đóng', 'Đóng hồ sơ'];
  if (legalCase.status && closedStatuses.includes(legalCase.status)) return 'none';

  const today = startOfDay(new Date());
  const deadline = startOfDay(new Date(deadlineStr));

  if (isBefore(deadline, today)) {
    return 'overdue';
  }

  const daysLeft = differenceInDays(deadline, today);
  if (daysLeft >= 0 && daysLeft <= 3) {
    return 'soon';
  }

  return 'normal';
}

export function formatDeadlineStatus(status: DeadlineStatus): string {
  switch (status) {
    case 'overdue': return 'Quá hạn xử lý';
    case 'soon':    return 'Sắp đến hạn';
    case 'normal':  return 'Còn hạn';
    default:        return 'Không có hạn';
  }
}
