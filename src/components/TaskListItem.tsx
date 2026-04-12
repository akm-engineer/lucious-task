import { motion } from 'framer-motion';
import { PenLine, Trash2, GripVertical, CalendarDays } from 'lucide-react';
import type { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface TaskListItemProps {
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

const priorityAccentBorder: Record<string, string> = {
  low: 'border-l-emerald-500',
  medium: 'border-l-amber-500',
  high: 'border-l-rose-500',
};

const priorityGlow: Record<string, string> = {
  low: 'hover:shadow-emerald-500/10',
  medium: 'hover:shadow-amber-500/10',
  high: 'hover:shadow-rose-500/10',
};

export function TaskListItem({
  task,
  isDragging,
  dragHandleProps,
  onToggle,
  onEdit,
  onDelete,
  onOpen,
}: TaskListItemProps) {
  const completed = task.status === 'completed';
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      onClick={onOpen}
      className={`group flex items-center gap-3 rounded-2xl border-l-[3px] border border-white/60 dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm px-4 py-3.5 transition-all duration-200 cursor-pointer ${priorityAccentBorder[task.priority]} ${
        isDragging
          ? 'shadow-2xl shadow-violet-500/20 scale-[1.01] border-violet-400/50'
          : `shadow-sm hover:shadow-lg ${priorityGlow[task.priority]} hover:-translate-y-px`
      } ${completed ? 'opacity-60' : ''}`}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        onClick={e => e.stopPropagation()}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
      >
        <GripVertical size={16} />
      </div>

      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          completed
            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-transparent shadow-md shadow-emerald-500/30'
            : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-sm hover:shadow-violet-400/30'
        }`}
      >
        {completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 justify-between flex-wrap">
          <p className={`text-sm font-semibold leading-snug break-words min-w-0 line-clamp-2 ${completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <PriorityBadge priority={task.priority} size="xs" />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              completed
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
            }`}>
              {completed ? 'Done' : 'Pending'}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{task.description}</p>
        )}

        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium ${
            overdue ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
          }`}>
            <CalendarDays size={11} />
            {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-all"
        >
          <PenLine size={14} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
