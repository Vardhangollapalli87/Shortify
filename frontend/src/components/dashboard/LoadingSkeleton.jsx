export const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/80" />
      ))}
    </div>
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="mb-6 h-5 w-48 animate-pulse rounded bg-slate-800" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-2xl bg-slate-800" />
        ))}
      </div>
    </div>
  </div>
);
