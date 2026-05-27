import type { SocialInsights } from '../../lib/analyticsApi';
import { AlertTriangle, Lightbulb, Activity, Target } from 'lucide-react';

interface Props {
  data: SocialInsights | null;
}

export function InsightsPanel({ data }: Props) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Cảnh báo / Tuyên bố từ chối trách nhiệm</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Số liệu này là thống kê tổng hợp, chưa chuẩn hóa theo dân số, số hộ hoặc mật độ cư trú.</li>
                <li>Các nhận định chỉ là gợi ý cần kiểm chứng thêm, không phải kết luận nguyên nhân.</li>
                {data.disclaimers?.map((text, idx) => (
                  <li key={idx}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {data.observations && data.observations.length > 0 && (
        <div>
          <h4 className="flex items-center text-md font-semibold text-foreground mb-3">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Quan sát dữ liệu
          </h4>
          <ul className="space-y-2">
            {data.observations.map((obs, idx) => (
              <li key={idx} className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground border-l-4 border-blue-500">
                {obs}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.hypotheses && data.hypotheses.length > 0 && (
        <div>
          <h4 className="flex items-center text-md font-semibold text-foreground mb-3">
            <Lightbulb className="h-5 w-5 mr-2 text-purple-500" />
            Giả thuyết diễn giải
          </h4>
          <ul className="space-y-2">
            {data.hypotheses.map((hyp, idx) => (
              <li key={idx} className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground border-l-4 border-purple-500">
                {hyp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recommendations && data.recommendations.length > 0 && (
        <div>
          <h4 className="flex items-center text-md font-semibold text-foreground mb-3">
            <Target className="h-5 w-5 mr-2 text-green-500" />
            Khuyến nghị
          </h4>
          <ul className="space-y-2">
            {data.recommendations.map((rec, idx) => (
              <li key={idx} className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground border-l-4 border-green-500">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
