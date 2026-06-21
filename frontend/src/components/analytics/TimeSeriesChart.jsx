import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const TimeSeriesChart = ({ data = [] }) => (
  <section className="app-panel rounded-lg border p-5 shadow-sm">
    <div className="mb-6 flex items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Trend</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Clicks over time</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">A daily view of engagement for the selected short link.</p>
      </div>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Current data</span>
    </div>

    <div className="h-80 w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950 text-center text-sm text-slate-400">No time-series data available for this link yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="clicksFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="count" stroke="#2563eb" fill="url(#clicksFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </section>
);
