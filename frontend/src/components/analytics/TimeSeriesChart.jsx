import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const TimeSeriesChart = ({ data = [] }) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
    <div className="mb-6 flex items-end justify-between gap-3">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Trend</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Clicks over time</h2>
        <p className="mt-2 text-slate-300">A daily view of engagement for the selected short link.</p>
      </div>
      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">Live data</span>
    </div>

    <div className="h-80 w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/70 text-slate-300">No time-series data available for this link yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="clicksFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', color: '#e2e8f0' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="count" stroke="#22d3ee" fill="url(#clicksFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </section>
);
