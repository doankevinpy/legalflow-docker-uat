import type { CrossTabStat } from '../../lib/analyticsApi';

interface Props {
  data: CrossTabStat[];
}

export function CrossTabTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center bg-muted/20 rounded-md border">
        <span className="text-muted-foreground text-sm">Chưa có dữ liệu thống kê chéo</span>
      </div>
    );
  }

  const neighborhoods = Array.from(new Set(data.map((d) => d.neighborhood))).sort();
  const fields = Array.from(new Set(data.map((d) => d.field))).sort();

  const getCount = (nh: string, field: string) => {
    const record = data.find((d) => d.neighborhood === nh && d.field === field);
    return record?.count || 0;
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider">
              Khu phố
            </th>
            {fields.map((field) => (
              <th key={field} className="px-4 py-3 text-right font-medium text-muted-foreground uppercase tracking-wider">
                {field}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-bold text-muted-foreground uppercase tracking-wider">
              Tổng
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-gray-200">
          {neighborhoods.map((nh) => {
            let rowTotal = 0;
            return (
              <tr key={nh} className="hover:bg-muted/50">
                <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                  {nh}
                </td>
                {fields.map((field) => {
                  const val = getCount(nh, field);
                  rowTotal += val;
                  return (
                    <td key={field} className="px-4 py-3 whitespace-nowrap text-right text-muted-foreground">
                      {val > 0 ? val : '-'}
                    </td>
                  );
                })}
                <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-primary">
                  {rowTotal}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-muted/50">
          <tr>
            <td className="px-4 py-3 font-bold text-foreground">Tổng cộng</td>
            {fields.map((field) => {
              const colTotal = neighborhoods.reduce((sum, nh) => sum + getCount(nh, field), 0);
              return (
                <td key={field} className="px-4 py-3 text-right font-bold text-primary">
                  {colTotal > 0 ? colTotal : '-'}
                </td>
              );
            })}
            <td className="px-4 py-3 text-right font-bold text-primary">
              {data.reduce((sum, d) => sum + d.count, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
