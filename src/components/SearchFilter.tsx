import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { FilterPriority, FilterStatus } from '../types';

interface SearchFilterProps {
  search: string;
  filterStatus: FilterStatus;
  filterPriority: FilterPriority;
  onSearch: (v: string) => void;
  onFilterStatus: (v: FilterStatus) => void;
  onFilterPriority: (v: FilterPriority) => void;
}

const statusOptions: {
  value: FilterStatus;
  label: string;
  activeGradient: string;
  activeShadow: string;
}[] = [
  {
    value: 'all',
    label: 'All',
    activeGradient: 'from-slate-600 to-zinc-800',
    activeShadow: 'shadow-slate-700/40',
  },
  {
    value: 'pending',
    label: 'Pending',
    activeGradient: 'from-amber-500 to-orange-500',
    activeShadow: 'shadow-amber-500/30',
  },
  {
    value: 'completed',
    label: 'Completed',
    activeGradient: 'from-teal-500 to-cyan-500',
    activeShadow: 'shadow-teal-500/30',
  },
];

const priorityOptions: {
  value: FilterPriority;
  label: string;
  dot: string;
  activeGradient: string;
  activeShadow: string;
}[] = [
  {
    value: 'all',
    label: 'All',
    dot: '',
    activeGradient: 'from-fuchsia-500 to-pink-600',
    activeShadow: 'shadow-fuchsia-500/30',
  },
  {
    value: 'low',
    label: 'Low',
    dot: 'bg-emerald-400',
    activeGradient: 'from-emerald-500 to-teal-500',
    activeShadow: 'shadow-emerald-500/30',
  },
  {
    value: 'medium',
    label: 'Medium',
    dot: 'bg-amber-400',
    activeGradient: 'from-amber-500 to-orange-500',
    activeShadow: 'shadow-amber-500/30',
  },
  {
    value: 'high',
    label: 'High',
    dot: 'bg-rose-400',
    activeGradient: 'from-rose-500 to-red-500',
    activeShadow: 'shadow-rose-500/30',
  },
];

export function SearchFilter({
  search,
  filterStatus,
  filterPriority,
  onSearch,
  onFilterStatus,
  onFilterPriority,
}: SearchFilterProps) {
  return (
    <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-sm p-3 sm:p-4 space-y-3">

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search tasks…"
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status — full width segmented */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">
          Status
        </p>
        <div className="flex items-center bg-slate-100/80 dark:bg-white/[0.05] rounded-xl p-1 gap-1">
          {statusOptions.map(opt => {
            const isActive = filterStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onFilterStatus(opt.value)}
                className={`relative flex-1 py-2 rounded-lg text-xs font-bold transition-colors duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="status-pill"
                    className={`absolute inset-0 rounded-lg bg-linear-to-r ${opt.activeGradient} shadow-md ${opt.activeShadow}`}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority — full width segmented */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">
          Priority
        </p>
        <div className="flex items-center bg-slate-100/80 dark:bg-white/[0.05] rounded-xl p-1 gap-1">
          {priorityOptions.map(opt => {
            const isActive = filterPriority === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onFilterPriority(opt.value)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="priority-pill"
                    className={`absolute inset-0 rounded-lg bg-linear-to-r ${opt.activeGradient} shadow-md ${opt.activeShadow}`}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {opt.dot && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white/70' : opt.dot}`} />
                  )}
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
