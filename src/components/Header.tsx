import { Sun, Moon, LayoutList, LayoutGrid, Plus } from 'lucide-react';
import liciousLogo from '../assets/licious-logo.svg';
import type { ViewMode } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  viewMode: ViewMode;
  onToggleTheme: () => void;
  onChangeView: (mode: ViewMode) => void;
  onAddTask: () => void;
}

export function Header({ theme, viewMode, onToggleTheme, onChangeView, onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-violet-200/40 dark:border-white/[0.06] bg-white/70 dark:bg-[#0b0b18]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img src={liciousLogo} alt="LIcious" className="h-5 sm:h-6 w-auto dark:brightness-0 dark:invert" />
          </div>

          {/* Desktop view toggle */}
          <div className="hidden sm:flex items-center bg-slate-100/80 dark:bg-white/[0.06] rounded-xl p-1 gap-1">
            <button
              onClick={() => onChangeView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-white/10 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LayoutList size={15} />
              List
            </button>
            <button
              onClick={() => onChangeView('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-white/10 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LayoutGrid size={15} />
              Card
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Mobile view toggle */}
            <button
              onClick={() => onChangeView(viewMode === 'list' ? 'card' : 'list')}
              className={`sm:hidden p-2 rounded-xl transition-all ${
                viewMode === 'card'
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
              }`}
            >
              {viewMode === 'list' ? <LayoutGrid size={18} /> : <LayoutList size={18} />}
            </button>

            {/* Theme */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* New Task — gradient */}
            <button
              onClick={onAddTask}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-px active:translate-y-0 transition-all duration-200"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
