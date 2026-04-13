import { motion } from 'framer-motion';
import { Hash, Timer, Trophy } from 'lucide-react';

interface StatsBarProps {
  total: number;
  pending: number;
  completed: number;
}

interface StatCardProps {
  label: string;
  shortLabel: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  textGradient: string;
  index: number;
}

function StatCard({ label, shortLabel, value, icon, gradient, glow, textGradient, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="group relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl p-3 sm:p-5 border border-white/60 dark:border-white/[0.07] shadow-sm hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300 bg-gradient-to-br ${gradient} pointer-events-none rounded-2xl`} />
      <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} ${glow} shadow-lg shrink-0`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="relative text-center sm:text-left min-w-0">
        <p className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className="sm:hidden text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">{shortLabel}</p>
        <motion.p
          key={value}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${textGradient} bg-clip-text text-transparent leading-tight`}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function StatsBar({ total, pending, completed }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      <StatCard label="Total Tasks" shortLabel="Total"   value={total}     icon={<Hash size={20} />}   gradient="from-violet-500 to-indigo-600"  glow="shadow-violet-500/40"  textGradient="from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400"  index={0} />
      <StatCard label="Pending"     shortLabel="Pending" value={pending}   icon={<Timer size={20} />}  gradient="from-amber-500 to-orange-500"   glow="shadow-amber-500/40"   textGradient="from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400"   index={1} />
      <StatCard label="Completed"   shortLabel="Done"    value={completed} icon={<Trophy size={20} />} gradient="from-emerald-500 to-teal-500"   glow="shadow-emerald-500/40" textGradient="from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400"   index={2} />
    </div>
  );
}
