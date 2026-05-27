import type { OverviewStats } from '../../lib/analyticsApi';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  MessageSquare
} from 'lucide-react';

interface Props {
  data: OverviewStats | null;
}

export function OverviewCards({ data }: Props) {
  if (!data) return null;

  const cards = [
    { name: 'Tổng số đơn thư', value: data.totalCases, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Đơn mới', value: data.newCases, icon: MessageSquare, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Đang xử lý', value: data.inProgressCases, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Đã phản hồi / Đóng', value: data.respondedCases + data.closedCases, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.name} className="overflow-hidden rounded-lg bg-card border shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-muted-foreground">{card.name}</dt>
                  <dd>
                    <div className="text-2xl font-bold text-foreground">{card.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
