export const AnalyticsFilters = ({ links = [], selectedLinkId, onSelect }) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Filter</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Focus the analytics view</h2>
        <p className="mt-2 text-slate-300">Select a short link to inspect engagement, audience mix, and traffic changes.</p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-200 lg:w-80">
        <span className="font-medium text-slate-200">Active link</span>
        <select
          value={selectedLinkId ?? ''}
          onChange={(event) => onSelect(event.target.value)}
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
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
