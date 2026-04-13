import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, Timer, PenLine, Trash2, BadgeCheck, Circle, BellRing, ScrollText } from 'lucide-react';
import type { Task } from '../../../core/types';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, isOverdue } from '../utils/taskHelpers';

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const priorityGradient: Record<string, string> = {
  low:    'from-emerald-500 to-teal-500',
  medium: 'from-amber-500 to-orange-500',
  high:   'from-rose-500 to-red-500',
};

export function TaskDetailPanel({ task, onClose, onEdit, onDelete, onToggle }: TaskDetailPanelProps) {
  const completed = task.status === 'completed';
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <AnimatePresence>
      <motion.div
        key="detail-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        <motion.div
          key="detail-modal"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 360 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-lg max-h-[92svh] sm:max-h-[85svh] flex flex-col bg-white/95 dark:bg-[#0f0f1c]/98 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border-0 sm:border border-white/50 dark:border-white/[0.07] shadow-2xl overflow-hidden"
        >
          <div className={`h-1 w-full bg-gradient-to-r ${priorityGradient[task.priority]} shrink-0`} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/70 dark:border-white/[0.06] shrink-0">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Task Details</span>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-6 py-5 space-y-5">

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={task.priority} />
                <button
                  onClick={onToggle}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 transition-all hover:scale-105 active:scale-100 ${
                    completed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  {completed ? <BadgeCheck size={13} /> : <Circle size={13} />}
                  {completed ? 'Completed' : 'Pending'}
                  <span className="text-[10px] opacity-50 ml-0.5">· tap to toggle</span>
                </button>
              </div>

              {/* Title */}
              <h2 className={`text-2xl font-black leading-tight tracking-tight ${completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                {task.title}
              </h2>

              {/* Description */}
              <div className="rounded-2xl bg-slate-50/80 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <ScrollText size={13} className="text-slate-400 dark:text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</span>
                </div>
                {task.description ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">No description provided.</p>
                )}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {task.dueDate && (
                  <div className={`flex items-center gap-3 rounded-2xl p-3.5 border ${
                    overdue ? 'bg-rose-500/5 border-rose-500/20 dark:border-rose-500/20' : 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-100 dark:border-white/[0.06]'
                  }`}>
                    <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
                      overdue ? 'bg-rose-500/15 text-rose-500' : 'bg-slate-200/60 dark:bg-white/[0.07] text-slate-500 dark:text-slate-400'
                    }`}>
                      {overdue ? <BellRing size={16} /> : <CalendarDays size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</p>
                      <p className={`text-sm font-semibold truncate ${overdue ? 'text-rose-500 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {formatDate(task.dueDate)}
                        {overdue && <span className="ml-1.5 text-[11px] font-bold">· Overdue</span>}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-2xl p-3.5 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-slate-200/60 dark:bg-white/[0.07] text-slate-500 dark:text-slate-400">
                    <Timer size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Created</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatDate(task.createdAt, true)}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100/70 dark:border-white/[0.06] flex gap-3 shrink-0">
            <button
              onClick={() => { onDelete(); onClose(); }}
              className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-sm font-bold text-rose-500 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 ring-1 ring-rose-500/20 transition-all hover:-translate-y-px active:translate-y-0"
            >
              <Trash2 size={15} /> Delete
            </button>
            <button
              onClick={() => { onEdit(); onClose(); }}
              className="flex items-center justify-center gap-2 flex-[2] py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-px active:translate-y-0"
            >
              <PenLine size={15} /> Edit Task
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
