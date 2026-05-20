import { Badge } from './Badge';
import type { CaseStatus } from '../../types';

export function StatusBadge({ status }: { status: CaseStatus }) {
  let variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' = 'default';

  switch (status) {
    case 'Mới tiếp nhận':
      variant = 'secondary';
      break;
    case 'Đang xử lý':
      variant = 'default';
      break;
    case 'Cần bổ sung':
      variant = 'warning';
      break;
    case 'Đã hoàn thành':
      variant = 'success';
      break;
    case 'Đóng':
      variant = 'outline';
      break;
  }

  return <Badge variant={variant}>{status}</Badge>;
}
