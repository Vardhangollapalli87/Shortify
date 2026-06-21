import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../context/ThemeProvider';

export const TimeSeriesChart = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const axisColor = isDark ? '#A3A3A3' : '#525252';
  const gridColor = isDark ? '#333333' : '#D4D4D4';
  const lineColor = isDark ? '#3B82F6' : '#2563EB';
  const tooltipBg = isDark ? '#262626' : '#FFFFFF';
  const tooltipText = isDark ? '#FAFAFA' : '#171717';

  return (
    <section className="app-panel rounded-lg border p-5 shadow-sm">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Trend</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Clicks over time</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Daily clicks for the selected short link.</p>
        </div>
        <span className="rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:border-green-900 dark:bg-green-900/30 dark:text-green-300">Current data</span>
      </div>

      <div className="h-80 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-center text-sm text-neutral-700 dark:border-[#333333] dark:bg-[#212121] dark:text-[#A3A3A3]">No time-series data available for this link yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="clicksFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="4 4" />
              <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: gridColor }} tick={{ fill: axisColor, fontSize: 12 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: gridColor }} tick={{ fill: axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: '8px', color: tooltipText, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}
                labelStyle={{ color: tooltipText, fontWeight: 600 }}
                itemStyle={{ color: lineColor }}
              />
              <Area type="monotone" dataKey="count" stroke={lineColor} fill="url(#clicksFill)" strokeWidth={2.5} dot={{ r: 2, fill: lineColor }} activeDot={{ r: 4, fill: lineColor }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};
