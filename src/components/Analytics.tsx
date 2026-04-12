import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, BadgeCheck, Rocket, Crosshair } from 'lucide-react';
import type { Task } from '../types';

interface AnalyticsProps {
  tasks: Task[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getLast7Days(): { date: Date; label: string; shortLabel: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: startOfDay(d),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      shortLabel: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
    };
  });
}

// ─── Ring ────────────────────────────────────────────────────────────────────

interface RingProps {
  pct: number;
  color: string;      // stroke color (hex / tailwind CSS var)
  trackColor: string;
  size?: number;
  stroke?: number;
}

function Ring({ pct, color, trackColor, size = 72, stroke = 6 }: RingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      />
    </svg>
  );
}

// ─── Animated number ─────────────────────────────────────────────────────────

function AnimNum({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {value}{suffix}
    </motion.span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Analytics({ tasks }: AnalyticsProps) {
  const days = useMemo(() => getLast7Days(), []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;

    // Completed this week (uses completedAt if set, else skip)
    const weekStart = startOfDay(new Date());
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1)); // Monday

    const completedThisWeek = tasks.filter(t => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt) >= weekStart;
    }).length;

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Productivity: completed on/before due date ÷ completed tasks with a due date
    const completedWithDue = tasks.filter(t => t.status === 'completed' && t.dueDate);
    const onTime = completedWithDue.filter(t => {
      if (!t.completedAt) return true; // legacy: assume on time
      const [y, m, d] = t.dueDate.split('-').map(Number);
      return new Date(t.completedAt) <= new Date(y, m - 1, d, 23, 59, 59);
    }).length;
    const productivity = completedWithDue.length > 0
      ? Math.round((onTime / completedWithDue.length) * 100)
      : completed > 0 ? 100 : 0;

    // Activity per day (last 7 days)
    const activity = days.map(({ date }) => {
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      return tasks.filter(t => {
        if (!t.completedAt) return false;
        const ca = new Date(t.completedAt);
        return ca >= date && ca < next;
      }).length;
    });

    return { total, completed, pending, completedThisWeek, completionRate, productivity, activity };
  }, [tasks, days]);

  const maxActivity = Math.max(...stats.activity, 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100/70 dark:border-white/[0.06]">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-indigo-500/30">
          <Flame size={13} className="text-white" />
        </div>
        <h2 className="text-sm font-black text-slate-800 dark:text-white tracking-tight">
          Insights
        </h2>
        <span className="ml-auto text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          All time · this week
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-5">

        {/* ── Three KPI cards ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">

          {/* Completed this week */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-violet-50/80 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 p-3 sm:p-4"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-indigo-500/30">
              <BadgeCheck size={15} className="text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent leading-none">
              <AnimNum value={stats.completedThisWeek} />
            </p>
            <p className="text-center text-[10px] sm:text-xs font-bold text-violet-500 dark:text-violet-400 leading-tight">
              Done<br className="sm:hidden" /><span className="hidden sm:inline"> </span>This Week
            </p>
          </motion.div>

          {/* Completion rate ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="flex flex-col items-center gap-1 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3 sm:p-4"
          >
            <div className="relative flex items-center justify-center">
              <Ring
                pct={stats.completionRate}
                color="#10b981"
                trackColor="rgba(16,185,129,0.15)"
                size={60}
                stroke={6}
              />
              <span className="absolute text-sm font-black text-emerald-600 dark:text-emerald-400">
                <AnimNum value={stats.completionRate} suffix="%" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Crosshair size={11} className="text-emerald-500" />
              <p className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Completion
              </p>
            </div>
          </motion.div>

          {/* Productivity ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.19, duration: 0.4 }}
            className="flex flex-col items-center gap-1 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-3 sm:p-4"
          >
            <div className="relative flex items-center justify-center">
              <Ring
                pct={stats.productivity}
                color="#f59e0b"
                trackColor="rgba(245,158,11,0.15)"
                size={60}
                stroke={6}
              />
              <span className="absolute text-sm font-black text-amber-600 dark:text-amber-400">
                <AnimNum value={stats.productivity} suffix="%" />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Rocket size={11} className="text-amber-500" />
              <p className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
                On-Time
              </p>
            </div>
          </motion.div>

        </div>

        {/* ── 7-day activity chart ── */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Activity — Last 7 Days
          </p>
          <div className="flex items-end gap-1.5 sm:gap-2 h-20">
            {stats.activity.map((count, i) => {
              const heightPct = (count / maxActivity) * 100;
              const isToday = i === 6;
              const dayOfWeek = days[i].date.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex flex-col justify-end" style={{ height: 'calc(100% - 20px)' }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      style={{ height: `${Math.max(heightPct, count > 0 ? 10 : 4)}%` }}
                      className={`w-full rounded-t-lg origin-bottom transition-all ${
                        isToday
                          ? 'bg-gradient-to-t from-violet-600 to-indigo-400 shadow-md shadow-indigo-500/30'
                          : count > 0
                            ? 'bg-gradient-to-t from-violet-400/60 to-indigo-300/60 dark:from-violet-700/60 dark:to-indigo-600/60'
                            : 'bg-slate-200/60 dark:bg-white/[0.06]'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${
                    isToday
                      ? 'text-violet-600 dark:text-violet-400'
                      : isWeekend
                        ? 'text-slate-300 dark:text-slate-600'
                        : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {days[i].shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Count labels */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
            {stats.activity.map((count, i) => (
              <div key={i} className="flex-1 text-center">
                {count > 0 && (
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{count}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick summary row ── */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100/70 dark:border-white/[0.05]">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-700 dark:text-slate-300' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-lg font-black ${color}`}>{value}</p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
