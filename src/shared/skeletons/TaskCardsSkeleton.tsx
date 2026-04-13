function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/6 ${className}`} />;
}

export function TaskCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white/80 dark:bg-white/4 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/7 shadow-sm p-4 space-y-3"
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
