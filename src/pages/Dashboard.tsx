import { useCases } from '../hooks/useCases';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { getDeadlineStatus } from '../utils/deadline';
import { AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];

export default function Dashboard() {
  const { cases } = useCases();

  const totalCases = cases.length;
  const newCases = cases.filter(c => c.status === 'Mới tiếp nhận').length;
  const processingCases = cases.filter(c => c.status === 'Đang xử lý').length;


  const overdueCases = cases.filter(c => getDeadlineStatus(c) === 'overdue');
  const soonCases = cases.filter(c => getDeadlineStatus(c) === 'soon');

  const recentCases = [...cases].sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()).slice(0, 5);

  const stats = [
    { name: 'Tổng số hồ sơ', value: totalCases },
    { name: 'Mới tiếp nhận', value: newCases },
    { name: 'Đang xử lý', value: processingCases },
    { name: 'Quá hạn xử lý', value: overdueCases.length, isWarning: true },
  ];

  // Prepare chart data
  const statusCounts = cases.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));

  const fieldCounts = cases.reduce((acc, curr) => {
    acc[curr.field] = (acc[curr.field] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const fieldData = Object.keys(fieldCounts).map(key => ({ name: key, value: fieldCounts[key] }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className={`rounded-xl border shadow-sm p-6 flex flex-col justify-between ${stat.isWarning && stat.value > 0 ? 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800' : 'bg-card text-card-foreground'}`}>
            <h3 className="tracking-tight text-sm font-medium opacity-80">{stat.name}</h3>
            <div className="text-3xl font-bold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê theo trạng thái</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                  {statusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê theo lĩnh vực</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fieldData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {(overdueCases.length > 0 || soonCases.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {overdueCases.length > 0 && (
            <div className="rounded-xl border bg-red-50 dark:bg-red-950/10 text-card-foreground shadow-sm overflow-hidden border-red-200 dark:border-red-800">
              <div className="p-4 border-b border-red-200 dark:border-red-800 flex items-center gap-2 bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Hồ sơ quá hạn ({overdueCases.length})</h3>
              </div>
              <div className="divide-y divide-red-100 dark:divide-red-900/30">
                {overdueCases.slice(0, 5).map(c => (
                  <Link key={c.id} to={`/cases/${c.id}`} className="block p-4 hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-red-900 dark:text-red-100">{c.caseId}</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{c.senderName}</p>
                      </div>
                      <div className="text-right text-xs text-red-600 dark:text-red-400 font-medium">
                        Hạn: {format(new Date(c.deadlineDate!), 'dd/MM/yyyy')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {soonCases.length > 0 && (
            <div className="rounded-xl border bg-orange-50 dark:bg-orange-950/10 text-card-foreground shadow-sm overflow-hidden border-orange-200 dark:border-orange-800">
              <div className="p-4 border-b border-orange-200 dark:border-orange-800 flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30">
                <Clock className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">Sắp đến hạn ({soonCases.length})</h3>
              </div>
              <div className="divide-y divide-orange-100 dark:divide-orange-900/30">
                {soonCases.slice(0, 5).map(c => (
                  <Link key={c.id} to={`/cases/${c.id}`} className="block p-4 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">{c.caseId}</p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">{c.senderName}</p>
                      </div>
                      <div className="text-right text-xs text-orange-600 dark:text-orange-400 font-medium">
                        Hạn: {format(new Date(c.deadlineDate!), 'dd/MM/yyyy')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Hồ sơ gần đây</h3>
        </div>
        <div className="divide-y">
          {recentCases.map(c => (
            <div key={c.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">{c.caseId} - {c.senderName}</p>
                <p className="text-sm text-muted-foreground">{c.field} • {format(new Date(c.receivedDate), 'dd/MM/yyyy', { locale: vi })}</p>
              </div>
              <div>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
          {recentCases.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">Chưa có hồ sơ nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}
