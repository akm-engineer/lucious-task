function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/6 ${className}`} />;
}

const BAR_HEIGHTS = [40, 65, 30, 80, 55, 90, 45];

export function AnalyticsSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-white/4 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/7 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100/70 dark:border-white/6">
        <Shimmer className="w-7 h-7 rounded-lg shrink-0" />
        <Shimmer className="h-3.5 w-16 rounded-full" />
        <Shimmer className="h-3 w-28 rounded-full ml-auto" />
      </div>

      <div className="p-4 sm:p-5 space-y-5">

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">

          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-violet-50/80 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 p-3 sm:p-4">
            <Shimmer className="w-8 h-8 rounded-xl" />
            <Shimmer className="h-8 w-10 rounded" />
            <Shimmer className="h-2.5 w-14 rounded-full" />
          </div>

          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3 sm:p-4">
            <Shimmer className="w-15 h-15 rounded-full" />
            <Shimmer className="h-2.5 w-16 rounded-full" />
          </div>

          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-3 sm:p-4">
            <Shimmer className="w-15 h-15 rounded-full" />
            <Shimmer className="h-2.5 w-14 rounded-full" />
          </div>

        </div>

        {/* Activity chart */}
        <div>
          <Shimmer className="h-2.5 w-32 rounded-full mb-3" />
          <div className="flex items-end gap-1.5 sm:gap-2 h-20">
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex flex-col justify-end" style={{ height: 'calc(100% - 20px)' }}>
                  <div
                    className="w-full rounded-t-lg animate-pulse bg-slate-200 dark:bg-white/6"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <Shimmer className="h-2.5 w-3 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100/70 dark:border-white/5">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Shimmer className="h-6 w-8 rounded" />
              <Shimmer className="h-2.5 w-12 rounded-full" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
