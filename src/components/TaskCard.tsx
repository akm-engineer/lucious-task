import { motion } from 'framer-motion';
import { PenLine, Trash2, GripVertical, CalendarDays } from 'lucide-react';
import type { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(dateStr: string, status: string): boolean {
  if (!dateStr || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d) < today;
}

const priorityGradient: Record<string, string> = {
  low: 'from-emerald-500 to-teal-500',
  medium: 'from-amber-500 to-orange-500',
  high: 'from-rose-500 to-red-500',
};

const priorityCardGlow: Record<string, string> = {
  low: 'hover:shadow-emerald-500/15',
  medium: 'hover:shadow-amber-500/15',
  high: 'hover:shadow-rose-500/15',
};

const priorityCheckGlow: Record<string, string> = {
  low: 'shadow-emerald-500/30',
  medium: 'shadow-amber-500/30',
  high: 'shadow-rose-500/30',
};

export function TaskCard({
  task,
  isDragging,
  dragHandleProps,
  onToggle,
  onEdit,
  onDelete,
  onOpen,
}: TaskCardProps) {
  const completed = task.status === 'completed';
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.18 } }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      onClick={onOpen}
      className={`group relative flex flex-col bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] overflow-hidden transition-all duration-300 cursor-pointer ${
        isDragging
          ? 'shadow-2xl shadow-violet-500/20 rotate-1 scale-[1.02]'
          : `shadow-sm hover:shadow-xl ${priorityCardGlow[task.priority]} hover:-translate-y-1`
      } ${completed ? 'opacity-60' : ''}`}
    >
      {/* Gradient top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${priorityGradient[task.priority]}`} />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
        {/* Checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            completed
              ? `bg-gradient-to-br from-emerald-500 to-teal-500 border-transparent shadow-md ${priorityCheckGlow[task.priority]}`
              : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
          }`}
        >
          {completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Title */}
        <p className={`flex-1 text-sm font-semibold leading-snug break-words min-w-0 line-clamp-2 ${
          completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
        }`}>
          {task.title}
        </p>

        {/* Drag handle */}
        <div
          {...dragHandleProps}
          onClick={e => e.stopPropagation()}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all mt-0.5"
        >
          <GripVertical size={15} />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-3 flex-1">
        {task.description ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{task.description}</p>
        ) : (
          <p className="text-xs text-slate-300 dark:text-slate-600 italic">No description added</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <PriorityBadge priority={task.priority} size="xs" />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            completed
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
          }`}>
            {completed ? 'Done' : 'Pending'}
          </span>
        </div>
        {task.dueDate && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${
            overdue ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
          }`}>
            <CalendarDays size={11} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Action buttons — appear on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl border border-white/60 dark:border-white/10 shadow-lg p-0.5">
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-all"
        >
          <PenLine size={13} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
