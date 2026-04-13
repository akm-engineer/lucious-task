function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/6 ${className}`} />;
}

export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3.5 bg-white/80 dark:bg-white/4 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/7 shadow-sm"
          style={{ opacity: 1 - i * 0.15 }}
        >
          <Shimmer className="w-5 h-5 rounded-full shrink-0" />
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
