import { useEffect, useState } from 'react';
import { analyticsApi } from '../lib/analyticsApi';
import type { OverviewStats, NeighborhoodStat, FieldStat, CrossTabStat, SocialInsights } from '../lib/analyticsApi';
import { OverviewCards } from '../components/analytics/OverviewCards';
import { NeighborhoodChart } from '../components/analytics/NeighborhoodChart';
import { FieldChart } from '../components/analytics/FieldChart';
import { CrossTabTable } from '../components/analytics/CrossTabTable';
import { InsightsPanel } from '../components/analytics/InsightsPanel';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [byNeighborhood, setByNeighborhood] = useState<NeighborhoodStat[]>([]);
  const [byField, setByField] = useState<FieldStat[]>([]);
  const [crossTab, setCrossTab] = useState<CrossTabStat[]>([]);
  const [insights, setInsights] = useState<SocialInsights | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ovData, nbData, fieldData, crossData, insightData] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getByNeighborhood(),
        analyticsApi.getByField(),
        analyticsApi.getCrossTab(),
        analyticsApi.getSocialInsights(),
      ]);

      setOverview(ovData);
      setByNeighborhood(nbData);
      setByField(fieldData);
      setCrossTab(crossData);
      setInsights(insightData);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={loadData}
                  className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Thống kê & Phân tích</h1>
        <button
          onClick={loadData}
          className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </button>
      </div>

      <OverviewCards data={overview} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Đơn thư theo khu phố</h3>
            <p className="text-sm text-muted-foreground">Phân bổ lượng đơn thư ghi nhận theo từng khu vực.</p>
          </div>
          <div className="p-6">
            <NeighborhoodChart data={byNeighborhood} />
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Đơn thư theo lĩnh vực</h3>
            <p className="text-sm text-muted-foreground">Phân bổ lượng đơn thư theo nhóm vấn đề/lĩnh vực.</p>
          </div>
          <div className="p-6">
            <FieldChart data={byField} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 border-b">
          <h3 className="font-semibold leading-none tracking-tight">Phân tích chéo (Khu phố x Lĩnh vực)</h3>
          <p className="text-sm text-muted-foreground">Ma trận chi tiết số lượng đơn thư.</p>
        </div>
        <div className="p-6">
          <CrossTabTable data={crossTab} />
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 border-b bg-muted/20">
          <h3 className="font-semibold leading-none tracking-tight">Phân tích Tâm lý học xã hội (Tham khảo)</h3>
          <p className="text-sm text-muted-foreground">Được sinh tự động dựa trên quy tắc thống kê hiện hành.</p>
        </div>
        <div className="p-6">
          <InsightsPanel data={insights} />
        </div>
      </div>
    </div>
  );
}

