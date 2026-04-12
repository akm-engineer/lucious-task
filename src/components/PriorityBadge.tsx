import type { Priority } from '../types';

const config: Record<Priority, { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30',
  },
  high: {
    label: 'High',
    className: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/30',
  },
};

const dot: Record<Priority, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'xs';
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const { label, className } = config[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${className} ${
        size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[priority]}`} />
      {label}
    </span>
  );
}
