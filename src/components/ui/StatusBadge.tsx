import { Badge } from './Badge';
import { CASE_STATUS_LABELS, type CaseStatusCode } from '../../lib/constants';

// Nhận code backend (NEW, IN_PROGRESS...) – hiển thị label tiếng Việt
export function StatusBadge({ status }: { status: string }) {
  const label = CASE_STATUS_LABELS[status as CaseStatusCode] ?? status;

  let variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' = 'default';

  switch (status as CaseStatusCode) {
    case 'NEW':
      variant = 'secondary';
      break;
    case 'IN_PROGRESS':
      variant = 'default';
      break;
    case 'NEEDS_MORE_INFO':
      variant = 'warning';
      break;
    case 'RESPONDED':
      variant = 'success';
      break;
    case 'CLOSED':
      variant = 'outline';
      break;
  }

  return <Badge variant={variant}>{label}</Badge>;
}
