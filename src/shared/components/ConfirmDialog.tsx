import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title = 'Delete Task',
  message = 'This action cannot be undone. The task will be permanently removed.',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', damping: 30, stiffness: 420 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm bg-white/95 dark:bg-[#13131f]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 dark:border-white/[0.08] p-6 text-center"
        >
          <div className="flex items-center justify-center mx-auto w-14 h-14 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 ring-1 ring-rose-500/20 mb-4">
            <Trash2 size={22} className="text-rose-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1.5">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-3 text-sm font-bold rounded-xl border border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-px active:translate-y-0 transition-all"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
