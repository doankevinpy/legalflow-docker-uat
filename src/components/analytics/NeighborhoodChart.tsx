import type { NeighborhoodStat } from '../../lib/analyticsApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: NeighborhoodStat[];
}

export function NeighborhoodChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-muted/20 rounded-md border">
        <span className="text-muted-foreground text-sm">Chưa có dữ liệu thống kê khu phố</span>
      </div>
    );
  }

  // Sort by count descending for better UI
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="neighborhood" 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="count" 
            name="Số đơn thư" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
