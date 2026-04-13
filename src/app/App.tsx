import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Kanban, TrendingUp } from 'lucide-react';

import { useTasks } from '../core/hooks/useTasks';
import { useTheme } from '../core/hooks/useTheme';
import { useTaskActions } from '../features/tasks/hooks/useTaskActions';
import type { ViewMode } from '../core/types';

import { Header } from '../shared/components/Header';
import { TasksPage } from '../features/tasks/views/TasksPage';
import { InsightsPage } from '../features/insights/views/InsightsPage';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleStatus, reorderTasks } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [isReady, setIsReady] = useState(false);
  useEffect(() => { setIsReady(true); }, []);

  const [activeTab, setActiveTab] = useState<'tasks' | 'insights'>('tasks');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const actions = useTaskActions(tasks, { addTask, updateTask, deleteTask });

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header
        theme={theme}
        viewMode={viewMode}
        onToggleTheme={toggleTheme}
        onChangeView={setViewMode}
        onAddTask={actions.openAddForm}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        <div className="flex items-center bg-white/80 dark:bg-white/4 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/7 shadow-sm p-1 gap-1">
          {([
            { id: 'tasks',    label: 'Tasks',    icon: <Kanban size={15} /> },
            { id: 'insights', label: 'Insights', icon: <TrendingUp size={15} /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'insights' ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <InsightsPage tasks={tasks} />
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <TasksPage
                tasks={tasks}
                toggleStatus={toggleStatus}
                reorderTasks={reorderTasks}
                viewMode={viewMode}
                isReady={isReady}
                actions={actions}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
