import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Inbox, Kanban, TrendingUp } from 'lucide-react';

import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import type { FilterPriority, FilterStatus, Task, TaskFormData, ViewMode } from './types';

import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { SearchFilter } from './components/SearchFilter';
import { TaskForm } from './components/TaskForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { TaskListItem } from './components/TaskListItem';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { Analytics } from './components/Analytics';
import { TaskCard } from './components/TaskCard';

// ─── Sortable wrappers ────────────────────────────────────────────────────────

interface SortableListItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

function SortableListItem({ task, onToggle, onEdit, onDelete, onOpen }: SortableListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative',
  };
  return (
    <div ref={setNodeRef} style={style}>
      <TaskListItem
        task={task}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpen={onOpen}
      />
    </div>
  );
}

interface SortableCardItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

function SortableCardItem({ task, onToggle, onEdit, onDelete, onOpen }: SortableCardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative',
  };
  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpen={onOpen}
      />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onAdd }: { hasFilters: boolean; onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center py-24 md:py-4 text-center"
    >
      <div className="relative w-24 h-24 rounded-3xl bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/[0.07] shadow-xl flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10" />
        <Inbox size={38} className="relative text-violet-400 dark:text-violet-500" />
      </div>
      <h3 className="text-xl font-black text-slate-800 dark:text-white">
        {hasFilters ? 'No matching tasks' : 'No tasks yet'}
      </h3>
      <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'Create your first task and start being productive.'}
      </p>
      {!hasFilters && (
        <button
          onClick={onAdd}
          className="mt-2 px-6 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-px transition-all duration-200"
        >
          Create First Task
        </button>
      )}
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleStatus, reorderTasks } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'tasks' | 'insights'>('tasks');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');

  // Detail panel
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Confirm delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Derived stats
  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    }),
    [tasks],
  );

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tasks.filter(task => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (
        q &&
        !task.title.toLowerCase().includes(q) &&
        !task.description.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [tasks, search, filterStatus, filterPriority]);

  const hasFilters = search !== '' || filterStatus !== 'all' || filterPriority !== 'all';

  // Handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) deleteTask(deletingId);
    setDeletingId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = tasks.findIndex(t => t.id === active.id);
    const newIdx = tasks.findIndex(t => t.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) {
      reorderTasks(arrayMove(tasks, oldIdx, newIdx));
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header
        theme={theme}
        viewMode={viewMode}
        onToggleTheme={toggleTheme}
        onChangeView={setViewMode}
        onAddTask={handleAddTask}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* Tab bar */}
        <div className="flex items-center bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/[0.07] shadow-sm p-1 gap-1">
          {([
            { id: 'tasks',    label: 'Tasks',    icon: <Kanban size={15} /> },
            { id: 'insights', label: 'Insights', icon: <TrendingUp size={15} /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">

          {activeTab === 'insights' ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <Analytics tasks={tasks} />
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-5"
            >
              <StatsBar
                total={stats.total}
                pending={stats.pending}
                completed={stats.completed}
              />

              <SearchFilter
                search={search}
                filterStatus={filterStatus}
                filterPriority={filterPriority}
                onSearch={setSearch}
                onFilterStatus={setFilterStatus}
                onFilterPriority={setFilterPriority}
              />

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                {filteredTasks.length === 0 ? (
                  <EmptyState hasFilters={hasFilters} onAdd={handleAddTask} />
                ) : viewMode === 'list' ? (
                  <SortableContext
                    items={filteredTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      <AnimatePresence initial={false} mode="popLayout">
                        {filteredTasks.map(task => (
                          <SortableListItem
                            key={task.id}
                            task={task}
                            onToggle={() => toggleStatus(task.id)}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteRequest(task.id)}
                            onOpen={() => setDetailTask(task)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                ) : (
                  <SortableContext
                    items={filteredTasks.map(t => t.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <AnimatePresence initial={false} mode="popLayout">
                        {filteredTasks.map(task => (
                          <SortableCardItem
                            key={task.id}
                            task={task}
                            onToggle={() => toggleStatus(task.id)}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteRequest(task.id)}
                            onOpen={() => setDetailTask(task)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                )}
              </DndContext>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TaskForm
            editingTask={editingTask}
            existingTasks={tasks}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {deletingId && (
          <ConfirmDialog
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </AnimatePresence>

      {/* Task Detail Panel */}
      <AnimatePresence>
        {detailTask && (() => {
          // Always show the latest version of the task (after toggles/edits)
          const live = tasks.find(t => t.id === detailTask.id);
          if (!live) return null;
          return (
            <TaskDetailPanel
              key={live.id}
              task={live}
              onClose={() => setDetailTask(null)}
              onEdit={() => {
                handleEditTask(live);
                setDetailTask(null);
              }}
              onDelete={() => {
                handleDeleteRequest(live.id);
                setDetailTask(null);
              }}
              onToggle={() => toggleStatus(live.id)}
            />
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
