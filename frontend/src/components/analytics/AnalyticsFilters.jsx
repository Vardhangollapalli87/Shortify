export const AnalyticsFilters = ({ links = [], selectedLinkId, onSelect }) => (
  <section className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-black/20">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Filter</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Focus the analytics view</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Select a short link to inspect engagement, audience mix, and traffic changes.</p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-200 lg:w-80">
        <span className="font-medium text-slate-200">Active link</span>
        <select
          value={selectedLinkId ?? ''}
          onChange={(event) => onSelect(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
        >
          {links.length === 0 ? (
            <option value="">No links available</option>
          ) : (
            links.map((link) => (
              <option key={link.id} value={link.id}>
                /{link.shortCode} — {link.originalUrl}
              </option>
            ))
          )}
        </select>
      </label>
    </div>
  </section>
);
