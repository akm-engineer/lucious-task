function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/6 ${className}`} />;
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-white/80 dark:bg-white/4 backdrop-blur-sm rounded-2xl p-3 sm:p-5 border border-white/60 dark:border-white/7 shadow-sm"
        >
          <Shimmer className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0" />
          <div className="flex flex-col items-center sm:items-start gap-2 w-full">
            <Shimmer className="h-2.5 w-14 rounded-full" />
            <Shimmer className="h-7 w-10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
