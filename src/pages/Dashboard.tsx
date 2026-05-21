import { useEffect, useState } from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { casesApi } from '../lib/casesApi';
import type { ApiCase, CaseStats } from '../lib/api-types';
import {
  CASE_STATUS_LABELS, CASE_FIELD_LABELS, type CaseFieldCode, type CaseStatusCode,
} from '../lib/constants';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];

export default function Dashboard() {
  const [stats, setStats]       = useState<CaseStats | null>(null);
  const [recent, setRecent]     = useState<ApiCase[]>([]);
  const [overdue, setOverdue]   = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const [statsRes, recentRes, overdueRes] = await Promise.all([
          casesApi.getStats(),
          casesApi.getCases({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
          casesApi.getCases({ status: 'IN_PROGRESS', limit: 5 }),
        ]);
        if (!cancelled) {
          setStats(statsRes);
          setRecent(recentRes.data);
          // Overdue: filter from recent + separately fetch by status
          setOverdue(overdueRes.data.filter(c => {
            if (!c.deadline) return false;
            return new Date(c.deadline) < new Date();
          }));
        }
      } catch {
        // silent – UI still renders
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    { name: 'Tổng số hồ sơ',  value: stats?.total ?? 0 },
    { name: 'Mới tiếp nhận',  value: stats?.byStatus?.NEW ?? 0 },
    { name: 'Đang xử lý',    value: stats?.byStatus?.IN_PROGRESS ?? 0 },
    { name: 'Cần bổ sung',   value: stats?.byStatus?.NEEDS_MORE_INFO ?? 0, isInfo: true },
    { name: 'Quá hạn xử lý', value: stats?.overdue ?? 0, isWarning: true },
  ];

  const statusData = Object.entries(stats?.byStatus ?? {}).map(([key, value]) => ({
    name: CASE_STATUS_LABELS[key as CaseStatusCode] ?? key,
    value,
  }));

  const fieldData = Object.entries(stats?.byField ?? {}).map(([key, value]) => ({
    name: CASE_FIELD_LABELS[key as CaseFieldCode] ?? key,
    value,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl border shadow-sm p-6 flex flex-col justify-between ${
              stat.isWarning && stat.value > 0
                ? 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800'
                : stat.isInfo && stat.value > 0
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800'
                : 'bg-card text-card-foreground'
            }`}
          >
            <h3 className="tracking-tight text-sm font-medium opacity-80">{stat.name}</h3>
            <div className="text-3xl font-bold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê theo trạng thái</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="value" label
                >
                  {statusData.map((_, index) => (
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
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div className="rounded-xl border bg-red-50 dark:bg-red-950/10 shadow-sm overflow-hidden border-red-200 dark:border-red-800">
          <div className="p-4 border-b border-red-200 dark:border-red-800 flex items-center gap-2 bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Hồ sơ quá hạn ({overdue.length})
            </h3>
          </div>
          <div className="divide-y divide-red-100 dark:divide-red-900/30">
            {overdue.slice(0, 5).map(c => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="block p-4 hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">{c.caseCode}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{c.senderName}</p>
                  </div>
                  {c.deadline && (
                    <div className="text-right text-xs text-red-600 dark:text-red-400 font-medium">
                      Hạn: {format(new Date(c.deadline), 'dd/MM/yyyy')}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent cases */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Hồ sơ gần đây</h3>
        </div>
        <div className="divide-y">
          {recent.map(c => (
            <Link
              key={c.id}
              to={`/cases/${c.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-secondary/20 transition-colors"
            >
              <div>
                <p className="font-medium">{c.caseCode} – {c.senderName}</p>
                <p className="text-sm text-muted-foreground">
                  {CASE_FIELD_LABELS[c.field as CaseFieldCode] ?? c.field}
                  {' • '}
                  {format(new Date(c.createdAt), 'dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
              <StatusBadge status={c.status} />
            </Link>
          ))}
          {recent.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">Chưa có hồ sơ nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}
