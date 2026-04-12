import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Wand2, AlertCircle, Copy, CalendarMinus } from 'lucide-react';
import type { Priority, Task, TaskFormData } from '../types';

const TITLE_MAX = 100;
const DESC_MAX = 500;

interface TaskFormProps {
  editingTask: Task | null;
  existingTasks: Task[];
  onSubmit: (data: TaskFormData) => void;
  onClose: () => void;
}

const priorityConfig: {
  value: Priority;
  label: string;
  gradient: string;
  inactiveClass: string;
}[] = [
  {
    value: 'low',
    label: '🟢 Low',
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md shadow-emerald-500/30',
    inactiveClass: 'border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10',
  },
  {
    value: 'medium',
    label: '🟡 Medium',
    gradient: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md shadow-amber-500/30',
    inactiveClass: 'border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10',
  },
  {
    value: 'high',
    label: '🔴 High',
    gradient: 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-transparent shadow-md shadow-rose-500/30',
    inactiveClass: 'border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10',
  },
];

// ─── Inline warning banner ────────────────────────────────────────────────────
function Warning({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/80 dark:border-amber-600/30"
    >
      <span className="flex-shrink-0 text-amber-500 mt-0.5">{icon}</span>
      <p className="text-xs font-medium text-amber-700 dark:text-amber-400 leading-relaxed">{children}</p>
    </motion.div>
  );
}

// ─── Character counter ────────────────────────────────────────────────────────
function CharCount({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color =
    pct >= 0.95 ? 'text-rose-500 dark:text-rose-400 font-bold' :
    pct >= 0.8  ? 'text-amber-500 dark:text-amber-400 font-semibold' :
                  'text-slate-400 dark:text-slate-500';
  return (
    <span className={`text-[11px] tabular-nums transition-colors ${color}`}>
      {current}/{max}
    </span>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function TaskForm({ editingTask, existingTasks, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '');
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 100); }, []);

  const today = new Date().toISOString().split('T')[0];

  // ── Derived warnings (non-blocking) ──
  const trimmedTitle = title.trim();

  const isDuplicate =
    trimmedTitle.length > 0 &&
    existingTasks.some(
      t => t.id !== editingTask?.id &&
           t.title.trim().toLowerCase() === trimmedTitle.toLowerCase(),
    );

  const isPastDate = !!dueDate && dueDate < today;

  const titleNearLimit = title.length >= Math.floor(TITLE_MAX * 0.8);
  const descNearLimit  = description.length >= Math.floor(DESC_MAX * 0.8);

  // ── Validation (blocking) ──
  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!trimmedTitle) next.title = 'Title cannot be empty.';
    else if (title.length > TITLE_MAX) next.title = `Title must be ${TITLE_MAX} characters or fewer.`;
    if (!dueDate) next.dueDate = 'Due date is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 200));
    onSubmit({ title: trimmedTitle, description: description.trim(), priority, dueDate });
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          key="dialog"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-lg max-h-[95svh] flex flex-col bg-white/95 dark:bg-[#13131f]/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-0 sm:border border-white/60 dark:border-white/[0.08] overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-slate-100/80 dark:border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-indigo-500/30">
                <Wand2 size={14} className="text-white" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <form id="task-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              {/* ── Title ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Title <span className="text-rose-400 normal-case tracking-normal">*</span>
                  </label>
                  {titleNearLimit && <CharCount current={title.length} max={TITLE_MAX} />}
                </div>
                <input
                  ref={titleRef}
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX}
                  onChange={e => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(p => ({ ...p, title: undefined }));
                  }}
                  placeholder="What needs to be done?"
                  className={`w-full px-4 py-3 text-sm rounded-xl bg-slate-50/80 dark:bg-white/[0.05] border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all ${
                    errors.title
                      ? 'border-rose-400 dark:border-rose-500 ring-1 ring-rose-400/30'
                      : 'border-slate-200/80 dark:border-white/[0.08]'
                  }`}
                />
                <AnimatePresence mode="wait">
                  {errors.title ? (
                    <motion.p
                      key="err"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={11} /> {errors.title}
                    </motion.p>
                  ) : isDuplicate ? (
                    <div className="mt-2">
                      <Warning icon={<Copy size={13} />}>
                        A task named <strong>"{trimmedTitle}"</strong> already exists. Consider a more specific title to avoid confusion.
                      </Warning>
                    </div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* ── Description ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Description
                  </label>
                  {descNearLimit && <CharCount current={description.length} max={DESC_MAX} />}
                </div>
                <textarea
                  value={description}
                  maxLength={DESC_MAX}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add details (optional)…"
                  rows={3}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.05] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent resize-none transition-all"
                />
              </div>

              {/* ── Priority + Due Date ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <div className="flex gap-1.5">
                    {priorityConfig.map(p => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                          priority === p.value ? `${p.gradient} scale-[1.02]` : `${p.inactiveClass} hover:scale-[1.01]`
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Due Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => {
                      setDueDate(e.target.value);
                      if (errors.dueDate) setErrors(p => ({ ...p, dueDate: undefined }));
                    }}
                    className={`w-full px-4 py-3 text-sm rounded-xl bg-slate-50/80 dark:bg-white/[0.05] border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all ${
                      errors.dueDate
                        ? 'border-rose-400 dark:border-rose-500 ring-1 ring-rose-400/30'
                        : isPastDate
                          ? 'border-amber-400 dark:border-amber-500/60'
                          : 'border-slate-200/80 dark:border-white/[0.08]'
                    }`}
                  />
                  <AnimatePresence mode="wait">
                    {errors.dueDate ? (
                      <motion.p
                        key="err"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1"
                      >
                        <AlertCircle size={11} /> {errors.dueDate}
                      </motion.p>
                    ) : isPastDate ? (
                      <div className="mt-2">
                        <Warning icon={<CalendarMinus size={13} />}>
                          This date is in the past. The task will be marked as <strong>overdue</strong> immediately upon creation.
                        </Warning>
                      </div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

            </form>
          </div>

          {/* Footer — sticky at bottom */}
          <div className="px-6 py-4 border-t border-slate-100/80 dark:border-white/[0.06] flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 text-sm font-bold rounded-xl border border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="task-form"
              disabled={submitting}
              className="flex-1 py-3 px-4 text-sm font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-70 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-px active:translate-y-0"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
