// ─── Base shimmer ─────────────────────────────────────────────────────────────

type ShimmerProps = React.HTMLAttributes<HTMLDivElement>;

const Shimmer: React.FC<ShimmerProps> = ({ className, style }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={style}
    />
  );
};

// ─── Stats bar ────────────────────────────────────────────────────────────────

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl p-3 sm:p-5 border border-white/60 dark:border-white/[0.07] shadow-sm"
        >
          <Shimmer className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0" />
          <div className="flex flex-col items-center sm:items-start gap-2 w-full">
            <Shimmer className="h-2.5 w-14 rounded-full" />
            <Shimmer className="h-7 w-10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3.5 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-sm"
          style={{ opacity: 1 - i * 0.15 }}
        >
          <Shimmer className="w-5 h-5 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Shimmer className={`h-3.5 rounded-full ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
            <Shimmer className="h-2.5 w-1/3 rounded-full" />
          </div>
          <Shimmer className="h-5 w-14 rounded-full hidden sm:block" />
          <Shimmer className="h-3.5 w-20 rounded-full hidden sm:block" />
        </div>
      ))}
    </div>
  );
}

// ─── Task cards ───────────────────────────────────────────────────────────────

export function TaskCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-sm p-4 space-y-3"
          style={{ opacity: 1 - i * 0.2 }}
        >
          <div className="flex items-center justify-between">
            <Shimmer className="w-5 h-5 rounded-full" />
            <Shimmer className="h-5 w-14 rounded-full" />
          </div>
          <div className="space-y-2">
            <Shimmer className="h-3.5 w-full rounded-full" />
            <Shimmer className="h-3.5 w-2/3 rounded-full" />
          </div>
          <Shimmer className="h-3 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [40, 65, 30, 80, 55, 90, 45];

export function AnalyticsSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100/70 dark:border-white/[0.06]">
        <Shimmer className="w-7 h-7 rounded-lg flex-shrink-0" />
        <Shimmer className="h-3.5 w-16 rounded-full" />
        <Shimmer className="h-3 w-28 rounded-full ml-auto" />
      </div>

      <div className="p-4 sm:p-5 space-y-5">

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">

          {/* Completed this week */}
          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-violet-50/80 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 p-3 sm:p-4">
            <Shimmer className="w-8 h-8 rounded-xl" />
            <Shimmer className="h-8 w-10 rounded" />
            <Shimmer className="h-2.5 w-14 rounded-full" />
          </div>

          {/* Completion ring */}
          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3 sm:p-4">
            <Shimmer className="w-[60px] h-[60px] rounded-full" />
            <Shimmer className="h-2.5 w-16 rounded-full" />
          </div>

          {/* On-time ring */}
          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-3 sm:p-4">
            <Shimmer className="w-[60px] h-[60px] rounded-full" />
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
                  <Shimmer className="w-full rounded-t-lg" style={{ height: ` ${h}%` }} />
                </div>
                <Shimmer className="h-2.5 w-3 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100/70 dark:border-white/[0.05]">
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