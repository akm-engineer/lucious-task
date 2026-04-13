import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Inbox } from 'lucide-react';
import type { Task, ViewMode } from '../../../core/types';
import type { useTaskActions } from '../hooks/useTaskActions';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { StatsBar } from '../../../shared/components/StatsBar';
import { StatsBarSkeleton } from '../../../shared/skeletons/StatsBarSkeleton';
import { TaskListSkeleton } from '../../../shared/skeletons/TaskListSkeleton';
import { TaskCardsSkeleton } from '../../../shared/skeletons/TaskCardsSkeleton';
import { SearchFilter } from '../../../shared/components/SearchFilter';
import { TaskForm } from '../components/TaskForm';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { TaskDetailPanel } from '../components/TaskDetailPanel';
import { TaskListView } from './TaskListView';
import { TaskGridView } from './TaskGridView';

interface TasksPageProps {
  tasks: Task[];
  toggleStatus: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  viewMode: ViewMode;
  isReady: boolean;
  actions: ReturnType<typeof useTaskActions>;
}

function EmptyState({ hasFilters, onAdd }: { hasFilters: boolean; onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center py-4 text-center"
    >
      <div className="relative w-24 h-24 rounded-3xl bg-white/80 dark:bg-white/4 border border-white/60 dark:border-white/7 shadow-xl flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-violet-500/10 to-indigo-500/10" />
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
          className="mt-6 px-6 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-px transition-all duration-200"
        >
          Create First Task
        </button>
      )}
    </motion.div>
  );
}

export function TasksPage({ tasks, toggleStatus, reorderTasks, viewMode, isReady, actions }: TasksPageProps) {
  const { search, setSearch, filterStatus, setFilterStatus, filterPriority, setFilterPriority, filteredTasks, hasFilters } =
    useTaskFilters(tasks);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

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
    <>
      <div className="space-y-5">
        {isReady ? (
          <StatsBar total={stats.total} pending={stats.pending} completed={stats.completed} />
        ) : (
          <StatsBarSkeleton />
        )}

        <SearchFilter
          search={search}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          onSearch={setSearch}
          onFilterStatus={setFilterStatus}
          onFilterPriority={setFilterPriority}
        />

        {!isReady ? (
          viewMode === 'list' ? <TaskListSkeleton /> : <TaskCardsSkeleton />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {filteredTasks.length === 0 ? (
              <EmptyState hasFilters={hasFilters} onAdd={actions.openAddForm} />
            ) : viewMode === 'list' ? (
              <TaskListView
                tasks={filteredTasks}
                onToggle={toggleStatus}
                onEdit={actions.openEditForm}
                onDelete={actions.setDeletingId}
                onOpen={actions.setDetailTask}
              />
            ) : (
              <TaskGridView
                tasks={filteredTasks}
                onToggle={toggleStatus}
                onEdit={actions.openEditForm}
                onDelete={actions.setDeletingId}
                onOpen={actions.setDetailTask}
              />
            )}
          </DndContext>
        )}
      </div>

      <AnimatePresence>
        {actions.showForm && (
          <TaskForm
            editingTask={actions.editingTask}
            existingTasks={tasks}
            onSubmit={actions.handleFormSubmit}
            onClose={actions.closeForm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actions.deletingId && (
          <ConfirmDialog
            onConfirm={actions.handleDeleteConfirm}
            onCancel={() => actions.setDeletingId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actions.liveDetailTask && (
          <TaskDetailPanel
            key={actions.liveDetailTask.id}
            task={actions.liveDetailTask}
            onClose={() => actions.setDetailTask(null)}
            onEdit={() => {
              actions.openEditForm(actions.liveDetailTask!);
              actions.setDetailTask(null);
            }}
            onDelete={() => {
              actions.setDeletingId(actions.liveDetailTask!.id);
              actions.setDetailTask(null);
            }}
            onToggle={() => toggleStatus(actions.liveDetailTask!.id)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
