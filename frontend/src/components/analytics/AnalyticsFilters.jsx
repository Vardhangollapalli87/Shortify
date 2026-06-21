export const AnalyticsFilters = ({ links = [], selectedLinkId, onSelect }) => (
  <section className="app-panel rounded-lg border p-5 shadow-sm">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Filter</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Focus the analytics view</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Select a short link to inspect engagement, audience mix, and traffic changes.</p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200 lg:w-80">
        <span className="font-medium">Active link</span>
        <select
          value={selectedLinkId ?? ''}
          onChange={(event) => onSelect(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
